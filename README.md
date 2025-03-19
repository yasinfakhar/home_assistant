# Smart Home Assistant

A voice-controlled smart home assistant that allows you to control lights using natural language commands.

## Features

- Multiple input methods for controlling smart home devices:
  - Voice control using microphone (when available)
  - Audio file upload
  - Text commands
- Speech recognition using OpenAI Whisper
- Natural language understanding with GPT-4o mini
- Beautiful web interface for manual control
- Real-time communication between client and server

## Project Structure

- `server/`: Server-side application
  - `app.py`: Main server application
  - `asr.py`: Speech recognition module
  - `assistant.py`: GPT-4o mini integration with function calling
  
- `client/`: Client-side application
  - `index.html`: Main UI
  - `styles.css`: Styling for the UI
  - `script.js`: Client-side logic
  - `assets/`: Images and other static assets

## Setup

### Prerequisites

- Python 3.8+
- Node.js 14+ (for development)
- OpenAI API key

### Installation

1. Clone the repository
2. Install server dependencies:
   ```
   cd server
   pip install -r requirements.txt
   ```
3. Set up your OpenAI API key:
   ```
   export OPENAI_API_KEY=your_api_key_here
   ```
4. Start the server:
   ```
   python app.py
   ```
5. Open the client in a web browser or run it as a standalone application

## Usage

1. Use the web interface to manually control the lights using the toggle buttons
2. Control the lights using one of these methods:
   - **Voice**: Click the microphone button and speak (if your browser supports it)
   - **Audio File**: Upload an audio file with your voice command
   - **Text**: Type your command in the text input field

3. Example commands you can use:
   - "Turn on light 1"
   - "Turn off light 2"
   - "Turn on both lights"
   - "Turn off all lights"

## License

MIT
