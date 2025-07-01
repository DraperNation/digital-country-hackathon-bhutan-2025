import re
import asyncio
from pathlib import Path

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text
from typing import AsyncGenerator, List
from contextlib import asynccontextmanager
from pydantic_settings import BaseSettings
from services.common.core.config import DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME
from services.common.core.logging import common_logger as logger


class Settings(BaseSettings):
    DATABASE_URL: str = (
        f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 10
    DB_POOL_TIMEOUT: int = 30
    MIGRATIONS_FOLDER: str = "services/common/migrations"
    RUN_MIGRATIONS: bool = True

    def model_post_init(self, __context):
        # Build the connection string after initialization
        self.DATABASE_URL = f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()

# Log the connection string for debugging (hide password)
connection_url = (
    settings.DATABASE_URL.replace(DB_PASSWORD, "****")
    if DB_PASSWORD
    else settings.DATABASE_URL
)
logger.info(f"Database connection URL: {connection_url}")


class Base(DeclarativeBase):
    pass


engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_timeout=settings.DB_POOL_TIMEOUT,
    pool_pre_ping=True,
)

AsyncSessionFactory = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


@asynccontextmanager
async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionFactory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# Usage in FastAPI through dependency injection
async def db_session():
    async with get_db_session() as session:
        yield session


async def create_migrations_table():
    """Create the migrations table if it doesn't exist"""
    async with AsyncSessionFactory() as session:
        await session.execute(
            text("""
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) NOT NULL UNIQUE,
                applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
            """)
        )
        await session.commit()


async def get_applied_migrations() -> List[str]:
    """Get list of migrations that have already been applied"""
    async with AsyncSessionFactory() as session:
        result = await session.execute(text("SELECT filename FROM migrations"))
        applied_migrations = [row[0] for row in result.fetchall()]
        logger.debug(f"Applied migrations: {applied_migrations}")
        return applied_migrations


def get_migration_files() -> List[Path]:
    """Get sorted list of SQL migration files"""
    migrations_path = Path(settings.MIGRATIONS_FOLDER)

    if not migrations_path.exists():
        logger.warning(f"Migrations folder not found: {migrations_path.absolute()}")
        return []

    # Get all .sql files in the migrations directory
    files = [
        f
        for f in migrations_path.glob("*.sql")
        if f.is_file() and f.name.endswith(".sql")
    ]

    if not files:
        logger.warning(f"No SQL files found in {migrations_path.absolute()}")
    else:
        logger.info(
            f"Found {len(files)} migration files in {migrations_path.absolute()}"
        )
        for file in files:
            logger.debug(f"  - {file.name}")

    # Extract numbers from filenames for proper ordering
    def get_number(filename):
        # Extract number from patterns like 001_..., V1_..., etc.
        match = re.search(r"^(?:V|)(\d+)", filename.name)
        if match:
            return int(match.group(1))
        # If no number pattern found, use the filename as is
        return filename.name

    # Sort files by their numeric prefix or name
    return sorted(files, key=get_number)


async def apply_migration(filepath: Path):
    """Apply a single migration file"""
    logger.info(f"Applying migration: {filepath.name}")

    # Read the SQL file content
    try:
        with open(filepath, "r") as f:
            sql_content = f.read()
    except Exception as e:
        logger.error(f"Failed to read migration file {filepath}: {str(e)}")
        raise

    logger.debug(f"Migration SQL content length: {len(sql_content)} characters")

    # Execute the SQL within a transaction
    async with AsyncSessionFactory() as session:
        async with session.begin():
            try:
                # Split SQL content into statements by ; and execute each one
                # This handles multi-statement migrations better
                statements = [
                    stmt.strip() for stmt in sql_content.split(";") if stmt.strip()
                ]

                for i, stmt in enumerate(statements):
                    if stmt:
                        logger.debug(
                            f"Executing statement {i + 1}/{len(statements)} from {filepath.name}"
                        )
                        await session.execute(text(stmt))

                # Record the migration
                await session.execute(
                    text("INSERT INTO migrations (filename) VALUES (:filename)"),
                    {"filename": filepath.name},
                )

                logger.info(f"Successfully applied migration: {filepath.name}")
            except Exception as e:
                logger.error(f"Failed to apply migration {filepath.name}: {str(e)}")
                raise


async def run_migrations():
    """Run all pending migrations"""
    logger.info("Checking for database migrations to apply...")

    # Ensure migrations table exists
    await create_migrations_table()

    # Get applied migrations
    applied = await get_applied_migrations()

    # Get all migration files
    migrations = get_migration_files()

    # Count pending migrations
    pending_migrations = [m for m in migrations if m.name not in applied]
    logger.info(f"Found {len(pending_migrations)} pending migrations to apply")

    # Apply pending migrations
    for migration_file in migrations:
        if migration_file.name not in applied:
            logger.info(f"Applying new migration: {migration_file.name}")
            await apply_migration(migration_file)
        else:
            logger.debug(f"Skipping already applied migration: {migration_file.name}")

    logger.info("Database migrations completed")


# Function to manually run migrations (can be called from scripts)
async def manually_run_migrations():
    """Manually run migrations from a script"""
    try:
        await run_migrations()
        return True
    except Exception as e:
        logger.error(f"Error running migrations: {str(e)}")
        logger.error("MIGRATIONS FAILED - DATABASE MAY BE IN INCONSISTENT STATE")
        return False


# This variable will hold our migration task for FastAPI startup
migration_task = None


# Instead of running migrations immediately, create a function that can be called
# during FastAPI startup event
async def run_startup_migrations():
    """Run migrations during application startup"""
    try:
        logger.info("Running database migrations during application startup")
        await run_migrations()
        logger.info("Startup migrations completed successfully")
    except Exception as e:
        logger.error(f"Error running startup migrations: {str(e)}")
        logger.error("MIGRATIONS FAILED - DATABASE MAY BE IN INCONSISTENT STATE")


# IMPORTANT: To properly use this with FastAPI, add this to your main.py:
#
# @app.on_event("startup")
# async def startup_event():
#     await run_startup_migrations()
#
# DO NOT use the automatic execution below with FastAPI!

# Only run automatically if not being imported by a web framework
# This check helps determine if we're being run directly or imported
if settings.RUN_MIGRATIONS and __name__ != "services.common.db.database":
    # We're being run directly (not imported), so run migrations automatically
    logger.info("Auto-running migrations on startup (standalone mode)")
    try:
        # Use asyncio.run() for standalone scripts
        asyncio.run(run_migrations())
    except RuntimeError as e:
        if "This event loop is already running" in str(e):
            logger.warning(
                "Event loop already running, migrations will be run during application startup"
            )
        else:
            logger.error(f"Error running migrations: {str(e)}")
            logger.error("MIGRATIONS FAILED - DATABASE MAY BE IN INCONSISTENT STATE")
