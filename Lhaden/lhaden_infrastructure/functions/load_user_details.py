from sqlalchemy import create_engine, text

db_url = 'postgresql://DB_URL'
engine = create_engine(db_url)


def load_user_details(email_id):
    try:
        with engine.connect() as connection:
            query = text("SELECT email_id, name, account_type FROM lhaden_user_db WHERE email_id = :email_id")
            result = connection.execute(query, {'email_id': email_id}).fetchone()

            if result is None:
                return None

            result_dict = {
                'email_id': result[0],
                'name': result[1],
                'company_name': result[2],
                'job_position': result[3]
            }
            return result_dict
    except Exception as e:
        print(f"Error extracting user info: {e}")
        raise
