#![cfg_attr(target_arch = "wasm32", no_main)]

extern crate alloc;

use alloc::vec::Vec;
use stylus_sdk::prelude::*;
use stylus_sdk::abi::Bytes;

#[storage]
#[entrypoint]
pub struct Contract;

#[public]
impl Contract {
    pub fn renderScene(
        &self,
        sphere_r: u8,
        sphere_g: u8,
        sphere_b: u8,
        cam_x: i32,
        cam_y: i32,
        cam_z: i32,
    ) -> Bytes {
        const WIDTH: i32 = 32;
        const HEIGHT: i32 = 32;
        const SCALE: i32 = 1024; // Fixed point 1.0 = 1024

        // Optimization: Pre-allocate memory
        let mut pixels = Vec::with_capacity((WIDTH * HEIGHT * 3) as usize);

        // Scene Setup (Scaled)
        // Base origin is (0, 0, 2.5). We add the camera offset.
        // Inputs are assumed to be standard integers, so we multiply by SCALE.
        let origin = Vec3::new(
            cam_x * SCALE, 
            cam_y * SCALE, 
            (2 * SCALE + SCALE/2) + cam_z * SCALE
        );
        
        let sphere_pos = Vec3::new(0, 0, 0);
        let sphere_radius = SCALE; // 1.0
        let light_dir = Vec3::new(SCALE, SCALE, SCALE).normalize();

        // Colors from input
        let sphere_color = (sphere_r as i32, sphere_g as i32, sphere_b as i32);

        for j in 0..HEIGHT {
            for i in 0..WIDTH {
                // Normalized Device Coordinates (-1 to 1)
                // u = (i / width) * 2 - 1
                let u = (i * 2 * SCALE) / WIDTH - SCALE;
                let v = -((j * 2 * SCALE) / HEIGHT - SCALE); // Flip Y

                // Ray Direction (Perspective)
                // z = -2.0
                let ray_dir = Vec3::new(u, v, -2 * SCALE).normalize();

                // Ray-Sphere Intersection
                let oc = origin - sphere_pos;
                let a = ray_dir.dot(ray_dir); // Should be close to SCALE (1.0)
                let b = 2 * oc.dot(ray_dir);
                let c = oc.dot(oc) - (sphere_radius as i64 * sphere_radius as i64 / SCALE as i64) as i32;
                
                // Discriminant = b*b - 4*a*c
                // Careful with scaling.
                // dot returns scaled value.
                // b is scaled. b*b is scaled^2.
                // 4*a*c. a is scaled. c is scaled. a*c is scaled^2.
                // So discriminant is scaled^2.
                
                let b_val = b as i64;
                let a_val = a as i64;
                let c_val = c as i64;
                let discriminant = b_val * b_val - 4 * a_val * c_val;

                let (r, g, b) = if discriminant > 0 {
                    let sqrt_disc = discriminant.isqrt();
                    let t = (-b_val - sqrt_disc) * SCALE as i64 / (2 * a_val); // Scale up numerator to keep precision?
                    // t is distance.
                    // The formula (-b - sqrt) / 2a.
                    // b is scaled. sqrt is scaled. numerator is scaled.
                    // a is scaled.
                    // result is unitless (ratio).
                    // We want t to be scaled.
                    // So (-b - sqrt) * SCALE / (2a).
                    
                    if t > 0 {
                        // Hit Point
                        // origin + ray_dir * t
                        // ray_dir is scaled. t is scaled.
                        // ray_dir * t is scaled^2. Need to divide by SCALE.
                        let t_i32 = t as i32;
                        let hit_point = origin + (ray_dir * t_i32);
                        let normal = (hit_point - sphere_pos).normalize();
                        
                        // Diffuse Lighting
                        // dot returns scaled value.
                        let diff = normal.dot(light_dir); // Range -SCALE to SCALE
                        let ambient = SCALE / 10; // 0.1
                        let intensity = if diff > 0 { diff + ambient } else { ambient };
                        
                        // Final Color
                        // color * intensity / SCALE
                        let r = (sphere_color.0 * intensity / SCALE).min(255) as u8;
                        let g = (sphere_color.1 * intensity / SCALE).min(255) as u8;
                        let b = (sphere_color.2 * intensity / SCALE).min(255) as u8;
                        (r, g, b)
                    } else {
                        get_background(v)
                    }
                } else {
                    get_background(v)
                };

                pixels.push(r);
                pixels.push(g);
                pixels.push(b);
            }
        }

        pixels.into()
    }
}

// Helper Structs and Functions
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

fn get_background(v: i32) -> (u8, u8, u8) {
    // Gradient: Top Blue (#5B9BD5) to Bottom White
    // v is -SCALE to SCALE
    // t = (v + SCALE) / 2SCALE -> 0 to 1
    // But we want integer math.
    // t_num = v + SCALE. t_den = 2 * SCALE.
    
    let t_num = v + SCALE;
    let t_den = 2 * SCALE;
    
    // Lerp: a + (b-a)*t
    // r = 255 + (91 - 255) * t
    // r = 255 - 164 * t
    
    let r = 255 - (164 * t_num) / t_den;
    let g = 255 - (100 * t_num) / t_den; // 155 - 255 = -100
    let b = 255 - (42 * t_num) / t_den;  // 213 - 255 = -42
    
    (r as u8, g as u8, b as u8)
}
