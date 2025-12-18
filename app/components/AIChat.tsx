'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Loader2, AlertCircle, Bot, User, Zap } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'ai'; 
    type: 'config' | 'chat' | 'error';
    content: string;
    timestamp: Date;
}

const MarkdownRenderer = ({ content }: { content: string }) => {
    const renderMarkdown = (text: string) => {
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
        text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-emerald-400 hover:underline">$1</a>');
        text = text.replace(/\n/g, '<br/>');
        
        return (
            <div 
                dangerouslySetInnerHTML={{ __html: text }}
                className="space-y-1 [&_strong]:font-bold [&_em]:italic"
            />
        );
    };

    return renderMarkdown(content);
};

export const AIChat = ({ 
    onConfigReceived,
    mode = 'studio'
}: { 
    onConfigReceived?: (config: any) => void;
    mode?: 'studio' | 'aesthetic';
}) => {
    const validKeysMap = {
        studio: ['sphereColor', 'bgColor1', 'bgColor2', 'cameraX', 'cameraY', 'cameraZ'],
        aesthetic: ['warmth', 'intensity', 'depth']
    };
    const validKeys = validKeysMap[mode as keyof typeof validKeysMap] || validKeysMap.studio;
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const parseAIResponse = (response: string) => {
        const cleanText = response.trim();
        if (cleanText.startsWith('[CONFIG]')) {
            let jsonContent = cleanText.replace('[CONFIG]', '').trim();
            const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonContent = jsonMatch[0];
            }
            return { type: 'config' as const, content: jsonContent };
        } else if (cleanText.startsWith('[CHAT]')) {
            return { type: 'chat' as const, content: cleanText.replace('[CHAT]', '').trim() };
        }
        return { type: 'chat' as const, content: cleanText };
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setError(null);
        const userContent = input;
        setInput('');

        const userMsg: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            type: 'chat',
            content: userContent,
            timestamp: new Date(),
        };

        const updatedHistory = [...messages, userMsg];
        setMessages(updatedHistory);
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    messages: updatedHistory.map(m => ({
                        role: m.role,
                        content: m.content
                    })),
                    mode: mode
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get response from AI');
            }

            const data = await response.json();
            const aiResponse = data.response;
            const parsed = parseAIResponse(aiResponse);

            const aiMsg: Message = {
                id: `ai-${Date.now()}`,
                role: 'ai',
                type: parsed.type,
                content: parsed.content,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMsg]);

            if (parsed.type === 'config') {
                try {
                    let config;
                    try {
                        config = JSON.parse(parsed.content);
                    } catch (e) {
                        const jsonMatch = parsed.content.match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                            config = JSON.parse(jsonMatch[0]);
                        } else {
                            throw e;
                        }
                    }
                    
                    const filteredConfig: any = {};
                    for (const key of validKeys) {
                        if (key in config) {
                            filteredConfig[key] = config[key];
                        }
                    }
                    
                    if (Object.keys(filteredConfig).length === 0) {
                        const invalidKeys = Object.keys(config);
                        setError(`Invalid config keys for ${mode} mode. Expected: ${validKeys.join(', ')}. Got: ${invalidKeys.join(', ')}`);
                        console.error('Invalid config keys:', { mode, expected: validKeys, received: invalidKeys });
                        return;
                    }
                    
                    if (onConfigReceived) {
                        onConfigReceived(filteredConfig);
                    }
                } catch (parseError) {
                    setError(`Failed to parse configuration: ${parseError instanceof Error ? parseError.message : 'Invalid JSON'}`);
                    console.error('Config parse error:', parseError, 'Content:', parsed.content);
                }
            }
        } catch (err) {
            const errorMsg: Message = {
                id: `error-${Date.now()}`,
                role: 'ai',
                type: 'error',
                content: err instanceof Error ? err.message : 'An error occurred',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMsg]);
            console.error('Chat error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#050605]/95 border border-ray-light/10 rounded-lg overflow-hidden font-sans flex-1">
            {/* HEADER - Lebih Menonjol */}
            <div className="p-4 border-b-2 border-ray-light/30 bg-gradient-to-r from-ray-mid/40 via-black/60 to-ray-mid/20 flex items-center justify-between shadow-lg shadow-ray-mid/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-ray-mid/30 border border-ray-light/40">
                        <Zap size={18} className="text-ray-light animate-pulse" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <h3 className="text-sm font-bold text-ray-cream tracking-wide">RayStylus AI</h3>
                        <p className="text-[10px] text-ray-light/70 font-medium">Creative Assistant</p>
                    </div>
                </div>
                <button 
                    onClick={() => setMessages([])} 
                    className="text-[10px] font-semibold text-ray-light/70 hover:text-ray-cream hover:bg-ray-mid/20 px-3 py-1.5 rounded-lg transition-all border border-ray-light/20 hover:border-ray-light/40"
                >
                    Clear Chat
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                        <Bot size={32} className="mx-auto text-ray-light/40 mb-3" />
                        <p className="text-xs text-ray-light/50">Ask me to change colors, move camera,<br/>or explain RayStylus.</p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg) => (
                            <div 
                                key={msg.id} 
                                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={
                                        'max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ' +
                                        (msg.role === 'user'
                                            ? 'bg-ray-mid text-white rounded-tr-none'
                                            : msg.type === 'error'
                                                ? 'bg-red-500/10 border border-red-500/20 text-red-200 rounded-tl-none'
                                                : msg.type === 'config'
                                                    ? 'bg-black/60 border border-ray-light/30 text-ray-light font-mono rounded-tl-none'
                                                    : 'bg-black/40 text-ray-cream border border-ray-light/10 rounded-tl-none')
                                    }
                                >
                                    {msg.type === 'chat' ? (
                                        <MarkdownRenderer content={msg.content} />
                                    ) : msg.type === 'config' ? (
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] uppercase tracking-wider opacity-60 font-bold flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
                                                Applying Config
                                            </span>
                                            <pre className="whitespace-pre-wrap break-all opacity-90">{msg.content}</pre>
                                        </div>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-black/40 rounded-2xl rounded-tl-none px-4 py-3 border border-ray-light/10">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-ray-light rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-ray-light rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-ray-light rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Form */}
            <div onSubmit={handleSendMessage} className="p-3 border-t border-ray-light/10 bg-black/20 space-y-2">
                {error && (
                    <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20 animate-in fade-in slide-in-from-bottom-2">
                        <AlertCircle size={12} />
                        {error}
                    </div>
                )}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e as any);
                            }
                        }}
                        placeholder="Type a message..."
                        disabled={isLoading}
                        className="flex-1 bg-black/40 border border-ray-light/10 rounded-xl px-4 py-2.5 text-xs text-ray-cream placeholder-ray-light/40 outline-none focus:border-ray-light/30 focus:bg-black/60 transition-all disabled:opacity-50"
                    />
                    <button
                        onClick={(e) => handleSendMessage(e as any)}
                        disabled={isLoading || !input.trim()}
                        className="p-2.5 rounded-xl bg-ray-mid hover:bg-ray-light text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(98,129,65,0.4)]"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
};