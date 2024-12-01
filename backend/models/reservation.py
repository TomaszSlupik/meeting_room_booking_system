from flask import jsonify
from database.index import connect_to_database 

def get_reservation():

    conn = connect_to_database()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT 
        u.username,
        ro.name_room,
        ro.description,
        r.reservation_date,   
        r.reservation_time,  
        r.created_at
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
            "username": room[0],  
            "name_room": room[1],
            "description": room[2],
            "reservation_date": room[3],
            "reservation_time": room[4],
            "created_at": room[5] 
        })

    cursor.close()
    conn.close()

    return jsonify(result)  