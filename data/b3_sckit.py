import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split

# Sample dataset from the image
data = np.array([
    [0.204, 0.834, 0], [0.222, 0.730, 0], [0.298, 0.822, 0], [0.450, 0.842, 0], [0.412, 0.732, 0],
    [0.298, 0.640, 0], [0.588, 0.298, 0], [0.540, 0.398, 0], [0.670, 0.466, 0], [0.834, 0.600, 0],
    [0.724, 0.368, 0], [0.790, 0.262, 0], [0.824, 0.338, 0], [0.136, 0.260, 1], [0.146, 0.374, 1],
    [0.258, 0.422, 1], [0.292, 0.282, 1], [0.478, 0.568, 1], [0.654, 0.702, 1], [0.786, 0.758, 1],
    [0.690, 0.628, 1], [0.736, 0.786, 1], [0.574, 0.742, 1]
])

# Split dataset into features and labels
X = data[:, :2]
y = data[:, 2]

# Train SVC classifier
model = SVC(kernel='rbf', C=1.0, gamma='scale')
model.fit(X, y)


# Visualization
def plot_decision_boundary(model, X, y):
    x_min, x_max = X[:, 0].min() - 0.1, X[:, 0].max() + 0.1
    y_min, y_max = X[:, 1].min() - 0.1, X[:, 1].max() + 0.1
    xx, yy = np.meshgrid(np.linspace(x_min, x_max, 100),
                         np.linspace(y_min, y_max, 100))

    Z = model.predict(np.c_[xx.ravel(), yy.ravel()])
    Z = Z.reshape(xx.shape)

    plt.contourf(xx, yy, Z, alpha=0.3)
    plt.scatter(X[y == 0][:, 0], X[y == 0][:, 1], c='red', marker='s', label='Class 0')
    plt.scatter(X[y == 1][:, 0], X[y == 1][:, 1], c='blue', marker='o', label='Class 1')
    plt.xlabel('X1')
    plt.ylabel('X2')
    plt.legend()
    plt.title('SVC Decision Boundary')
    plt.show()


plot_decision_boundary(model, X, y)
