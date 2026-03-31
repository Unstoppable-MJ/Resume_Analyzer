import React, { useState } from 'react';
import axios from 'axios';
import { Target, Search, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const JobMatching = ({ activeResume }) => {
    const [jd, setJd] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleMatch = async () => {
        if (!jd.trim()) return;
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const res = await axios.post('http://localhost:8000/api/v1/recommender/match/', {
                resume_text: activeResume?.extracted_text || '',
                job_description: jd
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setResult(res.data);
        } catch (err) {
            console.error(err);
            alert('Match calculation failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-2 px-2">
                <Target className="text-pink-500" />
                <h2 className="text-2xl font-bold">Job Role Matching</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-8 space-y-6">
                    <h3 className="text-xl font-semibold">Job Description</h3>
                    <textarea
                        value={jd}
                        onChange={(e) => setJd(e.target.value)}
                        placeholder="Paste the job description here..."
                        className="w-full h-80 bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-sm resize-none"
                    />
                    <button
                        onClick={handleMatch}
                        disabled={loading || !activeResume}
                        className="w-full bg-pink-600 py-3 rounded-xl font-bold hover:bg-pink-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Analyzing...' : <><Search size={18} /> Match Resume</>}
                    </button>
                    {!activeResume && <p className="text-xs text-yellow-400 text-center">Please upload a resume first.</p>}
                </div>

                <div className="glass-card p-8 flex flex-col items-center justify-center space-y-6">
                    {!result ? (
                        <div className="text-center opacity-50 space-y-4">
                            <div className="p-6 bg-white/5 rounded-full inline-block">
                                <Target size={64} />
                            </div>
                            <p>Results will appear here after analysis.</p>
                        </div>
                    ) : (
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-8">
                            <div className="relative inline-block">
                                <svg className="w-48 h-48">
                                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                                    <circle
                                        cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent"
                                        strokeDasharray={552.92}
                                        strokeDashoffset={552.92 - (552.92 * result.match_score) / 100}
                                        className="text-pink-500 transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-bold">{result.match_score}%</span>
                                    <span className="text-sm text-gray-400 uppercase tracking-widest tracking-tighter">Match</span>
                                </div>
                            </div>

                            <div className="space-y-4 text-left w-full">
                                <h4 className="font-semibold text-lg flex items-center gap-2">
                                    <CheckCircle size={18} className="text-green-400" /> Key Matches
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {result.common_keywords?.map((word, i) => (
                                        <span key={i} className="px-3 py-1 bg-white/5 rounded-md text-xs border border-white/5">{word}</span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobMatching;
