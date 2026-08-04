import React from 'react';

export default function Hero({ onStartQuiz, onSelectCourse }) {
    return (
        <>
            <section id="hero" className="hero section">
                <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    <div className="hero-split">
                        {/* Left Content */}
                        <div className="hero-text">
                            <h1 className="hero-anim-h1">
                                Upgrade your life with <span className="highlight tagline-highlight">practical AI skills</span>
                            </h1>
                            <p className="hero-tagline hero-anim-tagline">
                                Learn the tools. Build the skills. Get the certificate - in 28 days.
                            </p>
                            <div className="hero-features-grid hero-anim-features">
                                <div className="hero-feature-item">
                                    <p className="hero-feature-text">Learn the latest tools for a career edge.</p>
                                </div>
                                <div className="hero-feature-item">
                                    <p className="hero-feature-text">Get 24x7 lifetime access at your own pace.</p>
                                </div>
                                <div className="hero-feature-item">
                                    <p className="hero-feature-text">Build pure, practical, future-ready skills.</p>
                                </div>
                            </div>

                            <div className="hero-buttons hero-anim-btn">
                                <button onClick={onStartQuiz} className="btn btn-primary" style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    Build Practical AI Skills <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>

                        </div>

                        {/* Right Content - Floating 3D Tilted Tools Grid */}
                        <div className="hero-image-container">
                            <div className="hero-3d-grid-wrapper">
                                <div className="hero-3d-grid">
                                    <div className="tool-grid-card hero-card-anim" style={{ '--card-delay': '0.1s' }} onClick={() => onSelectCourse && onSelectCourse(0)}>
                                        <i className="fa-solid fa-user-tie" style={{ color: '#4f46e5' }}></i>
                                        <span>Executive Productivity</span>
                                    </div>
                                    <div className="tool-grid-card hero-card-anim" style={{ '--card-delay': '0.2s' }} onClick={() => onSelectCourse && onSelectCourse(1)}>
                                        <i className="fa-solid fa-bullhorn" style={{ color: '#ec4899' }}></i>
                                        <span>AI for Marketing</span>
                                    </div>
                                    <div className="tool-grid-card hero-card-anim" style={{ '--card-delay': '0.3s' }} onClick={() => onSelectCourse && onSelectCourse(2)}>
                                        <i className="fa-solid fa-chart-line" style={{ color: '#10b981' }}></i>
                                        <span>AI for Sales</span>
                                    </div>
                                    <div className="tool-grid-card hero-card-anim" style={{ '--card-delay': '0.6s' }} onClick={() => onSelectCourse && onSelectCourse(3)}>
                                        <i className="fa-solid fa-gears" style={{ color: '#f59e0b' }}></i>
                                        <span>Workflow Automation</span>
                                    </div>
                                    <div className="tool-grid-card hero-card-anim" style={{ '--card-delay': '0.5s' }} onClick={() => onSelectCourse && onSelectCourse(4)}>
                                        <i className="fa-solid fa-user-graduate" style={{ color: '#3b82f6' }}></i>
                                        <span>Graduate Productivity</span>
                                    </div>
                                    <div className="tool-grid-card hero-card-anim" style={{ '--card-delay': '0.4s' }} onClick={() => onSelectCourse && onSelectCourse(5)}>
                                        <i className="fa-solid fa-briefcase" style={{ color: '#6366f1' }}></i>
                                        <span>Career Planning</span>
                                    </div>
                                    <div className="tool-grid-card hero-card-anim" style={{ '--card-delay': '0.7s' }} onClick={() => onSelectCourse && onSelectCourse(6)}>
                                        <i className="fa-solid fa-laptop-code" style={{ color: '#d946ef' }}></i>
                                        <span>Mini-App Making</span>
                                    </div>
                                    <div className="tool-grid-card hero-card-anim" style={{ '--card-delay': '0.85s' }} onClick={() => onSelectCourse && onSelectCourse(7)}>
                                        <i className="fa-solid fa-hand-holding-dollar" style={{ color: '#8b5cf6' }}></i>
                                        <span>Earning & Freelancing</span>
                                    </div>
                                    <div className="tool-grid-card hero-card-anim" style={{ '--card-delay': '1.0s' }} onClick={() => onSelectCourse && onSelectCourse(8)}>
                                        <i className="fa-solid fa-chalkboard-user" style={{ color: '#14b8a6' }}></i>
                                        <span>AI for Teachers</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <img src="https://res.cloudinary.com/dfqyaawjv/image/upload/q_auto/f_auto/v1782120064/section2_svg_xokvds.png" className="hero-decor-blob" alt="" />
            </section>        </>
    );
}
