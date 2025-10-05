import random
import numpy as np
from PIL import Image, ImageFilter
import os, sys, time
from concurrent.futures import ThreadPoolExecutor, as_completed
from collections import Counter, defaultdict
from typing import List, Tuple, Dict
import cv2
import tqdm

INDEX_PATH   = "dataset.csv"
ROOT_DIR     = "map-proj-v3/"
EXPECTED_W   = 227
EXPECTED_H   = 227


def add_noise(img):
    row , col = img.shape
    number_of_pixels = random.randint(300, 800)
    
    for i in range(number_of_pixels):
        y_coord=random.randint(0, row - 1)
        x_coord=random.randint(0, col - 1)
        img[y_coord][x_coord] = 255

    number_of_pixels = random.randint(300 , 800)

    for i in range(number_of_pixels):
        y_coord=random.randint(0, row - 1)
        x_coord=random.randint(0, col - 1)
        img[y_coord][x_coord] = 0
        
    return img


groups_of_images = {}

with open(INDEX_PATH, "r") as f:
    for line in f.readlines()[1:]:
        path, label = line.strip().split(",")
        if label not in groups_of_images:
            groups_of_images[label] = []
        groups_of_images[label].append(path)

indexed_groups_of_images = {}

for group_label in groups_of_images.keys():
    print(group_label, len(groups_of_images[group_label]))
    indexed_groups_of_images[group_label] = len(groups_of_images[group_label])

indexed_groups_of_images = sorted(indexed_groups_of_images.items(), key=lambda x: x[1])

print(indexed_groups_of_images)

print("I'll augment the group", indexed_groups_of_images[0][0], indexed_groups_of_images[0][1])


for group_label, group_size in enumerate(indexed_groups_of_images):
    if group_label not in [5, 7]:
        continue
    for image in tqdm.tqdm(groups_of_images[str(group_label)]):
        img = cv2.imread(os.path.join(ROOT_DIR, image), cv2.IMREAD_GRAYSCALE)
        noisy_img = add_noise(img)
        new_name = os.path.join(ROOT_DIR, image.split(".")[0] + str(random.randint(1, 10000)) + "NOISE.png")
        cv2.imwrite(new_name, noisy_img)
        with open(INDEX_PATH, "a") as f:
            f.write(f"\n{new_name},{group_label}")
        print(f"Augmented image from Class #{group_label}: {image} ––> {new_name}")

print("Augmentation completed")