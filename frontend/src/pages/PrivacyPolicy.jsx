import React from 'react';
import { Shield, ChevronLeft } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen flex flex-col premium-gradient bg-slate-950 text-slate-50 selection:bg-blue-500/30">
            <div className="relative z-10 flex-grow max-w-4xl mx-auto px-6 py-16 w-full">
                <nav className="mb-12">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" /> Back to Home
                    </button>
                </nav>

                <div className="glass-card p-10 md:p-14 rounded-[2.5rem]">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-blue-500/10 rounded-2xl">
                            <Shield className="w-8 h-8 text-blue-400" />
                        </div>
                        <h1 className="text-4xl font-black text-white">Privacy Policy</h1>
                    </div>

                    <div className="space-y-8 text-slate-300 leading-relaxed">
                        <p>Last updated: {new Date().toLocaleDateString()}</p>

                        <section className="space-y-4">
                            <h2 className="text-2xl justify-start font-bold text-white">1. Introduction</h2>
                            <p>Welcome to Resume.AI. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our service. We respect your privacy and are committed to protecting your personal data.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl justify-start font-bold text-white">2. Information We Collect</h2>
                            <p>We may collect information about you in a variety of ways. The information we may collect via the Site includes:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-400">
                                <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and demographic details that you voluntarily give to us when using our services.</li>
                                <li><strong>Resume Data:</strong> The resumes and related documents you upload for analysis. This data is processed securely and is used solely for the purpose of providing you with an assessment.</li>
                                <li><strong>Usage Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl justify-start font-bold text-white">3. How We Use Your Information</h2>
                            <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-400">
                                <li>Generate your personalized resume analysis and ATS optimization reports.</li>
                                <li>Improve our website, application functionality, and overall user experience.</li>
                                <li>Deliver targeted advertising from third-party networks, such as Google AdSense.</li>
                                <li>Respond to your comments, questions, and requests and provide customer service.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl justify-start font-bold text-white">4. Google AdSense & Cookies</h2>
                            <p>We use Google AdSense to display ads on our site. Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.</p>
                            <p>Users may opt out of personalized advertising by visiting Google's <a href="https://myadcenter.google.com/" className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noreferrer">Ads Settings</a>.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl justify-start font-bold text-white">5. Data Security</h2>
                            <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl justify-start font-bold text-white">6. Contact Us</h2>
                            <p>If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:contact@shivam.dev" className="text-blue-400 hover:text-blue-300">contact@shivam.dev</a></p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
