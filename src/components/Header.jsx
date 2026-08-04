import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPurchasedCourses } from '../utils/progressTracker';
import AuthModal from './AuthModal';

export default function Header() {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);


    useEffect(() => {
        if (searchParams.get('auth') === 'login') {
            setAuthOpen(true);
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('auth');
            setSearchParams(newParams);
        }
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    const hasPurchased = getPurchasedCourses(user?.id).length > 0;

    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const sectionIds = ['about', 'courses', 'trainers', 'faq'];
        const observers = [];

        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveSection(id);
                },
                { threshold: 0.3 }
            );
            obs.observe(el);
            observers.push(obs);
        });

        // Reset to '' when scrolled back to very top
        const heroObs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setActiveSection(''); },
            { threshold: 0.2 }
        );
        const heroEl = document.getElementById('hero');
        if (heroEl) { heroObs.observe(heroEl); observers.push(heroObs); }

        return () => observers.forEach(o => o.disconnect());
    }, []);

    return (
        <>
            <header className={`header ${scrolled ? 'sticky-header' : ''}`} id="header">
                <div className="container nav-wrapper">
                    <button 
                        className="mobile-menu-btn" 
                        aria-label="Toggle Menu"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                    </button>
                    <Link to="/" className="logo">
                        GyanSchool <span className="logo-sub">by CapOasis</span>
                    </Link>
                    <nav className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
                        <a href="#hero" onClick={() => setMobileMenuOpen(false)} className={activeSection === '' ? 'active' : ''}>Home</a>
                        <a href="#about" onClick={() => setMobileMenuOpen(false)} className={activeSection === 'about' ? 'active' : ''}>About</a>
                        <a href="#courses" onClick={() => setMobileMenuOpen(false)} className={activeSection === 'courses' ? 'active' : ''}>Curriculum</a>
                        <a href="#trainers" onClick={() => setMobileMenuOpen(false)} className={activeSection === 'trainers' ? 'active' : ''}>Leadership</a>
                        <a href="#faq" onClick={() => setMobileMenuOpen(false)} className={activeSection === 'faq' ? 'active' : ''}>FAQ</a>
                        <a href="/gyanschool-app.apk" download onClick={() => setMobileMenuOpen(false)} className="nav-download-link mobile-only-link">
                            <i className="fa-solid fa-download"></i> Download App
                        </a>
                        {(hasPurchased || user) && (
                            <Link to="/learn" className="nav-learn-link" onClick={() => setMobileMenuOpen(false)}>
                                <i className="fa-solid fa-graduation-cap"></i> My Learning
                            </Link>
                        )}
                        {user ? (
                            <button className="nav-mobile-logout-btn" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                                <i className="fa-solid fa-right-from-bracket"></i> Logout
                            </button>
                        ) : (
                            <button className="nav-mobile-login-btn" onClick={() => { setAuthOpen(true); setMobileMenuOpen(false); }}>
                                <i className="fa-solid fa-right-to-bracket"></i> Login
                            </button>
                        )}
                    </nav>
                    <div className="header-actions">
                        {user ? (
                            <div className="header-user-dropdown-container" ref={dropdownRef}>
                                <button className="header-avatar-btn" onClick={() => setDropdownOpen(!dropdownOpen)} aria-label="User Menu">
                                    <div className="header-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                </button>
                                {dropdownOpen && (
                                    <div className="header-dropdown-menu">
                                        <Link to="/learn?tab=profile" className="header-dropdown-item" onClick={() => setDropdownOpen(false)}>
                                            <i className="fa-solid fa-circle-user"></i> Profile
                                        </Link>
                                        <button className="header-dropdown-item logout" onClick={() => { logout(); setDropdownOpen(false); }}>
                                            <i className="fa-solid fa-right-from-bracket"></i> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <button className="header-login-btn" onClick={() => setAuthOpen(true)}>
                                    Login
                                </button>
                                <button className="btn btn-start-now" onClick={() => setSearchParams({ step: '1' })} style={{ padding: '0.6rem 1.4rem', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}>
                                    Start now
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <AuthModal 
                isOpen={authOpen} 
                onClose={() => setAuthOpen(false)} 
                onStartQuiz={() => {
                    localStorage.removeItem('gyanschool_checkout_course_idx');
                    setSearchParams({ step: '1' });
                }}
                onExploreCourses={() => {
                    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
                }}
            />
        </>
    );
}
