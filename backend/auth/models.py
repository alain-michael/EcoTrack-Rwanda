import datetime as dt
from backend.auth.app import db, app

class User(db.Model):
    """
    Model representing a User.

    Attributes:
        id (Integer): The primary key and unique identifier of the user.
        email (String): The email of the user.
        name (String): The name of the user.
        password (String): The password of the user.
        active (Boolean): Whether the user is active.
        created_at (DateTime): The date when the user record was created.
    """
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=dt.datetime.now, nullable=False)

class HouseholdUser(db.Model):
    """
    Model representing a Household User.

    Attributes:
        id (Integer): The primary key and unique identifier of the household user.
        user_id (Integer): Foreign key referencing the User.
    """
    __tablename__ = "household_users"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    addresses = db.relationship("Address", backref="household_user")

class Address(db.Model):
    """
    Model representing an Address.

    Attributes:
        id (Integer): The primary key and unique identifier of the address.
        household_user_id (Integer): Foreign key referencing the HouseholdUser.
        address (String): The actual address.
    """
    __tablename__ = "addresses"

    id = db.Column(db.Integer, primary_key=True)
    household_user_id = db.Column(db.Integer, db.ForeignKey("household_users.id"), nullable=False)
    address = db.Column(db.String(255), nullable=False)

class WasteCollector(db.Model):
    """
    Model representing a Waste Collector.

    Attributes:
        id (Integer): The primary key and unique identifier of the waste collector.
        user_id (Integer): Foreign key referencing the User.
    """
    __tablename__ = "waste_collectors"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

class ColSchedule(db.Model):
    """
    Model representing a Collection Schedule.

    Attributes:
        id (Integer): The primary key and unique identifier of the collection schedule.
        user_id (Integer): Foreign key referencing the User.
        collector_id (Integer): Foreign key referencing the WasteCollector.
        date (DateTime): The date of the collection.
        address (String): The address for the collection.
        status (Boolean): The status of the collection (completed or not).
    """
    __tablename__ = "col_schedules"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    collector_id = db.Column(db.Integer, db.ForeignKey("waste_collectors.id"), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    address = db.Column(db.String(255), nullable=False)
    status = db.Column(db.Boolean, default=False, nullable=False)

    user = db.relationship("User", backref="col_schedules")
    collector = db.relationship("WasteCollector", backref="col_schedules")

with app.app_context():
    db.create_all()