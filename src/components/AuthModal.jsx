import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { hasPurchasedAnyCourse } from '../utils/progressTracker';
import { supabase } from '../utils/supabaseClient';


export default function AuthModal({ isOpen, onClose, onStartQuiz, onExploreCourses }) {
    const { sendOtp, verifyOtp, logout } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isNonLearner, setIsNonLearner] = useState(false);

    if (!isOpen) return null;

    const syncPrivilegedEmails = async () => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('name')
                .eq('email', 'admin_config@gyanschool.com')
                .maybeSingle();
            if (data && data.name) {
                const parsed = JSON.parse(data.name);
                if (Array.isArray(parsed)) {
                    localStorage.setItem('gyanschool_privileged_emails', JSON.stringify(parsed));
                }
            }
        } catch (err) {
            console.error("Failed to sync privileged emails:", err);
        }
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }

        setLoading(true);
        // Sync latest privileged emails list from Supabase
        await syncPrivilegedEmails();

        // Verify if user is an active course enrollee
        if (!hasPurchasedAnyCourse(email.trim(), null)) {
            setIsNonLearner(true);
            setLoading(false);
            return;
        }

        const result = await sendOtp(email.trim());
        setLoading(false);

        if (result.error) {
            setError(result.error);
        } else {
            setOtpSent(true);
            setMessage(result.isMock ? 'Demo login active. Use verification code 123456.' : 'Verification code sent! Please check your email inbox.');
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!otpCode.trim() || otpCode.trim().length !== 6) {
            setError('Please enter the 6-digit verification code.');
            return;
        }

        setLoading(true);
        // Sync latest privileged emails list from Supabase
        await syncPrivilegedEmails();

        const result = await verifyOtp(email.trim(), otpCode.trim());
        setLoading(false);

        if (result.error) {
            setError(result.error);
        } else {
            // Verify enrollment bounds after logging in
            if (!hasPurchasedAnyCourse(email.trim(), null)) {
                await logout();
                setIsNonLearner(true);
                return;
            }
            onClose();
            navigate('/learn');
        }

    };

    const otpArray = otpCode.split('').concat(Array(6).fill('')).slice(0, 6);

    return (
        <div className="auth-overlay" onClick={onClose} style={{ background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(8px)' }}>
            <div className="auth-modal" style={{ background: '#ffffff', borderRadius: '16px', padding: '2.5rem 2rem', maxWidth: '380px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', fontFamily: 'Outfit, sans-serif' }} onClick={(e) => e.stopPropagation()}>
                <button className="auth-close-btn" onClick={onClose} style={{ color: '#64748b' }}>
                    <i className="fa-solid fa-xmark"></i>
                </button>

                <div className="auth-tabs" style={{ justifyContent: 'center', background: 'transparent', marginBottom: '1.5rem', padding: 0 }}>
                    <h2 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.45rem', fontWeight: 600, textAlign: 'center', letterSpacing: '-0.5px' }}>
                        {otpSent ? 'Confirm Code' : 'Sign In'}
                    </h2>
                </div>

                {isNonLearner ? (
                    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'Outfit, sans-serif' }}>
                        <i className="fa-solid fa-circle-exclamation" style={{ fontSize: '2.5rem', color: '#f59e0b', margin: '10px 0' }}></i>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Enrollment Required</h3>
                        <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                            We couldn't find any purchased courses for <strong>{email || 'your email'}</strong>. Access to the learner portal is reserved for students who have purchased a course.
                        </p>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5, margin: '8px 0 0 0' }}>
                            Select one of the options below to find your path or browse our executive training catalog:
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsNonLearner(false);
                                    if (onStartQuiz) onStartQuiz();
                                    onClose();
                                }}
                                style={{ width: '100%', padding: '12px', background: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }}
                            >
                                Take 1-Min Quiz
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsNonLearner(false);
                                    if (onExploreCourses) onExploreCourses();
                                    onClose();
                                }}
                                style={{ width: '100%', padding: '12px', background: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }}
                            >
                                Explore All Courses
                            </button>
                            <button
                                type="button"
                                style={{ background: 'none', border: 'none', color: '#6366f1', width: '100%', marginTop: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}
                                onClick={() => {
                                    setIsNonLearner(false);
                                    setOtpSent(false);
                                    setError('');
                                    setMessage('');
                                    setOtpCode('');
                                    setEmail('');
                                }}
                            >
                                Try another email
                            </button>
                        </div>
                    </div>
                ) : !otpSent ? (
                    <form className="auth-form" onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <p className="auth-forgot-hint" style={{ textAlign: 'center', marginBottom: '4px', color: '#64748b', fontSize: '0.88rem', fontWeight: 400, lineHeight: 1.5 }}>
                            Enter your email address to receive a secure 6-digit verification code to access your courses.
                        </p>

                        <div className="auth-field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Email Address</label>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                style={{
                                    padding: '10px 14px',
                                    border: '1.5px solid #cbd5e1',
                                    borderRadius: '8px',
                                    fontSize: '0.95rem',
                                    fontWeight: 400,
                                    outline: 'none',
                                    background: '#f8fafc',
                                    color: '#0f172a',
                                    transition: 'all 0.15s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                            />
                        </div>

                        {error && <p className="auth-error" style={{ color: '#ef4444', fontSize: '0.85rem', margin: 0, textAlign: 'center' }}>{error}</p>}
                        {message && <p className="auth-success-msg" style={{ color: '#10b981', fontSize: '0.85rem', margin: 0, textAlign: 'center' }}>{message}</p>}

                        <button type="submit" className="auth-submit-btn" disabled={loading} style={{ width: '100%', padding: '12px', background: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer', textTransform: 'none', letterSpacing: 'normal', transition: 'background 0.15s' }}>
                            {loading ? 'Sending...' : 'Send Verification Code'}
                        </button>
                    </form>
                ) : (
                    <form className="auth-form" onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <p className="auth-forgot-hint" style={{ textAlign: 'center', marginBottom: '4px', color: '#64748b', fontSize: '0.88rem', fontWeight: 400, lineHeight: 1.5 }}>
                            We sent a secure code to <strong>{email}</strong>. Enter it below to sign in.
                        </p>

                        <div className="auth-field" style={{ position: 'relative', width: '100%', margin: '8px 0' }}>
                            <label style={{ display: 'block', textAlign: 'center', marginBottom: '12px', fontSize: '0.75rem', fontWeight: 600, color: '#475569', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                Verification Code
                            </label>
                            
                            <div style={{ position: 'relative', width: '100%' }}>
                                {/* 6 Styled Boxes */}
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', pointerEvents: 'none' }}>
                                    {otpArray.map((char, idx) => {
                                        const isFocused = idx === otpCode.length;
                                        return (
                                            <div
                                                key={idx}
                                                style={{
                                                    width: '42px',
                                                    height: '50px',
                                                    border: isFocused ? '2px solid #6366f1' : '1.5px solid #e2e8f0',
                                                    borderRadius: '8px',
                                                    background: '#f8fafc',
                                                    color: '#0f172a',
                                                    fontSize: '1.25rem',
                                                    fontWeight: '500',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: isFocused ? '0 0 0 3px rgba(99, 102, 241, 0.15)' : 'none',
                                                    transition: 'all 0.1s'
                                                }}
                                            >
                                                {char}
                                            </div>
                                        );
                                    })}
                                </div>
                                {/* Actual hidden text input */}
                                 <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={6}
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                    disabled={loading}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        opacity: 0,
                                        cursor: 'pointer',
                                        caretColor: 'transparent',
                                        zIndex: 10
                                    }}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {error && <p className="auth-error" style={{ color: '#ef4444', fontSize: '0.85rem', margin: 0, textAlign: 'center' }}>{error}</p>}
                        {message && <p className="auth-success-msg" style={{ color: '#10b981', fontSize: '0.85rem', margin: 0, textAlign: 'center' }}>{message}</p>}

                        <button type="submit" className="auth-submit-btn" disabled={loading} style={{ width: '100%', padding: '12px', background: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer', textTransform: 'none', letterSpacing: 'normal', transition: 'background 0.15s' }}>
                            {loading ? 'Verifying...' : 'Verify & Log In'}
                        </button>

                        <button
                            type="button"
                            className="auth-forgot-hint"
                            style={{ background: 'none', border: 'none', color: '#6366f1', width: '100%', marginTop: '4px', cursor: 'pointer', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}
                            onClick={() => {
                                setOtpSent(false);
                                setError('');
                                setMessage('');
                                setOtpCode('');
                            }}
                            disabled={loading}
                        >
                            Change Email Address
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
