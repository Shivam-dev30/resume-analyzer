# Use official lightweight Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy all files
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port that Railway provides
EXPOSE 8080

# Run the Streamlit app
CMD ["streamlit", "run", "streamlit_app.py", "--server.port=8080", "--server.address=0.0.0.0"]
