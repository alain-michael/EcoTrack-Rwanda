from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

app = Flask(__name__)

from views import auth_blueprint
app.register_blueprint(auth_blueprint)

app.config['SECRET_KEY'] = '555b6dd61be440f18477a370b0bdb560'
app.config["JWT_SECRET_KEY"] = 'ad744d71ef4a458180418c4a4099a457'
app.config['JWT_TOKEN_LOCATION'] = ['headers']

# JWT Initialization
jwt = JWTManager(app)

CORS(app)


if __name__ == '__main__':
    app.run(debug=True)