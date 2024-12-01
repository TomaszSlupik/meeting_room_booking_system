from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from models.login import login
from models.reservation import get_reservation
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


# Lista dostępnych sal konferencyjnych:
@app.route('/room', methods=['GET'])
@jwt_required() 
def room_room():
    return get_room()

if __name__ == '__main__':
    app.run(debug=True)  

