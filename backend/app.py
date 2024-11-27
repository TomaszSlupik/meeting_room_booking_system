from flask import Flask, jsonify
from flask_cors import CORS
from config.config import config
import psycopg2

app = Flask(__name__)
CORS(app)

# Funkcja do pobierania sal konferencyjnych:
@app.route('/rooms', methods=['GET'])
def get_rooms():
    config_values = config() 

    try:
        conn = psycopg2.connect(
            dbname=config_values["DB_DATABASE"],
            user=config_values["DB_USER"],
            password=config_values["DB_PASSWORD"],
            host=config_values["DB_HOST"]
        )
        print("Połączono z bazą danych.")
    except Exception as e:
        print(f"Błąd połączenia z bazą danych: {e}")
        return jsonify({"error": "Błąd połączenia z bazą danych"}), 500 

    conn = psycopg2.connect(
        dbname=config_values["DB_DATABASE"],
        user=config_values["DB_USER"],
        password=config_values["DB_PASSWORD"],
        host=config_values["DB_HOST"]
    )
    cursor = conn.cursor()
    cursor2 = conn.cursor()

    cursor.execute("SELECT * FROM room")
    cursor2.execute("SELECT 'test'")
    rooms = cursor.fetchall()
    test = cursor2.fetchall()

    print(f"Pokoje: {rooms}")
    print(f"Test: {test}")

    result = []
    for room in rooms:
        result.append({
            "id": room[0],  
            "name": room[1],  
        })

    cursor.close()
    conn.close()

    return jsonify(result)  

if __name__ == '__main__':
    app.run(debug=True)  

