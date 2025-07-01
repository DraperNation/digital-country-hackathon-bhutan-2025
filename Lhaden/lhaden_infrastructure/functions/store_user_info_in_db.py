from sqlalchemy import create_engine, Column, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()


class LhadenUserDB(Base):
    __tablename__ = 'lhaden_user_db'

    email_id = Column(String, primary_key=True)
    name = Column(String)
    account_type = Column(String)


db_url = 'postgresql://DB_URL'
engine = create_engine(db_url)
Session = sessionmaker(bind=engine)


def store_user_info_in_db(user_data):
    local_session = Session()
    try:

        new_user = LhadenUserDB(
            email_id=user_data['email_id'],
            name=user_data['name'],
            account_type=user_data['account_type']
        )

        local_session.add(new_user)
        local_session.commit()
        print("New user added successfully.")
        return True
    except Exception as e:
        print(f"Error adding user: {e}")
        local_session.rollback()
        return False
