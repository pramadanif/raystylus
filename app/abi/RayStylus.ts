export const RAYSTYLUS_ABI = [
    {
        "inputs": [
            { "name": "sphere_r", "type": "uint8" },
            { "name": "sphere_g", "type": "uint8" },
            { "name": "sphere_b", "type": "uint8" },
            { "name": "bg_color1_r", "type": "uint8" },
            { "name": "bg_color1_g", "type": "uint8" },
            { "name": "bg_color1_b", "type": "uint8" },
            { "name": "bg_color2_r", "type": "uint8" },
            { "name": "bg_color2_g", "type": "uint8" },
            { "name": "bg_color2_b", "type": "uint8" },
            { "name": "cam_x", "type": "int32" },
            { "name": "cam_y", "type": "int32" },
            { "name": "cam_z", "type": "int32" }
        ],
        "name": "renderScene",
        "outputs": [
            {
                "type": "bytes",
                "name": ""
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const;

export const RAYSTYLUS_ADDRESS = "0x36b922c9056c7a2f16c539c0066c5e472455a12c";
