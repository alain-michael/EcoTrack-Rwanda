from flask import request, jsonify, Blueprint, make_response
from flask_bcrypt import Bcrypt
from sqlalchemy import or_, create_engine
from sqlalchemy.orm import sessionmaker
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import User, Base

auth_blueprint = Blueprint('auth', __name__)
engine = create_engine('sqlite:///database.db') 
Session = sessionmaker(bind=engine)
bcrypt = Bcrypt()

# Database setup
Base.metadata.create_all(engine)
session = Session()

@auth_blueprint.route('/api/register', methods=['POST', 'OPTIONS'])
def register():
    """View to handle user registration."""
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        return response

    user_data = request.json
    
    if 'name' not in user_data or 'email' not in user_data or 'password' not in user_data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    user = session.query(User).filter_by(email=user_data['email']).first()
    if user:
        return jsonify({'error': 'User already exists'}), 409
    
    new_user = User(
        name=user_data['name'],
        email=user_data['email'],
        password=bcrypt.generate_password_hash(user_data['password']),
    )
    session.add(new_user)
    session.commit()
    return jsonify({'message': 'User registered successfully','status':201}), 201

@auth_blueprint.route('/api/login', methods=['POST'])
def login():
    """View to handle authentication and send back a JWT if user exists."""
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        return response

    user_data = request.json

    if 'email' not in user_data or 'password' not in user_data:
        return jsonify({'error': 'Missing required fields'}), 400

    user = session.query(User).filter_by(email=user_data['email']).first()
    if not user or not bcrypt.check_password_hash(pw_hash=user.password, password=user_data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({'message': 'Login successful', 'access_token': access_token}), 200
