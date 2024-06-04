#!/bin/bash

# Define the path to your virtual environment and requirements file
VENV_PATH="venv"
REQUIREMENTS_FILE="requirements.txt"
FLASK_APP_PATH="auth/app.py"

# Ensure we are in the correct directory (the backend directory)
cd "$(dirname "$0")"

# Activate the virtual environment
if [ -d "$VENV_PATH" ]; then
  echo "Activating virtual environment..."
  source "$VENV_PATH/bin/activate"
else
  echo "Virtual environment not found. Please set it up first."
  exit 1
fi

# Install required packages
echo "Installing required packages..."
pip install -r "$REQUIREMENTS_FILE"

# Set environment variables
export FLASK_APP=$FLASK_APP_PATH
export FLASK_ENV=development

# Run the Flask app
echo "Starting Flask app..."
flask run
