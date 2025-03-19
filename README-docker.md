# Smart Home Assistant - Docker Setup

This document explains how to run the Smart Home Assistant using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- OpenAI API Key

## Setup

1. **Set up your OpenAI API key**:
   - Copy the example environment file:
     ```bash
     cp server/.env.example server/.env
     ```
   - Edit the `.env` file and add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     ```

2. **Build and start the containers**:
   ```bash
   docker-compose up -d --build
   ```

   This command will:
   - Build the Docker images for both the server and client
   - Start the containers in detached mode
   - Set up the necessary networks and volumes

3. **Access the application**:
   - Web interface: http://localhost:8000
   - Server API: http://localhost:5000

## Container Structure

The application consists of two containers:

1. **Server Container (`home-assistant-server`)**:
   - Flask application with Whisper and GPT-4o mini integration
   - Handles speech recognition and natural language understanding
   - Exposes API endpoints on port 5000

2. **Client Container (`home-assistant-client`)**:
   - Nginx serving the static web interface
   - Proxies API requests to the server container
   - Accessible on port 8000

## Managing the Containers

- **View logs**:
  ```bash
  docker-compose logs -f
  ```

- **Stop the containers**:
  ```bash
  docker-compose down
  ```

- **Restart the containers**:
  ```bash
  docker-compose restart
  ```

- **Rebuild and restart (after code changes)**:
  ```bash
  docker-compose up -d --build
  ```

## Volumes

- `server_data`: Persistent volume for server data

## Networks

- `home-assistant-network`: Internal network for communication between containers

## Troubleshooting

- **Server container not starting**: Check if you've set the OPENAI_API_KEY in the `.env` file
- **Client can't connect to server**: Ensure both containers are running (`docker-compose ps`)
- **Changes not reflecting**: Rebuild the containers with `docker-compose up -d --build`
