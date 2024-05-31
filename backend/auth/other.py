from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine

Base = declarative_base()
# engine = engine.create_engine("postgresql:///database.db")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    active = Column(Boolean, default=False, nullable=False)

class HouseholdUser(Base):
    __tablename__ = "household_users"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    household_id = ForeignKey("households.id")

class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True)
    household_user = Column(Integer, ForeignKey("household_users.id"))
    address = Column(String(255), nullable=False)

class WasteCollector(Base):
    __tablename__ = "waste_collectors"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
