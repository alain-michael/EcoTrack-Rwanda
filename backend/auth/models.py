from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
import datetime as dt

Base = declarative_base()


class User(Base):
    """
    Model representing a User.

    Attributes:
        id (Integer): The primary key and unique identifier of the user.
        email (String): The education level of the student.
        country (String): The country of residence of the student.
        created_at (String): The date when the student record was created.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    active = Column(Boolean, default=False, nullable=False)
    # created_at = Column(DateTime, default=dt.datetime.now())

class HouseholdUser(Base):
    """
    Model representing a User.

    Attributes:
        id (Integer): The primary key and unique identifier of the user.
        user_if (String): The education level of the student.
    """
    __tablename__ = "household_users"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    # address = Column(String(255), nullable=False)

class Address(Base):
    """
    Model representing a User.

    Attributes:
        id (Integer): The primary key and unique identifier of the user.
        household_user (ForeignKey): References household user.
        address (String): Actual address of the user.
    """
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True)
    household_user = Column(Integer, ForeignKey("household_users.id"))
    address = Column(String(255), nullable=False)

class WasteCollector(Base):
    """
    Model representing a User.

    Attributes:
        id (Integer): The primary key and unique identifier of the Collector.
        user_id (ForeignKey): References base user.
    """
    __tablename__ = "waste_collectors"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))

class col_Schedule(Base):
    """
    Model representing a col_Schedule.

    Attributes:
        id (Integer): The primary key and unique identifier of the Collector.
        user_id (ForeignKey): References base user.
    """
    __tablename__ = "col_Schedule"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    collector_id = Column(Integer, ForeignKey("waste_collectors.id") ,default=None)
    date = Column(DateTime, nullable=False)
    Address = Column(String, nullable=False)
    Status = Column(Boolean, default=False)
