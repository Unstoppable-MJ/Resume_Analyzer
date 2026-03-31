import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import ReactMarkdown from 'react-markdown';

const ResumeAnalysis = ({ data }) => {
    if (!data) return null;

    const chartData = [
        { name: 'ATS', score: parseInt(data.ats_score) || 0, color: '#f472b6' },
        { name: 'Skills', score: data.skills?.length * 10 || 0, color: '#818cf8' },
        { name: 'Experience', score: 85, color: '#fbbf24' },
        { name: 'Education', score: 90, color: '#34d399' }
    ];

    return (
        <div className="space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 lg:p-8 flex flex-col h-full min-h-[400px] border border-white/5 shadow-2xl">
                    <h3 className="text-xl font-bold mb-6 text-white/90">Skill Breakdown</h3>
                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', color: '#fff' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                                <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={60}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 lg:p-8 flex flex-col h-full max-h-[600px] border border-white/5 shadow-2xl">
                    <h3 className="text-xl font-bold mb-6 text-white/90">AI Suggestions</h3>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                        {data.suggestions?.length > 0 ? (
                            data.suggestions.map((s, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-5 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 shadow-lg"
                                >
                                    <div className="text-gray-300 text-sm leading-relaxed">
                                        <ReactMarkdown
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                strong: ({ node, ...props }) => <strong className="font-semibold text-indigo-300" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-4 mt-2 space-y-1 text-gray-300" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-4 mt-2 space-y-1 text-gray-300" {...props} />,
                                                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                                a: ({ node, ...props }) => <a className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2" {...props} />,
                                                h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-white mt-4 mb-2" {...props} />,
                                                h2: ({ node, ...props }) => <h2 className="text-base font-bold text-white mt-3 mb-2" {...props} />,
                                                h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-white mt-2 mb-1" {...props} />,
                                            }}
                                        >
                                            {s}
                                        </ReactMarkdown>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4 animate-pulse">
                                <div className="w-12 h-12 rounded-full border-t-2 border-indigo-500 animate-spin" />
                                <p>Generating AI insights...</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <div className="glass-card p-8">
                <h3 className="text-xl font-bold mb-8 italic text-indigo-400">Extracted Key Skills</h3>
                <div className="flex flex-wrap gap-3">
                    {data.skills?.map((skill, i) => (
                        <motion.span
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            className="px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-sm text-indigo-400"
                        >
                            {skill}
                        </motion.span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResumeAnalysis;
