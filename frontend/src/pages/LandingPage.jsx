import React from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Search,
    TrendingUp,
    Lightbulb,
    Briefcase,
    MessageSquare,
    ArrowRight,
    CheckCircle2,
    Users,
    Zap,
    Target,
    BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        initial: {},
        whileInView: { transition: { staggerChildren: 0.1 } },
        viewport: { once: true }
    };

    return (
        <div className="space-y-24 pb-20">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden -mt-8">
                {/* Animated Background Gradients */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] -z-10 animate-pulse delay-700" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl space-y-8"
                >
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium animate-bounce">
                        🚀 New: AI Job Matchmaker Integrated
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-500">
                        AI Resume Analyzer & <br />
                        <span className="text-indigo-400">Career Copilot</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Analyze your resume, improve your ATS score, and get personalized AI-powered job recommendations in seconds.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1"
                        >
                            Upload Resume Now <ArrowRight size={20} />
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold transition-all"
                        >
                            Get Started
                        </Link>
                    </div>
                </motion.div>

                {/* Floating Elements Mockup */}
                <div className="absolute top-20 right-10 hidden lg:block opacity-20 pointer-events-none">
                    <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="bg-indigo-500 w-12 h-12 rounded-2xl rotate-12" />
                </div>
                <div className="absolute bottom-20 left-10 hidden lg:block opacity-20 pointer-events-none">
                    <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="bg-pink-500 w-16 h-16 rounded-full" />
                </div>
            </section>

            {/* Stats Section */}
            <section className="container mx-auto px-4">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    <StatBox number="10,000+" label="Resumes Analyzed" icon={<FileText className="text-indigo-400" />} />
                    <StatBox number="85%" label="Career Improvement" icon={<TrendingUp className="text-pink-400" />} />
                    <StatBox number="5,000+" label="Jobs Matched" icon={<Zap className="text-yellow-400" />} />
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 space-y-16">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold">Powerful Features for Your Career</h2>
                    <p className="text-gray-400">Everything you need to land your dream job in the AI era.</p>
                </div>

                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <FeatureCard
                        icon={<Search />}
                        title="Resume Analysis"
                        desc="Deep dive into your resume content with advanced NLP to find strengths and weaknesses."
                        color="bg-blue-500"
                    />
                    <FeatureCard
                        icon={<Zap />}
                        title="Skill Extraction"
                        desc="Automatically identify and categorize technical and soft skills using AI."
                        color="bg-indigo-500"
                    />
                    <FeatureCard
                        icon={<BarChart3 />}
                        title="ATS Score Checker"
                        desc="See how well your resume ranks against Applicant Tracking Systems."
                        color="bg-pink-500"
                    />
                    <FeatureCard
                        icon={<Lightbulb />}
                        title="AI Suggestions"
                        desc="Receive tailored advice on how to improve your resume wording and structure."
                        color="bg-yellow-500"
                    />
                    <FeatureCard
                        icon={<Briefcase />}
                        title="Job Matching Engine"
                        desc="Get real-time job listings ranked by how well they match your unique profile."
                        color="bg-green-500"
                    />
                    <FeatureCard
                        icon={<MessageSquare />}
                        title="Career Chatbot"
                        desc="Your 24/7 AI career assistant for interview prep and career guidance."
                        color="bg-purple-500"
                    />
                </motion.div>
            </section>

            {/* How It Works */}
            <section className="container mx-auto px-4 py-20 bg-indigo-600/5 rounded-[40px] border border-indigo-500/10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
                    <p className="text-gray-400 text-lg">Four simple steps to transform your career path.</p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent hidden lg:block -translate-y-1/2" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                        <StepCard number="1" title="Upload Resume" desc="Drop your PDF/Doc resume and let our AI parse every detail." />
                        <StepCard number="2" title="AI Analyzes Data" desc="Our neural networks scan for skills, experience, and domain." />
                        <StepCard number="3" title="Get Insights & Score" desc="View your ATS score, skill radar, and improvement tips." />
                        <StepCard number="4" title="Find Jobs" desc="Instantly see matched real-world jobs with apply links." />
                    </div>
                </div>
            </section>

            {/* AI Job Matching Highlight Section */}
            <section className="container mx-auto px-4 overflow-hidden">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div {...fadeIn} className="lg:w-1/2 space-y-6">
                        <h2 className="text-4xl md:text-5xl font-bold">Smart Job Matching</h2>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            Stop applying blindly. Our matching engine compares your resume against thousands of live job descriptions using vector embeddings.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-gray-300">
                                <CheckCircle2 className="text-indigo-400" /> Real-time listings from tech job boards
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <CheckCircle2 className="text-indigo-400" /> AI-calculated match percentage
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <CheckCircle2 className="text-indigo-400" /> Instant one-click apply links
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2 relative"
                    >
                        {/* Demo Card Mockup */}
                        <div className="glass-card p-6 border border-white/10 shadow-2xl space-y-8 max-w-md ml-auto">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-xl font-bold">Cloud Architect</h4>
                                    <p className="text-gray-400 text-sm">Amazon Web Services</p>
                                </div>
                                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 font-bold">
                                    94% Match
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-500 uppercase font-bold tracking-wider">
                                    <span>AI Match Confidence</span>
                                    <span>Very High</span>
                                </div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '94%' }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                        className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full"
                                    />
                                </div>
                            </div>

                            <button className="w-full py-3 bg-indigo-600 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/30">
                                Apply Now
                            </button>
                        </div>

                        {/* Second card overlapping slightly */}
                        <div className="glass-card p-4 border border-white/10 shadow-xl opacity-40 absolute -bottom-10 -left-10 max-w-[200px] hidden md:block">
                            <h4 className="font-bold text-sm">Fullstack Developer</h4>
                            <div className="text-pink-400 font-bold text-xs mt-1">82% Match</div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="container mx-auto px-4 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="glass-card p-12 lg:p-20 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] -z-10" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-600/10 blur-[80px] -z-10" />

                    <h2 className="text-4xl md:text-6xl font-bold mb-8">Start Your Career <br /> Journey Today</h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                        Join over 10,000 professionals using AI to optimize their resumes and land tech roles.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 px-10 py-5 bg-white text-indigo-900 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-white/10 shadow-2xl"
                    >
                        Sign Up Now <ArrowRight />
                    </Link>
                </motion.div>
            </section>
        </div>
    );
};

const StatBox = ({ number, label, icon }) => (
    <motion.div
        variants={{
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 }
        }}
        className="glass-card p-8 flex items-center gap-6 group hover:border-indigo-500/30 transition-all border border-white/5"
    >
        <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <div>
            <h3 className="text-3xl font-bold text-white">{number}</h3>
            <p className="text-gray-400 font-medium">{label}</p>
        </div>
    </motion.div>
);

const FeatureCard = ({ icon, title, desc, color }) => (
    <motion.div
        variants={{
            initial: { opacity: 0, scale: 0.9 },
            whileInView: { opacity: 1, scale: 1 }
        }}
        whileHover={{ y: -10 }}
        className="glass-card p-8 space-y-6 hover:border-white/20 transition-all border border-white/5 shadow-lg group"
    >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} bg-opacity-10 text-white shadow-inner group-hover:bg-opacity-20 transition-all`}>
            {React.cloneElement(icon, { size: 28, className: "text-white group-hover:scale-110 transition-transform" })}
        </div>
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{desc}</p>
    </motion.div>
);

const StepCard = ({ number, title, desc }) => (
    <div className="relative space-y-6 group text-center lg:text-left">
        <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/40 mx-auto lg:mx-0 relative z-10 group-hover:scale-110 transition-transform">
            {number}
        </div>
        <div className="space-y-2">
            <h3 className="text-xl font-bold text-white lg:min-h-[1.5em]">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default LandingPage;
