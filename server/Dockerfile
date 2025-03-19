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

# Copy application code
COPY . .

# Create a data directory for temporary files
RUN mkdir -p /app/data

# Make entrypoint script executable
RUN chmod +x /app/entrypoint.sh

# Expose the port the app runs on
EXPOSE 5000

# Use entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]
