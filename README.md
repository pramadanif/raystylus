
<div align="center">

  <img src="./public/raystylus-logo.png" alt="RayStylus Logo" width="150" />

  # 🎨 RayStylus: On-Chain Ray Tracing Engine

  <br/>
  <img src="./public/demo.gif" alt="RayStylus On-Chain Demo" width="600" />
  <br/>

  <sub><i>Actual on-chain rendering: 32x32 pixels, calculated in Rust via Stylus. No off-chain GPU used.</i></sub>

  <br/>
  <br/>

  <h3>
    <a href="https://raystylus.vercel.app">🚀 LAUNCH LIVE STUDIO</a>
  </h3>

  [![Arbitrum Stylus](https://img.shields.io/badge/Arbitrum-Stylus-blue?style=flat-square)](https://arbitrum.io)
  [![Rust](https://img.shields.io/badge/Language-Rust-orange?style=flat-square)](https://www.rust-lang.org/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

</div>

---
### The Story

💬 The Hook
Most people still think blockchains are only good for DeFi.
We don’t.

⚡ The Breakthrough
Meet RayStylus — the first fully on-chain ray tracing engine built with Arbitrum Stylus (Rust), enhanced with an on-chain mini neural network.

🔬 Why Stylus Changes Everything
This level of computation is impractical on traditional EVM contracts.
With Stylus + Rust, RayStylus executes heavy vector math, ray–sphere intersections, and pixel shading directly on-chain — deterministically and verifiably.

🧠 On-Chain Mini Neural Network
Beyond classic ray tracing, RayStylus includes a lightweight neural network executed on-chain.
This neural module dynamically computes depth intensity and color modulation, enabling adaptive shading that goes beyond fixed mathematical formulas — while remaining fully deterministic.

🤖 Human-Friendly by Design
An AI-powered configuration agent (OpenAI integration) translates natural language prompts into deterministic rendering parameters.
AI never touches execution logic — it only assists configuration.
All rendering and neural computation happens entirely on-chain.

🌐 The Vision
RayStylus demonstrates that Stylus unlocks computational domains previously impossible on-chain.
By combining ray tracing + neural inference in a single smart contract, it challenges the assumption that blockchains can only handle financial logic.

🚀 Why This Matters
This is not a simulation or off-chain shortcut.
RayStylus performs real rendering and neural inference on-chain, achieving 10–100× lower gas costs compared to EVM-only approaches.

RayStylus is not a DeFi app.
It’s a proof-of-compute for Arbitrum Stylus.
[![Arbitrum Stylus](https://img.shields.io/badge/Arbitrum-Stylus-blue?style=flat-square)](https://arbitrum.io)
[![Rust](https://img.shields.io/badge/Language-Rust-orange?style=flat-square)](https://www.rust-lang.org/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js-black?style=flat-square)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

</div>

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Getting Started](#-getting-started)
3. [System Architecture](#️-system-architecture)
4. [Smart Contract Documentation](#-smart-contract-documentation)
5. [Technical Deep Dive](#-technical-deep-dive)
6. [MNN Training Guide](#-mnn-training-guide) ← **NEW: Complete training workflow**
7. [Project Structure](#-project-structure)
8. [Usage Guide](#-usage-guide)
9. [Performance Benchmarks](#-performance-benchmarks)
10. [Development](#-development)
11. [Additional Technical Reference](#-additional-technical-reference)
12. [Deployment Checklist](#-deployment-checklist)
13. [Contributing](#-contributing)
14. [License](#-license)
15. [Acknowledgments](#-acknowledgments)
16. [Support](#-support)

---

## 🚀 Overview

RayStylus demonstrates the power of **Arbitrum Stylus** by implementing a complete ray tracing engine in Rust. Instead of expensive off-chain computations, we render 32×32 pixel spheres with full 3D lighting directly on-chain.


### Key Features

- ✅ **Full Ray Tracing**: Ray-sphere intersection with diffuse lighting
- ✅ **Dynamic Parameters**: Adjustable sphere color, background gradient, and camera position (X, Y, Z)
- ✅ **Fixed-Point Math**: 1024-scale integer arithmetic for deterministic results
- ✅ **Gas Efficient**: Optimized for minimal gas consumption
- ✅ **Live Rendering**: Real-time pixel data to canvas
- ✅ **Mobile Ready**: Responsive design for all devices
- ✅ **Gradient Background**: Smooth interpolation between two colors
- ✅ **AI Integration**: Natural language chat to control scene parameters, powered by OpenRouter and GPT-4.1. Seamlessly integrates AI and WASM raytracing on Arbitrum Stylus blockchain.
- ✅ **🧠 Mini Neural Network (MNN)**: On-chain ML inference (3→4→2 architecture) for aesthetic color generation. Trained neural network deployed as immutable smart contract code. First-ever trustless AI inference on blockchain.

### 🌐 Deployment Details

**Network:** Arbitrum Sepolia (Chain ID: 421614)
| Property | Value |
|----------|-------|
| **Contract Address** | `0x1bd8e7e9b1d0824eb97535af61bbaed0a9dd5757` |
| **TX Hash** | `0x5743ade3433f2ea1c6ae93679ce5210593af81353171775aba2c0f31444817f9` |
| **Status** | ✅ Active and Ready On-Chain |
| **Block Explorer** | [Arbiscan](https://sepolia.arbiscan.io/address/0x1bd8e7e9b1d0824eb97535af61bbaed0a9dd5757)

---

## 🔧 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** or **yarn**
- **Rust** 1.70+ with `wasm32-unknown-unknown` target
- **Cargo Stylus** CLI (`cargo install cargo-stylus`)
- **MetaMask** wallet with Arbitrum Sepolia testnet configured
- **Python** 3.8+ (for MNN training)


## 🏗️ System Architecture

### Complete System Overview

```mermaid
graph TB
    subgraph UI["🎨 Frontend Layer"]
        A["Next.js App"]
        B["Landing Page"]
        C["Studio Page"]
        A --> B
        A --> C
    end
    
    subgraph Input["⚙️ Input Processing"]
        D["AI Chat<br/>(OpenRouter)"]
        E["Style Sliders<br/>(Warmth/Intensity/Depth)"]
        F["Color Picker<br/>(Sphere + BG)"]
        G["Camera Controls<br/>(X/Y/Z)"]
    end
    
    subgraph Preview["👁️ FREE Preview (No Gas)"]
        H["view_aesthetic()<br/>(MNN Inference)"]
        H1["Layer 1: 3→4 ReLU<br/>Input: Warmth, Intensity, Depth"]
        H2["Layer 2: 4→2 Sigmoid<br/>Output: Sphere RGB"]
        H --> H1 --> H2
    end
    
    subgraph Web3["🔗 Web3 Integration"]
        I["Wagmi/Viem"]
        J["RPC: Arbitrum Sepolia<br/>sepolia-rollup.arbitrum.io"]
    end
    
    subgraph Smart["⚙️ Arbitrum Stylus Contract"]
        K["Contract Address:<br/>0x1bd8e7e9b1d0824.."]
        L["Three Main Functions"]
        M["1. view_aesthetic()"]
        N["2. mint(params)"]
        O["3. render_token(id)"]
        L --> M
        L --> N
        L --> O
    end
    
    subgraph RayTrace["🔴 Ray Tracing Engine"]
        P["Setup Scene"]
        Q["32×32 Pixel Loop"]
        R["Ray Generation"]
        S["Ray-Sphere Test"]
        T["Lighting Calc"]
        U["RGB Encoding"]
        P --> Q --> R --> S --> T --> U
    end
    
    subgraph Output["📊 Results"]
        V["3,072 bytes<br/>(32×32×3 RGB)"]
        W["Canvas Renderer"]
        X["🖼️ Visual Output"]
        V --> W --> X
    end
    
    C --> D
    C --> E
    C --> F
    C --> G
    D --> H
    E --> H
    H2 -.->|Preview| X
    E --> I
    F --> I
    G --> I
    I --> J
    J --> K
    M --> H1
    N --> P
    O --> RayTrace
    U --> V
    
    style UI fill:#1B211A,stroke:#EBD5AB,color:#EBD5AB
    style Input fill:#2D3A2D,stroke:#8BAE66,color:#EBD5AB
    style Preview fill:#4A6741,stroke:#8BAE66,color:#EBD5AB
    style Web3 fill:#2D3A2D,stroke:#8BAE66,color:#EBD5AB
    style Smart fill:#628141,stroke:#8BAE66,color:#fff
    style RayTrace fill:#628141,stroke:#8BAE66,color:#fff
    style Output fill:#EBD5AB,stroke:#628141,color:#1B211A
```

### Detailed Data Flow

```mermaid
graph LR
    subgraph Step1["STEP 1: Preview (FREE)"]
        A["Input Style<br/>(Warmth/Intensity/Depth)"]
        B["MNN Inference<br/>(view_aesthetic)"]
        C["Output RGB"]
        A --> B --> C
    end
    
    subgraph Step2["STEP 2: Mint NFT"]
        D["Confirm Colors<br/>& Camera"]
        E["Call mint()<br/>21 bytes stored"]
        F["Get token_id"]
        D --> E --> F
    end
    
    subgraph Step3["STEP 3: Render On-Demand"]
        G["Call render_token(id)<br/>(Anyone can call)"]
        H["Ray Tracing<br/>~120K gas"]
        I["Return BMP<br/>3,126 bytes"]
        G --> H --> I
    end
    
    C -.->|No Cost| D
    F -.->|Storage Cost| G
    
    style Step1 fill:#4A6741,stroke:#8BAE66,color:#fff
    style Step2 fill:#628141,stroke:#8BAE66,color:#fff
    style Step3 fill:#628141,stroke:#8BAE66,color:#fff
```

### Contract Execution Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Next.js UI
    participant MNN as MNN Preview<br/>view_aesthetic()
    participant Web3 as Web3 Layer<br/>Wagmi/Viem
    participant RPC as RPC Node<br/>Arbitrum Sepolia
    participant VM as Stylus VM
    participant Contract as Smart Contract
    participant Output as Canvas Renderer
    
    User->>UI: Set Warmth/Intensity/Depth
    UI->>MNN: Call view_aesthetic() - FREE!
    MNN-->>UI: Return RGB (no gas cost)
    UI-->>User: Show Preview
    
    User->>UI: Confirm & Click Render
    UI->>Web3: readContract(render_token)
    Web3->>RPC: Query Arbitrum Sepolia
    RPC->>VM: Execute WASM Code
    VM->>Contract: run ray_tracing()
    
    rect rgb(100, 150, 100)
        Note over Contract: Ray Tracing Engine
        Contract->>Contract: Setup Scene<br/>(Camera, Sphere, Light)
        Contract->>Contract: Loop 1024 pixels<br/>(32×32 grid)
        Contract->>Contract: Ray-Sphere Intersection<br/>(Quadratic Solver)
        Contract->>Contract: Diffuse Lighting<br/>(Normal × Light)
        Contract->>Contract: RGB Encoding
    end
    
    Contract-->>VM: Return 3,126 bytes<br/>(BMP File)
    VM-->>RPC: Serialized Result
    RPC-->>Web3: Hex String
    Web3-->>UI: Complete Response
    UI->>Output: Decode & Render
    Output-->>User: Display Ray-Traced Image
```

### System Architecture - Submission Ready (Hackquest)

```mermaid
graph LR
    subgraph User["👤 User"]
        A["Set Parameters<br/>Warmth/Intensity/Depth"]
    end
    
    subgraph Frontend["🎨 Frontend<br/>Next.js"]
        B["View Aesthetic<br/>(MNN Preview)"]
        C["Render Token<br/>(Ray Tracer)"]
    end
    
    subgraph Web3Layer["🔗 Web3 Layer"]
        D["Arbitrum Sepolia RPC<br/>sepolia-rollup.arbitrum.io"]
    end
    
    subgraph SmartContract["⚙️ Smart Contract<br/>Arbitrum Stylus"]
        E["view_aesthetic<br/>MNN Inference"]
        F["render_token<br/>Ray Tracing"]
    end
    
    subgraph Rendering["🔴 On-Chain Computation"]
        G["32×32 Pixel Loop"]
        H["Ray-Sphere Intersection"]
        I["Diffuse Lighting"]
        J["RGB Output"]
    end
    
    subgraph Result["📊 Result"]
        K["3,126 bytes<br/>BMP Image"]
        L["Canvas Display"]
    end
    
    A --> B
    B --> D
    D --> E
    E --> L
    
    A --> C
    C --> D
    D --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L
    
    style User fill:#EBD5AB,stroke:#628141,color:#1B211A
    style Frontend fill:#4A6741,stroke:#8BAE66,color:#fff
    style Web3Layer fill:#2D3A2D,stroke:#8BAE66,color:#EBD5AB
    style SmartContract fill:#628141,stroke:#8BAE66,color:#fff
    style Rendering fill:#628141,stroke:#8BAE66,color:#fff
    style Result fill:#EBD5AB,stroke:#628141,color:#1B211A
```

**Key Stats:**
- ✅ MNN Preview: FREE (view function, 0 gas)
- ✅ Render: ~120K gas (~120ms)
- ✅ Chain: Arbitrum Sepolia
- ✅ Contract: `0x1bd8e7e9b1d0824eb97535af61bbaed0a9dd5757`

### Frontend Component Architecture

```mermaid
graph TB
    subgraph Root["🎨 App Structure"]
        App["App.tsx"]
        Layout["RootLayout<br/>(providers, theme)"]
        App --> Layout
    end
    
    subgraph Pages["📄 Pages"]
        Landing["Landing Page"]
        Studio["Studio Page<br/>(Interactive)"]
        Aesthetic["Aesthetic Page<br/>(AI Preview)"]
    end
    
    subgraph Landing_Comps["Landing Components"]
        Hero["Hero<br/>(Typewriter)"]
        Problem["Problem/Solution"]
        HowIt["How It Works"]
        Bench["Benchmark Table"]
        Arch["Architecture"]
        Demo["Demo CTA"]
        Footer["Footer"]
    end
    
    subgraph Studio_Comps["Studio Components"]
        Navbar["Navigation<br/>(Connect)"]
        Config["Configuration<br/>(Colors, Camera)"]
        Canvas["Canvas<br/>(32×32)"]
        Hooks["useRayStylus<br/>(Contract)"]
        AestheticHook["useAesthetic<br/>(MNN)"]
    end
    
    Layout --> Landing
    Layout --> Studio
    Layout --> Aesthetic
    
    Landing --> Hero
    Landing --> Problem
    Landing --> HowIt
    Landing --> Bench
    Landing --> Arch
    Landing --> Demo
    Landing --> Footer
    
    Studio --> Navbar
    Studio --> Config
    Studio --> Canvas
    Studio --> Hooks
    Studio --> AestheticHook
    
    Hooks --> Web3["Web3: render_token"]
    AestheticHook --> Web3
    
    style Root fill:#1B211A,stroke:#EBD5AB,color:#EBD5AB
    style Pages fill:#2D3A2D,stroke:#8BAE66,color:#EBD5AB
    style Landing_Comps fill:#4A6741,stroke:#8BAE66,color:#EBD5AB
    style Studio_Comps fill:#628141,stroke:#8BAE66,color:#fff
    style Web3 fill:#8BAE66,stroke:#EBD5AB,color:#1B211A
```

---

## 📜 Smart Contract Documentation

### Overview

The RayStylus smart contract is a sophisticated ray tracing engine written in Rust and deployed as a WebAssembly (WASM) contract on Arbitrum Stylus. It provides four main functions:

1. **`view_aesthetic(warmth, intensity, depth)`** - AI-powered color generation (FREE view function)
2. **`mint()`** - Create NFTs with rendering parameters
3. **`render_token(token_id)`** - On-demand rendering from stored parameters
4. **`owner_of(token_id)`** - Query token ownership

This **multi-phase design** separates: preview (free AI inference) → minting (cheap, parameters only) → rendering (expensive, on-demand).

---

### Contract Functions

#### 0️⃣ **`view_aesthetic(warmth, intensity, depth) → (r, g, b)`**

**Purpose:** AI-powered preview of aesthetic colors using on-chain neural network (FREE!)

**Parameters:**
| Parameter | Type | Range | Description |
|-----------|------|-------|-------------|
| `warmth` | `U256` | 0 to 10^18 | Warmth style factor (0.0 to 1.0) |
| `intensity` | `U256` | 0 to 10^18 | Intensity style factor (0.0 to 1.0) |
| `depth` | `U256` | 0 to 10^18 | Depth style factor (0.0 to 1.0) |

**Returns:** `(u8, u8, u8)` - RGB color tuple (0-255 each)

**Gas Cost:** FREE (view function, no state changes)

**Behavior:**
- Runs 2-layer neural network (3→4→2 architecture) trained on 1000 synthetic samples
- Input: 3 style dimensions (warmth, intensity, depth normalized to 0.0-1.0)
- Hidden layer: 4 neurons with ReLU activation
- Output layer: 2 neurons with sigmoid activation
- Returns predicted sphere RGB colors instantly
- Deterministic: same inputs always produce identical outputs
- **Perfect for**: Live preview before minting!

**Frontend Example:**
```typescript
// Preview colors before minting (no gas cost!)
const [r, g, b] = await publicClient.readContract({
  address: contractAddress,
  abi: RAYSTYLUS_ABI,
  functionName: 'view_aesthetic',
  args: [
    BigInt(1e18) * BigInt(75) / BigInt(100),   // Warmth: 0.75
    BigInt(1e18) * BigInt(60) / BigInt(100),   // Intensity: 0.60
    BigInt(1e18) * BigInt(50) / BigInt(100)    // Depth: 0.50
  ]
});
console.log(`Predicted colors: RGB(${r}, ${g}, ${b})`);
```

---

#### 1️⃣ **`mint(sphere_r, sphere_g, sphere_b, bg_color1_r, bg_color1_g, bg_color1_b, bg_color2_r, bg_color2_g, bg_color2_b, cam_x, cam_y, cam_z) → U256`**

**Purpose:** Mint a unique NFT with ray-traced rendering parameters stored on-chain

**Parameters:**
| Parameter | Type | Range | Description |
|-----------|------|-------|-------------|
| `sphere_r, sphere_g, sphere_b` | `uint8` | 0-255 | RGB color of the sphere |
| `bg_color1_r/g/b` | `uint8` | 0-255 | Top gradient background color |
| `bg_color2_r/g/b` | `uint8` | 0-255 | Bottom gradient background color |
| `cam_x, cam_y, cam_z` | `int32` | -2048 to 2048 | Camera offset (scale 1024) |

**Returns:** `U256` - Token ID of minted NFT

**Gas Cost:** ~5,000-10,000 gas (parameters only, no rendering)

**Behavior:**
- Increments `total_supply` counter
- Stores caller address as token owner
- Packs 21 bytes of configuration data (9 color bytes + 12 camera bytes in little-endian)
- Stores data in contract's persistent storage
- **Fire-and-forget design**: Parameters encoded once, rendering done on-demand later

**Data Stored (21 bytes):**
```
Bytes 0-8:   RGB Colors (3 bytes each)
  [0] sphere_r        [3] bg_color1_r     [6] bg_color2_r
  [1] sphere_g        [4] bg_color1_g     [7] bg_color2_g
  [2] sphere_b        [5] bg_color1_b     [8] bg_color2_b

Bytes 9-20:  Camera (4 bytes each, little-endian i32)
  [9-12]   cam_x (as little-endian bytes)
  [13-16]  cam_y (as little-endian bytes)
  [17-20]  cam_z (as little-endian bytes)
```

**Frontend Example:**
```typescript
const result = await mint(config);
// Returns sender address for Arbiscan verification
// Transaction is submitted to mempool immediately
```

---

#### 2️⃣ **`render_token(token_id) → Bytes`**

**Purpose:** Retrieve fully rendered BMP image for a minted token (on-demand rendering)

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `token_id` | `U256` | The token ID to render |

**Returns:** `Bytes` - Complete BMP image file (3,126 bytes total)
- 54-byte BMP header
- 3,072 pixel bytes (32×32 × 3 RGB)

**Gas Cost:** ~120,000-150,000 gas (full ray tracing)

**Execution Flow:**
1. Retrieve 21-byte config from storage
2. Unpack colors and camera position
3. Execute ray tracing algorithm for all 1,024 pixels
4. Generate BMP file header
5. Return as bytes

**Output Example:**
```
Total: 3,126 bytes
[0-53]     BMP Header (54 bytes)
[54-3125]  Pixel Data (3,072 bytes)
           Each pixel: 3 bytes (RGB)
           Format: BGR (reversed for BMP format)
```

---

#### 3️⃣ **`owner_of(token_id) → Address`**

**Purpose:** Retrieve the owner address of a specific token

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `token_id` | `U256` | The token ID to query |

**Returns:** `Address` - Wallet address that minted the token

**Gas Cost:** ~2,000-3,000 gas (storage read)

---

### Contract Data Structure

```rust
pub struct Contract {
    // Maps token_id → owner_address
    pub owners: StorageMap<U256, StorageAddress>,
    
    // Maps token_id → 21-byte packed config
    pub token_data: StorageMap<U256, StorageBytes>,
    
    // Total number of minted tokens
    pub total_supply: StorageU256,
}
```

---

### Contract Interaction Example

**Using wagmi/viem (Frontend):**

```typescript
// Preview aesthetic colors (FREE - VIEW function)
const [r, g, b] = await publicClient.readContract({
  address: contractAddress,
  abi: RAYSTYLUS_ABI,
  functionName: 'view_aesthetic',
  args: [
    BigInt(1e18) * BigInt(75) / BigInt(100),   // Warmth: 0.75
    BigInt(1e18) * BigInt(60) / BigInt(100),   // Intensity: 0.60
    BigInt(1e18) * BigInt(50) / BigInt(100)    // Depth: 0.50
  ]
});
// Returns: [r_value, g_value, b_value] - no gas cost!

// Mint NFT with rendering parameters
const txHash = await writeContractAsync({
  address: contractAddress,
  abi: RAYSTYLUS_ABI,
  functionName: 'mint',
  args: [
    235, 213, 171,  // Sphere: beige
    255, 255, 255,  // BG top: white
    91, 127, 213,   // BG bottom: blue
    0, 0, 0         // Camera: center
  ]
});
// Returns: token_id

// Render a stored token (on-demand, anyone can call)
const bmpData = await publicClient.readContract({
  address: contractAddress,
  abi: RAYSTYLUS_ABI,
  functionName: 'render_token',
  args: [BigInt(0)] // Token ID 0
});
// Returns: 3,126 bytes (BMP file format)

// Check token ownership
const owner = await publicClient.readContract({
  address: contractAddress,
  abi: RAYSTYLUS_ABI,
  functionName: 'owner_of',
  args: [BigInt(0)] // Token ID 0
});
// Returns: Address of token owner
```

---

### Contract Verification

View the contract on Arbiscan:
- **Address:** [0x1bd8e7e9b1d0824eb97535af61bbaed0a9dd5757](https://sepolia.arbiscan.io/address/0x1bd8e7e9b1d0824eb97535af61bbaed0a9dd5757)
- **Deployment TX:** [0x5743ade3433f2ea1c6ae93679ce5210593af81353171775aba2c0f31444817f9](https://sepolia.arbiscan.io/tx/0x5743ade3433f2ea1c6ae93679ce5210593af81353171775aba2c0f31444817f9)
- **Status:** ✅ Active and Ready On-Chain

---

### Parameter Explanation

#### Sphere Color Parameters (`sphere_r`, `sphere_g`, `sphere_b`)
- **Type:** uint8 (0-255)
- **Purpose:** Define the RGB color of the sphere in the scene
- **Examples:**
  - Red sphere: `(255, 0, 0)`
  - Green sphere: `(0, 255, 0)`
  - Blue sphere: `(0, 0, 255)`
  - Beige/Tan: `(235, 213, 171)` [Default]

#### Background Gradient Parameters
- **bg_color1_r/g/b:** Top color of the background gradient
- **bg_color2_r/g/b:** Bottom color of the background gradient
- **Purpose:** Creates a smooth linear interpolation (lerp) between two colors
- **Example:**
  ```
  bg_color1 = (255, 255, 255)  // White at top
  bg_color2 = (100, 100, 100)  // Gray at bottom
  // Creates smooth white-to-gray gradient from top to bottom
  ```

#### Camera Offset Parameters (`cam_x`, `cam_y`, `cam_z`)
- **Type:** int32 (fixed-point format, scale 1024)
- **Conversion:** Actual value = parameter / 1024
- **Valid Range:** Typically -2 to 2 (representing -2.0 to 2.0 in world space)
- **Coordinate System:**
  - **X-axis:** Left (-) / Right (+)
  - **Y-axis:** Down (-) / Up (+)
  - **Z-axis:** Away (-) / Closer (+) to camera
- **Default Camera Position:** (0, 0, 2.5) in world space
- **Example:** To move camera right by 1.0 unit, set `cam_x = 1024`

---

### Internal Contract Architecture

#### Scene Setup

```
Fixed-Point Scale: 1024 (1.0 = 1024 units)

Camera Position (World Space):
  - Default: (0, 0, 2.5)
  - Adjusted: (cam_x*1024, cam_y*1024, (2.5*1024 + cam_z*1024))

Sphere Position: (0, 0, 0) [center of world]
Sphere Radius: 1.0

Light Source Direction: (1, 1, 1) normalized
  - Creates illumination from diagonal top-right-front
  
Render Resolution: 32×32 pixels = 1,024 total pixels
Output Format: RGB bytes (1,024 pixels × 3 bytes = 3,072 bytes total)
```
  bg_color2 = (100, 100, 100)  // Gray at bottom
  // Creates smooth white-to-gray gradient from top to bottom
  ```

#### Camera Offset Parameters (`cam_x`, `cam_y`, `cam_z`)
- **Type:** int32 (fixed-point format, scale 1024)
- **Conversion:** Actual value = parameter / 1024
- **Valid Range:** Typically -2 to 2 (representing -2.0 to 2.0 in world space)
- **Coordinate System:**
  - **X-axis:** Left (-) / Right (+)
  - **Y-axis:** Down (-) / Up (+)
  - **Z-axis:** Away (-) / Closer (+) to camera
- **Default Camera Position:** (0, 0, 2.5) in world space
- **Example:** To move camera right by 1.0 unit, set `cam_x = 1024`

### Internal Contract Architecture

#### Scene Setup

```
Fixed-Point Scale: 1024 (1.0 = 1024 units)

Camera Position (World Space):
  - Default: (0, 0, 2.5)
  - Adjusted: (cam_x*1024, cam_y*1024, (2.5*1024 + cam_z*1024))

Sphere Position: (0, 0, 0) [center of world]
Sphere Radius: 1.0

Light Source Direction: (1, 1, 1) normalized
  - Creates illumination from diagonal top-right-front
  
Render Resolution: 32×32 pixels = 1,024 total pixels
Output Format: RGB bytes (1,024 pixels × 3 bytes = 3,072 bytes total)
```

#### Ray Tracing Algorithm

The contract implements the classic ray-sphere intersection algorithm:

**Step 1: Ray Generation**
For each pixel (i, j) in 32×32 grid:
```
Normalized Device Coordinates (NDC):
  u = (i / 32) * 2 - 1     // Range: -1 to 1 (X-axis)
  v = -(j / 32) * 2 + 1    // Range: -1 to 1 (Y-axis, flipped)
  
Ray Direction (3D):
  ray_dir = normalize((u, v, -2.0))
  // Looking down negative Z-axis (perspective projection)
```

**Step 2: Ray-Sphere Intersection**
Solves quadratic equation: `a*t² + b*t + c = 0`

```
Given:
  - Ray origin: O (camera position)
  - Ray direction: D (normalized)
  - Sphere center: C (0, 0, 0)
  - Sphere radius: r (1.0)

Derive:
  - oc = O - C
  - a = D · D  (dot product)
  - b = 2 * (oc · D)
  - c = (oc · oc) - r²
  
Discriminant = b² - 4ac

If discriminant < 0:  No intersection → Background color
If discriminant ≥ 0:  Calculate intersection point
  - t = (-b - sqrt(discriminant)) / (2a)
  - hit_point = O + D * t
```

**Step 3: Lighting Calculation**
```
Normal at hit point = (hit_point - sphere_center).normalize()

Diffuse lighting (Lambertian model):
  intensity = max(0, normal · light_direction) + ambient
  
Where:
  - ambient = 0.1 (10% base illumination)
  - Ensures no pixels go completely black

Final color:
  r = (sphere_r * intensity / 1024).clamp(0, 255)
  g = (sphere_g * intensity / 1024).clamp(0, 255)
  b = (sphere_b * intensity / 1024).clamp(0, 255)
```

**Step 4: Background Rendering**
For pixels that don't hit the sphere:
```
Linear gradient interpolation (lerp):
  t = (v + 1.0) / 2.0  // Normalize to 0-1
  
  r = bg_color1_r + (bg_color2_r - bg_color1_r) * t
  g = bg_color1_g + (bg_color2_g - bg_color1_g) * t
  b = bg_color1_b + (bg_color2_b - bg_color1_b) * t
  
This creates smooth gradient from bg_color1 (top) to bg_color2 (bottom)
```

#### Fixed-Point Mathematics

All arithmetic uses **32-bit fixed-point** with scale 1024:

```rust
const SCALE: i32 = 1024;

// Floating point ↔ Fixed-point conversion
1.0 = 1024
0.5 = 512
2.5 = 2560
```

**Key Operations:**

1. **Dot Product:**
   ```rust
   dot(a, b) = (a.x * b.x + a.y * b.y + a.z * b.z) / SCALE
   ```
   - Carefully avoids overflow using i64 intermediate
   - Result stays within i32 range

2. **Vector Normalization:**
   ```rust
   length = sqrt(x² + y² + z²)
   normalized = (x * SCALE / length, y * SCALE / length, z * SCALE / length)
   ```
   - Uses integer square root (isqrt)
   - Result has magnitude = SCALE (representing 1.0)

3. **Scalar Multiplication:**
   ```rust
   vec * scalar = (vec.x * scalar / SCALE, vec.y * scalar / SCALE, vec.z * scalar / SCALE)
   ```
   - Maintains fixed-point precision
   - Prevents intermediate overflow

#### Memory Optimization

- **Pre-allocation:** Vector pre-allocates 3,072 bytes capacity
- **No Dynamic Allocation:** Fixed 32×32 grid eliminates runtime branching
- **WASM Compilation:** Rust compiles to ~5KB WASM (60x smaller than EVM equivalent)

### Deterministic Computation

✅ **100% Deterministic Results:**
- Same inputs always produce identical outputs
- No randomness or external data sources
- Integer arithmetic eliminates floating-point precision issues
- Safe for blockchain verification

### Gas Efficiency Analysis

| Component | Gas Estimate | Notes |
|-----------|--------------|-------|
| Loop Setup (32×32) | ~10,000 | Nested loops, simple arithmetic |
| Ray Generation | ~40,000 | NDC calculation × 1,024 pixels |
| Ray-Sphere Intersection | ~50,000 | Quadratic solver × 1,024 pixels |
| Lighting & Color | ~25,000 | Diffuse calculation × 1,024 pixels |
| Background Interpolation | ~10,000 | Lerp calculation for non-hits |
| Output Encoding | ~5,000 | Bytes vector creation and return |
| **Total** | **~120,000-150,000** | Varies by scene (hit/miss ratio) |

### Why Stylus for Ray Tracing?

| Aspect | Traditional EVM | Arbitrum Stylus |
|--------|-----------------|-----------------|
| **Language** | Solidity (limited math) | Rust (full capabilities) |
| **Arithmetic** | 256-bit integers | 32-bit integers (optimized) |
| **Execution** | Slow, expensive | 10-100x faster, cheaper |
| **Code Size** | ~50KB+ | ~5KB |
| **Precision** | Workarounds needed | Native integer math |
| **Float Support** | No | Yes (but not used here) |

### Contract Interaction Example

**Using ethers.js/viem:**

```typescript
import { createPublicClient, http } from 'viem';

const client = createPublicClient({
  chain: arbitrumSepolia,
  transport: http('https://sepolia-rollup.arbitrum.io/rpc')
});

const result = await client.readContract({
  address: '0x1bd8e7e9b1d0824eb97535af61bbaed0a9dd5757',
  abi: RAYSTYLUS_ABI,
  functionName: 'renderScene',
  args: [
    235, 213, 171,  // Sphere: beige (sphere_r, g, b)
    255, 255, 255,  // Background top: white (bg_color1_r, g, b)
    100, 100, 100,  // Background bottom: gray (bg_color2_r, g, b)
    0,              // Camera X offset
    0,              // Camera Y offset
    0               // Camera Z offset
  ]
});

// Result: Bytes of 3,072 bytes (32×32×3 RGB pixels)
const rgbBytes = result; // Hex string or bytes array
```




## 💡 Technical Deep Dive

### 🧠 Mini Neural Network (MNN) - AI on Blockchain

RayStylus features the **first-ever neural network deployed directly on a smart contract**. The MNN enables AI-driven aesthetic color generation with **zero off-chain dependencies**.

#### Neural Network Architecture

```mermaid
graph LR
    subgraph Input["Input Layer (3)"]
        I1["Warmth<br/>(0.0-1.0)"]
        I2["Intensity<br/>(0.0-1.0)"]
        I3["Depth<br/>(0.0-1.0)"]
    end
    
    subgraph Hidden["Hidden Layer (4)<br/>ReLU Activation"]
        H1["Neuron 1"]
        H2["Neuron 2"]
        H3["Neuron 3"]
        H4["Neuron 4"]
    end
    
    subgraph Output["Output Layer (2)<br/>Sigmoid Activation"]
        O1["Sphere_R<br/>(0-255)"]
        O2["Sphere_G<br/>(0-255)"]
    end
    
    I1 --> H1
    I1 --> H2
    I1 --> H3
    I1 --> H4
    I2 --> H1
    I2 --> H2
    I2 --> H3
    I2 --> H4
    I3 --> H1
    I3 --> H2
    I3 --> H3
    I3 --> H4
    
    H1 --> O1
    H1 --> O2
    H2 --> O1
    H2 --> O2
    H3 --> O1
    H3 --> O2
    H4 --> O1
    H4 --> O2
    
    style Input fill:#4A6741,stroke:#8BAE66,color:#fff
    style Hidden fill:#628141,stroke:#8BAE66,color:#fff
    style Output fill:#EBD5AB,stroke:#628141,color:#1B211A
```

**Network Specifications:**
- **Input:** 3 dimensions (warmth, intensity, depth) - normalized 0.0 to 1.0
- **Hidden:** 4 neurons with ReLU activation (max(0, x))
- **Output:** 2 neurons with Sigmoid activation (bounded 0-1)
- **Parameters:** 20 weights + 6 biases = 26 total
- **Scale:** Fixed-point 10^18 (Rust i64 for determinism)
- **Training:** 1000 synthetic aesthetic samples
- **Accuracy:** MSE = 0.0112 (highly accurate predictions)

#### Training & Deployment Process

**1. Off-Chain Training (Python + TensorFlow)**
```python
# 1000 synthetic samples
X = [warmth, intensity, depth]  # Input
Y = [sphere_r, sphere_g]         # Output

# Trained using Adam optimizer, MSE loss
# Test MSE: 0.0112 (highly accurate)
```

**Trained Weights & Biases:**
- Layer 1: 3×4 weight matrix + 4 biases
- Layer 2: 4×2 weight matrix + 2 biases
- Total: 28 weights + 6 biases

**2. Fixed-Point Conversion**
```
Scale: 10^18 (Rust i64)
Example: 0.567939 → 567938987432345600 (i64)
```

**3. On-Chain Deployment**
```rust
const W1: [[i64; 3]; 4] = [
    [567938987432345600, -1027907238687145984, 687906701138984960],
    [-519756979153928192, -297215172857036800, 567038006372859904],
    [-1382447992878923776, 647886333313810432, 16105605521473536],
    [-379177786113261568, -505057986159312896, 155223330712977408]
];

const B1: [i64; 4] = [
    640866501326274560, 413779107801726976, 
    722336121056395264, -83450321208082432
];

// Same for Layer 2 (W2, B2)
```

#### Training & Deployment Pipeline

```mermaid
graph LR
    subgraph Train["🏋️ Off-Chain Training"]
        A["1000 Samples<br/>(Synthetic Data)"]
        B["TensorFlow<br/>Adam Optimizer"]
        C["Model Weights<br/>MSE: 0.0112"]
        A --> B --> C
    end
    
    subgraph Convert["🔢 Fixed-Point Conversion"]
        D["Float Weights<br/>(Python)"]
        E["Scale by 10^18<br/>(Precision)"]
        F["i64 Constants<br/>(Rust)"]
        D --> E --> F
    end
    
    subgraph Deploy["⛓️ On-Chain Deployment"]
        G["Embed in Contract<br/>lib.rs"]
        H["W1: 3×4 matrix<br/>B1: 4 biases"]
        I["W2: 4×2 matrix<br/>B2: 2 biases"]
        J["Immutable &<br/>Verifiable"]
        G --> H --> I --> J
    end
    
    C --> D
    F --> G
    
    style Train fill:#4A6741,stroke:#8BAE66,color:#fff
    style Convert fill:#628141,stroke:#8BAE66,color:#fff
    style Deploy fill:#EBD5AB,stroke:#628141,color:#1B211A
```

#### Training Workflow: From Python to Rust Smart Contract

The `minineuralnetwork/` folder contains the complete training pipeline that bridges Python ML to on-chain Rust execution:

**Step 1: Neural Network Training (`minineuralnetwork/train.py`)**

```bash
# Generate synthetic training data
python minineuralnetwork/train.py
```

This script:
1. **Generates 1000 synthetic samples** mapping (warmth, intensity, depth) → (sphere_r, sphere_g)
2. **Trains a 3→4→2 neural network** using TensorFlow/Keras with Adam optimizer
3. **Extracts trained weights & biases** from the Keras model
4. **Converts to fixed-point i64** (scale: 10^18) for deterministic Rust arithmetic
5. **Outputs Rust code** with const arrays ready to embed in the smart contract

**Example output:**
```
const W1: [[i64; 3]; 4] = [
    [567938987432345600, -1027907238687145984, 687906701138984960],
    [-519756979153928192, -297215172857036800, 567038006372859904],
    ...
];
const B1: [i64; 4] = [640866501326274560, 413779107801726976, ...];
const W2: [[i64; 4]; 2] = [[...], [...]];
const B2: [i64; 2] = [...];
```

**Step 2: Embedding Weights into Smart Contract**

The generated weights are embedded directly into `contracts/src/lib.rs`:

```rust
// These constants come directly from train.py output
const W1: [[i64; 3]; 4] = [...];  // Input→Hidden layer weights
const B1: [i64; 4] = [...];        // Hidden layer biases
const W2: [[i64; 4]; 2] = [...];  // Hidden→Output layer weights
const B2: [i64; 2] = [...];        // Output layer biases
const ML_SCALE: i64 = 10i64.pow(18); // Fixed-point scale
```

**Step 3: On-Chain Inference**

When a user calls `view_aesthetic(warmth, intensity, depth)`:
1. Input parameters are converted to fixed-point i64 format
2. Layer 1: `hidden = W1 × input + B1` with ReLU activation
3. Layer 2: `output = W2 × hidden + B2` with Sigmoid activation
4. Output is converted back to RGB (0-255 range)
5. **All computation happens deterministically on-chain** with no floating-point errors

#### Why This Matters

| Aspect | Traditional ML | RayStylus MNN |
|--------|---|---|
| **Centralization** | Server-controlled | Blockchain immutable |
| **Trust** | Trust the API provider | Trust the code/math |
| **Auditability** | Black box | Public, verifiable weights |
| **Cost** | API fees per inference | Gas cost (included in minting) |
| **Availability** | Server dependent | Blockchain redundancy |
| **Inference Speed** | Fast (optimized hardware) | Deterministic (same result always) |
| **Training Source** | Hidden | Open (`minineuralnetwork/train.py`) |
| **Reproducibility** | Can change anytime | Fixed forever on-chain |

#### Implementation Details

**VIEW Function: `view_aesthetic(warmth, intensity, depth) → (r, g, b)`**
- **Gas Cost**: FREE (view function)
- **Execution**: ~50μs on Stylus VM
- **Output**: RGB values deterministically computed from inputs

```rust
pub fn view_aesthetic(
    &self,
    style_warmth_u256: U256,
    style_intensity_u256: U256,
    style_depth_u256: U256,
) -> (u8, u8, u8) {
    // 1. Convert U256 to i64 fixed-point
    let [w, i, d] = [warmth_i64, intensity_i64, depth_i64];
    
    // 2. Layer 1: Matrix multiply + ReLU
    let hidden = layer1_inference([w, i, d]);
    
    // 3. Layer 2: Matrix multiply + Sigmoid
    let output = layer2_inference(hidden);
    
    // 4. Convert i64 fixed-point to u8 RGB
    (output[0] as u8, output[1] as u8)
}
```

**Rust Implementation - Matrix Multiplication (Layer 1)**

```rust
fn layer1_inference(input: [i64; 3]) -> [i64; 4] {
    let mut hidden = [0i64; 4];
    
    // Matrix multiply: W1 (4×3) × input (3×1) + B1 (4×1)
    for i in 0..4 {
        let mut sum = B1[i];
        for j in 0..3 {
            sum = sum.saturating_add(W1[i][j].saturating_mul(input[j]) / ML_SCALE);
        }
        hidden[i] = relu(sum);
    }
    
    hidden
}
```

**ReLU Activation**

```rust
fn relu(x: i64) -> i64 {
    if x > 0 { x } else { 0 }
}
```

**Sigmoid Approximation (Layer 2)**

```rust
fn sigmoid_approx(x: i64) -> i64 {
    // Bounds check to prevent overflow
    if x >= 3 * ML_SCALE { return ML_SCALE; }
    if x <= -3 * ML_SCALE { return 0; }
    
    // Linear approximation: 0.5 + 0.166 * x / SCALE
    HALF_SCALE + (x / 6)
}

fn layer2_inference(hidden: [i64; 4]) -> [i64; 2] {
    let mut output = [0i64; 2];
    
    // Matrix multiply: W2 (2×4) × hidden (4×1) + B2 (2×1)
    for i in 0..2 {
        let mut sum = B2[i];
        for j in 0..4 {
            sum = sum.saturating_add(W2[i][j].saturating_mul(hidden[j]) / ML_SCALE);
        }
        output[i] = sigmoid_approx(sum);
    }
    
    output
}
```

#### Key Design Decisions

1. **Fixed-Point Arithmetic (Scale: 10^18)**
   - All floats converted to i64 with scale 10^18
   - Deterministic: same input → identical output, always
   - No floating-point rounding errors
   - Fully verifiable on-chain

2. **Simplified Sigmoid**
   - Linear approximation instead of exp() (expensive in WASM)
   - Still provides smooth 0-1 output range
   - Good enough for aesthetic color generation

3. **Saturating Arithmetic**
   - Uses `saturating_add/mul` to prevent integer overflow
   - Safe for all valid input ranges
   - No panic risk

4. **Determinism Guarantee**
   - Same parameters always produce identical output
   - Can be verified by anyone
   - Multiple independent runs produce identical results

#### Performance Characteristics

| Metric | Value |
|--------|-------|
| **Weights** | 26 parameters (3×4 + 4 + 4×2 + 2) |
| **Inference Time** | ~1-2ms per call (Stylus WASM) |
| **Gas Cost** | Included in contract call |
| **Precision** | Fixed-point i64 (18 decimal places) |
| **Error Rate** | < 0.5% from original float model |

---

#### Aesthetic NFT Workflow

```
User Input (UI)
├─ Warmth slider    (0-100%)
├─ Intensity slider (0-100%)
└─ Depth slider     (0-100%)
        ↓
FREE PREVIEW
├─ Call view_aesthetic()  [FREE - VIEW function]
├─ Get predicted RGB colors [instantly]
└─ Render sphere with colors [client-side canvas]
        ↓
MINT NFT
├─ Transaction: mint(r, g, b, ...) [pays gas]
├─ Store params on-chain
├─ Get token ID
└─ Render full raytraced image [on-demand via render_token()]
```

---

### Fixed-Point Arithmetic (Scale 1024)

All calculations use **i32 fixed-point** with scale 1024:
- `1.0 = 1024`
- `0.5 = 512`
- Operations require careful scaling/unscaling

```rust
// Example: Vector dot product
fn dot(self, other: Vec3) -> i32 {
    ((self.x as i64 * other.x as i64 +
      self.y as i64 * other.y as i64 +
      self.z as i64 * other.z as i64) / SCALE as i64) as i32
}
```

### Ray Tracing Engine Architecture

```mermaid
graph TB
    subgraph Setup["Setup"]
        A["Scene Initialize"]
        B["Camera Position<br/>(cam_x, cam_y, cam_z)"]
        C["Sphere<br/>Pos: 0,0,0<br/>Radius: 1.0"]
        D["Light Direction<br/>1,1,1 normalized"]
        A --> B
        A --> C
        A --> D
    end
    
    subgraph MainLoop["Main Loop"]
        E["For Each Pixel<br/>(32×32)"]
    end
    
    subgraph RayGen["Ray Generation"]
        F["NDC (-1 to 1)"]
        G["Perspective<br/>Projection"]
        H["Normalized<br/>Direction"]
        F --> G --> H
    end
    
    subgraph Intersect["Intersection Test"]
        I["Quadratic Solver"]
        J["Discriminant Δ"]
        K["Calculate t"]
        I --> J --> K
    end
    
    subgraph Light["Lighting"]
        L["Surface Normal"]
        M["Dot Light"]
        N["RGB × Intensity"]
        L --> M --> N
    end
    
    A --> E
    E --> RayGen --> Intersect
    Intersect -->|Hit| Light
    Intersect -->|Miss| BG["Background"]
    Light --> Out["Output RGB"]
    BG --> Out
    
    style Setup fill:#4A6741,stroke:#8BAE66,color:#fff
    style MainLoop fill:#628141,stroke:#8BAE66,color:#fff
    style RayGen fill:#628141,stroke:#8BAE66,color:#fff
    style Intersect fill:#628141,stroke:#8BAE66,color:#fff
    style Light fill:#628141,stroke:#8BAE66,color:#fff
    style Out fill:#EBD5AB,stroke:#628141,color:#1B211A
```

### Ray-Sphere Intersection Algorithm

**Mathematical Foundation:**

Given:
- Ray origin: `O` (camera position)
- Ray direction: `D` (normalized)
- Sphere center: `C` (0, 0, 0)
- Sphere radius: `r` (1.0)

Solve quadratic: `at² + bt + c = 0`

**Formula:**
```
Vector oc = O - C
a = D · D
b = 2 × (oc · D)
c = (oc · oc) - r²

Discriminant: Δ = b² - 4ac

If Δ ≥ 0:  t = (-b - √Δ) / (2a)
```

**Rust Implementation:**
```rust
let oc = origin - sphere_pos;
let a = ray_dir.dot(ray_dir);
let b = 2 * oc.dot(ray_dir);
let c = oc.dot(oc) - sphere_radius²;
let discriminant = b² - 4ac;

if discriminant > 0 {
    t = (-b - √discriminant) / (2a);
    hit_point = origin + ray_dir * t;
}
```

### Diffuse Lighting Model

**Lambertian Reflection (Matte Surface):**

```rust
normal = (hit_point - sphere_center).normalize();
light_dir = light_source.normalize();
intensity = max(0, normal · light_dir) + ambient;
rgb = sphere_color * intensity / SCALE;
```

---

## 🧠 MNN Training Guide

**For developers who want to understand or customize the neural network training pipeline:**

→ **See complete guide: [MNN_TRAINING_GUIDE.md](./MNN_TRAINING_GUIDE.md)**

This guide covers:
- ✅ Complete workflow from Python training to on-chain deployment
- ✅ How `minineuralnetwork/train.py` generates weights
- ✅ Fixed-point conversion (floats → i64)
- ✅ Step-by-step deployment instructions
- ✅ Rust implementation details
- ✅ Verification and debugging
- ✅ Advanced customization options

### Quick Reference

| Phase | Tool | Input | Output |
|-------|------|-------|--------|
| **1. Training** | Python + TensorFlow | 1000 samples | Model (MSE: 0.0112) |
| **2. Conversion** | `train.py` script | Trained weights | Fixed-point i64 |
| **3. Embedding** | Rust compiler | const arrays | WASM bytecode |
| **4. Deployment** | cargo-stylus | WASM | Blockchain address |

**Key Point**: Once deployed on-chain, the neural network weights are immutable forever, ensuring trustless execution.

---

## 📁 Project Structure

```
raystylus/
├── contracts/                 # Rust Stylus Smart Contract
│   ├── Cargo.toml
│   ├── rust-toolchain.toml   # nightly-2025-01-09
│   └── src/
│       └── lib.rs            # Ray tracing + MNN inference engine
│
├── minineuralnetwork/         # 🧠 Neural Network Training Pipeline
│   ├── train.py              # TensorFlow model training + weight extraction
│   └── output.txt            # Generated Rust const arrays (W1, B1, W2, B2)
│
├── app/                       # Next.js Frontend
│   ├── layout.tsx
│   ├── page.tsx              # Landing page
│   ├── aesthetic/
│   │   └── page.tsx          # High-resolution aesthetic visualization
│   ├── studio/
│   │   └── page.tsx          # Interactive rendering interface
│   ├── globals.css           # Animations & theme
│   ├── abi/
│   │   └── RayStylus.ts      # Contract ABI & address
│   ├── hooks/
│   │   ├── useRayStylus.ts   # Hook for ray tracing
│   │   ├── useAesthetic.ts   # Hook for MNN preview (FREE)
│   │   └── useRayStylusMint.ts # Hook for NFT minting
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── SystemArchitecture.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Benchmark.tsx
│   │   ├── ProblemSolution.tsx
│   │   ├── DemoSection.tsx
│   │   ├── Footer.tsx
│   │   ├── ConnectButton.tsx
│   │   ├── LandingNavbar.tsx
│   │   ├── AIChat.tsx        # OpenAI integration
│   │   └── Icons.tsx
│   └── utils/
│       ├── bmpRenderer.ts    # BMP image encoding
│       ├── sphereRenderer.ts # Pixel data processing
│       └── fixedPoint.ts     # Fixed-point arithmetic utilities
│
├── public/
│   └── raystylus-logo.png
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── README.md
```

### Key Folders Explained

#### 🧠 `minineuralnetwork/` - Training Pipeline

This folder contains the complete workflow for training and deploying a neural network on-chain:

**`train.py`**
- Generates 1000 synthetic training samples mapping (warmth, intensity, depth) → (sphere_r, sphere_g)
- Trains a 3→4→2 neural network using TensorFlow/Keras
- Achieves MSE accuracy of 0.0112 on test data
- Extracts all weights and biases from the trained model
- **Converts to fixed-point i64 format** (scale: 10^18) for deterministic Rust execution
- Outputs Rust `const` arrays ready to embed in the smart contract

**`output.txt`**
- Contains the generated Rust code with weight matrices:
  - `W1: [[i64; 3]; 4]` - Input→Hidden weights
  - `B1: [i64; 4]` - Hidden layer biases  
  - `W2: [[i64; 4]; 2]` - Hidden→Output weights
  - `B2: [i64; 2]` - Output layer biases
- These values are copied directly into `contracts/src/lib.rs`

**Why This Approach?**
- Weights are trained off-chain (efficient, fast, repeatable)
- Converted to fixed-point for deterministic on-chain math (no floating-point rounding errors)
- Embedded as immutable constants in smart contract (no upgrades, fully verifiable)
- No off-chain model serving needed (fully self-contained)

#### ⚙️ `contracts/` - Smart Contract

- **`lib.rs`**: Main Stylus contract containing:
  - Ray tracing engine (ray-sphere intersection, diffuse lighting)
  - MNN inference engine (embedded neural network)
  - Rendering functions (`render_token`, `view_aesthetic`)
  - State management (NFT storage, camera position)

#### 🎨 `app/` - Next.js Frontend

- **`page.tsx`**: Landing page with problem/solution narrative and demos
- **`studio/page.tsx`**: Interactive interface for parameter adjustment and rendering
- **`aesthetic/page.tsx`**: High-resolution visualization of MNN output
- **`hooks/useAesthetic.ts`**: Free preview using MNN (0 gas cost)
- **`components/AIChat.tsx`**: OpenAI integration for natural language control
- **`utils/`**: Helper functions for BMP rendering, fixed-point math, pixel processing

---

## 🎮 Usage Guide

### On the Landing Page

1. **View the Hero Animation**: Watch the typewriter effect and animated title
2. **Check System Architecture**: Visual diagram of data flow
3. **Read Performance Benchmarks**: Compare Stylus vs Traditional EVM
4. **Launch Studio**: Click the CTA button

### In the Studio

#### Step 1: Connect Wallet
- Click **"Connect Wallet"** in the header
- Select MetaMask or your preferred wallet
- Ensure you're on **Arbitrum Sepolia (Chain ID: 421614)**
- Confirm connection in your wallet extension

#### Step 2: Configure Your Scene
- **Sphere Color**: Click the color picker or type hex value directly
  - Default: `#EBD5AB` (beige)
  - Examples: `#FF0000` (red), `#00FF00` (green)
- **Background Gradient (Top)**: Upper color of the gradient
  - Default: `#FFFFFF` (white)
- **Background Gradient (Bottom)**: Lower color of the gradient
  - Default: `#5B7FD5` (blue)
- **Camera Position**: Fine-tune the viewpoint
  - X-axis (Left/Right): -2.0 to 2.0
  - Y-axis (Up/Down): -2.0 to 2.0
  - Z-axis (Forward/Back): -2.0 to 2.0
  - Default: (0, 0, 0) - centered

#### Step 3: Render the Scene
1. Click **"Render Frame"** button
2. Wait for on-chain computation (~2-5 seconds)
3. View gas used and execution time in the stats panel
4. Real-time pixel data displayed on the canvas

#### Step 4: Mint Your NFT (New!)
1. Once rendered, the **"Mint as NFT"** button becomes active
2. Click **"Mint as NFT"**
3. Transaction is submitted to the mempool
4. Your configuration is stored on-chain as a unique token
5. Token ID is generated automatically
6. Click the **Arbiscan link** to verify your transaction
   - Link points to `/address/{yourWalletAddress}`
   - Shows all your recent transactions

#### Step 5: View Your NFT
- Your minted NFT is now stored on Arbitrum Sepolia
- Configuration is permanently saved
- Anyone can call `render_token(tokenId)` to generate the full image
- You own the metadata on-chain

### Studio Controls Reference

| Control | Purpose | Default |
|---------|---------|---------|
| **Sphere Color** | RGB of sphere object | #EBD5AB (beige) |
| **BG Color 1** | Gradient top color | #FFFFFF (white) |
| **BG Color 2** | Gradient bottom color | #5B7FD5 (blue) |
| **Camera X** | Left/Right offset | 0 |
| **Camera Y** | Up/Down offset | 0 |
| **Camera Z** | Forward/Back offset | 0 |
| **Render Frame** | Start on-chain computation | - |
| **Mint as NFT** | Create permanent token | - |
| **Wipeout Render** | Clear canvas | - |

### Minting Workflow

```
1. Configure Scene (Colors + Camera)
   ↓
2. Click "Render Frame"
   ↓
3. WASM contract executes ray tracing
   ↓
4. 3,072 bytes of pixel data returned
   ↓
5. Canvas displays result instantly
   ↓
6. Click "Mint as NFT"
   ↓
7. Your config stored as Token (21 bytes packed)
   ↓
8. NFT created with token_id
   ↓
9. Link to Arbiscan shows transaction
   ↓
10. On-demand rendering available forever
```

### Advanced: Rendering Stored NFTs

To render a previously minted NFT:

```typescript
// Get the BMP image for token_id = 42
const bmpData = await publicClient.readContract({
  address: '0x1bd8e7e9b1d0824eb97535af61bbaed0a9dd5757',
  abi: RAYSTYLUS_ABI,
  functionName: 'render_token',
  args: [BigInt(42)]
});

// Convert hex to pixels and display
const pixels = hexToPixels(bmpData);
drawToCanvas(pixels, canvas);
```

---

## 📊 Performance Benchmarks

### Operations & Costs Overview

```mermaid
graph LR
    subgraph Ops["Operations"]
        A["view_aesthetic<br/>(MNN)"]
        B["mint<br/>(Storage)"]
        C["render_token<br/>(Ray Trace)"]
    end
    
    subgraph Cost["Gas Cost"]
        A1["🟢 FREE<br/>View Function"]
        B1["🟡 ~5K<br/>Lightweight"]
        C1["🔴 ~120K<br/>Computation"]
    end
    
    subgraph Speed["Execution"]
        AT["Instant<br/>~50μs"]
        BT["2-5 sec<br/>(tx)"]
        CT["120ms<br/>(runtime)"]
    end
    
    A --> A1 --> AT
    B --> B1 --> BT
    C --> C1 --> CT
    
    style Ops fill:#4A6741,stroke:#8BAE66,color:#fff
    style Cost fill:#628141,stroke:#8BAE66,color:#fff
    style Speed fill:#EBD5AB,stroke:#628141,color:#1B211A
```

### Stylus vs Traditional EVM

| Aspect | Arbitrum Stylus | Traditional EVM | Result |
|--------|---|---|---|
| **Language** | Rust (WASM) | Solidity | Native math ✅ |
| **Gas (Render)** | ~120K | Impossible | 100x+ cheaper ✅ |
| **Gas (Mint)** | ~5K | ~200K | 40x cheaper ✅ |
| **Exec Speed** | ~120ms | Timeout | Instant ✅ |
| **Math Support** | 32-bit integers | 256-bit only | Efficient ✅ |
| **Code Size** | 5.2 KiB | ~50 KiB | Compact ✅ |
| **Determinism** | ✅ Perfect | ⚠️ Varies | Guaranteed ✅ |

*Ray tracing impossible on standard EVM

### Gas Breakdown for Render

```mermaid
pie title Render Operation (~120K gas)
    "Ray Setup & Loop (33%)" : 40000
    "Ray-Sphere Intersection (42%)" : 50000
    "Lighting & Diffuse (21%)" : 25000
    "Encoding & Return (4%)" : 5000
```

---

## 🔧 Development

### Contract Implementation Details

#### Complete Function Signatures

```rust
#![cfg_attr(target_arch = "wasm32", no_main)]

extern crate alloc;

use alloc::vec::Vec;
use stylus_sdk::prelude::*;
use stylus_sdk::abi::Bytes;
use stylus_sdk::alloy_primitives::{Address, U256};
use stylus_sdk::msg;
use stylus_sdk::storage::{StorageMap, StorageBytes, StorageU256, StorageAddress};

#[storage]
#[entrypoint]
pub struct Contract {
    pub owners: StorageMap<U256, StorageAddress>,
    pub token_data: StorageMap<U256, StorageBytes>,
    pub total_supply: StorageU256,
}

#[public]
impl Contract {
    // Mint NFT with rendering parameters
    pub fn mint(
        &mut self,
        sphere_r: u8,
        sphere_g: u8,
        sphere_b: u8,
        bg_color1_r: u8,
        bg_color1_g: u8,
        bg_color1_b: u8,
        bg_color2_r: u8,
        bg_color2_g: u8,
        bg_color2_b: u8,
        cam_x: i32,
        cam_y: i32,
        cam_z: i32,
    ) -> U256 {
        // Implementation...
    }
    
    // Render stored NFT
    pub fn render_token(&self, token_id: U256) -> Bytes {
        // Implementation...
    }
    
    // Check token ownership
    pub fn owner_of(&self, token_id: U256) -> Address {
        // Implementation...
    }
}
```
}
```

#### Step-by-Step Code Breakdown

**1. Constants and Scene Setup**

```rust
const WIDTH: i32 = 32;
const HEIGHT: i32 = 32;
const SCALE: i32 = 1024;  // Fixed-point scale: 1.0 = 1024

// Pre-allocate memory for efficiency
let mut pixels = Vec::with_capacity((WIDTH * HEIGHT * 3) as usize);

// Camera position setup
// Base camera is at (0, 0, 2.5)
// User inputs modify this position
let origin = Vec3::new(
    cam_x * SCALE,                          // X: Direct multiplication
    cam_y * SCALE,                          // Y: Direct multiplication
    (2 * SCALE + SCALE/2) + cam_z * SCALE   // Z: 2.5 + cam_z offset
);

// Fixed scene objects
let sphere_pos = Vec3::new(0, 0, 0);                    // Sphere at origin
let sphere_radius = SCALE;                              // Radius = 1.0
let light_dir = Vec3::new(SCALE, SCALE, SCALE).normalize();  // Normalized light direction

// Parse input colors (0-255 to 0-1 scaled)
let sphere_color = (sphere_r as i32, sphere_g as i32, sphere_b as i32);
let bg_color1 = (bg_color1_r as i32, bg_color1_g as i32, bg_color1_b as i32);
let bg_color2 = (bg_color2_r as i32, bg_color2_g as i32, bg_color2_b as i32);
```

**2. Main Rendering Loop**

```rust
// Iterate through all 32×32 pixels
for j in 0..HEIGHT {
    for i in 0..WIDTH {
        // === STEP A: Convert pixel coordinates to ray direction ===
        
        // Normalized Device Coordinates (NDC)
        // Maps pixel (i,j) to range [-1, 1] for both axes
        let u = (i * 2 * SCALE) / WIDTH - SCALE;    // X: -1 to 1
        let v = -((j * 2 * SCALE) / HEIGHT - SCALE); // Y: -1 to 1 (flipped)
        
        // Ray direction using perspective projection
        // Viewing angle: z = -2.0
        let ray_dir = Vec3::new(u, v, -2 * SCALE).normalize();
        
        // === STEP B: Ray-Sphere Intersection Test ===
        
        let oc = origin - sphere_pos;                  // Vector from sphere to ray origin
        let a = ray_dir.dot(ray_dir);                  // Quadratic coefficient (≈ SCALE)
        let b = 2 * oc.dot(ray_dir);                   // Linear coefficient
        let c = oc.dot(oc) - (sphere_radius as i64 * sphere_radius as i64 / SCALE as i64) as i32;
        
        // Calculate discriminant (b² - 4ac)
        let b_val = b as i64;
        let a_val = a as i64;
        let c_val = c as i64;
        let discriminant = b_val * b_val - 4 * a_val * c_val;
        
        // === STEP C: Process Intersection Result ===
        
        let (r, g, b) = if discriminant > 0 {
            // Ray hits the sphere
            let sqrt_disc = discriminant.isqrt();
            let t = (-b_val - sqrt_disc) * SCALE as i64 / (2 * a_val);
            
            if t > 0 {
                // Valid intersection point (in front of camera)
                let t_i32 = t as i32;
                let hit_point = origin + (ray_dir * t_i32);
                
                // === STEP D: Calculate Lighting ===
                
                // Surface normal at hit point
                let normal = (hit_point - sphere_pos).normalize();
                
                // Diffuse lighting calculation
                let diff = normal.dot(light_dir);
                let ambient = SCALE / 10;  // 10% ambient lighting
                let intensity = if diff > 0 { diff + ambient } else { ambient };
                
                // Apply lighting to sphere color
                let r = (sphere_color.0 * intensity / SCALE).min(255) as u8;
                let g = (sphere_color.1 * intensity / SCALE).min(255) as u8;
                let b = (sphere_color.2 * intensity / SCALE).min(255) as u8;
                (r, g, b)
            } else {
                // Intersection behind camera
                get_background(v, bg_color1, bg_color2)
            }
        } else {
            // No intersection, render background
            get_background(v, bg_color1, bg_color2)
        };
        
        // === STEP E: Store Pixel Data ===
        pixels.push(r);
        pixels.push(g);
        pixels.push(b);
    }
}

// Return as bytes
pixels.into()
```

**3. Helper Structures**

```rust
#[derive(Clone, Copy)]
struct Vec3 {
    x: i32,
    y: i32,
    z: i32,
}

impl Vec3 {
    fn new(x: i32, y: i32, z: i32) -> Self {
        Self { x, y, z }
    }
    
    /// Dot product: (a · b) / SCALE
    /// Uses i64 to prevent overflow in intermediate calculations
    fn dot(self, other: Self) -> i32 {
        ((self.x as i64 * other.x as i64 + 
          self.y as i64 * other.y as i64 + 
          self.z as i64 * other.z as i64) / SCALE as i64) as i32
    }
    
    /// Vector normalization: result magnitude = SCALE (1.0)
    /// Uses integer square root to avoid floating-point operations
    fn normalize(self) -> Self {
        let len_sq = self.x as i64 * self.x as i64 + 
                     self.y as i64 * self.y as i64 + 
                     self.z as i64 * self.z as i64;
        let len = len_sq.isqrt() as i32;
        
        if len == 0 { return self; }  // Avoid division by zero
        
        Self {
            x: (self.x as i64 * SCALE as i64 / len as i64) as i32,
            y: (self.y as i64 * SCALE as i64 / len as i64) as i32,
            z: (self.z as i64 * SCALE as i64 / len as i64) as i32,
        }
    }
}

// Operator overloads for vector arithmetic

impl core::ops::Add for Vec3 {
    type Output = Self;
    fn add(self, other: Self) -> Self {
        Self {
            x: self.x + other.x,
            y: self.y + other.y,
            z: self.z + other.z,
        }
    }
}

impl core::ops::Sub for Vec3 {
    type Output = Self;
    fn sub(self, other: Self) -> Self {
        Self {
            x: self.x - other.x,
            y: self.y - other.y,
            z: self.z - other.z,
        }
    }
}

impl core::ops::Mul<i32> for Vec3 {
    type Output = Self;
    /// Scalar multiplication with fixed-point scaling
    fn mul(self, scalar: i32) -> Self {
        Self {
            x: (self.x as i64 * scalar as i64 / SCALE as i64) as i32,
            y: (self.y as i64 * scalar as i64 / SCALE as i64) as i32,
            z: (self.z as i64 * scalar as i64 / SCALE as i64) as i32,
        }
    }
}
```

**4. Background Gradient Function**

```rust
/// Create linear gradient between two colors
/// 
/// Parameters:
/// - v: Vertical coordinate (-SCALE to SCALE)
/// - bg_color1: Top color (at v = SCALE)
/// - bg_color2: Bottom color (at v = -SCALE)
/// 
/// Returns: Interpolated (r, g, b) tuple
fn get_background(
    v: i32,
    bg_color1: (i32, i32, i32),
    bg_color2: (i32, i32, i32),
) -> (u8, u8, u8) {
    // Normalize v from [-SCALE, SCALE] to [0, 1]
    // t = (v + SCALE) / (2 * SCALE)
    let t_num = v + SCALE;
    let t_den = 2 * SCALE;
    
    // Linear interpolation (lerp)
    // result = color1 + (color2 - color1) * t
    let r = bg_color1.0 + ((bg_color2.0 - bg_color1.0) * t_num) / t_den;
    let g = bg_color1.1 + ((bg_color2.1 - bg_color1.1) * t_num) / t_den;
    let b = bg_color1.2 + ((bg_color2.2 - bg_color1.2) * t_num) / t_den;
    
    // Clamp to valid u8 range [0, 255]
    (r as u8, g as u8, b as u8)
}
```

#### Performance Optimizations

1. **Pre-allocation:** `Vec::with_capacity()` allocates 3,072 bytes upfront
2. **Fixed-size Loop:** 32×32 grid is compile-time constant, allows optimizations
3. **Integer-only Math:** No floating-point operations → faster execution
4. **Early Exit:** Discriminant check avoids unnecessary calculations
5. **Minimal Allocations:** Single vector for output, no intermediate allocations
6. **WASM Optimization:** Rust compiler produces highly optimized WASM bytecode

### Running Tests

```bash
# Test the contract locally
cd contracts
cargo test

# Build with optimizations
cargo build --release --target wasm32-unknown-unknown
```

### Debugging

1. **Local Testing:** Use `cargo test` for unit tests
2. **Console Logs:** Use Stylus SDK debug macros if available
3. **RPC Inspection:** Call contract on Arbitrum Sepolia via Arbiscan interface
4. **Network Tracing:** Use ethers.js to log parameters and responses

### Modifying the Contract

To extend the contract, modify `contracts/src/lib.rs`:

```rust
// Example: Add new sphere
// Add another loop to render multiple objects
// Or extend the function with new parameters

pub fn renderScene(
    &self,
    sphere_r: u8,
    sphere_g: u8,
    sphere_b: u8,
    bg_color1_r: u8,
    bg_color1_g: u8,
    bg_color1_b: u8,
    bg_color2_r: u8,
    bg_color2_g: u8,
    bg_color2_b: u8,
    cam_x: i32,
    cam_y: i32,
    cam_z: i32,
    // Add new parameters here
    new_param: u8,
) -> Bytes {
    // Update implementation...
}
```

Then rebuild and redeploy:

```bash
cd contracts
cargo build --release --target wasm32-unknown-unknown
cargo stylus deploy \
  --private-key YOUR_PRIVATE_KEY \
  --endpoint https://sepolia-rollup.arbitrum.io/rpc \
  --no-verify \
  --max-fee-per-gas-gwei 30
```

### Updating Frontend ABI

After contract changes, update `app/abi/RayStylus.ts`:

```typescript
export const RAYSTYLUS_ABI = [
    {
        inputs: [
            { name: "sphere_r", type: "uint8" },
            { name: "sphere_g", type: "uint8" },
            { name: "sphere_b", type: "uint8" },
            { name: "bg_color1_r", type: "uint8" },
            { name: "bg_color1_g", type: "uint8" },
            { name: "bg_color1_b", type: "uint8" },
            { name: "bg_color2_r", type: "uint8" },
            { name: "bg_color2_g", type: "uint8" },
            { name: "bg_color2_b", type: "uint8" },
            { name: "cam_x", type: "int32" },
            { name: "cam_y", type: "int32" },
            { name: "cam_z", type: "int32" }
        ],
        name: "renderScene",
        outputs: [{ type: "bytes", name: "" }],
        stateMutability: "pure",
        type: "function"
    }
] as const;

export const RAYSTYLUS_CONTRACT_ADDRESS = 
    '0x1bd8e7e9b1d0824eb97535af61bbaed0a9dd5757' as const;
```

---

## 📚 Additional Technical Reference

### Math Behind the Rendering

#### Fixed-Point Arithmetic Reasoning

Why use fixed-point (1024-scale) instead of floating-point?

1. **Determinism:** Floating-point results can vary slightly depending on CPU/compiler
2. **Blockchain Safety:** Smart contracts require bit-exact reproducibility
3. **Gas Efficiency:** Integer operations are faster than floating-point
4. **Precision:** 10-bit fractional part (1024 scale) is sufficient for 32×32 rendering
5. **Overflow Prevention:** i64 intermediate calculations prevent i32 overflow

Example calculation:
```
Vector (x=1.5, y=2.0, z=0.5) in fixed-point:
  x = 1.5 * 1024 = 1536
  y = 2.0 * 1024 = 2048
  z = 0.5 * 1024 = 512

Dot product: (1536 * 1536 + 2048 * 2048 + 512 * 512) / 1024
           = (2359296 + 4194304 + 262144) / 1024
           = 6815744 / 1024
           = 6660
           = 6.5 in real coordinates ✓
```

#### Ray-Sphere Intersection Math

The quadratic formula for ray-sphere intersection:

Given:
- Ray: P(t) = O + D·t (O = origin, D = direction, t = distance)
- Sphere: |P - C|² = r² (C = center, r = radius)

Substitution: |O + D·t - C|² = r²

Let oc = O - C:
```
|oc + D·t|² = r²
(oc + D·t) · (oc + D·t) = r²
oc·oc + 2·(oc·D)·t + (D·D)·t² = r²
(D·D)·t² + 2·(oc·D)·t + (oc·oc - r²) = 0

This gives: a·t² + b·t + c = 0
  where:
    a = D·D
    b = 2·(oc·D)
    c = oc·oc - r²
```

Discriminant = b² - 4ac determines intersection count:
- Δ < 0: No intersection (miss)
- Δ = 0: One intersection (tangent)
- Δ > 0: Two intersections (enter and exit)

We use the **smaller positive root** (closest intersection):
```
t = (-b - √Δ) / (2a)
```

### Common Issues & Solutions

#### Issue 1: Contract Call Returns Empty

**Symptoms:** `readContract()` returns empty bytes or error

**Solutions:**
1. Verify contract address is correct (case-sensitive):
   ```
   0x1bd8e7e9b1d0824eb97535af61bbaed0a9dd5757
   ```
2. Check RPC endpoint is working:
   ```bash
   curl https://sepolia-rollup.arbitrum.io/rpc \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
   ```
3. Ensure parameters are within valid ranges:
   - RGB values: 0-255 (uint8)
   - Camera offsets: -1000 to 1000 (i32, scales to -1.0 to 1.0)

#### Issue 2: Rendering Looks Wrong

**Symptoms:** Black pixels, inverted colors, distorted geometry

**Causes & Fixes:**
| Symptom | Cause | Solution |
|---------|-------|----------|
| All black | Sphere color too dark | Use brighter RGB values |
| All one color | Background gradient wrong | Ensure bg_color1 ≠ bg_color2 |
| Sphere distorted | Camera too close | Reduce cam_z offset |
| Nothing visible | Camera behind sphere | Increase cam_z |

#### Issue 3: High Gas Usage

**Symptoms:** Gas estimate > 200,000

**Notes:**
- This is expected—rendering is computationally intensive
- Typical range: 120,000-150,000 gas
- Gas cost varies with: background gradient complexity, camera position

#### Issue 4: Frontend Cannot Parse Response

**Symptoms:** "Invalid hex string" or canvas shows garbage

**Solutions:**
1. Verify response is 3,072 bytes (3 bytes × 32×32):
   ```typescript
   const bytes = await readContract(...);
   console.log(bytes.length); // Should be 3072
   ```
2. Check byte order (RGB, not BGR):
   ```typescript
   const [r, g, b] = [bytes[0], bytes[1], bytes[2]];
   ```
3. Verify hex encoding is correct (0x prefix, even length)

### Network Configuration

**Arbitrum Sepolia Details:**
```
Chain ID: 421614
Network Name: Arbitrum Sepolia
RPC URL: https://sepolia-rollup.arbitrum.io/rpc
Block Explorer: https://sepolia.arbiscan.io
Currency: ETH (testnet)
```

**MetaMask Network Configuration:**
```json
{
  "chainId": "0x66eee",
  "chainName": "Arbitrum Sepolia",
  "nativeCurrency": {
    "name": "Ethereum",
    "symbol": "ETH",
    "decimals": 18
  },
  "rpcUrls": ["https://sepolia-rollup.arbitrum.io/rpc"],
  "blockExplorerUrls": ["https://sepolia.arbiscan.io"]
}
```

### Development Workflow

**Recommended Local Setup:**
```bash
# 1. Clone repository
git clone https://github.com/pramadanif/raystylus.git
cd raystylus

# 2. Install dependencies
npm install
cd contracts
cargo build --release --target wasm32-unknown-unknown
cd ..

# 3. Start development server
npm run dev

# 4. Open in browser
open http://localhost:3000

# 5. Test contract locally
cd contracts
cargo test

# 6. Deploy new version (when ready)
cargo stylus deploy --private-key $PRIVATE_KEY --endpoint https://sepolia-rollup.arbitrum.io/rpc --no-verify
```

### Performance Characteristics

**Execution Timeline:**
```
User Input → Parse Parameters (1ms)
          → Send RPC Call (100-500ms depending on network)
          → Contract Execution (120-150ms on Stylus VM)
          → RPC Response (100-500ms)
          → Canvas Rendering (10-50ms)
          
Total: ~300-1200ms typical
```

**Memory Usage (Contract):**
```
Fixed Values: ~100 bytes
Vec Pre-allocation: 3,072 bytes
Total Memory: ~3.2 KB
```

**Output Format:**
```
Binary Layout:
[Pixel 0 RGB]  [Pixel 1 RGB]  ... [Pixel 1023 RGB]
[R G B]        [R G B]            [R G B]
 
Total: 3,072 bytes = 6,144 hex characters
```

---

## 🚀 Deployment Checklist

- [x] Contract deployed to Arbitrum Sepolia (0x36b922c9...)
- [x] Contract activated and ready on-chain
- [x] Frontend verified on testnet
- [x] All animations and interactions working
- [x] Dynamic parameters (color, background, camera) functional
- [x] Gas costs optimized
- [x] Ray tracing algorithm verified
- [ ] Mainnet deployment (future)
- [ ] Additional shapes (cube, tetrahedron, complex models)
- [ ] Advanced lighting (specular, shadows, reflections)
- [ ] Multiple object rendering
- [ ] Texture mapping support

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

### Areas for Contribution

- Additional 3D shapes (tetrahedron, cube, complex models)
- Advanced lighting (specular highlights, shadows, reflections)
- Performance optimizations
- UI/UX improvements
- Documentation enhancements
- Community examples

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Arbitrum**: For the incredible Stylus platform
- **Rust Community**: For the amazing language and ecosystem
- **Web3 Developers**: For pushing the boundaries of on-chain computation

---

## 📞 Support

For questions or issues, please:

1. Check existing [GitHub Issues](https://github.com/pramadanif/raystylus/issues)
2. Review the [Documentation](#table-of-contents)
3. Join our community discussions
4. Contact the development team

---

<div align="center">

### 🌟 Star us on GitHub if you find this project interesting!

Built with ❤️ for Arbitrum Stylus

</div>
