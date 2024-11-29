from flask import jsonify
from database.index import connect_to_database 



def get_rooms():

    conn = connect_to_database()

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