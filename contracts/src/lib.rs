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
    pub fn mint(
        &mut self,
        _sphere_r: u8,
        _sphere_g: u8,
        _sphere_b: u8,
        _bg_color1_r: u8,
        _bg_color1_g: u8,
        _bg_color1_b: u8,
        _bg_color2_r: u8,
        _bg_color2_g: u8,
        _bg_color2_b: u8,
        _cam_x: i32,
        _cam_y: i32,
        _cam_z: i32,
    ) -> u64 {
        // Simple mint function - just returns 1 (token ID)
        // Future: can track mints with storage
        1u64
    }

    pub fn render_scene(
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
        _cam_x: i32,
        _cam_y: i32,
        _cam_z: i32,
    ) -> Bytes {
        const WIDTH: usize = 32;
        const HEIGHT: usize = 32;

        // Simple version: gradient background with sphere color at center
        let mut pixels = Vec::with_capacity(WIDTH * HEIGHT * 3);

        for j in 0..HEIGHT {
            for i in 0..WIDTH {
                // Gradient: top to bottom
                let t = (j as u32 * 255) / HEIGHT as u32;
                
                let r = ((bg_color1_r as u32 * (255 - t) + bg_color2_r as u32 * t) / 255) as u8;
                let g = ((bg_color1_g as u32 * (255 - t) + bg_color2_g as u32 * t) / 255) as u8;
                let b = ((bg_color1_b as u32 * (255 - t) + bg_color2_b as u32 * t) / 255) as u8;

                // Add sphere color in center pixels
                let (center_i, center_j) = (WIDTH / 2, HEIGHT / 2);
                let dist_x = ((i as i32) - (center_i as i32)).abs() as usize;
                let dist_y = ((j as i32) - (center_j as i32)).abs() as usize;
                
                let final_r = if dist_x < 8 && dist_y < 8 {
                    sphere_r
                } else {
                    r
                };
                
                let final_g = if dist_x < 8 && dist_y < 8 {
                    sphere_g
                } else {
                    g
                };
                
                let final_b = if dist_x < 8 && dist_y < 8 {
                    sphere_b
                } else {
                    b
                };

                pixels.push(final_r);
                pixels.push(final_g);
                pixels.push(final_b);
            }
        }

        pixels.into()
    }
}
