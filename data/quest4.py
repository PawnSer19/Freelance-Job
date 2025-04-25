import os
import pandas as pd
import numpy as np
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, confusion_matrix

def load_dataset(filename):
    """
    Load dataset from a file. Assumes the last column is the target.
    """
    data = pd.read_csv(filename, delimiter=",", header=None)
    X = data.iloc[:, :-1].values  # Features (all columns except the last)
    y = data.iloc[:, -1].values   # Target (last column)
    return X, y

def train_svc(train_file, test_file, kernel='rbf', gamma='scale', C=1.0):
    """
    Train an SVM classifier and evaluate it on the test set.
    """
    # Load train and test datasets
    X_train, y_train = load_dataset(train_file)
    X_test, y_test = load_dataset(test_file)

    # Initialize SVM model
    model = SVC(kernel=kernel, gamma=gamma, C=C, random_state=42)

    # Train the model
    model.fit(X_train, y_train)

    # Predict on the test set
    y_pred = model.predict(X_test)

    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)

    # Compute confusion matrix
    conf_matrix = confusion_matrix(y_test, y_pred)

    # Print results
    dataset_name = os.path.basename(os.path.dirname(train_file))
    print(f"\n📊 Results for {dataset_name}:")
    print(f"✅ Accuracy: {accuracy:.4f}")
    print("🔍 Confusion Matrix:")
    print(conf_matrix)

def process_all_datasets(data_dir, kernel='rbf', gamma='scale', C=1.0):
    """
    Automatically process all datasets in the data directory.
    """
    for dataset in ["iris", "optics", "letter", "leukemia", "fp"]:
        dataset_path = os.path.join(data_dir, dataset)
        train_file = os.path.join(dataset_path, "data.trn")
        test_file = os.path.join(dataset_path, "data.tst")

        if os.path.exists(train_file) and os.path.exists(test_file):
            train_svc(train_file, test_file, kernel, gamma, C)
        else:
            print(f"⚠️ Missing train/test file for {dataset}")

if __name__ == "__main__":
    data_directory = "data"  # Set the main data directory
    process_all_datasets(data_directory, kernel='rbf', gamma='scale', C=1.0)