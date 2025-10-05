import torch
import torch.nn.functional as F
from PIL import Image
from app.core.config import settings
import io
from app.core.model.classification import model, device, val_tfms


def classify_image(image_bytes, T=2.0, tau=0.35):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    x = val_tfms(image).unsqueeze(0).to(device)
    with (
        torch.no_grad(),
        torch.amp.autocast(device_type=device.type, dtype=torch.float16),
    ):
        logits = model(x)
        probs = F.softmax(logits / T, dim=1)
        conf, cls = probs.max(dim=1)

    cls = cls.item() + 1
    conf = float(conf.item())
    if conf < tau:
        cls = 0

    return {"class_id": cls, "label": settings.labels[cls], "confidence": conf}
