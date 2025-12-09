import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai'; // Import library OpenAI

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
// Gunakan URL yang sama dengan project SourceNet Anda
const BASE_URL = 'https://openrouter.ai/api/v1'; 

const SYSTEM_PROMPT = `You are the RayStylus AI Assistant. Your task has two strict operating modes:

MODE 1: SCENE CONFIGURATION (Trigger: Scene change instructions)
Task: Convert user's natural language instructions into VALID JSON object.
MAIN RULES:
1. Output MUST start with TAG: [CONFIG]
2. Output MUST contain ONLY JSON, no explanatory text.
3. JSON keys MUST be one of: "resolution", "sphereColor", "bgColor1", "bgColor2", "cameraX", "cameraY", "cameraZ".
4. Color values MUST be in valid HEX string format (example: "#FF4500").
5. Camera values MUST be integers.
EXAMPLE OUTPUT: [CONFIG] {"sphereColor": "#FF0000", "cameraZ": -20}

MODE 2: NARRATIVE QUESTIONS (Trigger: General questions, non-configuration)
Task: Answer user questions in an informative, engaging, and interactive way.
MAIN RULES:
1. Output MUST start with TAG: [CHAT]
2. Provide answers in English.
3. About RayStylus questions, answer as follows: "RayStylus is the world's first 3D render studio running entirely On-Chain, powered by Arbitrum Stylus (Rust). It proves that heavy computation (Ray Tracing) can be executed in real-time with zero-lag, opening the door for future Games and Art."
4. Use Markdown, emojis, and bold formatting for best presentation.
EXAMPLE OUTPUT: [CHAT] RayStylus is the world's first On-Chain 3D render studio...`;

// Mock responses tetap dipertahankan sebagai fallback
const getMockResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    if (msg.includes('red') || msg.includes('sphere')) return '[CONFIG] {"sphereColor": "#FF0000"}';
    if (msg.includes('blue')) return '[CONFIG] {"sphereColor": "#0000FF"}';
    if (msg.includes('green')) return '[CONFIG] {"sphereColor": "#00FF00"}';
    if (msg.includes('forward') || msg.includes('closer')) return '[CONFIG] {"cameraZ": -20}';
    if (msg.includes('back') || msg.includes('further')) return '[CONFIG] {"cameraZ": 20}';
    
    return '[CHAT] I\'m RayStylus AI! You can ask me to configure the scene (e.g., "make the sphere red") or ask questions about RayStylus. 🎨';
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { messages } = body;

        // Validasi input
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ error: 'messages array is required' }, { status: 400 });
        }

        const lastUserMessage = messages[messages.length - 1].content || '';

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
                    model: 'openai/gpt-oss-20b:free', // Model gratis yang cepat & bagus
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
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
        const mockResponse = getMockResponse(lastUserMessage);
        return NextResponse.json({ response: mockResponse });

    } catch (error) {
        console.error('API route error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}