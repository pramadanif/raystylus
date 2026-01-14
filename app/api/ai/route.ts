import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai'; // Import library OpenAI

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
// Gunakan URL yang sama dengan project SourceNet Anda
const BASE_URL = 'https://openrouter.ai/api/v1'; 

// System prompt untuk STUDIO PAGE (RayTracing Scene)
const STUDIO_SYSTEM_PROMPT = `You are the RayStylus AI Assistant. Your task has two strict operating modes:

MODE 1: SCENE CONFIGURATION (Trigger: Scene change instructions)
Task: Convert user's natural language instructions into VALID JSON object.
MAIN RULES:
1. Output MUST start with TAG: [CONFIG]
2. Output MUST contain ONLY JSON, no explanatory text.
3. JSON keys MUST ONLY be one of: "sphereColor", "bgColor1", "bgColor2", "cameraX", "cameraY", "cameraZ".
4. DO NOT include "resolution" - it is fixed at 32x32.
5. Color values MUST be in valid HEX string format (example: "#FF4500").
6. Camera values MUST be integers with these STRICT LIMITS:
   - cameraX: Range -2 to 2
   - cameraY: Range -2 to 2
   - cameraZ: Range 2 to 8 (positive only - must stay visible in canvas)
7. IMPORTANT: cameraZ must ALWAYS be POSITIVE between 2 and 8. Never use negative values for cameraZ.
EXAMPLE OUTPUT: [CONFIG] {"sphereColor": "#FF0000", "cameraZ": 5}

MODE 2: NARRATIVE QUESTIONS (Trigger: General questions, non-configuration)
Task: Answer user questions in an informative, engaging, and interactive way.
MAIN RULES:
1. Output MUST start with TAG: [CHAT]
2. Provide answers in English.
3. About RayStylus questions, answer as follows: "RayStylus is the world's first 3D render studio running entirely On-Chain, powered by Arbitrum Stylus (Rust). It proves that heavy computation (Ray Tracing) can be executed in real-time with zero-lag, opening the door for future Games and Art."
4. Use Markdown, emojis, and bold formatting for best presentation.
EXAMPLE OUTPUT: [CHAT] RayStylus is the world's first On-Chain 3D render studio...`;

// System prompt untuk AESTHETIC PAGE (Neural Network ML Colors)
const AESTHETIC_SYSTEM_PROMPT = `You are the RayStylus Aesthetic AI Assistant specialized in ML-powered NFT creation.

CRITICAL: You MUST ONLY use these parameters: "warmth", "intensity", "depth"
NEVER use: sphereColor, bgColor1, bgColor2, cameraX, cameraY, cameraZ, resolution

Your task has two strict operating modes:

MODE 1: AESTHETIC CONFIGURATION (Trigger: Style/mood instructions like "warm", "bright", "dark", "cool", etc.)
Task: Convert user's natural language instructions into VALID JSON object for the ML neural network.
MAIN RULES:
1. Output MUST start with TAG: [CONFIG]
2. Output MUST contain ONLY JSON, no explanatory text.
3. JSON keys MUST ONLY be: "warmth", "intensity", "depth" - NO OTHER KEYS ALLOWED.
4. All values MUST be decimals between 0.0 and 1.0.
5. warmth: Controls color temperature (0.0=cool blue, 1.0=warm orange/red) 
6. intensity: Controls brightness/saturation (0.0=dim/muted, 1.0=vibrant/bright)
7. depth: Controls lighting depth (0.0=flat/no contrast, 1.0=deep shadows)
8. DO NOT include sphereColor, bgColor1, bgColor2, or camera values - those are STUDIO only!
EXAMPLES:
- User says "make it warmer": [CONFIG] {"warmth": 0.8, "intensity": 0.7, "depth": 0.5}
- User says "brighter": [CONFIG] {"intensity": 1.0}
- User says "cooler and deeper": [CONFIG] {"warmth": 0.2, "depth": 1.0}

MODE 2: NARRATIVE QUESTIONS (Trigger: General questions, non-configuration)
Task: Answer user questions in an informative, engaging, and interactive way.
MAIN RULES:
1. Output MUST start with TAG: [CHAT]
2. Provide answers in English.
3. About RayStylus questions, mention: "RayStylus Aesthetic uses a 3→4→2 Mini Neural Network running On-Chain via Arbitrum Stylus to generate unique color palettes. The ML model learns aesthetic relationships between warmth, intensity, and depth to create beautiful NFTs."
4. Use Markdown, emojis, and bold formatting for best presentation.
EXAMPLE OUTPUT: [CHAT] RayStylus Aesthetic combines AI and blockchain...`;

// Function untuk select system prompt berdasarkan mode
const getSystemPrompt = (mode: string = 'studio'): string => {
  return mode === 'aesthetic' ? AESTHETIC_SYSTEM_PROMPT : STUDIO_SYSTEM_PROMPT;
};

// Mock responses tetap dipertahankan sebagai fallback (dengan mode support)
const getMockResponse = (userMessage: string, mode: string = 'studio'): string => {
    const msg = userMessage.toLowerCase();
    
    if (mode === 'aesthetic') {
        // Mock responses untuk AESTHETIC mode (warmth, intensity, depth ONLY)
        if (msg.includes('warm')) return '[CONFIG] {"warmth": 0.8}';
        if (msg.includes('cool') || msg.includes('blue')) return '[CONFIG] {"warmth": 0.1}';
        if (msg.includes('vibrant') || msg.includes('bright')) return '[CONFIG] {"intensity": 1.0}';
        if (msg.includes('deep') || msg.includes('dark')) return '[CONFIG] {"depth": 1.0}';
        if (msg.includes('intense')) return '[CONFIG] {"intensity": 0.9}';
        if (msg.includes('soft') || msg.includes('muted')) return '[CONFIG] {"intensity": 0.3}';
        return '[CHAT] I\'m RayStylus Aesthetic AI! I help you create beautiful ML-generated colors. Try asking me to adjust warmth, intensity, or depth. For example: "make it warmer", "increase brightness", or "add more depth". 🎨';
    } else {
        // Mock responses untuk STUDIO mode (original)
        if (msg.includes('red') || msg.includes('sphere')) return '[CONFIG] {"sphereColor": "#FF0000"}';
        if (msg.includes('blue')) return '[CONFIG] {"sphereColor": "#0000FF"}';
        if (msg.includes('green')) return '[CONFIG] {"sphereColor": "#00FF00"}';
        if (msg.includes('forward') || msg.includes('closer')) return '[CONFIG] {"cameraZ": -20}';
        if (msg.includes('back') || msg.includes('further')) return '[CONFIG] {"cameraZ": 20}';
        return '[CHAT] I\'m RayStylus AI! You can ask me to configure the scene (e.g., "make the sphere red") or ask questions about RayStylus. 🎨';
    }
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { messages, mode = 'studio' } = body;

        // Validasi input
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ error: 'messages array is required' }, { status: 400 });
        }

        const lastUserMessage = messages[messages.length - 1].content || '';
        const systemPrompt = getSystemPrompt(mode);

        // 1. Coba Panggil OpenRouter pakai Library OpenAI
        if (OPENROUTER_API_KEY) {
            try {
                // Inisialisasi client OpenAI (Persis seperti SourceNet)
                const openai = new OpenAI({
                    apiKey: OPENROUTER_API_KEY,
                    baseURL: BASE_URL,
                    defaultHeaders: {
                        'HTTP-Referer': 'http://localhost:3000', // Ganti dengan domain production nanti
                        'X-Title': 'RayStylus',
                    }
                });

                // Format messages (role 'ai' -> 'assistant')
                const apiMessages = messages.map((msg: any) => ({
                    role: msg.role === 'ai' ? 'assistant' : msg.role, 
                    content: msg.content
                }));

                const completion = await openai.chat.completions.create({
                    model: process.env.OPENROUTER_API_MODEL || 'openai/gpt-oss-20b:free', // Model gratis yang cepat & bagus
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...apiMessages
                    ],
                    temperature: 0.7,
                    max_tokens: 500,
                });

                const aiResponse = completion.choices[0]?.message?.content;
                
                if (aiResponse) {
                    return NextResponse.json({ response: aiResponse });
                }

            } catch (error) {
                console.warn('OpenRouter API Error:', error);
                // Jangan return error, lanjut ke Mock sebagai fallback
            }
        } else {
            console.log('No API Key, using mock.');
        }

        // 2. Fallback ke Mock jika API gagal/tidak ada key
        const mockResponse = getMockResponse(lastUserMessage, mode);
        return NextResponse.json({ response: mockResponse });

    } catch (error) {
        console.error('API route error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}