#![cfg_attr(target_arch = "wasm32", no_main)]

extern crate alloc;

use stylus_sdk::prelude::*;

// Minimal test contract
#[storage]
#[entrypoint]
pub struct Contract;

#[public]
impl Contract {
    pub fn hello(&self) -> u32 {
        0x12345678
    }
}
