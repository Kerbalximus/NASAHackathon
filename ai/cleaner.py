import os

for file in os.listdir("map-proj-v3"):
    if "NOISE" in file:
        os.remove("map-proj-v3/" + file)
        print("Deleted: " + file)