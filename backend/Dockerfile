FROM python:3.10-slim

WORKDIR /app

# Install system dependencies required for ML packages
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    torch transformers accelerate sentencepiece protobuf email-validator

# Copy the backend code into a "backend" directory inside the container
# This matches our local structure so relative imports work correctly
COPY . /app/backend

# Expose the API port
EXPOSE 8000

# Run the FastAPI server
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
