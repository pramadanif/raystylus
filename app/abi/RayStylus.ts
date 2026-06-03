// FILE: app/abi/RayStylus.ts

/**
 * Updated ABI for RayStylus Contract
 * 
 * Functions:
 * - view_aesthetic() → VIEW (FREE!) - Get aesthetic colors
 * - mint() → STATE (pays gas) - Create NFT with colors
 * - render_token() → VIEW - Render NFT image
 * - owner_of() → VIEW - Get token owner
 * - total_supply() → VIEW - Get total minted
 */

export const RAYSTYLUS_ABI = [
    // ============================================
    // VIEW FUNCTION: Get aesthetic colors (FREE!)
    // ============================================
    {
        "name": "viewAesthetic",
        "type": "function",
        "stateMutability": "view",
        "inputs": [
            {
                "name": "style_warmth_u256",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "style_intensity_u256",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "style_depth_u256",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "sphere_r",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "sphere_g",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "sphere_b",
                "type": "uint8",
                "internalType": "uint8"
            }
        ]
    },

    // ============================================
    // STATE FUNCTION: Mint token with colors
    // ============================================
    {
        "name": "mint",
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [
            {
                "name": "sphere_r",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "sphere_g",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "sphere_b",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "bg_color1_r",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "bg_color1_g",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "bg_color1_b",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "bg_color2_r",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "bg_color2_g",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "bg_color2_b",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "cam_x",
                "type": "int32",
                "internalType": "int32"
            },
            {
                "name": "cam_y",
                "type": "int32",
                "internalType": "int32"
            },
            {
                "name": "cam_z",
                "type": "int32",
                "internalType": "int32"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
    },

    // ============================================
    // VIEW FUNCTION: Render token image
    // ============================================
    {
        "name": "renderToken",
        "type": "function",
        "stateMutability": "view",
        "inputs": [
            {
                "name": "token_id",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bytes",
                "internalType": "bytes"
            }
        ]
    },

    // ============================================
    // VIEW FUNCTION: Get token owner
    // ============================================
    {
        "name": "owner_of",
        "type": "function",
        "stateMutability": "view",
        "inputs": [
            {
                "name": "token_id",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ]
    },

    // ============================================
    // VIEW FUNCTION: Get total supply
    // ============================================
    {
        "name": "total_supply",
        "type": "function",
        "stateMutability": "view",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
    },

    // ============================================
    // VIEW FUNCTION: Render scene (for testing)
    // ============================================
    {
        "name": "renderScene",
        "type": "function",
        "stateMutability": "view",
        "inputs": [
            {
                "name": "sphere_r",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "sphere_g",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "sphere_b",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "bg_color1_r",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "bg_color1_g",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "bg_color1_b",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "bg_color2_r",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "bg_color2_g",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "bg_color2_b",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "cam_x",
                "type": "int32",
                "internalType": "int32"
            },
            {
                "name": "cam_y",
                "type": "int32",
                "internalType": "int32"
            },
            {
                "name": "cam_z",
                "type": "int32",
                "internalType": "int32"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bytes",
                "internalType": "bytes"
            }
        ]
    }
] as const;

// ============================================
// CONTRACT ADDRESS - UPDATE AFTER DEPLOYMENT
// ============================================
export const RAYSTYLUS_ADDRESS = "0xd8f78c69d392d0235d851366dc6f97e378f73cb1" as const;