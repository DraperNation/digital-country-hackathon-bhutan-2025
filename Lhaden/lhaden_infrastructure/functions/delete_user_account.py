import logging as logger
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

DB_URL = 'postgresql://DB_URL'
engine = create_engine(DB_URL, echo=False)


def delete_user_account(email_id: str) -> int:

    deletes = {
        "notifications": text("DELETE FROM lhaden_notifications_db WHERE email_id = :email_id"),
        "users":         text("DELETE FROM lhaden_user_db WHERE email_id = :email_id"),
    }

    try:
        total_deleted = 0
        with engine.begin() as conn:
            for name, stmt in deletes.items():
                res = conn.execute(stmt, {"email_id": email_id})
                total_deleted += res.rowcount or 0
        return total_deleted

    except SQLAlchemyError as e:
        logger.error("Failed to delete account data for %s: %s", email_id, e, exc_info=True)
        raise
