#![cfg_attr(target_arch = "wasm32", no_main)]

// External crates
extern crate alloc;

use alloc::vec::Vec;
use stylus_sdk::prelude::*;

// ----------------------------------------------------------------------------
// Vec3 Struct and Implementation
// ----------------------------------------------------------------------------

#[derive(Clone, Copy, Debug)]
pub struct Vec3 {
    pub e: [f64; 3],
}

impl Vec3 {
    pub fn new(e0: f64, e1: f64, e2: f64) -> Vec3 {
        Vec3 { e: [e0, e1, e2] }
    }

    pub fn x(&self) -> f64 {
        self.e[0]
    }
    pub fn y(&self) -> f64 {
        self.e[1]
    }
    pub fn z(&self) -> f64 {
        self.e[2]
    }

    pub fn length_squared(&self) -> f64 {
        self.e[0] * self.e[0] + self.e[1] * self.e[1] + self.e[2] * self.e[2]
    }

    pub fn length(&self) -> f64 {
        self.length_squared().sqrt()
    }

    pub fn dot(&self, other: &Vec3) -> f64 {
        self.e[0] * other.e[0] + self.e[1] * other.e[1] + self.e[2] * other.e[2]
    }

    pub fn unit_vector(&self) -> Vec3 {
        *self / self.length()
    }
}

// Operator Overloading for Vec3

use core::ops::{Add, Div, Mul, Neg, Sub};

impl Add for Vec3 {
    type Output = Vec3;
    fn add(self, other: Vec3) -> Vec3 {
        Vec3::new(
            self.e[0] + other.e[0],
            self.e[1] + other.e[1],
            self.e[2] + other.e[2],
        )
    }
}

impl Sub for Vec3 {
    type Output = Vec3;
    fn sub(self, other: Vec3) -> Vec3 {
        Vec3::new(
            self.e[0] - other.e[0],
            self.e[1] - other.e[1],
            self.e[2] - other.e[2],
        )
    }
}

impl Mul<f64> for Vec3 {
    type Output = Vec3;
    fn mul(self, t: f64) -> Vec3 {
        Vec3::new(self.e[0] * t, self.e[1] * t, self.e[2] * t)
    }
}

impl Mul<Vec3> for f64 {
    type Output = Vec3;
    fn mul(self, v: Vec3) -> Vec3 {
        v * self
    }
}

impl Div<f64> for Vec3 {
    type Output = Vec3;
    fn div(self, t: f64) -> Vec3 {
        self * (1.0 / t)
    }
}

impl Neg for Vec3 {
    type Output = Vec3;
    fn neg(self) -> Vec3 {
        Vec3::new(-self.e[0], -self.e[1], -self.e[2])
    }
}

// ----------------------------------------------------------------------------
// Ray Struct
// ----------------------------------------------------------------------------

pub struct Ray {
    pub origin: Vec3,
    pub dir: Vec3,
}

impl Ray {
    pub fn new(origin: Vec3, dir: Vec3) -> Ray {
        Ray { origin, dir }
    }

    pub fn at(&self, t: f64) -> Vec3 {
        self.origin + (self.dir * t)
    }
}

// ----------------------------------------------------------------------------
// Core Ray Tracing Logic
// ----------------------------------------------------------------------------

fn hit_sphere(center: Vec3, radius: f64, ray: &Ray) -> f64 {
    let oc = ray.origin - center;
    let a = ray.dir.length_squared();
    let half_b = oc.dot(&ray.dir);
    let c = oc.length_squared() - radius * radius;
    let discriminant = half_b * half_b - a * c;

    if discriminant < 0.0 {
        -1.0
    } else {
        (-half_b - discriminant.sqrt()) / a
    }
}

fn ray_color(ray: &Ray) -> Vec3 {
    let t = hit_sphere(Vec3::new(0.0, 0.0, -1.0), 0.5, ray);
    if t > 0.0 {
        let n = (ray.at(t) - Vec3::new(0.0, 0.0, -1.0)).unit_vector();
        return Vec3::new(n.x() + 1.0, n.y() + 1.0, n.z() + 1.0) * 0.5;
    }

    // Background gradient
    let unit_direction = ray.dir.unit_vector();
    let t = 0.5 * (unit_direction.y() + 1.0);
    Vec3::new(1.0, 1.0, 1.0) * (1.0 - t) + Vec3::new(0.5, 0.7, 1.0) * t
}

// ----------------------------------------------------------------------------
// Stylus Entry Point
// ----------------------------------------------------------------------------

#[storage]
#[entrypoint]
pub struct Contract;

#[public]
impl Contract {
    pub fn render_scene(&self) -> Result<Vec<u8>, Vec<u8>> {
        const WIDTH: u32 = 32;
        const HEIGHT: u32 = 32;

        let mut pixels = Vec::with_capacity((WIDTH * HEIGHT * 3) as usize);

        // Camera setup
        let origin = Vec3::new(0.0, 0.0, 0.0);
        let horizontal = Vec3::new(4.0, 0.0, 0.0);
        let vertical = Vec3::new(0.0, 4.0, 0.0);
        let lower_left_corner =
            origin - (horizontal / 2.0) - (vertical / 2.0) - Vec3::new(0.0, 0.0, 1.0);

        for j in (0..HEIGHT).rev() {
            for i in 0..WIDTH {
                let u = (i as f64) / ((WIDTH - 1) as f64);
                let v = (j as f64) / ((HEIGHT - 1) as f64);

                let ray = Ray::new(
                    origin,
                    lower_left_corner + horizontal * u + vertical * v - origin,
                );

                let color = ray_color(&ray);

                // Convert to u8 (0-255)
                let ir = (255.999 * color.x()) as u8;
                let ig = (255.999 * color.y()) as u8;
                let ib = (255.999 * color.z()) as u8;

                pixels.push(ir);
                pixels.push(ig);
                pixels.push(ib);
            }
        }

        Ok(pixels)
    }
}
