from sqlalchemy import create_engine, text


db_url = 'postgresql://DB_URL'
engine = create_engine(db_url)


def check_email_in_db(email_id):
    query = text("SELECT COUNT(*) FROM lhdaden_user_db WHERE email_id = :email_id")

    try:
        with engine.connect() as connection:
            result = connection.execute(query, {'email_id': email_id})
            count = result.scalar()

        if count > 0:
            return True
        else:
            return False

    except Exception as e:
        f"An error occurred while checking the user ID: {e}"
        return False
