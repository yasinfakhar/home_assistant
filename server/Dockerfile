FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libasound2-dev \
    libsndfile1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy entrypoint script first and make it executable
COPY entrypoint.sh /app/
RUN chmod +x /app/entrypoint.sh

# Copy the rest of the application code
COPY . .

# Create a data directory for temporary files
RUN mkdir -p /app/data

# Expose the port the app runs on
EXPOSE 5000

# Use entrypoint script with shell to ensure proper execution
CMD ["/bin/sh", "/app/entrypoint.sh"]
