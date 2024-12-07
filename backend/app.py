from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from models.login import login
from models.reservation import get_reservation
from models.delete import delete_reservation
from models.edit import edit_reservation, check_if_reservation_exists
from models.add import add_reservation
from models.room import get_room
from flask_jwt_extended import JWTManager, jwt_required


app = Flask(__name__)
CORS(app, origins="http://localhost:3000")


# JWT
app.config['JWT_SECRET_KEY'] = 'tomekAppFlask' 
jwt = JWTManager(app)


# Logowanie:
@app.route('/login', methods=['POST'])
def login_route():
    return login()
    

# Funkcja do pobierania rezerwacji
@app.route('/reservation', methods=['GET'])
@jwt_required() 
def reservation_route():
    return get_reservation()

# Funkcja do usuwania rezerwacji:
@app.route('/delete', methods=['DELETE'])
@jwt_required() 
def delete_route():
    data = request.get_json()
    room_id = data.get('id') 
    return delete_reservation(room_id)

# Funckja do edycji rezerwacji:
@app.route('/edit', methods=['PUT'])
@jwt_required() 
def edit_route():
    data = request.get_json()
    room_id = data.get('room_id')
    reservation_date = data.get('reservation_date')
    reservation_time = data.get('reservation_time')
    created_at = data.get('created_at')
    user_id = data.get('user_id')
    old_hour = data.get('oldHour')
    old_reservation_date = data.get('oldReservationDate')
            # Sprawdzam, czy rezerwacja już istnieje
    if check_if_reservation_exists(room_id, reservation_date, reservation_time):
        return jsonify({"message": "Nie możesz zarezerwować sali, bo już jest zajęta."}), 400
    
    return edit_reservation(user_id, room_id, reservation_date, reservation_time, created_at, old_hour, old_reservation_date)

@app.route('/add', methods=['POST'])
@jwt_required() 
def add_route():
    return add_reservation()
   

# Lista dostępnych sal konferencyjnych:
@app.route('/room', methods=['GET'])
@jwt_required() 
def room_room():
    return get_room()

if __name__ == '__main__':
    app.run(debug=True)  

