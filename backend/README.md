# NASA Hackathon Project: Mars Image Classification

## Overview
This project was developed as part of the NASA Hackathon 2025. The goal of the project is to classify images of Mars using a machine learning model. The system is designed to assist researchers in analyzing and categorizing Martian surface features, enabling better understanding of the planet's geology and potential for future exploration.

## Features
- **Image Classification**: A deep learning model trained to classify Martian surface images.
- **API Integration**: RESTful APIs for health checks and classification services.
- **Dockerized Deployment**: Simplified deployment using Docker and Docker Compose.
- **Modular Design**: Organized codebase for scalability and maintainability.

## Project Structure
```
backend/
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile               # Docker image setup
├── requirements.txt         # Python dependencies
├── app/
│   ├── main.py              # Entry point for the application
│   ├── api/v1/              # API endpoints
│   │   ├── classification.py
│   │   └── health.py
│   ├── core/                # Core utilities
│   │   ├── config.py
│   │   └── logging.py
│   ├── schemas/             # Data schemas
│   │   └── classification.py
│   ├── services/            # Business logic
│   │   └── classification.py
│   └── models/              # Pre-trained models
│       └── mars_classifier.pt
```

### RUNRUNRUN
'''
git clone https://github.com/Kerbalximus/NASAHackathon.git
cd NASAHackathon/backend
docker-compose up --build
'''

## Usage
### Classification API
1. Send a POST request to `/api/v1/classification` with an image file.
2. Receive the classification results in JSON format.
### Health Check
- Send a GET request to `/api/v1/health` to verify the service status.

---
*Developed during the NASA Hackathon 2025.*