#![cfg_attr(target_arch = "wasm32", no_main)]
#![allow(non_snake_case)]

extern crate alloc;

use alloc::vec::Vec;
use stylus_sdk::prelude::*;
use stylus_sdk::abi::Bytes;
use stylus_sdk::alloy_primitives::{Address, U256};
use stylus_sdk::msg;
use stylus_sdk::storage::{StorageMap, StorageBytes, StorageU256, StorageAddress};
use core::convert::TryInto;

// ==========================================================
// ========== 1. ML INFERENCE MODULE (Mini NN - Fixed-Point) ==========
// ==========================================================

// Fixed-Point Scale (10^18)
const ML_SCALE: i64 = 1_000_000_000_000_000_000;
const HALF_SCALE: i64 = 500_000_000_000_000_000;

// --- MNN WEIGHTS AND BIASES (Trained with 1000 Samples) ---

// --- LAYER 1: INPUT (3) -> HIDDEN (4) ---

// W_1 Matrix (INPUT -> HIDDEN): Shape (4, 3)
const W1: [[i64; 3]; 4] = [
    [567938987432345600, -1027907238687145984, 687906701138984960], 
    [-519756979153928192, -297215172857036800, 567038006372859904], 
    [-1382447992878923776, 647886333313810432, 16105605521473536], 
    [-379177786113261568, -505057986159312896, 155223330712977408]
];

// B_1 Vector (HIDDEN LAYER BIASES): Shape (4)
const B1: [i64; 4] = [
    640866501326274560, 
    413779107801726976, 
    722336121056395264, 
    -83450321208082432
];

// --- LAYER 2: HIDDEN (4) -> OUTPUT (2) ---

// W_2 Matrix (HIDDEN -> OUTPUT): Shape (2, 4)
const W2: [[i64; 4]; 2] = [
    [262302328600657920, -581599938371125248, -1118118525613899776, 604784103115456512], 
    [-1509882490049789952, -735249060490903552, 982777096730312704, -349181700158259200]
];

// B_2 Vector (OUTPUT LAYER BIASES): Shape (2)
const B2: [i64; 2] = [
    -178075408585981952, 
    -350273790082547712
];


// --- FIXED-POINT ACTIVATION FUNCTIONS ---

/// Implements Rectified Linear Unit (ReLU): max(0, x).
fn relu(x: i64) -> i64 {
    if x > 0 { x } else { 0 }
}

/// Implements Sigmoid (Approximation): 1 / (1 + e^(-x)).
/// Uses a crude piecewise linear approximation for gas efficiency on Stylus.
/// (Result approximates the fixed-point value in range [0, ML_SCALE])
fn sigmoid_approx(x: i64) -> i64 {
    // If x is large positive, result approaches 1.0 (ML_SCALE)
    if x >= 3 * ML_SCALE {
        ML_SCALE
    } 
    // If x is large negative, result approaches 0.0
    else if x <= -3 * ML_SCALE {
        0
    } 
    // Linear slope around x=0 (0.5 + 0.1667 * x approximation)
    else {
        // 0.1667 fixed-point (approx 1/6)
        const ONE_SIXTH_FP: i64 = 166_666_666_666_666_667; 
        
        // Linear part: 0.1667 * x
        let linear_term = (x as i128 * ONE_SIXTH_FP as i128 / ML_SCALE as i128) as i64;

        // Final approximation: 0.5 + linear_term
        HALF_SCALE + linear_term
    }
}


/// Performs Mini Neural Network Inference (3 -> 4 -> 2).
/// Input: Style Vector [Warmth, Intensity, Depth] in 10^18 scale.
/// Output: 2D Vector [Sphere R, Sphere G] in 10^18 scale (Normalized 0.0 - 1.0).
pub fn infer_aesthetic(style_vector: [i64; 3]) -> [i64; 2] {
    let mut hidden_output = [0i64; 4];
    let mut final_output = [0i64; 2];

    // --- STEP 1: INPUT -> HIDDEN LAYER (Linear + ReLU) ---
    // Y_H = ReLU(W1 * X + B1)
    for i in 0..4 { // Iterate through 4 hidden neurons
        let mut sum: i64 = 0;
        
        // Matrix Multiplication: W1 * X
        for j in 0..3 { // Iterate through 3 inputs
            // Fixed-point multiplication (W * X) / SCALE
            // Using i128 to prevent overflow in the multiplication step
            sum += (W1[i][j] as i128 * style_vector[j] as i128 / ML_SCALE as i128) as i64;
        }

        let z1 = sum + B1[i]; // Add Bias (Z1)
        
        // Apply Activation: ReLU(z1)
        hidden_output[i] = relu(z1); 
    }

    // --- STEP 2: HIDDEN -> OUTPUT LAYER (Linear + Sigmoid Approximation) ---
    // Y_O = Sigmoid(W2 * Y_H + B2)
    for i in 0..2 { // Iterate through 2 output neurons (R and G)
        let mut sum: i64 = 0;
        
        // Matrix Multiplication: W2 * Y_H
        for j in 0..4 { // Iterate through 4 hidden outputs
            // Fixed-point multiplication (W * Y_H) / SCALE
            sum += (W2[i][j] as i128 * hidden_output[j] as i128 / ML_SCALE as i128) as i64;
        }

        let z2 = sum + B2[i]; // Add Bias (Z2)
        
        // Apply Output Activation: Sigmoid Approximation(z2)
        final_output[i] = sigmoid_approx(z2); 
    }

    final_output
}


#[storage]
#[entrypoint]
pub struct Contract {
// ... (STRUCT INI TETAP SAMA)
    pub owners: StorageMap<U256, StorageAddress>,
    pub token_data: StorageMap<U256, StorageBytes>,
    pub total_supply: StorageU256,
}

#[public]
impl Contract {
    // ===============================================================
    // ========== NEW ENTRYPOINT: MINT BY AESTHETIC (DUAL-COMPUTE) ====
    // ===============================================================

    /// MINT_BY_AESTHETIC: Uses On-Chain ML Inference to determine parameters.
    /// The style_vector input must be pre-scaled (e.g., 0.0-1.0 multiplied by 10^18).
    pub fn mint_by_aesthetic(
        &mut self,
        // HAPUS INI: style_vector: [i64; 3], 
        // GANTI DENGAN 3 VARIABLE INI:
        style_warmth_u256: U256,
        style_intensity_u256: U256,
        style_depth_u256: U256,// Input 3
        
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
        // Gabungkan kembali menjadi array di dalam contract untuk diproses ML
        let w = style_warmth_u256.try_into().unwrap_or(0u64) as i64;
        let i = style_intensity_u256.try_into().unwrap_or(0u64) as i64;
        let d = style_depth_u256.try_into().unwrap_or(0u64) as i64;

        let style_vector = [w, i, d];
        let inferred_output = infer_aesthetic(style_vector);
        // ... (SISA KODE SAMA PERSIS KE BAWAH) ...
        let sphere_r_i64 = inferred_output[0];
        let sphere_g_i64 = inferred_output[1];
        
        let sphere_r: u8 = ((sphere_r_i64 as i128 * 255i128 / ML_SCALE as i128).min(255).max(0)) as u8;
        let sphere_g: u8 = ((sphere_g_i64 as i128 * 255i128 / ML_SCALE as i128).min(255).max(0)) as u8;
        let sphere_b: u8 = sphere_g; 

        self.mint(
            sphere_r, sphere_g, sphere_b,
            bg_color1_r, bg_color1_g, bg_color1_b,
            bg_color2_r, bg_color2_g, bg_color2_b,
            cam_x, cam_y, cam_z,
        )
    }


    /// MINT: Save token data with safe arithmetic
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
        let token_id = self.total_supply.get();
        let new_supply = token_id + U256::from(1);
        self.total_supply.set(new_supply);
        self.owners.setter(token_id).set(msg::sender());

        let mut data: Vec<u8> = Vec::new();
        data.push(sphere_r);
        data.push(sphere_g);
        data.push(sphere_b);
        data.push(bg_color1_r);
        data.push(bg_color1_g);
        data.push(bg_color1_b);
        data.push(bg_color2_r);
        data.push(bg_color2_g);
        data.push(bg_color2_b);
        
        for byte in cam_x.to_le_bytes().iter() {
            data.push(*byte);
        }
        for byte in cam_y.to_le_bytes().iter() {
            data.push(*byte);
        }
        for byte in cam_z.to_le_bytes().iter() {
            data.push(*byte);
        }

        self.token_data.setter(token_id).set_bytes(data);
        token_id
    }

    /// GET OWNER: Check who owns the token
    pub fn owner_of(&self, token_id: U256) -> Address {
        self.owners.get(token_id)
    }

    /// RENDER TOKEN: Retrieve data & render scene + BMP header 
    pub fn render_token(&self, token_id: U256) -> Bytes {
        let data = self.token_data.get(token_id).get_bytes();

        if data.len() < 21 {
            return Vec::new().into();
        }

        // Unpack data (21 bytes)
        let sphere_r = data[0];
        let sphere_g = data[1];
        let sphere_b = data[2];
        let bg1_r = data[3];
        let bg1_g = data[4];
        let bg1_b = data[5];
        let bg2_r = data[6];
        let bg2_g = data[7];
        let bg2_b = data[8];
        let cx = i32::from_le_bytes([data[9], data[10], data[11], data[12]]);
        let cy = i32::from_le_bytes([data[13], data[14], data[15], data[16]]);
        let cz = i32::from_le_bytes([data[17], data[18], data[19], data[20]]);

        // Render scene
        let raw_pixels = self.renderScene(
            sphere_r, sphere_g, sphere_b,
            bg1_r, bg1_g, bg1_b,
            bg2_r, bg2_g, bg2_b,
            cx, cy, cz,
        );

        // Add BMP header
        self.add_bmp_header(raw_pixels)
    }

    /// RENDER SCENE: Core rendering logic with safe arithmetic
    #[allow(unused_variables)]
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
    ) -> Bytes {
        // ... (KODE RENDERSCENE LAMA TETAP SAMA) ...
        const WIDTH: i32 = 32;
        const HEIGHT: i32 = 32;
        const SCALE: i32 = 1024;

        let mut pixels = Vec::with_capacity((WIDTH * HEIGHT * 3) as usize);

        let origin = Vec3::new(
            cam_x.saturating_mul(SCALE),
            cam_y.saturating_mul(SCALE),
            (2_i64 * SCALE as i64 + SCALE as i64 / 2) as i32,
        );

        let sphere_pos = Vec3::new(0, 0, 0);
        let sphere_radius = SCALE;
        let light_dir = Vec3::new(SCALE, SCALE, SCALE).normalize();

        let sphere_color = (sphere_r as i32, sphere_g as i32, sphere_b as i32);
        let bg_color1 = (bg_color1_r as i32, bg_color1_g as i32, bg_color1_b as i32);
        let bg_color2 = (bg_color2_r as i32, bg_color2_g as i32, bg_color2_b as i32);

        for j in 0..HEIGHT {
            for i in 0..WIDTH {
                let u = (i as i64 * 2i64 * SCALE as i64) / (WIDTH as i64) - SCALE as i64;
                let v = -((j as i64 * 2i64 * SCALE as i64) / (HEIGHT as i64) - SCALE as i64);

                let ray_dir = Vec3::new(u as i32, v as i32, -2 * SCALE).normalize();

                let oc = origin - sphere_pos;
                let a = ray_dir.dot(ray_dir);
                let b = 2i64 as i32 * oc.dot(ray_dir);
                let c = oc.dot(oc).saturating_sub((sphere_radius as i64 * sphere_radius as i64 / SCALE as i64) as i32);

                let b_val = b as i64;
                let a_val = a as i64;
                let c_val = c as i64;
                
                let discriminant = b_val.saturating_mul(b_val).saturating_sub(4i64.saturating_mul(a_val).saturating_mul(c_val));

                let (r, g, b) = if discriminant > 0 {
                    let sqrt_disc = if discriminant <= i64::MAX {
                        discriminant.isqrt()
                    } else {
                        65536i64
                    };
                    
                    let numerator = -b_val - sqrt_disc;
                    let denominator = 2i64 * a_val;
                    
                    let t = if denominator != 0 {
                        numerator.saturating_mul(SCALE as i64) / denominator
                    } else {
                        0
                    };

                    if t > 0 {
                        let t_i32 = (t as i32).min(i32::MAX);
                        let hit_point = origin + (ray_dir * t_i32);
                        let normal = (hit_point - sphere_pos).normalize();

                        let diff = normal.dot(light_dir);
                        let ambient = SCALE / 10;
                        let intensity = if diff > 0 { diff + ambient } else { ambient };

                        let r = ((sphere_color.0 as i64 * intensity as i64) / SCALE as i64).min(255) as u8;
                        let g = ((sphere_color.1 as i64 * intensity as i64) / SCALE as i64).min(255) as u8;
                        let b = ((sphere_color.2 as i64 * intensity as i64) / SCALE as i64).min(255) as u8;
                        (r, g, b)
                    } else {
                        get_background(v as i32, bg_color1, bg_color2)
                    }
                } else {
                    get_background(v as i32, bg_color1, bg_color2)
                };

                pixels.push(r);
                pixels.push(g);
                pixels.push(b);
            }
        }

        pixels.into()
    }

    /// ADD BMP HEADER: Convert pixel data to BMP format
    fn add_bmp_header(&self, pixel_data: Bytes) -> Bytes {
        // ... (KODE BMP HEADER LAMA TETAP SAMA) ...
        let width: u32 = 32;
        let file_size: u32 = 54 + pixel_data.len() as u32;

        let mut bmp = Vec::with_capacity(file_size as usize);

        // BMP File Header
        bmp.push(0x42);
        bmp.push(0x4D);
        bmp.extend_from_slice(&file_size.to_le_bytes());
        bmp.extend_from_slice(&[0, 0, 0, 0]);
        bmp.push(54);
        bmp.push(0);
        bmp.push(0);
        bmp.push(0);

        // DIB Header
        bmp.push(40);
        bmp.push(0);
        bmp.push(0);
        bmp.push(0);
        bmp.extend_from_slice(&width.to_le_bytes());

        let neg_height: i32 = -32;
        bmp.extend_from_slice(&neg_height.to_le_bytes());

        bmp.push(1);
        bmp.push(0);
        bmp.push(24);
        bmp.push(0);
        bmp.extend_from_slice(&[0; 24]);

        // Pixel data (BGR format)
        let data_vec = pixel_data.to_vec();
        for chunk in data_vec.chunks(3) {
            if chunk.len() == 3 {
                bmp.push(chunk[2]); // B
                bmp.push(chunk[1]); // G
                bmp.push(chunk[0]); // R
            }
        }

        bmp.into()
    }
}

// ============ HELPER STRUCTS (REMAINS THE SAME) ============

#[derive(Clone, Copy)]
struct Vec3 {
// ... (KODE VEC3 TETAP SAMA)
    x: i32,
    y: i32,
    z: i32,
}

const SCALE: i32 = 1024;

impl Vec3 {
    fn new(x: i32, y: i32, z: i32) -> Self {
        Self { x, y, z }
    }

    fn dot(self, other: Self) -> i32 {
        ((self.x as i64 * other.x as i64
            + self.y as i64 * other.y as i64
            + self.z as i64 * other.z as i64)
            / SCALE as i64) as i32
    }

    fn normalize(self) -> Self {
        let len_sq = self.x as i64 * self.x as i64
            + self.y as i64 * self.y as i64
            + self.z as i64 * self.z as i64;
        let len = len_sq.isqrt() as i32;

        if len == 0 {
            return self;
        }

        Self {
            x: (self.x as i64 * SCALE as i64 / len as i64) as i32,
            y: (self.y as i64 * SCALE as i64 / len as i64) as i32,
            z: (self.z as i64 * SCALE as i64 / len as i64) as i32,
        }
    }
}

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
    fn mul(self, scalar: i32) -> Self {
        Self {
            x: (self.x as i64 * scalar as i64 / SCALE as i64) as i32,
            y: (self.y as i64 * scalar as i64 / SCALE as i64) as i32,
            z: (self.z as i64 * scalar as i64 / SCALE as i64) as i32,
        }
    }
}

fn get_background(
    v: i32,
    bg_color1: (i32, i32, i32),
    bg_color2: (i32, i32, i32),
) -> (u8, u8, u8) {
    let t_num = v + SCALE;
    let t_den = 2 * SCALE;

    let r = bg_color1.0 + ((bg_color2.0 - bg_color1.0) * t_num) / t_den;
    let g = bg_color1.1 + ((bg_color2.1 - bg_color1.1) * t_num) / t_den;
    let b = bg_color1.2 + ((bg_color2.2 - bg_color1.2) * t_num) / t_den;

    (r as u8, g as u8, b as u8)
}