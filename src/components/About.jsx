import React, { useRef, useState, useEffect } from 'react';

export default function About() {
    const containerRef = useRef(null);
    const [dims, setDims] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver(() => {
            if (containerRef.current) {
                setDims({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Scroll-triggered card animations
    useEffect(() => {
        const cards = document.querySelectorAll('.about-card');
        if (!cards.length) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
        cards.forEach(card => observer.observe(card));
        return () => observer.disconnect();
    }, []);

    const padding = 18; // Centered in the 36px wrapper padding margin
    const w = dims.width;
    const h = dims.height;

    const r = 28; // Corner radius matching card rounding

    // Draw clockwise rounded rectangle path starting from bottom-right (w - padding - r, h - padding)
    const pathD = w && h ? `M ${w - padding - r},${h - padding} L ${padding + r},${h - padding} A ${r},${r} 0 0,1 ${padding},${h - padding - r} L ${padding},${padding + r} A ${r},${r} 0 0,1 ${padding + r},${padding} L ${w - padding - r},${padding} A ${r},${r} 0 0,1 ${w - padding},${padding + r} L ${w - padding},${h - padding - r} A ${r},${r} 0 0,1 ${w - padding - r},${h - padding}` : '';

    // Compute the exact perimeter of the rounded rectangular path
    const perimeter = w && h ? 2 * (w - 2 * padding) + 2 * (h - 2 * padding) - r * (8 - 2 * Math.PI) : 0;
    // Find optimal N repetitions to target roughly 240px per cycle
    const N = Math.max(Math.round(perimeter / 240), 1);
    // Compute the exact repetition period length
    const L = perimeter / N;

    return (
        <section id="about" className="about section reveal" style={{ padding: '8rem 0' }}>
            <div
                ref={containerRef}
                className="container"
                style={{ maxWidth: '1200px', position: 'relative', padding: '36px', boxSizing: 'border-box' }}
            >
                {/* SVG Typography Border Frame */}
                {w > 0 && h > 0 && (
                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
                        <path id="text-border-path" d={pathD} fill="none" stroke="transparent" />
                        <text
                            fill="rgba(255, 255, 255, 0.25)"
                            fontSize="15"
                            fontWeight="700"
                            style={{ fontFamily: "'Space Mono', 'Courier New', monospace", textTransform: 'uppercase' }}
                        >
                            <textPath href="#text-border-path" startOffset="0">
                                {[...Array(N + 2)].map((_, i) => (
                                    <tspan key={i} textLength={L}>GYANSCHOOL • AI COURSES • </tspan>
                                ))}
                                <animate attributeName="startOffset" from="0" to={`-${L}`} dur="15s" repeatCount="indefinite" />
                            </textPath>
                        </text>
                    </svg>
                )}

                <div className="custom-bento-grid">
                    {/* Card 1: Practical Learning (Spans 2) */}
                    <div className="cb-card cb-gradient-blue cb-span-2 about-card" style={{ '--card-i': 0 }}>
                        <div className="cb-content-left">
                            <h3 className="cb-title">Practical Learning</h3>
                            <p className="cb-text">Gain AI skills that directly help you grow or explore new opportunities. From productivity to advanced workflows, everything is designed to make you more valuable.</p>
                            <a href="#courses" className="cb-btn-light">View Courses <i className="fa-solid fa-arrow-right"></i></a>
                        </div>
                        <div className="cb-graphic-right">
                            <div className="cb-mockup-panel">
                                <div className="cb-mockup-header">
                                    <span>AI Workflow</span>
                                    <span className="cb-mockup-tag">Active</span>
                                </div>
                                <div className="cb-mockup-grid">
                                    <div className="cb-mockup-item active"><i className="fa-solid fa-star"></i></div>
                                    <div className="cb-mockup-item"><i className="fa-solid fa-lock"></i></div>
                                    <div className="cb-mockup-item"><i className="fa-solid fa-lock"></i></div>
                                    <div className="cb-mockup-item"><i className="fa-solid fa-lock"></i></div>
                                    <div className="cb-mockup-item"><i className="fa-solid fa-lock"></i></div>
                                    <div className="cb-mockup-item"><i className="fa-solid fa-lock"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Rating / Success Block */}
                    <div className="cb-card cb-dark about-card" style={{ justifyContent: 'space-between', '--card-i': 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '12px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Reviews</span>
                            <span className="cb-success-badge">98% Completion</span>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 'auto 0' }}>
                            <span className="cb-rating-num" style={{ fontSize: '3rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>4.8</span>
                            <div className="cb-stars-row" style={{ display: 'flex', gap: '4px', margin: '8px 0' }}>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star-half-stroke"></i>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Based on 12k+ reviews</span>
                        </div>

                        <div className="cb-content-bottom" style={{ marginTop: 'auto' }}>
                            <h3 className="cb-title" style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Top-Rated Platform</h3>
                            <p className="cb-text-small" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>Leading AI courses recognized globally for quality and student success.</p>
                        </div>
                    </div>

                    {/* Card 3: Vibrant Community (Spans 1) */}
                    <div className="cb-card cb-dark about-card" style={{ justifyContent: 'space-between', '--card-i': 2 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '12px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Network</span>
                            <div className="cb-live-pill">
                                <span className="cb-pulse-dot"></span>
                                340 Online
                            </div>
                        </div>
                        
                        <div className="cb-community-visual" style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
                            <div className="cb-avatar-stack">
                                <div className="cb-avatar" style={{ background: 'linear-gradient(135deg, #ff4e50, #f9d423)' }}>JP</div>
                                <div className="cb-avatar" style={{ background: 'linear-gradient(135deg, #00c6ff, #0072ff)' }}>SD</div>
                                <div className="cb-avatar" style={{ background: 'linear-gradient(135deg, #f857a6, #ff5858)' }}>AM</div>
                                <div className="cb-avatar" style={{ background: 'linear-gradient(135deg, #11998e, #38ef7d)' }}>TL</div>
                            </div>
                            <span className="cb-member-count">+12.8k</span>
                        </div>

                        <div className="cb-tag-grid" style={{ display: 'flex', gap: '6px', margin: '8px 0' }}>
                            <span className="cb-tag">#ai-collabs</span>
                            <span className="cb-tag">#whatsapp</span>
                            <span className="cb-tag">#projects</span>
                        </div>

                        <div className="cb-content-bottom" style={{ marginTop: 'auto' }}>
                            <h3 className="cb-title" style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Vibrant Community</h3>
                            <p className="cb-text-small" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>Collaborate on AI projects, ask questions, and build professional connections.</p>
                        </div>
                    </div>

                    {/* Card 4: Expert Mentorship (Spans 1) */}
                    <div className="cb-card cb-dark about-card" style={{ justifyContent: 'space-between', '--card-i': 3 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '12px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Mentorship</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a5b4fc', background: 'rgba(99,102,241,0.1)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(99,102,241,0.2)' }}>1-on-1 Sessions</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '80px', margin: '4px 0' }}>
                            <svg width="220" height="70" viewBox="0 0 220 70" fill="none">
                                <defs>
                                    <linearGradient id="nodeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#4f46e5" />
                                        <stop offset="100%" stopColor="#06b6d4" />
                                    </linearGradient>
                                    <linearGradient id="nodeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#a855f7" />
                                        <stop offset="100%" stopColor="#ec4899" />
                                    </linearGradient>
                                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#06b6d4" />
                                        <stop offset="50%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#a855f7" />
                                    </linearGradient>
                                </defs>
                                
                                {/* Animated Connecting Line */}
                                <path d="M 45,35 Q 110,15 175,35" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" fill="none" />
                                <path d="M 45,35 Q 110,15 175,35" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray="15 150" className="cb-signal-line" />

                                {/* Student Node */}
                                <circle cx="45" cy="35" r="18" fill="url(#nodeGrad1)" filter="drop-shadow(0px 4px 10px rgba(6, 182, 212, 0.4))" />
                                <text x="45" y="39" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800" fontFamily="sans-serif">YOU</text>

                                {/* Mentor Node */}
                                <circle cx="175" cy="35" r="18" fill="url(#nodeGrad2)" filter="drop-shadow(0px 4px 10px rgba(168, 85, 247, 0.4))" />
                                <text x="175" y="39" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800" fontFamily="sans-serif">PRO</text>
                            </svg>
                        </div>

                        <div className="cb-content-bottom" style={{ marginTop: 'auto' }}>
                            <h3 className="cb-title" style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Expert Mentorship</h3>
                            <p className="cb-text-small" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>Direct guidance from industry leaders to accelerate your career growth.</p>
                        </div>
                    </div>

                    {/* Card 5: Fast-Track Your Career (Spans 1) */}
                    <div className="cb-card cb-gradient-blue about-card" style={{ justifyContent: 'space-between', '--card-i': 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '12px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px' }}>Boost</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ffffff', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.3)' }}>10x Faster</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '80px', margin: '4px 0' }}>
                            <svg width="220" height="70" viewBox="0 0 220 70" fill="none">
                                <defs>
                                    <linearGradient id="chartGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                                        <stop offset="100%" stopColor="rgba(255,255,255,0.9)" />
                                    </linearGradient>
                                </defs>
                                
                                {/* Standard Pace (Dotted flat curve) */}
                                <path d="M 20,60 C 80,55 140,50 200,45" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                                <text x="140" y="60" fill="rgba(255,255,255,0.4)" fontSize="9" fontWeight="600" fontFamily="sans-serif">Standard Pace</text>
                                
                                {/* Fast Track Pace (Steep curve) */}
                                <path d="M 20,60 C 70,55 100,20 180,10" stroke="url(#chartGrad)" strokeWidth="4" strokeLinecap="round" fill="none" />
                                
                                {/* Glowing Dot */}
                                <circle cx="180" cy="10" r="5" fill="#ffffff" className="cb-spark-dot" />
                                <circle cx="180" cy="10" r="10" fill="none" stroke="#ffffff" strokeWidth="1.5" className="cb-spark-ring" />
                            </svg>
                        </div>

                        <div className="cb-content-bottom" style={{ marginTop: 'auto' }}>
                            <h3 className="cb-title" style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Fast-Track Career</h3>
                            <p className="cb-text-small" style={{ fontSize: '0.85rem', lineHeight: '1.4', color: 'rgba(255,255,255,0.9)' }}>Accelerated curriculum designed to get you job-ready in weeks, not years.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
