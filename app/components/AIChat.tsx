'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Loader2, AlertCircle } from 'lucide-react';

interface Message {
    id: string;
    type: 'config' | 'chat' | 'error';
    content: string;
    timestamp: Date;
}

const MarkdownRenderer = ({ content }: { content: string }) => {
    const renderMarkdown = (text: string) => {
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
        text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        text = text.replace(/\n/g, '<br/>');
        
        return (
            <div 
                dangerouslySetInnerHTML={{ __html: text }}
                className="space-y-1 [&_strong]:font-semibold [&_em]:italic [&_a]:underline [&_a]:text-ray-light [&_a]:hover:text-ray-mid"
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

    const parseAIResponse = (response: string) => {
        if (response.startsWith('[CONFIG]')) {
            return { type: 'config' as const, content: response.slice(8).trim() };
        } else if (response.startsWith('[CHAT]')) {
            return { type: 'chat' as const, content: response.slice(6).trim() };
        }
        return { type: 'chat' as const, content: response };
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setError(null);
        const userMessage = input;
        setInput('');

        const userMsg: Message = {
            id: `user-${Date.now()}`,
            type: 'chat',
            content: userMessage,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMsg]);

        setIsLoading(true);

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userMessage }),
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
                type: parsed.type,
                content: parsed.content,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMsg]);

            if (parsed.type === 'config') {
                try {
                    const config = JSON.parse(parsed.content);
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
                type: 'error',
                content: err instanceof Error ? err.message : 'An error occurred',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMsg]);
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Chat error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0c0a]/95 border border-white/5 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-black/40 flex items-center gap-2">
                <MessageSquare size={16} className="text-ray-mid" />
                <h3 className="text-sm font-semibold text-gray-200">RayStylus AI</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <MessageSquare size={32} className="mx-auto text-gray-600 mb-3 opacity-50" />
                            <p className="text-xs text-gray-500">Start chatting or ask to configure the scene</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.type === 'chat' && messages[messages.indexOf(msg) - 1]?.type !== 'error' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-lg p-3 text-xs leading-relaxed ${
                                    msg.type === 'error'
                                        ? 'bg-red-500/20 border border-red-500/30 text-red-200'
                                        : msg.type === 'config'
                                        ? 'bg-green-500/20 border border-green-500/30 text-green-200 font-mono'
                                        : 'bg-blue-500/20 border border-blue-500/30 text-blue-100'
                                }`}>
                                    {msg.type === 'chat' ? (
                                        <MarkdownRenderer content={msg.content} />
                                    ) : msg.type === 'config' ? (
                                        <pre className="overflow-x-auto whitespace-pre-wrap break-words">{msg.content}</pre>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-700/30 border border-gray-600/30 rounded-lg p-3 flex items-center gap-2">
                                    <Loader2 size={14} className="animate-spin text-ray-mid" />
                                    <span className="text-xs text-gray-400">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/5 bg-black/20 space-y-2">
                {error && (
                    <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
                        <AlertCircle size={12} />
                        {error}
                    </div>
                )}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask to render or configure..."
                        disabled={isLoading}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-200 placeholder-gray-500 outline-none focus:border-ray-mid/50 transition-colors disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-2 rounded-lg bg-ray-mid/20 border border-ray-mid/50 text-ray-light hover:bg-ray-mid hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={14} />
                    </button>
                </div>
            </form>
        </div>
    );
};
