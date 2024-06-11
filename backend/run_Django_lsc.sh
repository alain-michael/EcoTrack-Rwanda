#!/bin/bash

# Define the path to your virtual environment and requirements file
VENV_PATH="venv"
REQUIREMENTS_FILE="requirements.txt"

# Check if the virtual environment directory exists
if [ ! -d "$VENV_PATH" ]; then
  echo "Virtual environment not found. Creating one..."
  python3 -m venv $VENV_PATH
fi

# Activate the virtual environment
source $VENV_PATH/bin/activate

# Install requirements
if [ -f "$REQUIREMENTS_FILE" ]; then
  pip install -r $REQUIREMENTS_FILE
else
  echo "Requirements file not found!"
fi


# Run Django migrations
python3 manage.py migrate


# Start the Django development server
python3 manage.py runserver
