from flask import jsonify
from database.index import connect_to_database 


def delete_reservation(id):

    conn = connect_to_database()
    cursor = conn.cursor()


    cursor.execute("""
    DELETE FROM reservation WHERE id = %s;
    """, (id,))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Rezerwacja została usunięta"})