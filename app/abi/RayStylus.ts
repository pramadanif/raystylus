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
        "name": "mint",
        "outputs": [
            {
                "type": "uint256",
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
        "name": "renderScene",
        "outputs": [
            {
                "type": "bytes",
                "name": ""
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "name": "token_id", "type": "uint256" }
        ],
        "name": "render_token",
        "outputs": [
            {
                "type": "bytes",
                "name": ""
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "name": "token_id", "type": "uint256" }
        ],
        "name": "owner_of",
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const;

export const RAYSTYLUS_ADDRESS = "0x7515c2027cf9c5cee814b0516d794c8e0048b2e3";
