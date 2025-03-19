# Smart Home Assistant Server

This is the server-side application for the Smart Home Assistant project. It handles speech recognition, natural language understanding, and communication with the client application.

## Features

- Speech recognition using OpenAI Whisper
- Natural language understanding with GPT-4o mini
- Function calling for light control actions
- RESTful API for client communication

## Setup

### Prerequisites

- Python 3.8+
- OpenAI API key

### Installation

1. Create a virtual environment (recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Set up your OpenAI API key:
   - Copy `.env.example` to `.env`
   - Edit `.env` and add your OpenAI API key

## Running the Server

Start the server with:

```
python app.py
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### POST /api/process-audio

Processes audio data from the client:

1. Receives base64-encoded audio data
2. Transcribes it using Whisper
3. Processes the transcript with GPT-4o mini
4. Returns the transcript and response

Request body:
```json
{
  "audio": "base64-encoded-audio-data"
}
```

Response:
```json
{
  "transcript": "Turn on light 1",
  "response": {
    "action": "on",
    "light_id": "1",
    "response_text": "Turning on light 1"
  }
}
```

### POST /api/process-text

Processes text commands directly from the client:

1. Receives text command
2. Processes it with GPT-4o mini
3. Returns the response

Request body:
```json
{
  "text": "Turn on light 1"
}
```

Response:
```json
{
  "transcript": "Turn on light 1",
  "response": {
    "action": "on",
    "light_id": "1",
    "response_text": "Turning on light 1"
  }
}
```

### GET /api/test

Simple endpoint to test if the server is running.

Response:
```json
{
  "status": "Server is running"
}
```
