import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, CheckCircle, Zap, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResumeAnalysis from './ResumeAnalysis';

const Dashboard = ({ activeResume }) => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="space-y-8">
            <header className="space-y-2">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-bold"
                >
                    Analysis Overview
                </motion.h1>
                <p className="text-gray-400">Track your career progress and optimize your resume for success.</p>
            </header>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <StatCard icon={<BarChart2 className="text-indigo-400" />} label="ATS Score" value={activeResume?.ats_score || '0%'} />
                <StatCard icon={<CheckCircle className="text-pink-400" />} label="Skills Identified" value={activeResume?.skills?.length || 0} />
                <StatCard icon={<Zap className="text-yellow-400" />} label="Match Confidence" value="High" />
                <StatCard icon={<MessageCircle className="text-blue-400" />} label="AI Suggestions" value={activeResume?.suggestions?.length || 0} />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                <div className="glass-card p-8 lg:col-span-2">
                    <h2 className="text-2xl font-semibold mb-6">Detailed Analysis</h2>
                    {!activeResume ? (
                        <div className="text-center py-12 space-y-4">
                            <p className="text-gray-400">No resume analyzed yet.</p>
                            <Link to="/upload" className="inline-block bg-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-500 transition-all font-medium">
                                Analyze Resume Now
                            </Link>
                        </div>
                    ) : (
                        <ResumeAnalysis data={activeResume} />
                    )}
                </div>

                <div className="flex flex-col h-full gap-8">
                    <div className="glass-card p-8 flex-1 flex flex-col relative overflow-hidden group/panel">
                        {/* Premium Background Pattern */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] group-hover/panel:bg-indigo-600/20 transition-all duration-700" />

                        <div className="relative space-y-8 flex-1 flex flex-col">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-semibold">Quick Actions</h2>
                                    <Zap className="w-5 h-5 text-indigo-400 animate-pulse" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <ActionCard
                                        to="/upload"
                                        icon={<Zap className="w-5 h-5 text-indigo-400" />}
                                        title="Re-analyze"
                                        desc="Reprocess now"
                                    />
                                    <ActionCard
                                        to="/copilot"
                                        icon={<MessageCircle className="w-5 h-5 text-pink-400" />}
                                        title="AI Copilot"
                                        desc="Get advice"
                                    />
                                    <ActionCard
                                        to="/jobs"
                                        icon={<BarChart2 className="w-5 h-5 text-yellow-400" />}
                                        title="Find Jobs"
                                        desc="AI-matched"
                                    />
                                    <ActionCard
                                        to="/history"
                                        icon={<CheckCircle className="w-5 h-5 text-blue-400" />}
                                        title="History"
                                        desc="Prior versions"
                                    />
                                </div>
                            </div>

                            {/* Added Section to Fill Space: Profile Strength */}
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex-grow flex flex-col justify-center text-center space-y-4">
                                <div className="relative w-24 h-24 mx-auto">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                                        <motion.circle
                                            cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                                            strokeDasharray={251.2}
                                            initial={{ strokeDashoffset: 251.2 }}
                                            animate={{ strokeDashoffset: 251.2 - (251.2 * (parseInt(activeResume?.ats_score) || 65) / 100) }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="text-indigo-500"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-xl font-bold text-white">{activeResume?.ats_score || '65%'}</span>
                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Strength</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Optimize your profile</h4>
                                    <p className="text-xs text-gray-400 mt-1">Complete your skills to reach 90% and unlock premium matches.</p>
                                </div>
                            </div>

                            {/* Career Tip Section at bottom */}
                            <div className="pt-6 border-t border-white/5 relative z-10">
                                <div className="bg-indigo-500/10 rounded-2xl p-4 border border-indigo-500/20">
                                    <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2">
                                        <Zap className="w-3.5 h-3.5" />
                                        Pro Tip
                                    </div>
                                    <p className="text-sm text-gray-300 leading-relaxed italic">
                                        "Focus on impact: use metrics and results rather than just listing responsibilities."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <motion.div className="glass-card p-6 flex items-center gap-4">
        <div className="p-3 bg-white/5 rounded-xl">{icon}</div>
        <div>
            <p className="text-sm text-gray-400 font-medium">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </motion.div>
);

const ActionCard = ({ to, icon, title, desc }) => (
    <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
    >
        <Link
            to={to}
            className="flex flex-col h-full p-4 bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-indigo-500/30 rounded-2xl transition-all group shadow-lg hover:shadow-indigo-500/10"
        >
            <div className="p-2 w-fit bg-white/5 rounded-lg mb-3 group-hover:bg-indigo-500/20 transition-colors">
                {icon}
            </div>
            <h4 className="font-bold text-white mb-1">{title}</h4>
            <p className="text-[11px] text-gray-400 leading-tight">{desc}</p>
        </Link>
    </motion.div>
);

export default Dashboard;
