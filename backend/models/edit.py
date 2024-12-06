from flask import jsonify
from database.index import connect_to_database 

# czy mamy już rezerwację
def check_if_reservation_exists(room_id, reservation_date, reservation_time):
    conn = connect_to_database()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM reservation
        WHERE room_id = %s AND reservation_date = %s AND reservation_time = %s;
    """, (room_id, reservation_date, reservation_time))

    existing_reservation = cursor.fetchone()

    cursor.close()
    conn.close()

    return existing_reservation is not None


# edycja
def edit_reservation(user_id, room_id, reservation_date, reservation_time, created_at, old_hour, old_reservation_date):
    conn = connect_to_database()
    cursor = conn.cursor()

    cursor.execute("""
    UPDATE reservation 
    SET 
        user_id = %s,
        room_id = %s, 
        reservation_date = %s,
        reservation_time = %s,
        created_at = %s
    WHERE user_id = %s AND room_id = %s AND reservation_date = %s AND reservation_time = %s;
    """, (user_id, room_id, reservation_date, reservation_time, created_at, user_id, room_id, old_reservation_date, old_hour))


    if cursor.rowcount > 0:
        print(f"Zaktualizowano {cursor.rowcount} rekordów.")
    else:
        print("Brak rekordów do zaktualizowania.")
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Rezerwacja zaktualizowana"})