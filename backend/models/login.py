from flask import jsonify, request
from flask_jwt_extended import create_access_token
from database.index import connect_to_database 
def login():
    username = request.json.get('username', '')
    password = request.json.get('password', '')

    conn = connect_to_database()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()

    if user is None:
        return jsonify({"error": "Niepoprawne dane logowania"}), 401

    # Czy hasła zgadzają sie:
    stored_password = user[2]  
    
    if password != stored_password:
        return jsonify({"error": "Niepoprawne dane logowania"}), 401

    # Token JWT
    access_token = create_access_token(identity=username)
    
    cursor.close()
    conn.close()

    return jsonify(access_token=access_token), 200