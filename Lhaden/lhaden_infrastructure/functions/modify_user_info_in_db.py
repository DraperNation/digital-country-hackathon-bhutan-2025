from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, select, Column, String
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.declarative import declarative_base

# ---------- engine & session ----------
db_url ='postgresql://DB_URL'
engine = create_engine(db_url, pool_pre_ping=True)
Session = sessionmaker(bind=engine)

Base = declarative_base()


class LhadenUserDB(Base):
    __tablename__ = 'lhaden_user_db'

    email_id = Column(String, primary_key=True)
    name = Column(String)
    account_type = Column(String)


def modify_user_info_in_db(data: dict[str, str]) -> bool:
    email_id = data.get("email_id", "").lower().strip()
    name = data.get("name", "").strip()
    account_type = data.get("account_type", "").strip()

    if not email_id:
        raise ValueError("email_id is required")

    session = Session()
    try:
        user = session.scalar(select(LhadenUserDB).where(LhadenUserDB.email_id == email_id))

        if user:
            user.name = name
            user.account_type = account_type
        else:
            user = LhadenUserDB(
                email_id=email_id,
                name=name,
                account_type=account_type,
            )
            session.add(user)

        session.commit()
        return True

    except SQLAlchemyError as e:
        session.rollback()
        raise RuntimeError(f"DB error: {e}") from e

    finally:
        session.close()
