import os
import cv2
import numpy as np
from sklearn.model_selection import train_test_split

# Folder containing 'violence' and 'normal' subfolders
DATA_DIR = 'SCVD'
FRAME_SIZE = (224, 224)
FRAMES_PER_VIDEO = 10  # Sample 10 frames from each video

label_map = {'violence': 1, 'normal': 0}

def extract_frames(video_path, num_frames=FRAMES_PER_VIDEO):
    cap = cv2.VideoCapture(video_path)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frames = []

    if total < num_frames:
        gap = 1
    else:
        gap = total // num_frames

    for i in range(num_frames):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i * gap)
        success, frame = cap.read()
        if success:
            frame = cv2.resize(frame, FRAME_SIZE)
            frames.append(frame)
    cap.release()
    return frames

def load_dataset():
    X, y = [], []
    for label in os.listdir(DATA_DIR):
        label_path = os.path.join(DATA_DIR, label)
        if not os.path.isdir(label_path): continue
        for video in os.listdir(label_path):
            video_path = os.path.join(label_path, video)
            frames = extract_frames(video_path)
            X.extend(frames)
            y.extend([label_map[label]] * len(frames))
    return np.array(X), np.array(y)

print("📦 Loading data...")
X, y = load_dataset()

# Normalize
X = X / 255.0

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Save for training
np.save("X_train.npy", X_train)
np.save("y_train.npy", y_train)
np.save("X_test.npy", X_test)
np.save("y_test.npy", y_test)

print(f"✅ Done. Total: {len(X)}, Train: {len(X_train)}, Test: {len(X_test)}")
