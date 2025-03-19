# Smart Home Assistant Client

This is the client-side application for the Smart Home Assistant project. It provides a beautiful user interface for controlling smart lights through both voice commands and manual interaction.

## Features

- Beautiful UI with two interactive light controls
- Voice command recording and processing
- Real-time communication with the server
- Visual feedback for light states and voice commands

## Running the Client

You can run the client in several ways:

1. **Using a local web server**:
   - Install a simple HTTP server like `http-server` for Node.js:
     ```
     npm install -g http-server
     ```
   - Navigate to the client directory and run:
     ```
     http-server
     ```
   - Open your browser to `http://localhost:8080`

2. **Using Python's built-in HTTP server**:
   - Navigate to the client directory and run:
     ```
     python -m http.server
     ```
   - Open your browser to `http://localhost:8000`

3. **Opening directly in a browser**:
   - Simply open the `index.html` file in your web browser

## Configuration

The client is configured to connect to a server running at `http://localhost:5000`. If your server is running on a different address or port, you'll need to update the `SERVER_URL` variable in `script.js`.

## Usage

1. Make sure the server is running before using the client
2. Use the toggle buttons to manually control the lights
3. Click the microphone button and speak commands like:
   - "Turn on light 1"
   - "Turn off light 2"
   - "Turn on both lights"
   - "Turn off all lights"
