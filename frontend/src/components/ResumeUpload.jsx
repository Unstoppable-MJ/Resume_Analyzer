import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, Loader2, XCircle } from 'lucide-react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const ResumeUpload = ({ setActiveResume }) => {
    const [file, setFile] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState(1); // 1: Select, 2: Parsing, 3: Success, 4: Error
    const [errorData, setErrorData] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        setFile(acceptedFiles[0]);
        setStep(2);
        handleUpload(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        }
    });

    const handleUpload = async (fileObj) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Authentication required! Please login or register to upload a resume.');
            window.location.href = '/login';
            return;
        }

        setProcessing(true);
        const formData = new FormData();
        formData.append('file', fileObj);

        try {
            const res = await api.post('parser/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Get additional analysis
            const analysisRes = await api.post('scoring/score/',
                { text: res.data.preview_text }
            );

            const aiRes = await api.post('suggestions/suggestions/',
                { text: res.data.preview_text }
            ).catch(e => {
                console.warn("AI Suggestions failed:", e);
                return { data: { suggestions: ["AI suggestions are currently unavailable. Please check your backend API configuration."] } };
            });

            setActiveResume({
                ...res.data,
                ats_score: `${analysisRes.data.score}%`,
                suggestions: aiRes.data.suggestions || [],
            });

            setStep(3);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 400 && err.response?.data?.is_valid_resume === false) {
                setErrorData(err.response.data);
                setStep(4);
            } else {
                alert('Processing failed. Please try again.');
                setStep(1);
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-12 pb-20">
            <motion.div className="glass-card overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600/20 to-pink-600/20 p-8 border-b border-white/10">
                    <h2 className="text-3xl font-bold">Upload Your Resume</h2>
                    <p className="text-gray-400">PDF or DOCX accepted. Minimum text required.</p>
                </div>

                <div className="p-10">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isDragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-white/20'}`}
                            >
                                <input {...getInputProps()} />
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 bg-white/5 rounded-full">
                                        <Upload className="text-indigo-400" size={48} />
                                    </div>
                                    <p className="text-lg font-medium">Drag & drop your resume here</p>
                                    <p className="text-sm text-gray-500">or click to browse files</p>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-20 gap-6"
                            >
                                <Loader2 className="animate-spin text-indigo-400" size={64} />
                                <div className="text-center space-y-2">
                                    <p className="text-xl font-bold">Analyzing Content...</p>
                                    <p className="text-gray-400">Our AI is extracting skills and scoring sections.</p>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-10 gap-6"
                            >
                                <div className="p-6 bg-green-500/20 rounded-full">
                                    <CheckCircle className="text-green-400" size={64} />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-2xl font-bold">Success!</p>
                                    <p className="text-gray-400">{file?.name} has been processed.</p>
                                </div>
                                <button
                                    onClick={() => setStep(1)}
                                    className="bg-white/10 px-8 py-3 rounded-xl hover:bg-white/20 transition-all font-medium"
                                >
                                    Analyze Another
                                </button>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-10 gap-6"
                            >
                                <div className="p-6 bg-red-500/20 rounded-full">
                                    <XCircle className="text-red-400" size={64} />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-2xl font-bold text-red-500">Invalid Resume Uploaded</p>
                                </div>

                                <div className="w-full max-w-md bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-left space-y-4">
                                    <h4 className="font-semibold text-red-300">Validation Failure</h4>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        {errorData?.reason || "The uploaded document is missing critical sections (like Skills or Experience) required to be classified as a valid resume."}
                                    </p>
                                    <div className="flex justify-between items-center text-xs pt-4 border-t border-red-500/20">
                                        <span className="text-gray-400 uppercase tracking-widest">Confidence Score</span>
                                        <span className="font-mono font-bold text-red-300 bg-red-500/10 px-2 py-1 rounded">
                                            {((errorData?.confidence || 0) * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(1)}
                                    className="bg-red-600/80 px-8 py-3 rounded-xl hover:bg-red-600 transition-all font-medium mt-4 shadow-lg shadow-red-500/20"
                                >
                                    Try Another File
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default ResumeUpload;
