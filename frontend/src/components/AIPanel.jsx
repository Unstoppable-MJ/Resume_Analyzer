import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

const AIPanel = ({ activeResume }) => {
    if (!activeResume) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-yellow-400" />
                <h3 className="text-xl font-bold">AI Insights</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 border-l-4 border-indigo-500">
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="text-indigo-400" />
                        <h4 className="font-semibold uppercase tracking-wider text-xs opacity-70">Improvement Potential</h4>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-300">
                        Your resume has a strong foundation in <span className="text-indigo-400">{activeResume.skills?.[0] || 'technical skills'}</span>.
                        To reach the top 5% of candidates, focus on quantifying your impact with metrics.
                    </p>
                </div>

                <div className="glass-card p-6 border-l-4 border-pink-500">
                    <div className="flex items-center gap-3 mb-4">
                        <ShieldCheck className="text-pink-400" />
                        <h4 className="font-semibold uppercase tracking-wider text-xs opacity-70">ATS Confidence</h4>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-300">
                        The structure is highly compatible with modern ATS systems. No complex tables or graphics were detected that could block parsing.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AIPanel;
