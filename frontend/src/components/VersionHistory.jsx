import React from 'react';
import { Clock, Download, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const VersionHistory = () => {
    const history = [
        { id: 1, date: '2026-03-31', name: 'Resume_V2_Final.pdf', score: 88 },
        { id: 2, date: '2026-03-30', name: 'Resume_V1_Draft.pdf', score: 72 }
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-2 px-2">
                <Clock className="text-indigo-400" />
                <h2 className="text-2xl font-bold">Resume History</h2>
            </div>

            <div className="space-y-4">
                {history.map((item, idx) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-6 flex items-center justify-between group cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-xl group-hover:bg-indigo-600/20 transition-colors">
                                <Clock className="text-gray-400 group-hover:text-indigo-400" />
                            </div>
                            <div>
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-sm font-bold text-indigo-400">{item.score}%</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">ATS Score</p>
                            </div>
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                                <Download size={18} className="text-gray-400" />
                            </button>
                            <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default VersionHistory;
