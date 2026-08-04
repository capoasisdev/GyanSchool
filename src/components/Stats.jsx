import React, { useState, useEffect, useRef } from 'react';

const COMPANIES_DATA = {
    amazon: {
        name: "Amazon",
        total: "62,000+",
        logo: "fa-brands fa-amazon",
        color: "#ff9900",
        strategy: "Reorganized corporate roles and AWS structures to streamline management bureaucracy, funneling the savings directly into generative Bedrock AI clusters.",
        sourceUrl: "https://press.aboutamazon.com",
        sourceLabel: "Amazon Press Center",
        breakdown: [
            { year: "2023", count: "27,000", value: 27000, action: "Pandemic-era operational adjustments" },
            { year: "2024", count: "5,000", value: 5000, action: "AWS & Prime Video restructuring" },
            { year: "2025", count: "14,000", value: 14000, action: "Corporate efficiency program cuts" },
            { year: "2026 YTD", count: "16,000 cut", value: 16000, action: "Lost until now this year", is2026: true },
            { year: "2026 Est.", count: "22,000 projected", value: 22000, action: "Expected to be lost", isProjected: true }
        ]
    },
    meta: {
        name: "Meta",
        total: "29,000+",
        logo: "fa-brands fa-meta",
        color: "#0668e1",
        strategy: "Flattened middle management layers during the 'Year of Efficiency' and automated content moderation streams to refocus capital on core AI research.",
        sourceUrl: "https://about.meta.com/newsroom/",
        sourceLabel: "Meta Newsroom",
        breakdown: [
            { year: "2023", count: "10,000", value: 10000, action: "'Year of Efficiency' restructuring" },
            { year: "2024", count: "2,000", value: 2000, action: "Instagram & Reality Labs target cuts" },
            { year: "2025", count: "1,500", value: 1500, action: "Middle management flattening" },
            { year: "2026 YTD", count: "8,000 cut", value: 8000, action: "Lost until now this year", is2026: true },
            { year: "2026 Est.", count: "10,000 projected", value: 10000, action: "Expected to be lost", isProjected: true }
        ]
    },
    google: {
        name: "Google",
        total: "22,000+",
        logo: "fa-brands fa-google",
        color: "#4285f4",
        strategy: "Consolidated hardware design teams and restructured voice assistant units to redirect computing budgets to generative Gemini LLM development.",
        sourceUrl: "https://blog.google",
        sourceLabel: "Google Blog",
        breakdown: [
            { year: "2023", count: "12,000", value: 12000, action: "Company-wide workforce adjustment" },
            { year: "2024", count: "3,000", value: 3000, action: "Hardware (Fitbit/Pixel) downsizing" },
            { year: "2025", count: "4,000", value: 4000, action: "Voice Assistant & Ad sales pivot" },
            { year: "2026 YTD", count: "3,000 cut", value: 3000, action: "Lost until now this year", is2026: true },
            { year: "2026 Est.", count: "5,000 projected", value: 5000, action: "Expected to be lost", isProjected: true }
        ]
    },
    tesla: {
        name: "Tesla",
        total: "24,000+",
        logo: "fa-solid fa-car",
        color: "#e82127",
        strategy: "Trimmed global operations, battery development, and sales staff to redirect capital towards Autopilot models, compute clusters, and Optimus robotics.",
        sourceUrl: "https://ir.tesla.com",
        sourceLabel: "Tesla Investor Relations",
        breakdown: [
            { year: "2023", count: "1,500", value: 1500, action: "Assembly line & factory changes" },
            { year: "2024", count: "14,000", value: 14000, action: "10% global workforce reduction" },
            { year: "2025", count: "3,500", value: 3500, action: "Supercharger & Sales team cuts" },
            { year: "2026 YTD", count: "2,000 cut", value: 2000, action: "Lost until now this year", is2026: true },
            { year: "2026 Est.", count: "4,000 projected", value: 4000, action: "Expected to be lost", isProjected: true }
        ]
    },
    microsoft: {
        name: "Microsoft",
        total: "18,000+",
        logo: "fa-brands fa-windows",
        color: "#f25022",
        strategy: "Downsized HoloLens/Mixed Reality divisions and sales units to accelerate Copilot integration across core Azure cloud instances.",
        sourceUrl: "https://news.microsoft.com",
        sourceLabel: "Microsoft News",
        breakdown: [
            { year: "2023", count: "10,000", value: 10000, action: "Cloud & hardware consolidation" },
            { year: "2024", count: "2,500", value: 2500, action: "HoloLens & Mixed Reality trimming" },
            { year: "2025", count: "3,000", value: 3000, action: "Sales & customer service restructuring" },
            { year: "2026 YTD", count: "1,500 cut", value: 1500, action: "Lost until now this year", is2026: true },
            { year: "2026 Est.", count: "3,000 projected", value: 3000, action: "Expected to be lost", isProjected: true }
        ]
    }
};

const NEWS_CLIPPINGS = [
    {
        url: "https://static.digit.in/meta-ai-big-tech-layoff-2025.png",
        caption: "Meta AI & Big Tech Layoffs Highlight",
        rot: "-5deg",
        left: "0%"
    },
    {
        url: "https://pbs.twimg.com/media/Gw8jVwHa8AAcbBG.jpg",
        caption: "TCS Layoff Newspaper Coverage",
        rot: "4deg",
        left: "25%"
    },
    {
        url: "https://c8.alamy.com/comp/3BJ18P0/the-death-of-creativity-advent-of-ai-brings-fear-for-jobs-in-advertising-industry-guardian-newspaper-headline-10-june-2025-london-uk-3BJ18P0.jpg",
        caption: "Guardian Headline: AI Brings Job Fear",
        rot: "-3deg",
        left: "50%"
    },
    {
        url: "https://media.licdn.com/dms/image/v2/D5622AQFhZO1CuZ6f5Q/feedshare-shrink_800/B56ZxJHpmQGsAg-/0/1770753268466?e=2147483647&v=beta&t=s0o3B8qJk1j0F1iNB5qp9tTp8hVVyiSewXxfj_ok79g",
        caption: "Corporate Layoffs Tracking Log",
        rot: "6deg",
        left: "75%"
    }
];

export default function Stats() {
    const [selectedCompany, setSelectedCompany] = useState('amazon');
    const [viewMode, setViewMode] = useState('graph'); // 'graph' or 'list'
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [hoveredClipping, setHoveredClipping] = useState(null);
    const [activeLightbox, setActiveLightbox] = useState(null);
    const sectionRef = useRef(null);

    // Scroll-triggered entrance animations
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        const els = section.querySelectorAll('.stats-anim-el');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        els.forEach(el => el.classList.add('in-view'));
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.08 }
        );
        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    // Keyboard navigation (Escape, Left, Right)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (activeLightbox === null) return;

            if (e.key === 'Escape') {
                setActiveLightbox(null);
            } else if (e.key === 'ArrowRight') {
                setActiveLightbox((prev) => (prev + 1) % NEWS_CLIPPINGS.length);
            } else if (e.key === 'ArrowLeft') {
                setActiveLightbox((prev) => (prev - 1 + NEWS_CLIPPINGS.length) % NEWS_CLIPPINGS.length);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeLightbox]);

    const activeCompany = COMPANIES_DATA[selectedCompany];

    // SVG Layout Constants
    const svgWidth = 500;
    const svgHeight = 220;
    const paddingLeft = 50;
    const paddingRight = 30;
    const paddingTop = 20;
    const paddingBottom = 40;

    const maxVal = Math.max(...activeCompany.breakdown.map(d => d.value), 1000);

    const points = activeCompany.breakdown.map((item, idx) => {
        const x = paddingLeft + (idx / (activeCompany.breakdown.length - 1)) * (svgWidth - paddingLeft - paddingRight);
        const yVal = item.value / maxVal;
        const y = svgHeight - paddingBottom - yVal * (svgHeight - paddingTop - paddingBottom);
        return { x, y, ...item };
    });

    // Draw cubic bezier curve
    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const cpX1 = p0.x + (p1.x - p0.x) / 2;
        const cpY1 = p0.y;
        const cpX2 = p0.x + (p1.x - p0.x) / 2;
        const cpY2 = p1.y;
        pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }

    const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingBottom} L ${points[0].x} ${svgHeight - paddingBottom} Z`;

    const gridRatios = [0, 0.25, 0.5, 0.75, 1];

    const showPrevClipping = (e) => {
        e.stopPropagation();
        setActiveLightbox((prev) => (prev - 1 + NEWS_CLIPPINGS.length) % NEWS_CLIPPINGS.length);
    };

    const showNextClipping = (e) => {
        e.stopPropagation();
        setActiveLightbox((prev) => (prev + 1) % NEWS_CLIPPINGS.length);
    };

    return (
        <section className="stats-section" style={{ padding: '6rem 0px 3rem 0rem' }} ref={sectionRef}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.2fr', gap: '60px', alignItems: 'center' }} className="stats-split">
                    {/* Left Column: General Stats & Summary */}
                    <div className="stats-intro" style={{ textAlign: 'left', margin: 0, maxWidth: 'none' }}>
                        <span className="stats-anim-el stats-left" style={{ '--si': 0, fontSize: '0.82rem', fontWeight: '700', color: '#e11d48', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fa-solid fa-triangle-exclamation"></i> The Great Tech Reorganization
                        </span>
                        <h2 className="stats-anim-el stats-left" style={{ '--si': 1, fontSize: '2.85rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem', lineHeight: '1.12', fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}>
                            200K+ jobs cut as Big Tech <span className="highlight">pivots to AI.</span>
                        </h2>

                        {/* Interactive Newspaper Clippings Stack with Lightbox Trigger */}
                        <div style={{ position: 'relative', height: '145px', margin: '2rem 0 3rem 0', display: 'flex', alignItems: 'center', '--si': 2 }} className="clippings-container stats-anim-el stats-left">
                            {NEWS_CLIPPINGS.map((clip, idx) => {
                                const isHovered = hoveredClipping === idx;
                                return (
                                    <div
                                        key={idx}
                                        onMouseEnter={() => setHoveredClipping(idx)}
                                        onMouseLeave={() => setHoveredClipping(null)}
                                        onClick={() => setActiveLightbox(idx)}
                                        style={{
                                            position: 'absolute',
                                            left: clip.left,
                                            width: '26%',
                                            height: '115px',
                                            borderRadius: '12px',
                                            border: '4px solid #ffffff',
                                            boxShadow: isHovered
                                                ? '0 20px 40px rgba(106, 49, 240, 0.25)'
                                                : '0 6px 16px rgba(15, 23, 42, 0.08)',
                                            background: '#f1f5f9',
                                            backgroundImage: `url(${clip.url})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            transform: isHovered
                                                ? 'rotate(0deg) scale(1.4)'
                                                : `rotate(${clip.rot})`,
                                            zIndex: isHovered ? 50 : (10 + idx),
                                            filter: isHovered ? 'grayscale(0%) contrast(1.15)' : 'grayscale(10%) contrast(0.95)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        title={`${clip.caption} (Click to expand)`}
                                    >
                                        {/* Hover Indicator Overlay */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'rgba(106, 49, 240, 0.2)',
                                            opacity: isHovered ? 1 : 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'opacity 0.2s ease',
                                            color: '#ffffff',
                                            fontSize: '1.4rem'
                                        }}>
                                            <i className="fa-solid fa-magnifying-glass-plus"></i>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Current 2026 Trajectory Overview Block */}
                        <div className="stats-anim-el stats-left" style={{ '--si': 3, background: 'linear-gradient(135deg, #fff5f5 0%, #fffbeb 100%)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '20px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'stats-pulse 1.5s infinite' }}></span>
                                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current 2026 Trajectory</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '1.75rem', fontWeight: '600', color: '#dc2626', lineHeight: '1.1' }}>118,000+</div>
                                    <div style={{ fontSize: '0.78rem', color: '#7f1d1d', marginTop: '4px', fontWeight: '500' }}>Lost until now this year</div>
                                </div>
                                <div style={{ borderLeft: '1px solid rgba(220, 38, 38, 0.15)', paddingLeft: '16px' }}>
                                    <div style={{ fontSize: '1.75rem', fontWeight: '600', color: '#d97706', lineHeight: '1.1' }}>240,000+</div>
                                    <div style={{ fontSize: '0.78rem', color: '#78350f', marginTop: '4px', fontWeight: '500' }}>Expected to be lost this year</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interactive Company Layoff Inspector */}
                    <div className="stats-anim-el stats-right" style={{ '--si': 0 }}>
                        <div style={{ background: '#ffffff', border: '1px solid rgba(148, 163, 184, 0.18)', borderRadius: '24px', padding: '32px 28px', boxShadow: '0 10px 30px rgba(30, 41, 59, 0.02)', position: 'relative' }}>
                            {/* Card Header with View Mode Toggle */}
                            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                <div style={{ textAlign: 'left' }}>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#0f172a', margin: 0, fontFamily: 'var(--font-heading)' }}>
                                        Corporate Reorganization Log
                                    </h3>
                                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Select a tech giant to audit their AI transition cuts</span>
                                </div>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            borderBottom: viewMode === 'list' ? '2px solid #6a31f0' : '2px solid transparent',
                                            borderRadius: '0',
                                            padding: '8px 4px',
                                            fontSize: '0.82rem',
                                            fontWeight: '600',
                                            color: viewMode === 'list' ? '#0f172a' : '#64748b',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <i className="fa-solid fa-list-ul"></i> List
                                    </button>
                                    <button
                                        onClick={() => setViewMode('graph')}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            borderBottom: viewMode === 'graph' ? '2px solid #6a31f0' : '2px solid transparent',
                                            borderRadius: '0',
                                            padding: '8px 4px',
                                            fontSize: '0.82rem',
                                            fontWeight: '600',
                                            color: viewMode === 'graph' ? '#0f172a' : '#64748b',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <i className="fa-solid fa-chart-line"></i> Graph
                                    </button>
                                </div>
                            </div>

                            {/* Company Selection Tabs */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0px', borderBottom: '1px solid rgba(148, 163, 184, 0.12)', marginBottom: '24px' }}>
                                {Object.keys(COMPANIES_DATA).map((key) => {
                                    const comp = COMPANIES_DATA[key];
                                    const isSelected = selectedCompany === key;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => setSelectedCompany(key)}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                borderBottom: isSelected ? `3px solid ${comp.color}` : '3px solid transparent',
                                                borderRadius: '0',
                                                padding: '12px 6px',
                                                fontSize: '0.75rem',
                                                fontWeight: '700',
                                                color: isSelected ? '#0f172a' : '#64748b',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '6px',
                                                transition: 'all 0.2s ease',
                                                minWidth: '0'
                                            }}
                                        >
                                            <i className={comp.logo} style={{ color: isSelected ? comp.color : '#94a3b8', fontSize: '1.25rem', transition: 'all 0.2s ease' }}></i>
                                            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>{comp.name}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Inspector Output Details */}
                            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>


                                {/* Dynamic View (List vs. Graph) */}
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>
                                        Verified Reduction Breakdown
                                    </div>

                                    {viewMode === 'list' ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {activeCompany.breakdown.map((item, idx) => {
                                                let badgeBg = '#f5f2ff';
                                                let badgeColor = '#6a31f0';
                                                let tagColor = '#e11d48';
                                                let tagBg = '#fef2f2';
                                                let tagBorder = 'rgba(148, 163, 184, 0.08)';

                                                if (item.is2026) {
                                                    badgeBg = '#fee2e2';
                                                    badgeColor = '#dc2626';
                                                } else if (item.isProjected) {
                                                    badgeBg = '#fef3c7';
                                                    badgeColor = '#d97706';
                                                    tagColor = '#d97706';
                                                }

                                                return (
                                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', borderBottom: '1px solid rgba(148, 163, 184, 0.08)', padding: '12px 4px' }}>
                                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                                            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: badgeColor, minWidth: '70px', whiteSpace: 'nowrap' }}>
                                                                {item.year}
                                                            </span>
                                                            <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: '500' }}>{item.action}</span>
                                                        </div>
                                                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: tagColor }}>
                                                            {item.count}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div style={{ position: 'relative', background: '#f8fafc', border: '1px solid rgba(148, 163, 184, 0.08)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                                                <defs>
                                                    <linearGradient id={`grad-${selectedCompany}`} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor={activeCompany.color} stopOpacity="0.35" />
                                                        <stop offset="100%" stopColor={activeCompany.color} stopOpacity="0.0" />
                                                    </linearGradient>
                                                </defs>

                                                {/* Grid Lines & Y Labels */}
                                                {gridRatios.map((ratio, i) => {
                                                    const y = svgHeight - paddingBottom - ratio * (svgHeight - paddingTop - paddingBottom);
                                                    const val = Math.round(ratio * maxVal);
                                                    return (
                                                        <g key={i}>
                                                            <line
                                                                x1={paddingLeft}
                                                                y1={y}
                                                                x2={svgWidth - paddingRight}
                                                                y2={y}
                                                                stroke="#e2e8f0"
                                                                strokeDasharray="3 3"
                                                            />
                                                            <text
                                                                x={paddingLeft - 8}
                                                                y={y + 3}
                                                                textAnchor="end"
                                                                fill="#94a3b8"
                                                                style={{ fontSize: '9px', fontWeight: '600', fontFamily: 'monospace' }}
                                                            >
                                                                {val.toLocaleString()}
                                                            </text>
                                                        </g>
                                                    );
                                                })}

                                                {/* Area under curve */}
                                                <path d={areaD} fill={`url(#grad-${selectedCompany})`} />

                                                {/* Line path */}
                                                <path
                                                    d={pathD}
                                                    fill="none"
                                                    stroke={activeCompany.color}
                                                    strokeWidth="3.5"
                                                    strokeLinecap="round"
                                                    style={{ transition: 'd 0.3s ease' }}
                                                />

                                                {/* Interactive Nodes */}
                                                {points.map((pt, idx) => {
                                                    const isHovered = hoveredIdx === idx;
                                                    return (
                                                        <g key={idx}>
                                                            <circle
                                                                cx={pt.x}
                                                                cy={pt.y}
                                                                r="18"
                                                                fill="transparent"
                                                                style={{ cursor: 'pointer' }}
                                                                onMouseEnter={() => setHoveredIdx(idx)}
                                                                onMouseLeave={() => setHoveredIdx(null)}
                                                            />
                                                            <circle
                                                                cx={pt.x}
                                                                cy={pt.y}
                                                                r={isHovered ? "8" : "5.5"}
                                                                fill={isHovered ? "#ffffff" : activeCompany.color}
                                                                stroke={activeCompany.color}
                                                                strokeWidth={isHovered ? "3.5" : "2.5"}
                                                                style={{ transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)', pointerEvents: 'none' }}
                                                            />
                                                        </g>
                                                    );
                                                })}

                                                {/* X Axis Labels */}
                                                {points.map((pt, idx) => (
                                                    <text
                                                        key={idx}
                                                        x={pt.x}
                                                        y={svgHeight - 14}
                                                        textAnchor="middle"
                                                        fill="#64748b"
                                                        style={{ fontSize: '10px', fontWeight: '700' }}
                                                    >
                                                        {pt.year}
                                                    </text>
                                                ))}
                                            </svg>

                                            {/* HTML Tooltip Box */}
                                            {hoveredIdx !== null && (() => {
                                                const pt = points[hoveredIdx];
                                                // Calculate responsive parent positions
                                                const pctX = (pt.x / svgWidth) * 100;
                                                const pctY = (pt.y / svgHeight) * 100;
                                                return (
                                                    <div style={{
                                                        position: 'absolute',
                                                        left: `${pctX}%`,
                                                        top: `calc(${pctY}% - 14px)`,
                                                        transform: 'translate(-50%, -100%)',
                                                        background: '#0f172a',
                                                        color: '#ffffff',
                                                        padding: '8px 12px',
                                                        borderRadius: '8px',
                                                        fontSize: '0.75rem',
                                                        pointerEvents: 'none',
                                                        zIndex: 100,
                                                        boxShadow: '0 8px 20px rgba(15, 23, 42, 0.2)',
                                                        whiteSpace: 'nowrap',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '2px',
                                                        alignItems: 'center',
                                                        transition: 'all 0.15s ease'
                                                    }}>
                                                        <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{pt.count}</div>
                                                        <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{pt.action}</div>
                                                        <div style={{
                                                            position: 'absolute',
                                                            bottom: '-4px',
                                                            left: '50%',
                                                            transform: 'translateX(-50%) rotate(45deg)',
                                                            width: '8px',
                                                            height: '8px',
                                                            background: '#0f172a'
                                                        }}></div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Modal Component */}
            {activeLightbox !== null && (
                <div
                    onClick={() => setActiveLightbox(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(15, 23, 42, 0.9)',
                        backdropFilter: 'blur(10px)',
                        zIndex: 9999,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                        cursor: 'zoom-out',
                        animation: 'lightbox-fade 0.2s ease-out'
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setActiveLightbox(null)}
                        style={{
                            position: 'absolute',
                            top: '24px',
                            right: '24px',
                            background: 'rgba(255,255,255,0.15)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '46px',
                            height: '46px',
                            color: '#ffffff',
                            fontSize: '1.4rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s ease',
                            zIndex: 10002
                        }}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>

                    {/* Image Container Box */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: '90%',
                            maxHeight: '70%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'default',
                            animation: 'lightbox-scale 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                    >
                        <img
                            src={NEWS_CLIPPINGS[activeLightbox].url}
                            alt={NEWS_CLIPPINGS[activeLightbox].caption}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '60vh',
                                borderRadius: '12px',
                                border: '6px solid #ffffff',
                                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                                objectFit: 'contain'
                            }}
                        />
                    </div>

                    {/* Controls Row containing Prev Button, Counter/Caption card, Next Button */}
                    <div className="lightbox-controls-row" onClick={(e) => e.stopPropagation()}>
                        <button className="lightbox-btn-prev" onClick={showPrevClipping}>
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>

                        <div className="lightbox-caption-card">
                            <span className="lightbox-caption-text">{NEWS_CLIPPINGS[activeLightbox].caption}</span>
                            <span className="lightbox-counter">
                                {activeLightbox + 1} / {NEWS_CLIPPINGS.length}
                            </span>
                        </div>

                        <button className="lightbox-btn-next" onClick={showNextClipping}>
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* Custom Responsive Overrides & Lightbox Animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes stats-pulse {
                    0% { transform: scale(0.95); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(0.95); opacity: 0.5; }
                }
                @keyframes lightbox-fade {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes lightbox-scale {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                
                /* Lightbox Controls Styles */
                .lightbox-controls-row {
                    position: absolute;
                    bottom: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                    z-index: 10002;
                }
                .lightbox-btn-prev, .lightbox-btn-next {
                    background: rgba(255,255,255,0.1);
                    border: none;
                    border-radius: 50%;
                    width: 56px;
                    height: 56px;
                    color: #ffffff;
                    font-size: 1.5rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }
                .lightbox-btn-prev:hover, .lightbox-btn-next:hover {
                    background: rgba(255,255,255,0.25);
                    transform: scale(1.1);
                }
                .lightbox-caption-card {
                    background: #ffffff;
                    padding: 12px 24px;
                    border-radius: 30px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: #0f172a;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }
                .lightbox-counter {
                    background: #f1f5f9;
                    color: #6a31f0;
                    padding: 2px 10px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 700;
                }

                @media (max-width: 1024px) {
                    .stats-split {
                        grid-template-columns: 1fr !important;
                        gap: 40px !important;
                    }
                }
                @media (max-width: 768px) {
                    .clippings-container {
                        height: 100px !important;
                        margin: 1.5rem 0 2rem 0 !important;
                    }
                    .clippings-container div {
                        height: 75px !important;
                    }
                    .lightbox-controls-row {
                        display: flex !important;
                        flex-direction: row !important;
                        align-items: center !important;
                        justify-content: center !important;
                        gap: 12px !important;
                        width: calc(100% - 48px) !important;
                        bottom: 24px !important;
                    }
                    .lightbox-btn-prev, .lightbox-btn-next {
                        position: static !important;
                        transform: none !important;
                        width: 48px !important;
                        height: 48px !important;
                        font-size: 1.2rem !important;
                        background: rgba(255,255,255,0.15) !important;
                    }
                    .lightbox-btn-prev:hover, .lightbox-btn-next:hover {
                        transform: none !important;
                        background: rgba(255,255,255,0.25) !important;
                    }
                    .lightbox-caption-text {
                        display: none !important;
                    }
                    .lightbox-caption-card {
                        padding: 8px 16px !important;
                    }
                }
                @media (max-width: 550px) {
                    .stats-split button {
                        padding: 8px 4px !important;
                        font-size: 0.68rem !important;
                    }
                }
            `}} />
        </section>
    );
}
