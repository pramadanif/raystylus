import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.io/api/v1/chat/completions';

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
EXAMPLE OUTPUT: [CHAT] RayStylus is the world's first On-Chain 3D render studio... [Continue with your interactive answer]`;

// Mock responses for testing without valid API key
const getMockResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    // Configuration requests
    if (msg.includes('red') || msg.includes('sphere')) {
        return '[CONFIG] {"sphereColor": "#FF0000"}';
    }
    if (msg.includes('blue')) {
        return '[CONFIG] {"sphereColor": "#0000FF"}';
    }
    if (msg.includes('green')) {
        return '[CONFIG] {"sphereColor": "#00FF00"}';
    }
    if (msg.includes('purple')) {
        return '[CONFIG] {"sphereColor": "#9370DB"}';
    }
    if (msg.includes('yellow')) {
        return '[CONFIG] {"sphereColor": "#FFFF00"}';
    }
    if (msg.includes('camera') && msg.includes('z')) {
        const match = userMessage.match(/-?\d+/);
        if (match) {
            return `[CONFIG] {"cameraZ": ${match[0]}}`;
        }
    }
    if (msg.includes('forward') || msg.includes('closer')) {
        return '[CONFIG] {"cameraZ": -20}';
    }
    if (msg.includes('back') || msg.includes('further')) {
        return '[CONFIG] {"cameraZ": 20}';
    }
    
    // Chat responses
    if (msg.includes('what') || msg.includes('tell') || msg.includes('explain')) {
        return '[CHAT] **RayStylus** is the world\'s first 3D render studio running entirely On-Chain, powered by **Arbitrum Stylus (Rust)**. It proves that heavy computation (Ray Tracing) can be executed in real-time with zero-lag, opening the door for future Games and Art. 🚀';
    }
    if (msg.includes('how') || msg.includes('work')) {
        return '[CHAT] RayStylus leverages **Arbitrum Stylus** to execute complex ray tracing calculations directly on the blockchain. Each render is a transaction, making your 3D creations truly decentralized! ✨';
    }
    
    // Default response
    return '[CHAT] I\'m RayStylus AI! You can ask me to configure the scene (e.g., "make the sphere red") or ask questions about RayStylus. 🎨';
};

export async function POST(request: NextRequest) {
    try {
        let body;
        try {
            body = await request.json();
        } catch (e) {
            console.error('Failed to parse request body:', e);
            return NextResponse.json(
                { error: 'Invalid JSON in request body' },
                { status: 400 }
            );
        }

        const { userMessage } = body;

        if (!userMessage) {
            return NextResponse.json(
                { error: 'userMessage is required' },
                { status: 400 }
            );
        }

        // If API key is available, try to use OpenRouter
        if (OPENROUTER_API_KEY) {
            try {
                const response = await fetch(OPENROUTER_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                        'HTTP-Referer': 'http://localhost:3000',
                        'X-Title': 'RayStylus',
                    },
                    body: JSON.stringify({
                        model: 'openai/gpt-oss-120b:free',
                        messages: [
                            {
                                role: 'system',
                                content: SYSTEM_PROMPT,
                            },
                            {
                                role: 'user',
                                content: userMessage,
                            },
                        ],
                        temperature: 0.7,
                        max_tokens: 500,
                    }),
                });

                const responseText = await response.text();
                
                if (response.ok && responseText) {
                    const data = JSON.parse(responseText);
                    const aiResponse = data.choices?.[0]?.message?.content || '';
                    if (aiResponse) {
                        console.log('Using OpenRouter API response');
                        return NextResponse.json({ response: aiResponse });
                    }
                } else {
                    console.warn('OpenRouter API unavailable, falling back to mock responses');
                    console.warn('Status:', response.status, 'Response:', responseText.substring(0, 100));
                }
            } catch (error) {
                console.warn('OpenRouter API error, falling back to mock responses:', error);
            }
        } else {
            console.log('No API key configured, using mock responses');
        }

        // Fallback to mock response
        const mockResponse = getMockResponse(userMessage);
        return NextResponse.json({ response: mockResponse });
    } catch (error) {
        console.error('API route error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
