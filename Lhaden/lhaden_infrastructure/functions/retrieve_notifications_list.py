from sqlalchemy import create_engine, text

db_url = 'postgresql://DB_URL'
engine = create_engine(db_url)


def retrieve_notifications_list(email_id):
    try:
        query = text("""
            SELECT notification_id, notification_text, created_at
            FROM lhaden_notifications_db
            WHERE email_id = :email_id
        """)

        with engine.connect() as connection:
            result = connection.execute(query, {'email_id': email_id})
            notifications_list = [{'notification_id': row[0],
                                   'notification_text': row[1],
                                   'created_at': row[2]}
                                  for row in result]

        return notifications_list
    except Exception as e:
        print(f"Error retrieving templates: {e}")
        raise
