import os
import base64
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import soundfile as sf
import numpy as np

from asr import transcribe_audio
from assistant import process_command

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/process-audio', methods=['POST'])
def process_audio():
    """
    Process audio from client:
    1. Receive audio data
    2. Convert to audio file
    3. Transcribe using Whisper
    4. Process with GPT-4o mini
    5. Return response to client
    """
    try:
        data = request.json
        if not data or 'audio' not in data:
            return jsonify({"error": "No audio data provided"}), 400
        
        # Decode base64 audio data
        audio_data = base64.b64decode(data['audio'].split(',')[1])
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_audio:
            temp_audio_path = temp_audio.name
            temp_audio.write(audio_data)
        
        # Transcribe audio
        transcript = transcribe_audio(temp_audio_path)
        
        # Process command with GPT-4o mini
        response = process_command(transcript)
        
        # Clean up temporary file
        os.unlink(temp_audio_path)
        
        return jsonify({
            "transcript": transcript,
            "response": response
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/process-text', methods=['POST'])
def process_text():
    """
    Process text commands from client:
    1. Receive text data
    2. Process with GPT-4o mini
    3. Return response to client
    """
    try:
        data = request.json
        if not data or 'text' not in data:
            return jsonify({"error": "No text data provided"}), 400
        
        text = data['text']
        
        # Process command with GPT-4o mini
        response = process_command(text)
        
        return jsonify({
            "transcript": text,  # Echo back the original text as transcript
            "response": response
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    """Simple endpoint to test if the server is running"""
    return jsonify({"status": "Server is running"})

if __name__ == '__main__':
    # Check for OpenAI API key
    if not os.getenv('OPENAI_API_KEY'):
        print("Warning: OPENAI_API_KEY not set in environment variables")
    
    # Determine if we're running in Docker
    in_docker = os.environ.get('RUNNING_IN_DOCKER', False)
    
    # Set debug mode based on environment
    debug_mode = False if in_docker else True
    
    app.run(host='0.0.0.0', port=5000, debug=debug_mode)
