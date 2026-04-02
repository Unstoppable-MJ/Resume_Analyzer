import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Building, Target, Loader2, ExternalLink } from 'lucide-react';
import api from '../utils/api';

const AICareerMatchJobs = ({ skills = [], resumeText = '' }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [filter, setFilter] = useState('All'); // Location filter simple implementation

    const handleSearch = async () => {
        setLoading(true);
        setError('');
        setHasSearched(true);

        try {
            // Provide skills as fake resume_text if real text isn't passed down
            const fallbackText = resumeText.length > 50 ? resumeText : skills.join(' ');

            const response = await api.post(
                'ai-jobs/live/',
                { resume_text: fallbackText, skills: skills }
            );

            setJobs(response.data.jobs || []);
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
            setError(err.response?.data?.error || 'Failed to find jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = filter === 'All'
        ? jobs
        : filter === 'Remote'
            ? jobs.filter(j => j.location.toLowerCase().includes('remote'))
            : jobs.filter(j => !j.location.toLowerCase().includes('remote'));

    return (
        <div className="mt-8 space-y-6">
            {!hasSearched ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-10 flex flex-col items-center justify-center text-center space-y-6"
                >
                    <div className="bg-indigo-500/10 p-4 rounded-full">
                        <Briefcase className="w-10 h-10 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Live AI Job Matcher</h3>
                        <p className="text-gray-400 max-w-lg mx-auto">
                            We've analyzed your skills and profile. Click below to fetch real-time tech jobs matched and ranked using our AI engine just for you.
                        </p>
                    </div>
                    <button
                        onClick={handleSearch}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2"
                    >
                        <Target className="w-5 h-5" />
                        Find Live AI Jobs
                    </button>
                </motion.div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Target className="text-indigo-400 w-7 h-7" />
                            Live AI Job Matches
                        </h3>
                        {jobs.length > 0 && !loading && (
                            <div className="flex gap-2">
                                {['All', 'Remote', 'On-site'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <div className="glass-card p-12 flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                            <p className="text-gray-400 animate-pulse">Scanning external APIs & ranking jobs via AI...</p>
                        </div>
                    ) : error ? (
                        <div className="glass-card p-8 border border-red-500/20 text-center space-y-4">
                            <p className="text-red-400">{error}</p>
                            <button onClick={handleSearch} className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-sm">
                                Try Again
                            </button>
                        </div>
                    ) : filteredJobs.length === 0 ? (
                        <div className="glass-card p-10 text-center space-y-4">
                            <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Briefcase className="w-8 h-8 text-gray-500" />
                            </div>
                            <h4 className="text-lg font-bold text-white">No Jobs Found</h4>
                            <p className="text-gray-400 max-w-sm mx-auto">We couldn't find active listings matching your exact profile right now. Try updating your skills or check back later.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
                            <AnimatePresence>
                                {filteredJobs.map((job, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="relative group bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm border border-white/5 hover:border-indigo-500/30 rounded-2xl p-6 transition-all duration-300"
                                    >
                                        <div className="flex flex-col lg:flex-row justify-between gap-6">
                                            {/* Job Info */}
                                            <div className="space-y-4 lg:w-2/3">
                                                <div>
                                                    <h4 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                                                        {job.title}
                                                    </h4>
                                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-400">
                                                        <div className="flex items-center gap-1.5 list-none">
                                                            <Building className="w-4 h-4 text-indigo-400/70" />
                                                            {job.company}
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin className="w-4 h-4 text-pink-400/70" />
                                                            {job.location}
                                                        </div>
                                                        <div className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs">
                                                            Via {job.source}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* AI Match & Apply action */}
                                            <div className="flex flex-col lg:items-end justify-between gap-5 lg:w-1/3">
                                                <div className="w-full lg:w-48 bg-gray-900/50 rounded-xl p-3 border border-white/5 flex flex-col items-center">
                                                    <div className="flex justify-between w-full text-xs mb-1.5 font-medium">
                                                        <span className="text-gray-400">AI Match Score</span>
                                                        <span className={job.match_percentage >= 80 ? 'text-green-400' : job.match_percentage >= 60 ? 'text-yellow-400' : 'text-gray-400'}>
                                                            {job.match_percentage}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-white/10 rounded-full h-1.5">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${job.match_percentage}%` }}
                                                            transition={{ duration: 1, delay: 0.2 }}
                                                            className={`h-1.5 rounded-full ${job.match_percentage >= 80 ? 'bg-green-400'
                                                                : job.match_percentage >= 60 ? 'bg-yellow-400'
                                                                    : 'bg-gray-400'
                                                                }`}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="w-full space-y-3">
                                                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-indigo-400/80 mb-1 lg:justify-end">
                                                        <div className="h-px bg-indigo-500/30 flex-grow lg:flex-grow-0 lg:w-8" />
                                                        More opportunities
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row lg:flex-row gap-3 lg:justify-end">
                                                        {job.apply_link && (
                                                            <motion.a
                                                                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(79, 70, 229, 0.4)" }}
                                                                whileTap={{ scale: 0.98 }}
                                                                href={job.apply_link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                title="Apply directly to this job"
                                                                className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 transition-all border border-indigo-400/20"
                                                            >
                                                                Apply Now
                                                                <ExternalLink className="w-4 h-4" />
                                                            </motion.a>
                                                        )}

                                                        <motion.a
                                                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                                                            whileTap={{ scale: 0.98 }}
                                                            href={`https://www.naukri.com/${job.title.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-')}-jobs`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="Explore more similar jobs on Naukri.com"
                                                            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:border-white/20 rounded-xl font-medium transition-all"
                                                        >
                                                            Find More Jobs
                                                            <Briefcase className="w-4 h-4 text-pink-400/70" />
                                                        </motion.a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AICareerMatchJobs;
