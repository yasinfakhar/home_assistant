#!/bin/sh

# Check if OPENAI_API_KEY is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "Error: OPENAI_API_KEY environment variable is not set."
    echo "Please set it in your .env file or pass it as an environment variable to Docker."
    exit 1
fi

# Start the Flask application
python app.py
