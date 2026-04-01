import React, { useState } from 'react';
import axios from 'axios';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const CareerCopilot = ({ activeResume }) => {
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Hello! I'm your Career Copilot. How can I help you improve your resume today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        const token = localStorage.getItem('token');

        try {
            const res = await axios.post('http://localhost:8000/api/v1/chatbot/chat/', {
                query: input,
                context: activeResume?.extracted_text || ''
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setMessages(prev => [...prev, { role: 'bot', text: res.data.response }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting to my brain right now." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[700px] flex flex-col gap-6">
            <div className="flex items-center gap-2 px-2">
                <Sparkles className="text-yellow-400" />
                <h2 className="text-2xl font-bold">Career Copilot</h2>
            </div>

            <div className="flex-grow glass-card p-6 overflow-hidden flex flex-col">
                <div className="flex-grow overflow-y-auto space-y-4 pr-4">
                    <AnimatePresence>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`p-2 rounded-lg h-fit ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-white/10'}`}>
                                        {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                                    </div>
                                    <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600/40 border border-indigo-500/30' : 'bg-white/5 border border-white/10'}`}>
                                        {msg.role === 'user' ? (
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                        ) : (
                                            <div className="text-sm leading-relaxed">
                                                <ReactMarkdown
                                                    components={{
                                                        ul: ({ node, ...props }) => <ul className="list-disc ml-4 mt-2 mb-4 space-y-2" {...props} />,
                                                        ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mt-2 mb-4 space-y-2" {...props} />,
                                                        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                                        p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                                                        strong: ({ node, ...props }) => <strong className="font-semibold text-indigo-300" {...props} />
                                                    }}
                                                >
                                                    {msg.text}
                                                </ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {loading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex gap-2">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-6 flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about your resume, skills, or job search..."
                        className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="bg-indigo-600 p-3 rounded-xl hover:bg-indigo-500 transition-all disabled:opacity-50"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CareerCopilot;
