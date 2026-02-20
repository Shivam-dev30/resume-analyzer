import React, { useState } from 'react';
import axios from 'axios';
import {
    Upload, FileText, Target, CheckCircle, AlertCircle,
    Download, Layout, Type, Github, Linkedin, ExternalLink,
    Briefcase, Award, Zap, ChevronRight, BarChart3, Globe,
    Hash, FileType, User
} from 'lucide-react';
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
        <div className="min-h-screen flex flex-col premium-gradient bg-slate-950 text-slate-50 selection:bg-blue-500/30">
            {/* Dynamic Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/5 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 flex-grow max-w-7xl mx-auto px-6 py-16 w-full">
                {/* Navigation / Mini Header */}
                <nav className="flex justify-between items-center mb-16">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="p-2 bg-blue-600 rounded-xl group-hover:rotate-12 transition-transform">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight uppercase">Resume.AI</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
                        <a href="https://github.com/Shivam-dev30" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">GitHub</a>
                        <a href="https://shivam-portfolio-gamma-ruby.vercel.app/" target="_blank" rel="noreferrer" className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5 transition-all">My Portfolio</a>
                    </div>
                </nav>

                {/* Hero Section */}
                <header className="text-center mb-24 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8"
                    >
                        <Award className="w-4 h-4" /> Next-Gen ATS Optimization
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-7xl font-bold mb-8 leading-[1.1]"
                    >
                        Optimize Your Career <br />
                        <span className="gradient-text tracking-tighter">With AI Precision</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed"
                    >
                        Upload your resume and get an instant deep-dive analysis. We match your skills against target roles to help you land your dream job.
                    </motion.p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Input Section */}
                    <section className="lg:col-span-12 xl:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card p-10 rounded-[2.5rem] relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                <FileText className="w-32 h-32" />
                            </div>

                            <div className="relative z-10 space-y-8">
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
                                        <Target className="w-5 h-5 text-blue-400" />
                                        Target Job Title
                                    </label>
                                    <input
                                        type="text"
                                        value={targetRole}
                                        onChange={(e) => setTargetRole(e.target.value)}
                                        placeholder="e.g. Senior Frontend Developer"
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-lg"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
                                        <Briefcase className="w-5 h-5 text-indigo-400" />
                                        Drop Your Resume
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept=".pdf,.docx,.txt"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        />
                                        <div className={`
                      border-2 border-dashed rounded-[2rem] p-12 text-center transition-all duration-300
                      ${file ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/5 hover:border-white/10 bg-slate-950/50 hover:bg-slate-950'}
                    `}>
                                            <div className="flex flex-col items-center gap-6">
                                                <div className={`p-5 rounded-2xl ${file ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-slate-400 shadow-inner'}`}>
                                                    <Upload className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-bold mb-1">{file ? file.name : 'Choose a file or drag'}</p>
                                                    <p className="text-sm text-slate-500">PDF, DOCX, or TXT up to 10MB</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center gap-4 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm"
                                    >
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        {error}
                                    </motion.div>
                                )}

                                <button
                                    onClick={handleAnalyze}
                                    disabled={loading}
                                    className="btn-primary w-full flex items-center justify-center gap-3 text-lg"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Deep Analyzing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Analyze Strategy</span>
                                            <ChevronRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </section>

                    {/* Results Section */}
                    <section className="lg:col-span-12 xl:col-span-7">
                        <AnimatePresence mode="wait">
                            {report ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    className="space-y-12"
                                >
                                    {/* Candidate Header Area */}
                                    <div className="glass-card p-10 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8">
                                        <div className="space-y-4 text-center md:text-left">
                                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                                <User className="w-6 h-6 text-blue-400" />
                                                <h2 className="text-3xl font-black text-white">{report.candidate_name}</h2>
                                            </div>
                                            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm font-medium text-slate-400">
                                                <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                                                    <FileType className="w-4 h-4" /> {report.file_type}
                                                </span>
                                                <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                                                    <Target className="w-4 h-4" /> {report.target_role}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-center md:text-right">
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Overall ATS Score</p>
                                            <div className="inline-flex items-baseline gap-2">
                                                <span className="text-6xl font-black gradient-text">{report.ats_score}</span>
                                                <span className="text-slate-600 text-xl">/ 100</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Score Visualization */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="glass-card p-8 rounded-3xl animate-glow">
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <BarChart3 className="w-4 h-4 text-blue-400" /> ATS Compatibility
                                            </p>
                                            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-4">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${report.ats_score}%` }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500"
                                                />
                                            </div>
                                            <p className="text-2xl font-black text-white">{report.ats_score}%</p>
                                        </div>

                                        <div className="glass-card p-8 rounded-3xl">
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <Type className="w-4 h-4 text-indigo-400" /> Grammar Score
                                            </p>
                                            <p className="text-4xl font-black text-white mb-2">{report.grammar_score}<span className="text-xs text-slate-600 ml-1">/100</span></p>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= (report.grammar_score / 20) ? 'bg-indigo-400' : 'bg-white/5'}`} />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="glass-card p-8 rounded-3xl">
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <Layout className="w-4 h-4 text-violet-400" /> Format Score
                                            </p>
                                            <p className="text-4xl font-black text-white mb-2">{report.format_score}<span className="text-xs text-slate-600 ml-1">/100</span></p>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= (report.format_score / 20) ? 'bg-violet-400' : 'bg-white/5'}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Keyword Analysis Section */}
                                    <div className="glass-card p-10 rounded-[2.5rem]">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="p-3 bg-blue-500/10 rounded-2xl">
                                                <Hash className="w-7 h-7 text-blue-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold">Keyword Match Strategy</h3>
                                                <p className="text-sm text-slate-500">Analyzing {report.required_keywords.length} role-specific keywords</p>
                                            </div>
                                            <div className="ml-auto text-right">
                                                <h4 className="text-3xl font-black gradient-text">{report.keyword_match_percent}%</h4>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Match Rate</p>
                                            </div>
                                        </div>

                                        <div className="space-y-10">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.2em] mb-4">Matched Core Skills</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {report.matched_keywords.length > 0 ? report.matched_keywords.map((kw, i) => (
                                                        <span key={i} className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-400">
                                                            {kw}
                                                        </span>
                                                    )) : <p className="text-sm text-slate-600 italic">No matches detected</p>}
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.2em] mb-4 flex justify-between items-center">
                                                    Matched keyword scores (sample)
                                                    <ChevronRight className="w-3 h-3 text-slate-700" />
                                                </p>
                                                <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-950/50">
                                                    <table className="w-full text-left text-xs">
                                                        <thead>
                                                            <tr className="bg-white/5 text-slate-500 uppercase font-black tracking-widest">
                                                                <th className="px-6 py-4">Keyword</th>
                                                                <th className="px-6 py-4 text-right">Match Score</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-white/5">
                                                            {(report.keyword_match_scores || []).slice(0, 10).map((item, i) => (
                                                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                                                    <td className="px-6 py-4 font-bold text-slate-300">{item[0]}</td>
                                                                    <td className="px-6 py-4 text-right">
                                                                        <span className={`px-2 py-1 rounded-md font-black ${item[1] > 80 ? 'text-emerald-400 bg-emerald-400/10' : 'text-blue-400 bg-blue-400/10'}`}>
                                                                            {item[1]}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actionable Suggestions & Feedback */}
                                    <div className="glass-card p-10 rounded-[2.5rem]">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="p-3 bg-indigo-500/10 rounded-2xl">
                                                <Award className="w-7 h-7 text-indigo-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold">Skill Gap & Suggestions</h3>
                                                <p className="text-sm text-slate-500">Actionable intelligence to boost your visibility</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div className="space-y-8">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em] mb-6">Top recommendations</p>
                                                    <ul className="space-y-4">
                                                        {(report.skill_gap_suggestions?.suggestions || []).map((s, i) => (
                                                            <li key={i} className="flex gap-4 group">
                                                                <CheckCircle className="w-5 h-5 text-emerald-500/50 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                                                                <p className="text-slate-300 text-sm leading-relaxed">{s}</p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-violet-400 tracking-[0.2em] mb-6">Priority missing keywords</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(report.skill_gap_suggestions?.priority_keywords || report.missing_keywords || []).slice(0, 15).map((kw, i) => (
                                                            <span key={i} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-xs font-medium text-slate-500 hover:text-blue-400 transition-colors cursor-default">
                                                                {kw}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-8">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.2em] mb-6">Sample resume phrases to add</p>
                                                    <div className="space-y-3">
                                                        {(report.skill_gap_suggestions?.sample_phrases || []).map((phrase, i) => (
                                                            <div key={i} className="p-4 bg-slate-900/50 border border-white/5 rounded-2xl group hover:border-blue-500/30 transition-all">
                                                                <code className="text-xs text-blue-300 block mb-2 opacity-50 font-mono tracking-tighter uppercase font-black">Success Metric Path</code>
                                                                <p className="text-xs text-slate-300 italic group-hover:not-italic group-hover:text-white transition-all">"{phrase}"</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="p-8 bg-blue-600/5 border border-blue-500/10 rounded-[2rem]">
                                                    <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.2em] mb-4 italic">Grammar & Formatting Expert Feedback</p>
                                                    <p className="text-xs text-slate-400 leading-relaxed mb-4"><strong>Grammar Insight:</strong> {report.grammar_feedback || "Clear and professional."}</p>
                                                    <p className="text-xs text-slate-400 leading-relaxed font-semibold"><strong>Format Strategy:</strong> {report.format_feedback || "Well organized."}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Final Actions */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={downloadJSON}
                                            className="flex-1 px-8 py-6 bg-white/5 hover:bg-white/10 border border-white/5 rounded-[2rem] font-black text-sm flex items-center justify-center gap-3 transition-all"
                                        >
                                            <Download className="w-5 h-5 text-slate-400" />
                                            DOWNLOAD ANALYSIS REPORT
                                        </button>
                                        <button
                                            onClick={() => setReport(null)}
                                            className="flex-1 px-8 py-6 bg-white text-slate-950 hover:bg-slate-100 rounded-[2rem] font-black text-sm flex items-center justify-center gap-3 transition-all shadow-2xl shadow-white/10"
                                        >
                                            <Zap className="w-5 h-5" />
                                            START NEW EVALUATION
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                /* Empty / Preview State */
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 glass-card rounded-[3rem] border-dashed border-2 bg-transparent"
                                >
                                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-10 shadow-inner">
                                        <Globe className="w-10 h-10 text-slate-700 animate-pulse" />
                                    </div>
                                    <h3 className="text-4xl font-black text-slate-200 mb-6 tracking-tight leading-tight">Ready for Assessment</h3>
                                    <p className="text-slate-500 text-lg max-w-sm mb-16 font-medium">
                                        Upload your details on the left to generate your custom AI assessment.
                                    </p>

                                    <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                                        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 text-left group hover:bg-blue-600/5 transition-all">
                                            <Zap className="w-5 h-5 text-yellow-500 mb-4" />
                                            <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-2 group-hover:text-blue-400">Deep Scan</p>
                                            <p className="text-xs text-slate-500 font-bold leading-normal">AI-powered keyword mining & skill matching.</p>
                                        </div>
                                        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 text-left group hover:bg-indigo-600/5 transition-all">
                                            <Layout className="w-5 h-5 text-blue-500 mb-4" />
                                            <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-2 group-hover:text-indigo-400">Validation</p>
                                            <p className="text-xs text-slate-500 font-bold leading-normal">Professional layout & parsing validation.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>
                </div>
            </div>

            {/* Professional Footer */}
            <footer className="relative z-10 border-t border-white/5 pt-20 pb-12 mt-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
                        <div className="md:col-span-5 space-y-6 text-center md:text-left">
                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-extrabold text-2xl uppercase tracking-tighter">Shivam Maurya</span>
                            </div>
                            <p className="text-slate-500 max-w-xs mx-auto md:mx-0 font-medium">
                                Architecting high-performance AI solutions for the modern workforce.
                            </p>
                            <div className="flex items-center gap-4 justify-center md:justify-start">
                                <a href="https://github.com/Shivam-dev30" target="_blank" rel="noreferrer" className="p-4 bg-white/5 rounded-2xl hover:bg-blue-600 transition-all group shadow-inner">
                                    <Github className="w-5 h-5 group-hover:scale-125 transition-transform" />
                                </a>
                                <a href="https://www.linkedin.com/in/shivammaurya01" target="_blank" rel="noreferrer" className="p-4 bg-white/5 rounded-2xl hover:bg-blue-600 transition-all group shadow-inner">
                                    <Linkedin className="w-5 h-5 group-hover:scale-125 transition-transform" />
                                </a>
                                <a href="https://shivam-portfolio-gamma-ruby.vercel.app/" target="_blank" rel="noreferrer" className="bg-white/5 hover:bg-white/10 px-8 py-4 rounded-2xl border border-white/5 transition-all font-black text-xs uppercase tracking-widest">
                                    View Full Portfolio
                                </a>
                            </div>
                        </div>

                        <div className="md:col-span-1 hidden md:block" />

                        <div className="md:col-span-3 text-center md:text-left">
                            <h5 className="text-white font-black mb-8 tracking-[0.3em] uppercase text-[10px]">Resources</h5>
                            <ul className="space-y-5 text-slate-500 font-bold text-sm">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Groq LPU Engine</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>

                        <div className="md:col-span-3 text-center md:text-left">
                            <h5 className="text-white font-black mb-8 tracking-[0.3em] uppercase text-[10px]">Connected</h5>
                            <ul className="space-y-5 text-slate-500 font-bold text-sm">
                                <li className="flex items-center gap-3 justify-center md:justify-start hover:text-white transition-colors">
                                    <ExternalLink className="w-4 h-4 text-blue-500" />
                                    <a href="mailto:contact@shivam.dev">contact@shivam.dev</a>
                                </li>
                                <li className="flex items-center gap-3 justify-center md:justify-start">
                                    <Globe className="w-4 h-4 text-indigo-500" />
                                    <span>Ghaziabad, India</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">© 2026 RESUME.AI — DEPLOYED VIA RENDER & VERCEL</p>
                        <div className="flex items-center gap-3 text-sm font-black text-slate-500 italic">
                            Crafted by <span className="text-white not-italic font-black px-4 py-2 bg-white/5 rounded-xl border border-white/5 shadow-inner">SHIVAM MAURYA</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
