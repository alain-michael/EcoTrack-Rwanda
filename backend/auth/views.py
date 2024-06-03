from flask import request, jsonify, Blueprint, make_response
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, create_refresh_token
from backend.auth.models import User, ColSchedule, WasteCollector
from backend.auth.app import db
from flask_bcrypt import Bcrypt

auth_blueprint = Blueprint('auth', __name__)
schedule_blueprint = Blueprint('schedule', __name__)
bcrypt = Bcrypt()

@auth_blueprint.route('/api/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    user = get_jwt_identity()
    access_token = create_access_token(identity=user)
    return jsonify({'access_token': access_token}), 200

@auth_blueprint.route('/api/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        return response

    user_data = request.json
    if 'name' not in user_data or 'email' not in user_data or 'password' not in user_data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    user = db.session.query(User).filter_by(email=user_data['email']).first()
    if user:
        return jsonify({'error': 'User already exists'}), 409
    
    new_user = User(
        name=user_data['name'],
        email=user_data['email'],
        password=bcrypt.generate_password_hash(user_data['password']).decode('utf-8'),
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully', 'status': 201}), 201

@auth_blueprint.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        return response

    user_data = request.json
    if 'email' not in user_data or 'password' not in user_data:
        return jsonify({'error': 'Missing required fields'}), 400

    user = User.query.filter_by(email=user_data['email']).first()
    if not user or not bcrypt.check_password_hash(user.password, user_data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    response = jsonify({'message': 'Login successful'})
    response.set_cookie('access_token', access_token, httponly=True, secure=True, samesite='None')
    response.set_cookie('refresh_token', refresh_token, httponly=True, secure=True, samesite='None')
    return response

@schedule_blueprint.route('/api/schedule', methods=['POST', 'OPTIONS'])
@jwt_required()
def schedule():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    
    schedule_data = request.json
    print(schedule_data)
    user_id = get_jwt_identity()
    user = db.session.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    schedule = ColSchedule(
        user_id=user.id,
        collector_id=None,  # Assuming you want to assign a collector later
        date=schedule_data['date'],
        address=user.household_users[0].addresses[0].address,  # Assuming the user has at least one address
        status=False
    )
    db.session.add(schedule)
    db.session.commit()

    return jsonify({'message': 'Collection scheduled successfully'}), 201

@schedule_blueprint.route('/api/my_schedules', methods=['GET', 'OPTIONS'])
@jwt_required()
def my_schedules():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        return response

    user_id = get_jwt_identity()
    schedules = db.session.query(ColSchedule).filter_by(user_id=user_id).all()
    return jsonify([{
        'id': schedule.id,
        'date': schedule.date,
        'address': schedule.address,
        'status': schedule.status
    } for schedule in schedules])

@auth_blueprint.route('/api/available_jobs', methods=['GET', 'OPTIONS'])
@jwt_required()
def available_jobs():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        return response

    schedules = db.session.query(ColSchedule).filter_by(status=False).all()
    return jsonify([{
        'id': schedule.id,
        'date': schedule.date,
        'address': schedule.address,
        'status': schedule.status
    } for schedule in schedules])

@auth_blueprint.route('/api/accept_job', methods=['POST', 'OPTIONS'])
@jwt_required()
def accept_job():
    """View for Waste Collectors to accept a job"""
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        return response

    schedule_id = request.json['id']
    schedule = ColSchedule.query.get(schedule_id)
    if not schedule:
        return jsonify({'error': 'Schedule not found'}), 404

    collector_id = get_jwt_identity()
    if WasteCollector.query.filter_by(id=collector_id).first() is None:
        return jsonify({'error': 'Not a collector'}), 401
    schedule.collector_id = collector_id
    schedule.status = True
    db.session.commit()

    return jsonify({'message': 'Job accepted successfully'}), 200
