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
        "name": "mint_rendered_image",
        "outputs": [
            {
                "type": "uint64",
                "name": ""
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
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
        "name": "render_scene",
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

export const RAYSTYLUS_ADDRESS = "0x2fa02fbc839728fa59188a0db3ebf225ea8d54f6";
