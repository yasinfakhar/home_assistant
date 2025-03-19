#!/bin/bash

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is required but not installed. Please install Python 3 and try again."
    exit 1
fi

# Check if pip is installed
if ! command -v pip &> /dev/null; then
    echo "pip is required but not installed. Please install pip and try again."
    exit 1
fi

# Create a virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate the virtual environment
source venv/bin/activate

# Install server dependencies
echo "Installing server dependencies..."
pip install -r server/requirements.txt

# Check if .env file exists, if not, create it from example
if [ ! -f "server/.env" ]; then
    echo "Creating .env file from example..."
    cp server/.env.example server/.env
    echo "Please edit server/.env to add your OpenAI API key before continuing."
    exit 1
fi

# Start the server in the background
echo "Starting server..."
cd server
python app.py &
SERVER_PID=$!
cd ..

# Wait for server to start
echo "Waiting for server to start..."
sleep 3

# Start the client
echo "Starting client..."
cd client
python -m http.server 8000 &
CLIENT_PID=$!
cd ..

echo "Smart Home Assistant is running!"
echo "Server: http://localhost:5000"
echo "Client: http://localhost:8000"
echo "Press Ctrl+C to stop both server and client"

# Handle cleanup on exit
function cleanup {
    echo "Stopping server and client..."
    kill $SERVER_PID
    kill $CLIENT_PID
    echo "Done!"
    exit 0
}

trap cleanup SIGINT

# Keep the script running
wait
