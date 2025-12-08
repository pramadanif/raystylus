#![cfg_attr(target_arch = "wasm32", no_main)]
#![allow(non_snake_case)]

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
    /// MINT: Simpan data token tanpa render (gas efisien)
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

        // Pack 21 bytes: 9 color bytes + 12 camera bytes
        let mut data = Vec::with_capacity(21);
        data.push(sphere_r);
        data.push(sphere_g);
        data.push(sphere_b);
        data.push(bg_color1_r);
        data.push(bg_color1_g);
        data.push(bg_color1_b);
        data.push(bg_color2_r);
        data.push(bg_color2_g);
        data.push(bg_color2_b);
        data.extend_from_slice(&cam_x.to_le_bytes());
        data.extend_from_slice(&cam_y.to_le_bytes());
        data.extend_from_slice(&cam_z.to_le_bytes());

        self.token_data.setter(token_id).set_bytes(data);

        token_id
    }

    /// GET OWNER: Cek siapa pemilik token
    pub fn owner_of(&self, token_id: U256) -> Address {
        self.owners.get(token_id)
    }

    /// RENDER TOKEN: Ambil data & render scene + BMP header (100% sama dengan code 2)
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

        // Render scene (PERSIS SAMA dengan code 2)
        let raw_pixels = self.renderScene(
            sphere_r, sphere_g, sphere_b,
            bg1_r, bg1_g, bg1_b,
            bg2_r, bg2_g, bg2_b,
            cx, cy, cz,
        );

        // Add BMP header
        self.add_bmp_header(raw_pixels)
    }

    /// RENDER SCENE: Core rendering logic (100% SAMA dengan code 2)
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

        let origin = Vec3::new(
            cam_x * SCALE,
            cam_y * SCALE,
            (2 * SCALE + SCALE / 2) + cam_z * SCALE,
        );

        let sphere_pos = Vec3::new(0, 0, 0);
        let sphere_radius = SCALE;
        let light_dir = Vec3::new(SCALE, SCALE, SCALE).normalize();

        let sphere_color = (sphere_r as i32, sphere_g as i32, sphere_b as i32);
        let bg_color1 = (bg_color1_r as i32, bg_color1_g as i32, bg_color1_b as i32);
        let bg_color2 = (bg_color2_r as i32, bg_color2_g as i32, bg_color2_b as i32);

        for j in 0..HEIGHT {
            for i in 0..WIDTH {
                let u = (i * 2 * SCALE) / WIDTH - SCALE;
                let v = -((j * 2 * SCALE) / HEIGHT - SCALE);

                let ray_dir = Vec3::new(u, v, -2 * SCALE).normalize();

                let oc = origin - sphere_pos;
                let a = ray_dir.dot(ray_dir);
                let b = 2 * oc.dot(ray_dir);
                let c = oc.dot(oc) - (sphere_radius as i64 * sphere_radius as i64 / SCALE as i64) as i32;

                let b_val = b as i64;
                let a_val = a as i64;
                let c_val = c as i64;
                let discriminant = b_val * b_val - 4 * a_val * c_val;

                let (r, g, b) = if discriminant > 0 {
                    let sqrt_disc = discriminant.isqrt();
                    let t = (-b_val - sqrt_disc) * SCALE as i64 / (2 * a_val);

                    if t > 0 {
                        let t_i32 = t as i32;
                        let hit_point = origin + (ray_dir * t_i32);
                        let normal = (hit_point - sphere_pos).normalize();

                        let diff = normal.dot(light_dir);
                        let ambient = SCALE / 10;
                        let intensity = if diff > 0 { diff + ambient } else { ambient };

                        let r = (sphere_color.0 * intensity / SCALE).min(255) as u8;
                        let g = (sphere_color.1 * intensity / SCALE).min(255) as u8;
                        let b = (sphere_color.2 * intensity / SCALE).min(255) as u8;
                        (r, g, b)
                    } else {
                        get_background(v, bg_color1, bg_color2)
                    }
                } else {
                    get_background(v, bg_color1, bg_color2)
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

// ============ HELPER STRUCTS (100% SAMA DENGAN CODE 2) ============

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