#![cfg_attr(target_arch = "wasm32", no_main)]
#![allow(non_snake_case)]

extern crate alloc;

use alloc::vec::Vec;
use stylus_sdk::prelude::*;
use stylus_sdk::abi::Bytes;
use stylus_sdk::alloy_primitives::{Address, U256};
use stylus_sdk::msg;
use stylus_sdk::storage::{StorageMap, StorageBytes, StorageU256, StorageAddress};

// ==========================================================
// ========== 1. ML INFERENCE MODULE (Mini NN - Fixed-Point) ==========
// ==========================================================

// Fixed-Point Scale (10^18) - All ML computations use this scale
const ML_SCALE: i64 = 1_000_000_000_000_000_000;
const HALF_SCALE: i64 = 500_000_000_000_000_000;

// --- MNN WEIGHTS AND BIASES (Trained with 1000 Samples) ---

// --- LAYER 1: INPUT (3) -> HIDDEN (4) ---
const W1: [[i64; 3]; 4] = [
    [567938987432345600, -1027907238687145984, 687906701138984960], 
    [-519756979153928192, -297215172857036800, 567038006372859904], 
    [-1382447992878923776, 647886333313810432, 16105605521473536], 
    [-379177786113261568, -505057986159312896, 155223330712977408]
];

const B1: [i64; 4] = [
    640866501326274560, 
    413779107801726976, 
    722336121056395264, 
    -83450321208082432
];

// --- LAYER 2: HIDDEN (4) -> OUTPUT (2) ---
const W2: [[i64; 4]; 2] = [
    [262302328600657920, -581599938371125248, -1118118525613899776, 604784103115456512], 
    [-1509882490049789952, -735249060490903552, 982777096730312704, -349181700158259200]
];

const B2: [i64; 2] = [
    -178075408585981952, 
    -350273790082547712
];

// --- ACTIVATION FUNCTIONS ---

/// ReLU activation: max(0, x)
fn relu(x: i64) -> i64 {
    if x > 0 { x } else { 0 }
}

/// Safe sigmoid approximation with bounds checking
fn sigmoid_approx_safe(x: i64) -> i64 {
    // Bounds check before computation - fast path for extreme values
    // Use safe comparison to avoid overflow: 3 * ML_SCALE would overflow i64
    const THREE_TIMES_ML_SCALE: i64 = 3_000_000_000_000_000_000i64;
    
    if x >= THREE_TIMES_ML_SCALE {
        return ML_SCALE;
    } 
    if x <= -THREE_TIMES_ML_SCALE {
        return 0;
    }

    const ONE_SIXTH_FP: i64 = 166_666_666_666_666_667;
    
    // For intermediate values, use safe calculation
    // Prevent overflow in multiplication by checking bounds
    let x_abs = x.abs();
    
    if x_abs > i64::MAX / 2 {
        // Value too large, return extreme sigmoid value
        return if x > 0 { ML_SCALE } else { 0 };
    }
    
    // Safe fixed-point calculation: (x * ONE_SIXTH) / ML_SCALE
    let product = (x as i128).saturating_mul(ONE_SIXTH_FP as i128);
    let linear_term = product.saturating_div(ML_SCALE as i128) as i64;
    
    // Final result: 0.5 + linear_term, clamped to valid range
    HALF_SCALE.saturating_add(linear_term)
}

/// ML Inference: 2-layer neural network (3 -> 4 -> 2)
/// Input: [warmth, intensity, depth] in fixed-point (10^18 scale)
/// Output: [sphere_r, sphere_g] in fixed-point (0 to 10^18)
pub fn infer_aesthetic(style_vector: [i64; 3]) -> [i64; 2] {
    let mut hidden_output = [0i64; 4];
    let mut final_output = [0i64; 2];

    // --- LAYER 1: INPUT -> HIDDEN ---
    for i in 0..4 {
        let mut sum: i64 = 0;
        
        for j in 0..3 {
            let w = W1[i][j];
            let x = style_vector[j];
            
            // Skip zero multiplications to save gas
            if w == 0 || x == 0 {
                continue;
            }
            
            // Safe fixed-point multiplication
            let product = (w as i128).saturating_mul(x as i128);
            let result = product.saturating_div(ML_SCALE as i128) as i64;
            
            // Use saturating_add to prevent overflow
            sum = sum.saturating_add(result);
        }

        let z1 = sum.saturating_add(B1[i]);
        hidden_output[i] = relu(z1); 
    }

    // --- LAYER 2: HIDDEN -> OUTPUT ---
    for i in 0..2 {
        let mut sum: i64 = 0;
        
        for j in 0..4 {
            let w = W2[i][j];
            let y = hidden_output[j];
            
            if w == 0 || y == 0 {
                continue;
            }
            
            let product = (w as i128).saturating_mul(y as i128);
            let result = product.saturating_div(ML_SCALE as i128) as i64;
            
            sum = sum.saturating_add(result);
        }

        let z2 = sum.saturating_add(B2[i]);
        final_output[i] = sigmoid_approx_safe(z2); 
    }

    final_output
}

#[storage]
#[entrypoint]
pub struct Contract {
    pub owners: StorageMap<U256, StorageAddress>,
    pub token_data: StorageMap<U256, StorageBytes>,
    pub total_supply: StorageU256,
}

#[public]
impl Contract {
    // ===============================================================
    // ========== VIEW FUNCTION: Get Aesthetic Colors (FREE!) ====
    // ===============================================================

    /// VIEW_AESTHETIC: Compute aesthetic colors using ML inference
    /// 
    /// This is a VIEW function - it does NOT modify state and costs NO GAS!
    /// Use this to preview colors before minting.
    ///
    /// Parameters:
    /// - style_warmth_u256: Warmth (0 to 10^18, where 10^18 = 1.0)
    /// - style_intensity_u256: Intensity (0 to 10^18)
    /// - style_depth_u256: Depth (0 to 10^18)
    ///
    /// Returns: (sphere_r, sphere_g, sphere_b) RGB values 0-255
    pub fn view_aesthetic(
        &self,
        style_warmth_u256: U256,
        style_intensity_u256: U256,
        style_depth_u256: U256,
    ) -> (u8, u8, u8) {
        // Maximum expected value: 10^18
        let max_value = U256::from(ML_SCALE as u64);
        
        // Validate inputs
        if style_warmth_u256 > max_value {
            return (0, 0, 0);
        }
        if style_intensity_u256 > max_value {
            return (0, 0, 0);
        }
        if style_depth_u256 > max_value {
            return (0, 0, 0);
        }

        // Safe U256 -> i64 conversion
        let w: i64 = match u64::try_from(style_warmth_u256) {
            Ok(val) => val as i64,
            Err(_) => i64::MAX,
        };

        let i: i64 = match u64::try_from(style_intensity_u256) {
            Ok(val) => val as i64,
            Err(_) => i64::MAX,
        };

        let d: i64 = match u64::try_from(style_depth_u256) {
            Ok(val) => val as i64,
            Err(_) => i64::MAX,
        };

        // Run ML inference
        let style_vector = [w, i, d];
        let inferred_output = infer_aesthetic(style_vector);

        let sphere_r_i64 = inferred_output[0];
        let sphere_g_i64 = inferred_output[1];
        
        // Convert fixed-point to 8-bit RGB
        // Ensure values are clamped to [0, ML_SCALE] range first
        let r_clamped = if sphere_r_i64 < 0 { 0 } else if sphere_r_i64 > ML_SCALE { ML_SCALE } else { sphere_r_i64 };
        let g_clamped = if sphere_g_i64 < 0 { 0 } else if sphere_g_i64 > ML_SCALE { ML_SCALE } else { sphere_g_i64 };
        
        // Safe conversion: (value / ML_SCALE) * 255
        let sphere_r: u8 = ((r_clamped as i128 * 255i128 / ML_SCALE as i128)
            .min(255)
            .max(0)) as u8;

        let sphere_g: u8 = ((g_clamped as i128 * 255i128 / ML_SCALE as i128)
            .min(255)
            .max(0)) as u8;

        let sphere_b: u8 = sphere_g;

        (sphere_r, sphere_g, sphere_b)
    }

    // ===============================================================
    // ========== STATE FUNCTION: Mint Token with Colors ====
    // ===============================================================

    /// MINT: Save token data with rendering parameters
    /// 
    /// Parameters:
    /// - sphere_r, sphere_g, sphere_b: Sphere color (RGB 0-255)
    /// - bg_color1_*, bg_color2_*: Background gradient colors
    /// - cam_x, cam_y, cam_z: Camera position
    ///
    /// Returns: Token ID (auto-incremented starting from 0)
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
        // Get current total supply
        let token_id = self.total_supply.get();

        // Update total supply
        let new_supply = token_id + U256::from(1);
        self.total_supply.set(new_supply);

        // Store owner
        self.owners.setter(token_id).set(msg::sender());

        // Pack 21 bytes: 9 color bytes + 12 camera bytes
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
        
        // Add camera coordinates as little-endian bytes
        for byte in cam_x.to_le_bytes().iter() {
            data.push(*byte);
        }
        for byte in cam_y.to_le_bytes().iter() {
            data.push(*byte);
        }
        for byte in cam_z.to_le_bytes().iter() {
            data.push(*byte);
        }

        // Store token data
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
        const WIDTH: i32 = 32;
        const HEIGHT: i32 = 32;
        const SCALE: i32 = 1024;

        let mut pixels = Vec::with_capacity((WIDTH * HEIGHT * 3) as usize);

        // Use saturating arithmetic to prevent panics
        // Camera Z position affects depth perception and view distance
        let origin = Vec3::new(
            cam_x.saturating_mul(SCALE),
            cam_y.saturating_mul(SCALE),
            cam_z.saturating_mul(SCALE),
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
                
                // Safe discriminant calculation
                let discriminant = b_val.saturating_mul(b_val).saturating_sub(4i64.saturating_mul(a_val).saturating_mul(c_val));

                let (r, g, b) = if discriminant > 0 {
                    // Safe square root calculation
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

// ============ HELPER STRUCTS ============

#[derive(Clone, Copy)]
struct Vec3 {
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