import os
import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import AdaBoostClassifier, BaggingClassifier, RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix


def load_dataset(filename):
    """
    Load dataset from a file. Assumes the last column is the target.
    """
    data = pd.read_csv(filename, delimiter=",", header=None)
    X = data.iloc[:, :-1].values  # Features (all columns except the last)
    y = data.iloc[:, -1].values  # Target (last column)
    return X, y


def train_and_evaluate(train_file, test_file, classifier, classifier_name, results):
    """
    Train a classifier and evaluate it on the test set.
    """
    # Load train and test datasets
    X_train, y_train = load_dataset(train_file)
    X_test, y_test = load_dataset(test_file)

    # Train the model
    classifier.fit(X_train, y_train)

    # Predict on the test set
    y_pred = classifier.predict(X_test)

    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)

    # Compute confusion matrix
    conf_matrix = confusion_matrix(y_test, y_pred)

    # Store results
    dataset_name = os.path.basename(os.path.dirname(train_file))
    results.append((dataset_name, classifier_name, accuracy, conf_matrix))


def process_all_datasets(data_dir):
    """
    Automatically process all datasets in the data directory with multiple classifiers.
    """
    classifiers = [
        (DecisionTreeClassifier(random_state=42), "Decision Tree"),
        (AdaBoostClassifier(n_estimators=50, random_state=42), "AdaBoost"),
        (BaggingClassifier(n_estimators=50, random_state=42), "Bagging"),
        (RandomForestClassifier(n_estimators=50, random_state=42), "Random Forest")
    ]

    results = []

    for dataset in os.listdir(data_dir):
        dataset_path = os.path.join(data_dir, dataset)
        if os.path.isdir(dataset_path):  # Ensure it's a directory
            train_file = os.path.join(dataset_path, "data.trn")
            test_file = os.path.join(dataset_path, "data.tst")

            if os.path.exists(train_file) and os.path.exists(test_file):
                for classifier, classifier_name in classifiers:
                    train_and_evaluate(train_file, test_file, classifier, classifier_name, results)
            else:
                print(f"⚠️ Missing train/test file for {dataset}")

    # Print summary results
    print("\n📊 Classification Results Summary:")
    for dataset_name, classifier_name, accuracy, conf_matrix in results:
        print(f"\nDataset: {dataset_name} | Classifier: {classifier_name}")
        print(f"Accuracy: {accuracy:.4f}")
        print("Confusion Matrix:")
        print(conf_matrix)


if __name__ == "__main__":
    data_directory = "data"  # Set the main data directory
    process_all_datasets(data_directory)
