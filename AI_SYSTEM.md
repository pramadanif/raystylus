# RayStylus AI Assistant System

## Overview

The RayStylus AI Assistant provides a dual-mode intelligent interface for the studio:

### **MODE 1: CONFIGURATION (CONFIG)**
Converts natural language instructions into scene configuration JSON. When the AI detects configuration requests, it responds with the `[CONFIG]` tag followed by valid JSON.

**Example:**
- User: "Make the sphere red and move the camera forward"
- AI: `[CONFIG] {"sphereColor": "#FF0000", "cameraZ": -10}`

### **MODE 2: CHAT (NARRATIVE)**
Answers general questions about RayStylus and other topics interactively. Responses are formatted with Markdown for better readability.

**Example:**
- User: "What is RayStylus?"
- AI: `[CHAT] RayStylus adalah Studio Render 3D pertama...`

## Architecture

### Components

1. **API Route** (`/app/api/ai/route.ts`)
   - Proxy to OpenRouter API
   - Handles system prompt injection
   - Validates requests and responses
   - Returns AI responses to the frontend

2. **AI Chat Component** (`/app/components/AIChat.tsx`)
   - Interactive chat interface
   - Message parsing ([CONFIG] and [CHAT] tags)
   - Auto-execution of config changes
   - Simple Markdown rendering

3. **Studio Integration** (`/app/studio/page.tsx`)
   - AI chat panel in sidebar
   - Config callback handler
   - Auto-render on config changes

## Configuration Keys

The AI can only modify these configuration parameters:
- `resolution` - Image resolution (e.g., "32x32")
- `sphereColor` - Sphere surface color (HEX format)
- `bgColor1` - Sky gradient top (HEX format)
- `bgColor2` - Ground gradient bottom (HEX format)
- `cameraX` - Camera X offset (-50 to 50)
- `cameraY` - Camera Y offset (-50 to 50)
- `cameraZ` - Camera Z offset (-50 to 50)

## Setup

### Environment Variables

Add to `.env.local`:
```
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Getting an OpenRouter API Key

1. Visit https://openrouter.io
2. Sign up for an account
3. Navigate to API Keys
4. Create a new key
5. Add it to your `.env.local`

## Usage

### In the Studio

1. Open the RayStylus Studio
2. Look for the "RayStylus AI" chat panel on the left
3. Type your request:
   - **For configuration**: "Make the sphere purple with camera at Z=20"
   - **For questions**: "Tell me about RayStylus"
4. Press Enter or click the send button
5. For CONFIG responses, the scene updates automatically

### Response Tags

- `[CONFIG]` - Configuration update (auto-executed)
- `[CHAT]` - Informative answer (displayed with Markdown formatting)

## Markdown Support

The AI Chat supports basic Markdown formatting:
- **bold text** → `**text**`
- *italic text* → `*text*`
- Links → `[Link](https://example.com)`
- Line breaks → Natural newlines

## Error Handling

- Invalid JSON in CONFIG response → Error message displayed
- Network failures → Shown in chat with error styling
- API quota exceeded → Error from OpenRouter

## Future Enhancements

- Streaming responses for better UX
- Conversation history persistence
- Advanced Markdown (code blocks, tables)
- Configuration validation
- Undo/redo for AI changes
