from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from models.login import login
from models.rooms import get_rooms


app = Flask(__name__)
CORS(app, origins="http://localhost:3000")

# JWT
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key' 
jwt = JWTManager(app)


# Logowanie:
@app.route('/login', methods=['POST'])
def login_route():
    return login()
    

# Funkcja do pobierania sal konferencyjnych:
@app.route('/rooms', methods=['GET'])
def rooms_route():
    return get_rooms()

if __name__ == '__main__':
    app.run(debug=True)  

