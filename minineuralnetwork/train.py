import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from sklearn.model_selection import train_test_split

# --- CONFIGURATION ---
N_SAMPLES = 1000      # Number of data samples for training
SCALE = 10**18        # Fixed-Point Scale for Rust (10^18)
HIDDEN_UNITS = 4      # Number of neurons in the single hidden layer
INPUT_DIM = 3         # [Warmth, Intensity, Depth]
OUTPUT_DIM = 2        # [Sphere Color R, Sphere Color G]
# ---------------------

print(f"--- 1. Generating {N_SAMPLES} Synthetic Data Samples ---")

# Input Data (X): [Warmth, Intensity, Depth] - Normalized 0.0 to 1.0
X = np.random.rand(N_SAMPLES, INPUT_DIM)

# Output Data (Y): [Sphere Color R, Sphere Color G] - Normalized 0.0 to 1.0
# We create a slightly more complex relationship for the NN to learn.
Y_R = 0.6 * X[:, 0] + 0.2 * X[:, 1] * X[:, 2] + np.random.normal(0, 0.05, N_SAMPLES)
Y_G = 0.7 * X[:, 1] - 0.3 * X[:, 0] + 0.1 * np.sin(X[:, 2] * 2 * np.pi) + np.random.normal(0, 0.05, N_SAMPLES)

# Clip the output to ensure it stays within the [0.0, 1.0] range
Y_R = np.clip(Y_R, 0.0, 1.0)
Y_G = np.clip(Y_G, 0.0, 1.0)
Y = np.column_stack((Y_R, Y_G))

# Split data (optional, but recommended)
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

print(f"Training data shape: {X_train.shape}")

# --- 2. Defining and Training the Mini Neural Network ---
print("\n--- 2. Training Mini Neural Network (1 Hidden Layer) ---")

model = Sequential([
    # Hidden Layer: 4 neurons, using ReLU activation function (W_1, b_1)
    Dense(HIDDEN_UNITS, activation='relu', input_shape=(INPUT_DIM,), name='hidden_layer'),
    # Output Layer: 2 outputs, using Sigmoid activation to ensure 0-1 output (W_2, b_2)
    Dense(OUTPUT_DIM, activation='sigmoid', name='output_layer')
])

# Compile and Train
model.compile(optimizer='adam', loss='mse')
model.fit(X_train, Y_train, epochs=50, batch_size=32, verbose=0)
loss = model.evaluate(X_test, Y_test, verbose=0)
print(f"Model trained successfully. Test Loss (MSE): {loss:.4f}")

# --- 3. Extracting Weights and Biases (4 Arrays) ---
print("\n--- 3. Extracting All Weights and Biases ---")

# Layer 1: Input -> Hidden (4 Arrays)
weights_1, biases_1 = model.get_layer('hidden_layer').get_weights()
# Layer 2: Hidden -> Output (4 Arrays)
weights_2, biases_2 = model.get_layer('output_layer').get_weights()

print(f"Weights 1 (Input->Hidden, Shape {weights_1.shape}):\n{weights_1.T}") # Transpose for Rust matrix multiplication format
print(f"Biases 1 (Hidden, Shape {biases_1.shape}):\n{biases_1}")
print(f"Weights 2 (Hidden->Output, Shape {weights_2.shape}):\n{weights_2.T}") # Transpose for Rust matrix multiplication format
print(f"Biases 2 (Output, Shape {biases_2.shape}):\n{biases_2}")

# --- 4. Conversion to Rust Fixed-Point i64 Format ---

def to_fixed_point(value, scale):
    """Converts a float value to an i64 fixed-point integer."""
    # We round the value before converting to int
    return int(round(value * scale))

# Transpose weights to match Rust matrix multiplication convention (W * X)
# Transpose W_1: (3, 4) -> (4, 3) | Transpose W_2: (4, 2) -> (2, 4)
W1_fixed = [[to_fixed_point(val, SCALE) for val in row] for row in weights_1.T]
B1_fixed = [to_fixed_point(val, SCALE) for val in biases_1]

W2_fixed = [[to_fixed_point(val, SCALE) for val in row] for row in weights_2.T]
B2_fixed = [to_fixed_point(val, SCALE) for val in biases_2]


print("\n=======================================================")
print("=== FINAL RUST IMPLEMENTATION DATA (i64 Fixed-Point) ===")
print("=======================================================")

print("\n// W_1 Matrix (INPUT -> HIDDEN): Shape (4, 3)")
print(f"const W1: [[i64; 3]; 4] = {W1_fixed};")

print("\n// B_1 Vector (HIDDEN LAYER BIASES): Shape (4)")
print(f"const B1: [i64; 4] = {B1_fixed};")

print("\n// W_2 Matrix (HIDDEN -> OUTPUT): Shape (2, 4)")
print(f"const W2: [[i64; 4]; 2] = {W2_fixed};")

print("\n// B_2 Vector (OUTPUT LAYER BIASES): Shape (2)")
print(f"const B2: [i64; 2] = {B2_fixed};")
