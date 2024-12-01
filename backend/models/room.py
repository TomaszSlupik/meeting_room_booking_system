from flask import jsonify
from database.index import connect_to_database 

def get_room():
    conn = connect_to_database()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT 
        r.name_room,
        r.description
    FROM 
        room AS r
    """)

    rooms = cursor.fetchall()
    print(f"Sale: {rooms}")

    result = []
    for room in rooms:
        result.append({
            "name_room": room[0],  
            "description": room[1]
        })

    cursor.close()
    conn.close()

    return jsonify(result) 
