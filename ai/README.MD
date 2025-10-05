# AI Module - Planets-Map

This directory contains the AI/ML components for training a deep learning model to classify Martian surface landmarks from HiRISE orbital imagery.

## Overview

This module implements a PyTorch-based image classification system that identifies 8 different types of Martian surface features from high-resolution orbital images. The trained model is used by the backend API to provide real-time classification of Mars surface imagery.

## Dataset

The project uses the **Mars orbital image (HiRISE) labeled data set version 3**, which contains 73,031 landmarks:
- 10,433 original landmarks extracted from 180 HiRISE browse images
- 62,598 augmented landmarks (6 augmentations per original image)

### Data Augmentation Methods
1. 90° clockwise rotation
2. 180° clockwise rotation
3. 270° clockwise rotation
4. Horizontal flip
5. Vertical flip
6. Random brightness adjustment
7. Salt-and-pepper noise (custom augmentation for underrepresented classes)

### Classification Classes

The model classifies images into 8 landmark categories:

| ID | Class Name      | Description |
|----|-----------------|-------------|
| 0  | Other           | Unclassified or mixed features |
| 1  | Crater          | Impact craters |
| 2  | Dark Dune       | Dark-colored dune formations |
| 3  | Slope Streak    | Dark streaks on slopes |
| 4  | Bright Dune     | Bright-colored dune formations |
| 5  | Impact Ejecta   | Material ejected from impacts |
| 6  | Swiss Cheese    | CO₂ ice formations with pitted texture |
| 7  | Spider          | Radial channel networks |

## Project Structure

```
ai/
├── training.ipynb                           # Main training notebook
├── augmentation.py                          # Data augmentation utilities
├── checker.py                               # Dataset validation & integrity checks
├── cleaner.py                               # Utility to remove augmented files
├── pyproject.toml                           # Python dependencies
├── landmarks_map-proj-v3_classmap.csv       # Class ID to name mapping
├── data_set_README.txt                      # Dataset documentation
└── test_images/                             # Sample test images
```

## Requirements

Install dependencies using uv or pip:

```bash
# Using uv (recommended)
uv sync

# Or using pip
pip install -r requirements.txt
```

### Main Dependencies
- Python >= 3.11
- PyTorch >= 2.8.0
- torchvision >= 0.23.0
- torchaudio >= 2.8.0
- tqdm

## Usage

### 0. Download NASA's dataset

Download full version of dataset: https://zenodo.org/records/2538136

YOU SHOULD CHECK ALL PATHS IN training.ipynb, cleaner.py, checker.py and augmentation.py

### 1. Dataset Validation

Before training, verify dataset integrity:

```bash
python checker.py
```

This script validates:
- File existence and readability
- Image dimensions (expected: 227×227 pixels)
- Image format and corruption
- Class distribution

### 2. Data Augmentation

#### If you have some strange results from training process, you should augment some classes (ex: 5, 7, 3, 4)

> We noticed that the NASA research team did not use the Gaussian noise
> augmentation method in their augmentation process. We used this method for our own re-
> augmentation, doubling the number of images in the Slope Streak class, quadrupling the number in
> the Dark Dune, Bright Dune, and Swiss Cheese classes, and octupling the number in the Spider and
> Impact Ejecta classes.

To augment underrepresented classes:

```bash
python augmentation.py
```

This adds noise-based augmentation to classes 5 and 7 (impact ejecta and spider features) to balance the dataset.

### 3. Model Training

Open and run `training.ipynb` in Jupyter:

```bash
jupyter notebook training.ipynb
```

The notebook includes:
- Data loading and preprocessing
- Model architecture definition
- Training loop with validation
- Model evaluation and metrics
- Export trained model to `../backend/models/mars_classifier.pt`

### 4. Cleanup

To remove augmented images (if needed):

```bash
python cleaner.py
```

## Model Architecture

The model uses a ResNet-50 architecture optimized for 227×227 grayscale images. Details are available in `training.ipynb`.

## Output

The trained model is saved as `mars_classifier.pt` and deployed to:
```
../backend/models/mars_classifier.pt
```

This model is loaded by the FastAPI backend to provide classification endpoints.

## Dataset Attribution

If you use this dataset in your work, please cite:
- **DOI**: [10.5281/zenodo.2538136](https://doi.org/10.5281/zenodo.2538136)
- **Authors**: Kiri L. Wagstaff, Steven Lu, Gary Doran, Lukas Mandrake
- **Contact**: you.lu@jpl.nasa.gov

## Testing

Sample test images are provided in the `test_images/` directory for quick model validation.

## Notes

- All images are preprocessed to 227×227 pixels
- The model expects grayscale images
- Data augmentation helps balance class distribution
- The checker script uses multithreading for fast validation

## License

This project was developed for the NASA Hackathon. Please refer to the main repository for license information.
