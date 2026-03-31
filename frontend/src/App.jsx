import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Upload, FileText, Target, CheckCircle, AlertCircle,
    Download, Layout, Type, Github, Linkedin, ExternalLink,
    Briefcase, Award, Zap, ChevronRight, BarChart3, Globe,
    Hash, FileType, User, Sparkles, ArrowRight, Star, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// 3D Floating Orbs Background Component
const Scene3D = () => (
    <div className="scene-3d">
        <div className="grid-lines" />
        <div className="floating-orb orb-1" />
        <div className="floating-orb orb-2" />
        <div className="floating-orb orb-3" />
    </div>
);

// Animated Score Ring Component
const ScoreRing = ({ score, size = 180 }) => {
    const [animatedScore, setAnimatedScore] = useState(0);
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedScore(score), 300);
        return () => clearTimeout(timer);
    }, [score]);

    return (
        <div className="score-ring relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox="0 0 180 180">
                <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                </defs>
                <circle className="score-ring-bg" cx="90" cy="90" r={radius} />
                <circle
                    className="score-ring-progress"
                    cx="90"
                    cy="90"
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-gradient-3d">{animatedScore}</span>
                <span className="text-sm text-white/40 font-medium tracking-wider">/ 100</span>
            </div>
        </div>
    );
};

// 3D Stat Card Component
const StatCard3D = ({ icon: Icon, label, value, maxValue = 100, color }) => {
    const colors = {
        cyan: { bg: 'rgba(56, 189, 248, 0.1)', border: 'rgba(56, 189, 248, 0.3)', text: '#38bdf8' },
        purple: { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.3)', text: '#a855f7' },
        green: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', text: '#22c55e' },
    };
    const colorSet = colors[color] || colors.cyan;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="stat-card-3d group"
        >
            <div className="flex items-center gap-3 mb-4">
                <div
                    className="p-3 rounded-xl"
                    style={{ background: colorSet.bg, border: `1px solid ${colorSet.border}` }}
                >
                    <Icon className="w-5 h-5" style={{ color: colorSet.text }} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-white/40">{label}</span>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-white">{value}</span>
                <span className="text-lg text-white/30">/{maxValue}</span>
            </div>
            <div className="progress-3d">
                <motion.div
                    className="progress-3d-bar"
                    initial={{ width: 0 }}
                    animate={{ width: `${(value / maxValue) * 100}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                    style={{
                        background: `linear-gradient(90deg, ${colorSet.text}, ${colorSet.text}aa)`
                    }}
                />
            </div>
        </motion.div>
    );
};

const App = () => {
    const [file, setFile] = useState(null);
    const [targetRole, setTargetRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setError(null);
        }
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
        <div className="min-h-screen relative bg-[#030712] text-white selection:bg-cyan-500/30">
            <Scene3D />

            <div className="relative z-10">
                {/* Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="glass-card-3d rounded-2xl px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                            <a href="/" className="flex items-center gap-3 group">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/30 transition-shadow">
                                        <Zap className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 opacity-0 group-hover:opacity-30 blur transition-opacity" />
                                </div>
                                <span className="text-xl font-bold tracking-tight">
                                    Resume<span className="text-gradient-3d">.AI</span>
                                </span>
                            </a>

                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-white/60">
                                <a href="/" className="hover:text-cyan-400 transition-colors">Home</a>
                                <a href="?page=privacy" className="hover:text-cyan-400 transition-colors">Privacy</a>
                                <a href="?page=terms" className="hover:text-cyan-400 transition-colors">Terms</a>
                                <a href="mailto:student18171@gmail.com" className="hover:text-cyan-400 transition-colors">Contact</a>
                                <a
                                    href="https://shivam-portfolio-gamma-ruby.vercel.app/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-glass px-4 py-2 text-xs font-semibold rounded-xl hidden sm:flex items-center gap-2"
                                >
                                    <Star className="w-3 h-3" /> Portfolio
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="pt-32 pb-24 px-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Hero Section */}
                        <header className="text-center mb-20">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card-3d text-cyan-400 text-xs font-bold uppercase tracking-widest mb-8"
                            >
                                <Sparkles className="w-4 h-4" />
                                AI-Powered Resume Analysis
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.05] tracking-tight"
                            >
                                Elevate Your
                                <br />
                                <span className="text-gradient-3d">Career Path</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                            >
                                Upload your resume and unlock instant AI-powered insights.
                                We analyze your skills against target roles to help you stand out.
                            </motion.p>
                        </header>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            {/* Input Section */}
                            <motion.section
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="glass-card-3d rounded-[2rem] p-8 md:p-10 float-card">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
                                            <Layers className="w-6 h-6 text-cyan-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">Upload & Analyze</h2>
                                            <p className="text-sm text-white/40">Start your career optimization</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Target Role Input */}
                                        <div>
                                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
                                                <Target className="w-4 h-4 text-cyan-400" />
                                                Target Job Title
                                            </label>
                                            <input
                                                type="text"
                                                value={targetRole}
                                                onChange={(e) => setTargetRole(e.target.value)}
                                                placeholder="e.g. Senior Frontend Developer"
                                                className="input-3d"
                                            />
                                        </div>

                                        {/* File Upload Zone */}
                                        <div>
                                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
                                                <Briefcase className="w-4 h-4 text-purple-400" />
                                                Resume File
                                            </label>
                                            <div
                                                className={`upload-zone-3d ${dragActive || file ? 'active' : ''}`}
                                                onDragEnter={handleDrag}
                                                onDragLeave={handleDrag}
                                                onDragOver={handleDrag}
                                                onDrop={handleDrop}
                                            >
                                                <input
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    accept=".pdf,.docx,.txt"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className={`p-4 rounded-2xl transition-all ${file
                                                            ? 'bg-cyan-500/20 text-cyan-400 neon-glow-cyan'
                                                            : 'bg-white/5 text-white/30'
                                                        }`}>
                                                        <Upload className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-semibold mb-1">
                                                            {file ? file.name : 'Drop your resume here'}
                                                        </p>
                                                        <p className="text-sm text-white/30">
                                                            PDF, DOCX, or TXT up to 10MB
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Error Message */}
                                        <AnimatePresence>
                                            {error && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"
                                                >
                                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                                    <p className="text-sm">{error}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Analyze Button */}
                                        <button
                                            onClick={handleAnalyze}
                                            disabled={loading}
                                            className="btn-3d w-full flex items-center justify-center gap-3 text-lg"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="loader-3d scale-50" />
                                                    <span>Analyzing...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-5 h-5" />
                                                    <span>Analyze Resume</span>
                                                    <ArrowRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Results Section */}
                            <section>
                                <AnimatePresence mode="wait">
                                    {report ? (
                                        <motion.div
                                            key="results"
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -30 }}
                                            className="space-y-6"
                                        >
                                            {/* Score Card */}
                                            <div className="glass-card-3d rounded-[2rem] p-8 neon-border animate-pulse-glow">
                                                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                                    <div className="text-center md:text-left">
                                                        <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                                                            <User className="w-5 h-5 text-cyan-400" />
                                                            <h2 className="text-2xl font-bold">{report.candidate_name}</h2>
                                                        </div>
                                                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                                            <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/60 flex items-center gap-2">
                                                                <FileType className="w-3 h-3" /> {report.file_type}
                                                            </span>
                                                            <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/60 flex items-center gap-2">
                                                                <Target className="w-3 h-3" /> {report.target_role}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <ScoreRing score={report.ats_score} />
                                                </div>
                                            </div>

                                            {/* Stats Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <StatCard3D
                                                    icon={BarChart3}
                                                    label="ATS Score"
                                                    value={report.ats_score}
                                                    color="cyan"
                                                />
                                                <StatCard3D
                                                    icon={Type}
                                                    label="Grammar"
                                                    value={report.grammar_score}
                                                    color="purple"
                                                />
                                                <StatCard3D
                                                    icon={Layout}
                                                    label="Format"
                                                    value={report.format_score}
                                                    color="green"
                                                />
                                            </div>

                                            {/* Keywords Section */}
                                            <div className="glass-card-3d rounded-[2rem] p-8">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                                                            <Hash className="w-5 h-5 text-cyan-400" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold">Keyword Analysis</h3>
                                                            <p className="text-xs text-white/40">{report.required_keywords?.length || 0} keywords analyzed</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-3xl font-bold text-gradient-3d">{report.keyword_match_percent}%</p>
                                                        <p className="text-xs text-white/40">Match Rate</p>
                                                    </div>
                                                </div>

                                                {/* Matched Keywords */}
                                                <div className="mb-6">
                                                    <p className="text-xs font-bold uppercase tracking-widest text-green-400 mb-3">Matched Skills</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(report.matched_keywords || []).length > 0 ? (
                                                            report.matched_keywords.map((kw, i) => (
                                                                <span key={i} className="tag-3d tag-matched">
                                                                    <CheckCircle className="w-3 h-3 mr-1.5" />
                                                                    {kw}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-white/30 italic">No matches detected</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Keyword Scores Table */}
                                                {report.keyword_match_scores && report.keyword_match_scores.length > 0 && (
                                                    <div className="overflow-hidden rounded-xl border border-white/5">
                                                        <table className="table-3d">
                                                            <thead>
                                                                <tr>
                                                                    <th>Keyword</th>
                                                                    <th className="text-right">Score</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {report.keyword_match_scores.slice(0, 8).map((item, i) => (
                                                                    <tr key={i}>
                                                                        <td className="font-medium">{item[0]}</td>
                                                                        <td className="text-right">
                                                                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${item[1] > 80
                                                                                    ? 'bg-green-500/20 text-green-400'
                                                                                    : 'bg-cyan-500/20 text-cyan-400'
                                                                                }`}>
                                                                                {item[1]}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Suggestions Section */}
                                            <div className="glass-card-3d rounded-[2rem] p-8">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                                        <Award className="w-5 h-5 text-purple-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold">Improvement Suggestions</h3>
                                                        <p className="text-xs text-white/40">Actionable insights to boost your score</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    {/* Recommendations */}
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-4">Top Recommendations</p>
                                                        <ul className="space-y-3">
                                                            {(report.skill_gap_suggestions?.suggestions || []).map((s, i) => (
                                                                <li key={i} className="flex gap-3 group">
                                                                    <CheckCircle className="w-5 h-5 text-green-500/50 group-hover:text-green-400 transition-colors flex-shrink-0 mt-0.5" />
                                                                    <p className="text-sm text-white/70 leading-relaxed">{s}</p>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* Missing Keywords */}
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-4">Priority Keywords</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {(report.skill_gap_suggestions?.priority_keywords || report.missing_keywords || []).slice(0, 12).map((kw, i) => (
                                                                <span key={i} className="tag-3d tag-missing">{kw}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Feedback Section */}
                                                <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border border-white/5">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <p className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">Grammar Feedback</p>
                                                            <p className="text-sm text-white/60">{report.grammar_feedback || "Clear and professional."}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">Format Strategy</p>
                                                            <p className="text-sm text-white/60">{report.format_feedback || "Well organized."}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <button onClick={downloadJSON} className="btn-glass flex-1 flex items-center justify-center gap-3">
                                                    <Download className="w-5 h-5" />
                                                    Download Report
                                                </button>
                                                <button onClick={() => setReport(null)} className="btn-3d flex-1 flex items-center justify-center gap-3">
                                                    <Zap className="w-5 h-5" />
                                                    New Analysis
                                                </button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        /* Empty State */
                                        <motion.div
                                            key="empty"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="glass-card-3d rounded-[2rem] p-12 min-h-[500px] flex flex-col items-center justify-center text-center border-dashed border-2 border-white/10"
                                        >
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10 flex items-center justify-center mb-8 animate-pulse-glow">
                                                <Globe className="w-10 h-10 text-white/20" />
                                            </div>
                                            <h3 className="text-3xl font-bold mb-4">Ready for Analysis</h3>
                                            <p className="text-white/40 max-w-sm mb-10">
                                                Upload your resume and target role to get instant AI-powered insights.
                                            </p>

                                            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                                                <div className="stat-card-3d p-5 text-left">
                                                    <Zap className="w-5 h-5 text-yellow-500 mb-3" />
                                                    <p className="text-xs font-bold uppercase text-white/30 tracking-widest mb-1">Deep Scan</p>
                                                    <p className="text-xs text-white/50">AI-powered keyword analysis</p>
                                                </div>
                                                <div className="stat-card-3d p-5 text-left">
                                                    <Layout className="w-5 h-5 text-cyan-500 mb-3" />
                                                    <p className="text-xs font-bold uppercase text-white/30 tracking-widest mb-1">Validation</p>
                                                    <p className="text-xs text-white/50">Format & structure check</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </section>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="relative z-10 border-t border-white/5 py-16 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                            <div className="md:col-span-5 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold">Shivam Maurya</span>
                                </div>
                                <p className="text-white/40 max-w-xs">
                                    Architecting high-performance AI solutions for the modern workforce.
                                </p>
                                <div className="flex items-center gap-4">
                                    <a
                                        href="https://github.com/Shivam-dev30"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-3 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-500/30 transition-all group"
                                    >
                                        <Github className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/shivammaurya01"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-3 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-500/30 transition-all group"
                                    >
                                        <Linkedin className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
                                    </a>
                                    <a
                                        href="https://shivam-portfolio-gamma-ruby.vercel.app/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn-glass px-5 py-3 text-xs font-bold rounded-xl flex items-center gap-2"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        View Portfolio
                                    </a>
                                </div>
                            </div>

                            <div className="md:col-span-3 md:col-start-7">
                                <h5 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-6">Resources</h5>
                                <ul className="space-y-4 text-sm text-white/50">
                                    <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
                                    <li><a href="#" className="hover:text-cyan-400 transition-colors">Groq LPU Engine</a></li>
                                    <li><a href="?page=privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                                    <li><a href="?page=terms" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
                                </ul>
                            </div>

                            <div className="md:col-span-3">
                                <h5 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-6">Contact</h5>
                                <ul className="space-y-4 text-sm text-white/50">
                                    <li className="flex items-center gap-3">
                                        <ExternalLink className="w-4 h-4 text-cyan-500" />
                                        <a href="mailto:student18171@gmail.com" className="hover:text-white transition-colors">student18171@gmail.com</a>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Globe className="w-4 h-4 text-purple-500" />
                                        <span>Ghaziabad, India</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-xs text-white/30 uppercase tracking-widest">
                                © 2026 Resume.AI — Deployed via Render & Vercel
                            </p>
                            <div className="flex items-center gap-2 text-sm text-white/40">
                                Crafted by
                                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-bold text-xs">
                                    SHIVAM MAURYA
                                </span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default App;
