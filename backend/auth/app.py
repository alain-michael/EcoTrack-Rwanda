from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = '555b6dd61be440f18477a370b0bdb560'
app.config["JWT_SECRET_KEY"] = 'ad744d71ef4a458180418c4a4099a457'
app.config['JWT_TOKEN_LOCATION'] = ['headers']

db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
CORS(app)

from backend.auth.views import auth_blueprint, schedule_blueprint
app.register_blueprint(auth_blueprint)
app.register_blueprint(schedule_blueprint)

if __name__ == '__main__':
    app.run(debug=True)
