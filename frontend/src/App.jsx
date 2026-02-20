import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, Target, CheckCircle, AlertCircle, Download, Layout, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const App = () => {
    const [file, setFile] = useState(null);
    const [targetRole, setTargetRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null);
    };

    const handleAnalyze = async () => {
        if (!file || !targetRole) {
            setError('Please upload a resume and specify a target role.');
            return;
        }

        setLoading(true);
        setReport(null);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('target_role', targetRole);

        try {
            const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setReport(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Analysis failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const downloadJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "resume_analysis.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <header className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-3 mb-6"
                    >
                        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            AI Resume <span className="gradient-text">Analyzer</span>
                        </h1>
                    </motion.div>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Upload your resume and target role to get instant feedback on ATS compatibility, skill gaps, and keyword optimization.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Input Section */}
                    <section className="lg:col-span-5 space-y-8">
                        <div className="glass p-8 rounded-3xl space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-blue-400" />
                                    Target Job Role
                                </label>
                                <input
                                    type="text"
                                    value={targetRole}
                                    onChange={(e) => setTargetRole(e.target.value)}
                                    placeholder="e.g. Senior Software Engineer"
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <Upload className="w-4 h-4 text-blue-400" />
                                    Resume File (PDF/DOCX)
                                </label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept=".pdf,.docx,.txt"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    />
                                    <div className={`
                    border-2 border-dashed rounded-2xl p-8 text-center transition-all
                    ${file ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-800 group-hover:border-slate-700 bg-slate-900/50'}
                  `}>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className={`p-3 rounded-full ${file ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                                                <Upload className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm font-medium">{file ? file.name : 'Click or drag resume here'}</p>
                                            <p className="text-xs text-slate-500">PDF, DOCX up to 10MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
                                >
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {error}
                                </motion.div>
                            )}

                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className={`
                  w-full py-4 rounded-xl font-semibold text-white transition-all
                  ${loading ? 'bg-slate-800 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/20'}
                `}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Analyzing...</span>
                                    </div>
                                ) : 'Analyze Resume'}
                            </button>
                        </div>
                    </section>

                    {/* Results Section */}
                    <section className="lg:col-span-12">
                        <AnimatePresence mode="wait">
                            {report && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    {/* Summary Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="glass p-6 rounded-3xl">
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">ATS Score</p>
                                            <div className="flex items-end gap-2">
                                                <span className="text-4xl font-bold">{report.ats_score}</span>
                                                <span className="text-slate-600 mb-1">/ 100</span>
                                            </div>
                                            <div className="mt-4 w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                                                    style={{ width: `${report.ats_score}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="glass p-6 rounded-3xl">
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Keyword Match</p>
                                            <div className="flex items-end gap-2">
                                                <span className="text-4xl font-bold">{report.keyword_match_percent}%</span>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-2">{report.matched_keywords.length} of {report.required_keywords.length} matched</p>
                                        </div>

                                        <div className="glass p-6 rounded-3xl">
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Grammar Score</p>
                                            <div className="flex items-end gap-2">
                                                <span className="text-4xl font-bold">{report.grammar_score}</span>
                                                <span className="text-slate-600 mb-1">/ 100</span>
                                            </div>
                                        </div>

                                        <div className="glass p-6 rounded-3xl">
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Format Score</p>
                                            <div className="flex items-end gap-2">
                                                <span className="text-4xl font-bold">{report.format_score}</span>
                                                <span className="text-slate-600 mb-1">/ 100</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Feedback Column */}
                                        <div className="space-y-8">
                                            <div className="glass p-8 rounded-3xl">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                                                    <h3 className="text-xl font-bold">Priority Improvements</h3>
                                                </div>
                                                <ul className="space-y-4">
                                                    {report.skill_gap_suggestions.suggestions.map((s, i) => (
                                                        <li key={i} className="flex gap-4 group">
                                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 border border-slate-800 text-xs flex items-center justify-center font-bold text-slate-500 group-hover:text-blue-400 transition-colors">
                                                                {i + 1}
                                                            </span>
                                                            <p className="text-slate-300 leading-relaxed">{s}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="glass p-8 rounded-3xl">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <Layout className="w-6 h-6 text-blue-400" />
                                                    <h3 className="text-xl font-bold">Formatting Feedback</h3>
                                                </div>
                                                <p className="text-slate-400 leading-relaxed whitespace-pre-line">{report.format_feedback}</p>
                                            </div>
                                        </div>

                                        {/* Keywords Column */}
                                        <div className="space-y-8">
                                            <div className="glass p-8 rounded-3xl">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <Type className="w-6 h-6 text-indigo-400" />
                                                    <h3 className="text-xl font-bold">Keyword Analysis</h3>
                                                </div>

                                                <div className="space-y-6">
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Matched Keywords</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {report.matched_keywords.length > 0 ? report.matched_keywords.map((kw, i) => (
                                                                <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-medium text-emerald-400">
                                                                    {kw}
                                                                </span>
                                                            )) : <p className="text-sm text-slate-600 italic">No matches found</p>}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Missing Critical Keywords</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {report.missing_keywords.slice(0, 15).map((kw, i) => (
                                                                <span key={i} className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-medium text-red-300">
                                                                    {kw}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="glass p-8 rounded-3xl">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <Download className="w-6 h-6 text-slate-400" />
                                                    <h3 className="text-xl font-bold">Actions</h3>
                                                </div>
                                                <button
                                                    onClick={downloadJSON}
                                                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Download Report
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Empty State */}
                            {!report && !loading && (
                                <div className="text-center py-24 glass rounded-3xl border-dashed">
                                    <FileText className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                                    <h3 className="text-xl font-medium text-slate-400">Analysis results will appear here</h3>
                                    <p className="text-slate-600 mt-2">Upload your resume to begin the AI deep-dive.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default App;
