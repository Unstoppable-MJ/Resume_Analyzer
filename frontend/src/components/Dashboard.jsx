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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="glass-card p-8 space-y-6 lg:col-span-2">
                    <h2 className="text-2xl font-semibold">Detailed Analysis</h2>
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

                <div className="glass-card p-8 space-y-6">
                    <h2 className="text-2xl font-semibold">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <ActionBtn to="/upload" label="Re-analyze" />
                        <ActionBtn to="/copilot" label="Talk to Copilot" />
                        <ActionBtn to="/jobs" label="Find Jobs" />
                        <ActionBtn to="/history" label="Version History" />
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

const ActionBtn = ({ to, label }) => (
    <Link to={to} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all text-center">
        {label}
    </Link>
);

export default Dashboard;
