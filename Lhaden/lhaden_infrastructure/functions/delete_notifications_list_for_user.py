from sqlalchemy import create_engine, Column, TIMESTAMP, TEXT
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()


class LhadenUserDBNotificationsDB(Base):
    __tablename__ = 'lhaden_notifications_db'

    notification_id = Column(TEXT, primary_key=True)
    email_id = Column(TEXT)
    notification_text = Column(TEXT)
    created_at = Column(TIMESTAMP)


db_url = 'postgresql://DB_URL'
engine = create_engine(db_url)
Session = sessionmaker(bind=engine)


def delete_notifications_list_for_user(email_id):
    local_session = Session()
    try:
        notifications = local_session.query(LhadenUserDBNotificationsDB).filter_by(email_Id=email_id).first()

        if notifications:
            local_session.delete(notifications)
            local_session.commit()
            print("deleted successfully.")
            return True
        else:
            print("not found.")
            return False
    except Exception as e:
        local_session.rollback()
        print(f"Error deleting: {e}")
        return False
    finally:
        local_session.close()
