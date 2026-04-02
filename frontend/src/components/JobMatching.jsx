import React, { useState } from 'react';
import api from '../utils/api';
import { Target, Search, CheckCircle, AlertTriangle, Briefcase, Zap, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const JobMatching = ({ activeResume }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFindJobs = async () => {
        if (!activeResume?.extracted_text) return;
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        try {
            const res = await api.post('ai-jobs/match/', {
                resume_text: activeResume.extracted_text
            });
            setJobs(res.data.recommended_jobs || []);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch AI job recommendations. Ensure the backend is running and OPENAI_API_KEY is valid.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <Target className="text-indigo-400" size={32} />
                    <div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
                            AI Career Matchmaker
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">Discover roles perfectly suited to your actual skill set.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Resume Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card p-6 border-t-4 border-indigo-500 sticky top-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Briefcase className="text-indigo-400" />
                            <h3 className="text-xl font-semibold">Your Profile</h3>
                        </div>

                        {!activeResume ? (
                            <div className="text-center p-6 text-gray-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                                <p>Please upload a resume first to see your profile summary.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm text-gray-400 uppercase tracking-wider mb-3">Extracted Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {activeResume.skills?.slice(0, 15).map((skill, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-md text-xs border border-indigo-500/20">
                                                {skill}
                                            </span>
                                        ))}
                                        {(!activeResume.skills || activeResume.skills.length === 0) && (
                                            <span className="text-xs text-gray-500">No specific skills detected.</span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={handleFindJobs}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 relative overflow-hidden group"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <Zap className="animate-pulse" size={20} /> Analyzing...
                                        </div>
                                    ) : (
                                        <>
                                            <span className="relative z-10 flex items-center gap-2"><Target size={20} /> Find AI Jobs</span>
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                        </>
                                    )}
                                </button>

                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-2 text-sm text-red-400">
                                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                        <p>{error}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: AI Job Recommendations */}
                <div className="lg:col-span-2 space-y-6">
                    {jobs.length === 0 && !loading && (
                        <div className="glass-card p-12 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-gray-600">
                            <div className="p-6 bg-white/5 rounded-full">
                                <Search size={48} className="text-gray-500" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-300">Ready to find your match?</h3>
                            <p className="text-gray-500 max-w-sm">
                                Click the "Find AI Jobs" button to run our ML matching engine against real-world tech roles.
                            </p>
                        </div>
                    )}

                    <AnimatePresence>
                        {jobs.map((job, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.15 }}
                                className="glass-card overflow-hidden hover:border-indigo-500/30 transition-colors"
                            >
                                <div className="p-6 sm:p-8 space-y-6">
                                    {/* Header: Title & Score */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-1">{job.title}</h3>
                                            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                                                {job.domain}
                                            </span>
                                        </div>

                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-3">
                                                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                                                    {job.match_percentage}%
                                                </div>
                                                <div className="w-12 h-12 relative">
                                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                                        <path className="text-white/10" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                        <path className="text-emerald-400 transition-all duration-1000 ease-out" strokeDasharray={`${job.match_percentage}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500 uppercase mt-1">Match Score</span>
                                        </div>
                                    </div>

                                    {/* AI Insight */}
                                    <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-5">
                                        <div className="flex items-start gap-3">
                                            <Zap className="text-indigo-400 shrink-0 mt-0.5" size={18} />
                                            <div>
                                                <h4 className="text-sm font-semibold text-indigo-300 mb-1">AI Match Insight</h4>
                                                <p className="text-sm text-gray-300 leading-relaxed">{job.reason}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skills Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Matched Skills */}
                                        <div className="space-y-3">
                                            <h4 className="flex items-center gap-2 text-sm font-medium text-green-400">
                                                <CheckCircle size={16} /> Skills You Have
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {job.matched_skills?.map((skill, i) => (
                                                    <span key={i} className="px-2.5 py-1 bg-green-500/10 text-green-300/90 rounded border border-green-500/20 text-xs">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {(!job.matched_skills || job.matched_skills.length === 0) && (
                                                    <span className="text-xs text-gray-500 italic">None specifically matched</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Missing Skills */}
                                        <div className="space-y-3">
                                            <h4 className="flex items-center gap-2 text-sm font-medium text-amber-400">
                                                <AlertTriangle size={16} /> Skills Needed
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {job.missing_skills?.map((skill, i) => (
                                                    <span key={i} className="px-2.5 py-1 bg-amber-500/10 text-amber-300/90 rounded border border-amber-500/20 text-xs shadow-sm">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {(!job.missing_skills || job.missing_skills.length === 0) && (
                                                    <span className="text-xs text-emerald-500 italic flex items-center gap-1">
                                                        <CheckCircle size={12} /> You have all required skills!
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default JobMatching;
