import psycopg2
from config.config import config

def connect_to_database():
    config_values = config() 
    try:
        conn = psycopg2.connect(
            dbname=config_values["DB_DATABASE"],
            user=config_values["DB_USER"],
            password=config_values["DB_PASSWORD"],
            host=config_values["DB_HOST"]
        )
        print("Połączono z bazą danych.")
        return conn
    except Exception as e:
        print(f"Błąd połączenia z bazą danych: {e}")
        return None
