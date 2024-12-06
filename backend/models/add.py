from flask import jsonify, request
from database.index import connect_to_database 


def add_reservation():
    try:

        data = request.get_json()

        user_id = data.get('user_id')
        room_id = data.get('room_id')
        reservation_date = data.get('reservation_date')
        reservation_time = data.get('reservation_time')
        created_at = data.get('created_at')


        conn = connect_to_database()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO reservation (user_id, room_id, reservation_date, reservation_time, created_at)
            VALUES (%s, %s, %s, %s, %s)
        """, (user_id, room_id, reservation_date, reservation_time, created_at))

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Rezerwacja została dodana pomyślnie"}), 201

    except Exception as e:
        print("Błąd:", e)
        return jsonify({"message": "Wystąpił błąd przy dodawaniu rezerwacji"}), 500