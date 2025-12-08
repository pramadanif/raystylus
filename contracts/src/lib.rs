#![cfg_attr(target_arch = "wasm32", no_main)]

extern crate alloc;
extern crate num_integer; // Pastikan ini ada di Cargo.toml

use alloc::vec::Vec;
use stylus_sdk::prelude::*;
use stylus_sdk::abi::Bytes;
use stylus_sdk::storage::{StorageMap, StorageU8, StorageI32, StorageU256, StorageAddress};
use stylus_sdk::stylus_proc::entrypoint;
use stylus_sdk::msg;
use num_integer::Integer; // Untuk .isqrt()
use alloy_primitives::U256;

// --- 1. DEFINISI STORAGE (DNA TOKEN) ---

// Struct ini akan menyimpan parameter (DNA) di blockchain
#[stylus_sdk::stylus_proc::solidity_storage]
pub struct TokenDNA {
    pub sphere_r: StorageU8,
    pub sphere_g: StorageU8,
    pub sphere_b: StorageU8,
    pub bg_color1_r: StorageU8,
    pub bg_color1_g: StorageU8,
    pub bg_color1_b: StorageU8,
    pub bg_color2_r: StorageU8,
    pub bg_color2_g: StorageU8,
    pub bg_color2_b: StorageU8,
    pub cam_x: StorageI32,
    pub cam_y: StorageI32,
    pub cam_z: StorageI32,
}

#[storage]
#[entrypoint]
pub struct Contract {
    // Mapping TokenID -> DNA
    pub token_dna: StorageMap<U256, TokenDNA>,
    // Mapping TokenID -> Owner
    pub owner_of: StorageMap<U256, StorageAddress>,
    // Counter untuk ID Token selanjutnya
    pub next_token_id: StorageU256,
}

#[public]
impl Contract {

    // --- 2. FUNGSI MINT (Sangat Murah & Robust) ---
    // Fungsi ini TIDAK melakukan render. Hanya menyimpan data.
    // Ini mencegah "Out of Gas" revert.
    pub fn mint_image(
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
    ) -> Result<U256, Vec<u8>> {
        // Ambil ID baru
        let token_id = self.next_token_id.get();
        
        // Simpan Ownership
        let sender = msg::sender();
        self.owner_of.setter(token_id).set(sender);

        // Simpan DNA (Parameter Input) ke Storage
        // Ini adalah langkah "Menyimpan Resep"
        let mut dna = self.token_dna.setter(token_id);
        dna.sphere_r.set(sphere_r);
        dna.sphere_g.set(sphere_g);
        dna.sphere_b.set(sphere_b);
        dna.bg_color1_r.set(bg_color1_r);
        dna.bg_color1_g.set(bg_color1_g);
        dna.bg_color1_b.set(bg_color1_b);
        dna.bg_color2_r.set(bg_color2_r);
        dna.bg_color2_g.set(bg_color2_g);
        dna.bg_color2_b.set(bg_color2_b);
        dna.cam_x.set(cam_x);
        dna.cam_y.set(cam_y);
        dna.cam_z.set(cam_z);

        // Increment ID untuk mint berikutnya
        let next_id = token_id + U256::from(1);
        self.next_token_id.set(next_id);

        Ok(token_id)
    }

    // --- 3. FUNGSI RENDER UTAMA (PREVIEW) ---
    // Tidak berubah, digunakan untuk Frontend Preview
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
        // Panggil logika internal (private)
        self.internal_render(
            sphere_r, sphere_g, sphere_b,
            bg_color1_r, bg_color1_g, bg_color1_b,
            bg_color2_r, bg_color2_g, bg_color2_b,
            cam_x, cam_y, cam_z
        )
    }

    // --- 4. FUNGSI RENDER TOKEN (ON-CHAIN PROOF) ---
    // Ini fungsi ajaibnya. Masukkan Token ID -> Keluar Gambar.
    // Membaca DNA dari storage, lalu merender.
    pub fn render_token_id(&self, token_id: U256) -> Bytes {
        let dna = self.token_dna.get(token_id);
        
        // Baca parameter dari storage
        self.internal_render(
            dna.sphere_r.get(),
            dna.sphere_g.get(),
            dna.sphere_b.get(),
            dna.bg_color1_r.get(),
            dna.bg_color1_g.get(),
            dna.bg_color1_b.get(),
            dna.bg_color2_r.get(),
            dna.bg_color2_g.get(),
            dna.bg_color2_b.get(),
            dna.cam_x.get(),
            dna.cam_y.get(),
            dna.cam_z.get()
        )
    }
}

// --- LOGIKA INTERNAL (Dipisah agar bisa dipanggil ulang) ---

impl Contract {
    fn internal_render(
        &self,
        sphere_r: u8, sphere_g: u8, sphere_b: u8,
        bg_color1_r: u8, bg_color1_g: u8, bg_color1_b: u8,
        bg_color2_r: u8, bg_color2_g: u8, bg_color2_b: u8,
        cam_x: i32, cam_y: i32, cam_z: i32,
    ) -> Bytes {
        const WIDTH: i32 = 32;
        const HEIGHT: i32 = 32;
        const SCALE: i32 = 1024;

        let mut pixels = Vec::with_capacity((WIDTH * HEIGHT * 3) as usize);

        let origin = Vec3::new(
            cam_x * SCALE, 
            cam_y * SCALE, 
            (2 * SCALE + SCALE/2) + cam_z * SCALE
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
}

// --- HELPER STRUCTS & MATH ---
// (Sama persis seperti kode Anda sebelumnya)

#[derive(Clone, Copy)]
struct Vec3 { x: i32, y: i32, z: i32 }

const SCALE: i32 = 1024;

impl Vec3 {
    fn new(x: i32, y: i32, z: i32) -> Self { Self { x, y, z } }
    
    fn dot(self, other: Self) -> i32 {
        ((self.x as i64 * other.x as i64 + self.y as i64 * other.y as i64 + self.z as i64 * other.z as i64) / SCALE as i64) as i32
    }

    fn normalize(self) -> Self {
        let len_sq = self.x as i64 * self.x as i64 + self.y as i64 * self.y as i64 + self.z as i64 * self.z as i64;
        let len = len_sq.isqrt() as i32;
        if len == 0 { return self; }
        Self {
            x: (self.x as i64 * SCALE as i64 / len as i64) as i32,
            y: (self.y as i64 * SCALE as i64 / len as i64) as i32,
            z: (self.z as i64 * SCALE as i64 / len as i64) as i32,
        }
    }
}

impl core::ops::Add for Vec3 {
    type Output = Self;
    fn add(self, other: Self) -> Self { Self { x: self.x + other.x, y: self.y + other.y, z: self.z + other.z } }
}

impl core::ops::Sub for Vec3 {
    type Output = Self;
    fn sub(self, other: Self) -> Self { Self { x: self.x - other.x, y: self.y - other.y, z: self.z - other.z } }
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

fn get_background(v: i32, bg_color1: (i32, i32, i32), bg_color2: (i32, i32, i32)) -> (u8, u8, u8) {
    let t_num = v + SCALE;
    let t_den = 2 * SCALE;
    let r = bg_color1.0 + ((bg_color2.0 - bg_color1.0) * t_num) / t_den;
    let g = bg_color1.1 + ((bg_color2.1 - bg_color1.1) * t_num) / t_den;
    let b = bg_color1.2 + ((bg_color2.2 - bg_color1.2) * t_num) / t_den;
    (r as u8, g as u8, b as u8)
}