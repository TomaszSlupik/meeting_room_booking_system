from flask import jsonify
from database.index import connect_to_database 

def get_reservation():

    conn = connect_to_database()
    cursor = conn.cursor()

    cursor.execute("""
 SELECT 
        u.id,
        u.username,
        u.role,
        ro.name_room,
        ro.description,
        r.reservation_date,   
        r.reservation_time,  
        r.created_at,
		r.id as id_room,
        ro.id as room
    FROM 
        reservation AS r
    JOIN 
        users AS u ON u.id = r.user_id
    JOIN 
        room AS ro ON ro.id = r.room_id;
    """)

    rooms = cursor.fetchall()

    result = []
    for room in rooms:
        result.append({
            "id": room[0],  
            "username": room[1], 
            "role": room[2], 
            "name_room": room[3],
            "description": room[4],
            "reservation_date": room[5],
            "reservation_time": room[6],
            "created_at": room[7],
            "id_room": room[8],
            "room": room[9]
        })

    cursor.close()
    conn.close()

    return jsonify(result)  