# NASA Hackathon 2025: Mars Exploration Project

## Overview
This repository contains the complete solution developed for the NASA Hackathon 2025. The project aims to enhance Mars exploration by leveraging artificial intelligence, backend services, and a user-friendly frontend interface. The solution is modular, scalable, and designed to assist researchers in analyzing Martian surface data efficiently.

## Project Components

### 1. AI Module
The AI module is responsible for processing and classifying Martian surface images. It includes:
- **Image Augmentation**: Tools for preprocessing and augmenting datasets.
- **Model Training**: A PyTorch-based deep learning model (`mars_classifier.pt`) trained on Martian surface images.
- **Utilities**: Scripts for data cleaning and validation.

#### Key Files:
- `augmentation.py`: Handles data augmentation.
- `training.ipynb`: Jupyter notebook for training the model.
- `landmarks_map-proj-v3_classmap.csv`: Class mapping for surface features.

#### Usage:
1. Prepare the dataset and run `augmentation.py` for preprocessing.
2. Train the model using `training.ipynb`.
3. Use the trained model for classification tasks.

---

### 2. Backend Module
The backend provides RESTful APIs for interacting with the AI model and managing the application. It is built using Python and Dockerized for easy deployment.

#### Key Features:
- **Classification API**: Accepts images and returns classification results.
- **Health Check API**: Monitors the status of the backend services.

#### Key Files:
- `main.py`: Entry point for the backend application.
- `classification.py`: Implements the classification logic.
- `docker-compose.yml` & `Dockerfile`: Configuration for containerized deployment.

#### Usage:
1. Install dependencies using `requirements.txt`.
2. Run the application locally or using Docker Compose.
3. Access the APIs at `http://localhost:8000`.

---

### 3. Frontend Module
The frontend is a web-based interface for interacting with the system. It is built using modern web technologies and provides:
- **Image Upload**: Allows users to upload Martian surface images for classification.
- **Visualization**: Displays classification results in an intuitive format.

#### Key Files:
- `index.html`: Main entry point for the web application.
- `vite.config.js`: Configuration for the Vite build tool.
- `package.json`: Manages frontend dependencies.

#### Usage:
1. Install dependencies using `npm install`.
2. Start the development server with `npm run dev`.
3. Access the application at `http://localhost:3000`.

---

### RUNRUNRUN
1. Clone the repository:
   ```bash
   git clone https://github.com/Kerbalximus/NASAHackathon.git
   cd NASAHackathon
   ```
2. Set up the backend:
   ```bash
   cd backend
   docker-compose up --build
   ```
3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Train the AI model (optional):
   ```bash
   cd ai
   python augmentation.py
   jupyter notebook training.ipynb
   ```

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments
- NASA for organizing the hackathon and providing inspiration.
- Open-source contributors for tools and libraries used in this project.

---
*Developed during the NASA Hackathon 2025.*