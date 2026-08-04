import React, { useState } from 'react';

const SINGLE_COURSE_MODULES = [
    {
        num: 1,
        title: "Module 1 – AI Fundamentals",
        description: "Master core artificial intelligence principles, advanced prompt engineering techniques, and foundational conversational AI models to supercharge daily productivity.",
        topics: ["Introduction to AI", "Prompt Engineering", "Model Architecture", "System Prompts", "Logic Reasoning Workflows"],
        icon: "fa-brain",
        badge: "Fundamentals"
    },
    {
        num: 2,
        title: "Module 2 – Research & Knowledge",
        description: "Learn deep research methodologies, private document grounding, information synthesis, and structured academic and market research workflows.",
        topics: ["Deep Research", "Private Document Grounding", "Information Synthesis", "Research Workflows"],
        icon: "fa-magnifying-glass",
        badge: "Research"
    },
    {
        num: 3,
        title: "Module 3 – Writing & Communication",
        description: "Draft executive boardroom memos, persuasive client proposals, professional email sequences, and high-impact articles in seconds.",
        topics: ["Executive Memos & Proposals", "Tone Optimization", "Email Generation", "Reports & Documentation"],
        icon: "fa-pen-to-square",
        badge: "Writing"
    },
    {
        num: 4,
        title: "Module 4 – Presentations & Visual Content",
        description: "Generate boardroom-ready presentation decks, detailed infographics, visual flowcharts, and interactive concept mind maps effortlessly.",
        topics: ["Slide Decks & Presentations", "Visual Flowcharts", "Mind Mapping & Diagrams", "Data Infographics"],
        icon: "fa-file-powerpoint",
        badge: "Presentations"
    },
    {
        num: 5,
        title: "Module 5 – Image, Audio & Video AI",
        description: "Produce studio-quality voiceovers, realistic speech synthesis, custom background music, and scroll-stopping visual media.",
        topics: ["AI Voice Synthesis", "Original Music Generation", "Social Media Graphics", "Media Production"],
        icon: "fa-photo-film",
        badge: "Media"
    },
    {
        num: 6,
        title: "Module 6 – Marketing with AI",
        description: "Develop end-to-end digital marketing strategies, high-converting ad copy, visual creative banners, presenter videos, and landing pages.",
        topics: ["Marketing Strategy", "Ad Copy & Campaigns", "Social Media Content", "Landing Page Copy"],
        icon: "fa-bullhorn",
        badge: "Marketing"
    },
    {
        num: 7,
        title: "Module 7 – Sales with AI",
        description: "Automate B2B prospect research, personalize cold outreach at scale, craft pitch scripts, and handle complex buyer objections.",
        topics: ["Lead Generation Strategy", "Cold Email Personalization", "Outreach Sequences", "Pitch Scripts"],
        icon: "fa-chart-line",
        badge: "Sales"
    },
    {
        num: 8,
        title: "Module 8 – Career Accelerator",
        description: "Build ATS-optimized resumes, track job application pipelines, prepare for high-stakes panel interviews, and optimize your professional profile.",
        topics: ["ATS Resume Building", "Job Pipeline Tracking", "Interview Prep", "LinkedIn Optimization"],
        icon: "fa-briefcase",
        badge: "Career"
    },
    {
        num: 9,
        title: "Module 9 – Workflow Automation",
        description: "Connect digital tools into automated business pipelines, set up hands-free triggers, and streamline team operations without code.",
        topics: ["Business Automations", "Multi-Step Triggers", "No-Code Integrations", "Operational Pipelines"],
        icon: "fa-gears",
        badge: "Automation"
    },
    {
        num: 10,
        title: "Module 10 – Build AI Apps",
        description: "Build, prototype, and deploy full-stack web applications, interactive tools, and functional MVPs using simple natural language prompts.",
        topics: ["Prompt-Based App Building", "Interactive Web Tools", "MVP Creation", "Deployment & Hosting"],
        icon: "fa-laptop-code",
        badge: "App Building"
    },
    {
        num: 11,
        title: "Module 11 – Education with AI",
        description: "Create structured lesson plans, interactive study materials, student assessments, rubrics, and digital classroom resources in minutes.",
        topics: ["Smart Lesson Planning", "Assessment & Rubrics", "Course Creation", "Student Engagement"],
        icon: "fa-graduation-cap",
        badge: "Education"
    },
    {
        num: 12,
        title: "Module 12 – Earn Money with AI",
        description: "Build a scalable AI freelancing business, offer agency services, launch SaaS MVPs, sell digital products, find clients, and set premium rates.",
        topics: ["AI Freelancing & Agency Services", "Building SaaS MVPs", "Digital Products", "Client Acquisition & Pricing"],
        icon: "fa-coins",
        badge: "Monetization"
    }
];

const CAPSTONE_STEPS = [
    "Conduct deep research on a niche market",
    "Generate strategic content & documentation",
    "Design visual assets & creative media",
    "Create professional presentation decks",
    "Build an interactive web application MVP",
    "Automate business & customer workflows",
    "Produce custom audio & voice narrations",
    "Generate brand music & audio IDs",
    "Launch and market the final product"
];

export default function Courses({ onSelectCourse }) {
    return (
        <section id="courses" className="courses section" style={{ padding: '80px 0', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
            <div className="container">
                <div className="courses-header-glass reveal text-center" style={{ marginBottom: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div className="courses-header-info" style={{ width: '100%', textAlign: 'center' }}>
                        <span className="badge-pill" style={{ display: 'inline-block', padding: '6px 18px', borderRadius: '50px', background: 'rgba(12, 73, 131, 0.1)', color: '#0c4983', fontWeight: '600', fontSize: '0.85rem', marginBottom: '14px' }}>
                            🎓 Complete All-in-One Master Program
                        </span>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', lineHeight: '1.2' }}>
                            AI Mastery: <span className="highlight" style={{ color: '#0c4983' }}>From Beginner to Professional</span>
                        </h2>
                        <p style={{ maxWidth: '720px', margin: '0 auto', fontSize: '1.15rem', color: '#475569', fontWeight: '500', lineHeight: '1.6' }}>
                            Work smarter, build faster, market better, and earn more.
                        </p>
                    </div>
                </div>

                {/* 12 Modules Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                    {SINGLE_COURSE_MODULES.map((mod) => (
                        <div 
                            key={mod.num}
                            style={{
                                background: '#ffffff',
                                borderRadius: '16px',
                                padding: '28px 24px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                                transition: 'all 0.25s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                cursor: 'pointer'
                            }}
                            onClick={() => onSelectCourse && onSelectCourse(0)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 12px 24px rgba(12, 73, 131, 0.08)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.03)';
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(12, 73, 131, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0c4983', fontSize: '1.2rem' }}>
                                        <i className={`fa-solid ${mod.icon}`}></i>
                                    </div>
                                    <span style={{ fontSize: '0.78rem', fontWeight: '600', padding: '4px 12px', borderRadius: '12px', background: '#f1f5f9', color: '#0c4983' }}>
                                        {mod.badge}
                                    </span>
                                </div>

                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>
                                    {mod.title}
                                </h3>

                                <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: '1.55', marginBottom: '16px' }}>
                                    {mod.description}
                                </p>

                                {/* Topics Pills */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {mod.topics.map((topic, tIdx) => (
                                        <span key={tIdx} style={{ fontSize: '0.8rem', padding: '3px 9px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', fontWeight: '500' }}>
                                            • {topic}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: '#0c4983', fontWeight: '600' }}>
                                <span>Included in Full Masterclass</span>
                                <i className="fa-solid fa-circle-check"></i>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Final Capstone Project Section */}
                <div style={{ 
                    background: '#ffffff', 
                    borderRadius: '24px', 
                    padding: '40px 32px', 
                    border: '1px solid #e2e8f0', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                    marginBottom: '48px'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                        <span style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '20px', background: 'rgba(234, 88, 12, 0.1)', color: '#ea580c', fontWeight: '700', fontSize: '0.85rem', marginBottom: '10px' }}>
                            🏆 Hands-On Graduation Requirement
                        </span>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a' }}>
                            Final Capstone Project
                        </h3>
                        <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '6px' }}>
                            Students complete a comprehensive end-to-end project combining all 12 modules:
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
                        {CAPSTONE_STEPS.map((step, sIdx) => (
                            <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0c4983', color: '#ffffff', fontWeight: '700', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {sIdx + 1}
                                </div>
                                <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: '600' }}>{step}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Masterclass CTA Card */}
                <div style={{ 
                    background: 'linear-gradient(135deg, #0c4983 0%, #082d52 100%)', 
                    borderRadius: '24px', 
                    padding: '44px 32px', 
                    color: '#ffffff', 
                    textAlign: 'center',
                    boxShadow: '0 20px 40px rgba(12, 73, 131, 0.25)'
                }}>
                    <h3 style={{ fontSize: '2.1rem', fontWeight: '800', marginBottom: '12px', color: '#ffffff' }}>
                        Enroll in AI Mastery: From Beginner to Professional
                    </h3>
                    <p style={{ maxWidth: '640px', margin: '0 auto 28px', fontSize: '1.1rem', color: '#93c5fd', lineHeight: '1.6' }}>
                        Get instant access to all 12 modules, hands-on capstone project, verified certificate, and lifetime updates.
                    </p>
                    <button 
                        onClick={() => onSelectCourse && onSelectCourse(0)}
                        style={{
                            padding: '16px 40px',
                            fontSize: '1.15rem',
                            fontWeight: '700',
                            borderRadius: '50px',
                            border: 'none',
                            background: '#ffffff',
                            color: '#0c4983',
                            cursor: 'pointer',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Start Learning Now
                    </button>
                </div>
            </div>
        </section>
    );
}
