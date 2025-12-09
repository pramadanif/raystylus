'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Loader2, AlertCircle, Bot, User } from 'lucide-react';

// 1. UPDATE INTERFACE: Tambahkan 'role' untuk membedakan User vs AI
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
    onConfigReceived 
}: { 
    onConfigReceived?: (config: any) => void 
}) => {
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

    // 2. LOGIC: Parsing response yang lebih aman (menggunakan replace bukan slice)
    const parseAIResponse = (response: string) => {
        const cleanText = response.trim();
        if (cleanText.startsWith('[CONFIG]')) {
            // Hapus tag dan bersihkan whitespace
            return { type: 'config' as const, content: cleanText.replace('[CONFIG]', '').trim() };
        } else if (cleanText.startsWith('[CHAT]')) {
            return { type: 'chat' as const, content: cleanText.replace('[CHAT]', '').trim() };
        }
        // Fallback jika tidak ada tag
        return { type: 'chat' as const, content: cleanText };
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setError(null);
        const userContent = input;
        setInput(''); // Reset input segera

        // Buat object pesan User
        const userMsg: Message = {
            id: `user-${Date.now()}`,
            role: 'user', // Set Role User
            type: 'chat',
            content: userContent,
            timestamp: new Date(),
        };

        // 3. LOGIC: Update state lokal & Siapkan payload history
        const updatedHistory = [...messages, userMsg];
        setMessages(updatedHistory);
        setIsLoading(true);

        try {
            // 4. API CALL: Mengirim array 'messages' (bukan cuma 'userMessage')
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    messages: updatedHistory.map(m => ({
                        role: m.role,
                        content: m.content
                    })) 
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get response from AI');
            }

            const data = await response.json();
            const aiResponse = data.response;
            const parsed = parseAIResponse(aiResponse);

            // Buat object pesan AI
            const aiMsg: Message = {
                id: `ai-${Date.now()}`,
                role: 'ai', // Set Role AI
                type: parsed.type,
                content: parsed.content,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMsg]);

            // Eksekusi Config jika ada
            if (parsed.type === 'config') {
                try {
                    // Bersihkan JSON dari potensi markdown code block (```json ... ```)
                    const cleanJson = parsed.content.replace(/```json/g, '').replace(/```/g, '');
                    const config = JSON.parse(cleanJson);
                    
                    if (onConfigReceived) {
                        onConfigReceived(config);
                    }
                } catch (parseError) {
                    setError('Failed to parse configuration JSON');
                    console.error('Config parse error:', parseError);
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
        <div className="flex flex-col h-full bg-[#0a0c0a]/95 border border-white/5 rounded-lg overflow-hidden font-sans">
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-black/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-emerald-500" />
                    <h3 className="text-sm font-semibold text-gray-200">RayStylus AI</h3>
                </div>
                <button 
                    onClick={() => setMessages([])} 
                    className="text-[10px] text-zinc-500 hover:text-red-400 transition-colors"
                >
                    Clear Chat
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                        <Bot size={32} className="mx-auto text-zinc-600 mb-3" />
                        <p className="text-xs text-zinc-500">Ask me to change colors, move camera,<br/>or explain RayStylus.</p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg) => (
                            // 5. UI: Alignment berdasarkan Role (User=Kanan, AI=Kiri)
                            <div 
                                key={msg.id} 
                                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`
                                    max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm
                                    ${msg.role === 'user' 
                                        ? 'bg-emerald-600 text-white rounded-tr-none' // Style User
                                        : msg.type === 'error'
                                            ? 'bg-red-500/10 border border-red-500/20 text-red-200 rounded-tl-none'
                                            : msg.type === 'config'
                                                ? 'bg-zinc-800 border border-emerald-500/30 text-emerald-300 font-mono rounded-tl-none'
                                                : 'bg-zinc-800 text-gray-200 rounded-tl-none' // Style AI
                                    }
                                `}>
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
                        
                        {/* Loading Typing Indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-zinc-800 rounded-2xl rounded-tl-none px-4 py-3 border border-white/5">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/5 bg-black/20 space-y-2">
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
                        placeholder="Type a message..."
                        disabled={isLoading}
                        className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-gray-200 placeholder-zinc-600 outline-none focus:border-emerald-500/40 focus:bg-zinc-900 transition-all disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                </div>
            </form>
        </div>
    );
};