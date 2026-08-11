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
        <section id="courses" className="courses section" style={{ padding: '40px 0 80px', position: 'relative', overflow: 'hidden' }}>
            {/* Background decoration blobs (from Meet The Team) */}
            <img src="images/section2_svg.png" className="team-decor-blob top-right" alt="" />
            <img src="images/section2_svg.png" className="team-decor-blob bottom-left" alt="" />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="courses-header-glass reveal text-center" style={{ marginBottom: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div className="courses-header-info" style={{ width: '100%', textAlign: 'center' }}>
                        <span className="badge-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', borderRadius: '50px', background: 'rgba(12, 73, 131, 0.1)', color: '#0c4983', fontWeight: '600', fontSize: '0.85rem', marginBottom: '14px' }}>
                            <i className="fa-solid fa-graduation-cap"></i> Complete All-in-One Master Program
                        </span>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', lineHeight: '1.2' }}>
                            AI Mastery: <span className="highlight" style={{ color: '#0c4983' }}>From Beginner to Professional</span>
                        </h2>
                        <p style={{ maxWidth: '720px', margin: '0 auto', fontSize: '1.15rem', color: '#475569', fontWeight: '500', lineHeight: '1.6' }}>
                            Work smarter, build faster, market better, and earn more.
                        </p>
                    </div>
                </div>

                {/* 12 Modules List */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px',
                    marginBottom: '48px'
                }}>
                    {SINGLE_COURSE_MODULES.map((mod, idx) => (
                        <div
                            key={mod.num}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '16px 20px',
                                background: '#ffffff',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 2px 8px rgba(12, 73, 131, 0.06)',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(12, 73, 131, 0.13)';
                                e.currentTarget.style.borderColor = '#93c5fd';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(12, 73, 131, 0.06)';
                                e.currentTarget.style.borderColor = '#e2e8f0';
                            }}
                        >
                            <div style={{
                                minWidth: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #0c4983 0%, #1565c0 100%)',
                                color: '#ffffff',
                                fontWeight: '800',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                boxShadow: '0 4px 10px rgba(12, 73, 131, 0.25)'
                            }}>
                                {mod.num}
                            </div>
                            <span style={{
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                color: '#1e293b',
                                lineHeight: '1.4'
                            }}>
                                {mod.title}
                            </span>
                        </div>
                    ))}
                </div>



            </div>
        </section>
    );
}
