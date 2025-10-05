import torch
import torch.nn as nn
from torchvision import transforms, models
from app.core.config import settings

# model
device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")

model = models.resnet50(weights=None)
model.fc = nn.Linear(model.fc.in_features, 7)

state = torch.load(settings.classification_model_path, map_location=device)
model.load_state_dict(state["model"])
model.to(device).eval()

# processing
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]
val_tfms = transforms.Compose(
    [
        transforms.Grayscale(num_output_channels=3),
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
    ]
)
