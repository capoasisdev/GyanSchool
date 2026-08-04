import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function InfluencerPortal() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [influencer, setInfluencer] = useState(null);
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [showPass, setShowPass] = useState(false);

    useEffect(() => {
        const savedInfluencer = sessionStorage.getItem('gyanschool_influencer');
        if (savedInfluencer) {
            try {
                const parsed = JSON.parse(savedInfluencer);
                setInfluencer(parsed);
                setIsLoggedIn(true);
                fetchReferrals(parsed.id);
            } catch (e) {
                sessionStorage.removeItem('gyanschool_influencer');
            }
        }
    }, []);

    const fetchReferrals = async (influencerId) => {
        try {
            const { data } = await supabase
                .from('referrals')
                .select('*')
                .eq('influencer_id', influencerId)
                .order('created_at', { ascending: false });
            setReferrals(data || []);
        } catch (err) {
            console.error('Error fetching referrals:', err);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await supabase
                .from('influencers')
                .select('*')
                .eq('email', email.trim().toLowerCase())
                .eq('password', password)
                .maybeSingle();

            if (data) {
                setInfluencer(data);
                setIsLoggedIn(true);
                sessionStorage.setItem('gyanschool_influencer', JSON.stringify(data));
                fetchReferrals(data.id);
            } else {
                setError('Invalid email or password. Please try again.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('gyanschool_influencer');
        setInfluencer(null);
        setReferrals([]);
        setIsLoggedIn(false);
    };

    const copyToClipboard = () => {
        if (!influencer) return;
        navigator.clipboard.writeText(influencer.promo_code.toUpperCase());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const totalEarnings = referrals.reduce((sum, ref) => sum + Number(ref.commission_earned), 0);

    // ─── LOGIN PAGE ──────────────────────────────────────────────────────────
    if (!isLoggedIn) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Ambient blobs */}
                <div style={{
                    position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(138,43,226,0.25) 0%, transparent 70%)',
                    top: '-100px', left: '-100px', pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(79,70,229,0.2) 0%, transparent 70%)',
                    bottom: '-80px', right: '-80px', pointerEvents: 'none'
                }} />

                <div style={{
                    width: '100%', maxWidth: '420px',
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    padding: '48px 40px',
                    boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    {/* Logo */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '16px',
                            background: 'linear-gradient(135deg, #8b5cf6, #4f46e5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px',
                            boxShadow: '0 8px 24px rgba(139,92,246,0.4)'
                        }}>
                            <img src="/images/gyanschool_logo.png" alt="G" style={{ width: '40px', height: '40px', objectFit: 'contain', filter: 'brightness(10)' }} />
                        </div>
                        <h1 style={{
                            margin: '0 0 8px', fontSize: '26px', fontWeight: '800',
                            color: '#ffffff', letterSpacing: '-0.5px',
                            fontFamily: "'Poppins', system-ui, sans-serif"
                        }}>Collaborator Portal</h1>
                        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5' }}>
                            Track your referrals & commission earnings
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            padding: '12px 16px', borderRadius: '10px',
                            background: 'rgba(239,68,68,0.15)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            color: '#fca5a5', fontSize: '14px',
                            marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            <i className="fa-solid fa-circle-exclamation"></i>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', letterSpacing: '0.3px' }}>
                                EMAIL ADDRESS
                            </label>
                            <div style={{ position: 'relative' }}>
                                <i className="fa-solid fa-envelope" style={{
                                    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                                    color: 'rgba(255,255,255,0.35)', fontSize: '14px'
                                }}></i>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        padding: '13px 14px 13px 40px',
                                        borderRadius: '10px',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        background: 'rgba(255,255,255,0.07)',
                                        color: '#ffffff', fontSize: '15px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                    }}
                                    onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,0.7)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', letterSpacing: '0.3px' }}>
                                PASSWORD
                            </label>
                            <div style={{ position: 'relative' }}>
                                <i className="fa-solid fa-lock" style={{
                                    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                                    color: 'rgba(255,255,255,0.35)', fontSize: '14px'
                                }}></i>
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••••"
                                    required
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        padding: '13px 44px 13px 40px',
                                        borderRadius: '10px',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        background: 'rgba(255,255,255,0.07)',
                                        color: '#ffffff', fontSize: '15px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                    }}
                                    onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,0.7)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; }}
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
                                    cursor: 'pointer', padding: '4px', fontSize: '14px'
                                }}>
                                    <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} style={{
                            marginTop: '8px',
                            padding: '14px',
                            borderRadius: '12px',
                            border: 'none',
                            background: loading ? 'rgba(139,92,246,0.5)' : 'linear-gradient(135deg, #8b5cf6, #4f46e5)',
                            color: '#ffffff',
                            fontSize: '15px',
                            fontWeight: '700',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            letterSpacing: '0.3px',
                            boxShadow: loading ? 'none' : '0 8px 24px rgba(139,92,246,0.4)',
                            transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}>
                            {loading ? (
                                <><i className="fa-solid fa-spinner fa-spin"></i> Signing in...</>
                            ) : (
                                <><i className="fa-solid fa-arrow-right-to-bracket"></i> Sign In</>
                            )}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
                        Access provided by GyanSchool
                    </p>
                </div>
            </div>
        );
    }

    // ─── DASHBOARD ───────────────────────────────────────────────────────────
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0c29 0%, #1a1740 100%)',
            color: '#ffffff',
            fontFamily: "'Poppins', system-ui, sans-serif",
        }}>
            {/* Top Nav */}
            <nav style={{
                padding: '0 32px',
                height: '64px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                position: 'sticky', top: 0, zIndex: 100,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #8b5cf6, #4f46e5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <img src="/images/gyanschool_logo.png" alt="G" style={{ width: '22px', objectFit: 'contain', filter: 'brightness(10)' }} />
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '15px', color: 'rgba(255,255,255,0.9)' }}>
                        GyanSchool <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: '400' }}>/ Collaborator</span>
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #8b5cf6, #4f46e5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px', fontWeight: '700'
                    }}>
                        {influencer.name.charAt(0).toUpperCase()}
                    </div>
                    <button onClick={handleLogout} style={{
                        padding: '8px 16px', borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(255,255,255,0.07)',
                        color: 'rgba(255,255,255,0.7)', fontSize: '13px',
                        fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                        <i className="fa-solid fa-right-from-bracket"></i> Log Out
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>

                {/* Hero Header */}
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{
                        margin: '0 0 6px', fontSize: '32px', fontWeight: '800',
                        background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.5px'
                    }}>
                        Welcome back, {influencer.name}! 👋
                    </h1>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.45)', fontSize: '15px' }}>
                        Here's your live referral performance overview
                    </p>
                </div>

                {/* Metrics Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    {/* Promo Code Card */}
                    <div style={cardStyle('#8b5cf6')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={iconStyle('rgba(139,92,246,0.25)', '#8b5cf6')}>
                                <i className="fa-solid fa-tag" style={{ fontSize: '18px' }}></i>
                            </div>
                            <span style={labelStyle}>Your Promo Code</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <span style={{
                                fontSize: '22px', fontWeight: '800', letterSpacing: '2px',
                                color: '#c4b5fd',
                                background: 'rgba(139,92,246,0.15)',
                                padding: '6px 14px', borderRadius: '8px',
                                border: '1px solid rgba(139,92,246,0.3)'
                            }}>{influencer.promo_code.toUpperCase()}</span>
                            <button onClick={copyToClipboard} style={{
                                padding: '6px 12px', borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.15)',
                                background: copied ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)',
                                color: copied ? '#6ee7b7' : 'rgba(255,255,255,0.7)',
                                fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '5px'
                            }}>
                                <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <p style={{ margin: '10px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                            Gives customers {influencer.discount_percent}% off on checkout
                        </p>
                    </div>

                    {/* Total Referrals */}
                    <div style={cardStyle('#3b82f6')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={iconStyle('rgba(59,130,246,0.25)', '#3b82f6')}>
                                <i className="fa-solid fa-users" style={{ fontSize: '18px' }}></i>
                            </div>
                            <span style={labelStyle}>Total Referrals</span>
                        </div>
                        <div style={{ fontSize: '44px', fontWeight: '800', color: '#93c5fd', lineHeight: 1 }}>
                            {referrals.length}
                        </div>
                        <p style={{ margin: '10px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                            Customers enrolled via your code
                        </p>
                    </div>

                    {/* Total Earnings */}
                    <div style={cardStyle('#10b981')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={iconStyle('rgba(16,185,129,0.25)', '#10b981')}>
                                <i className="fa-solid fa-indian-rupee-sign" style={{ fontSize: '18px' }}></i>
                            </div>
                            <span style={labelStyle}>Total Earnings</span>
                        </div>
                        <div style={{ fontSize: '36px', fontWeight: '800', color: '#6ee7b7', lineHeight: 1 }}>
                            ₹{totalEarnings.toLocaleString('en-IN')}
                        </div>
                        <p style={{ margin: '10px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                            Commission earned so far
                        </p>
                    </div>

                    {/* Commission Rate */}
                    <div style={cardStyle('#f59e0b')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={iconStyle('rgba(245,158,11,0.25)', '#f59e0b')}>
                                <i className="fa-solid fa-bolt" style={{ fontSize: '18px' }}></i>
                            </div>
                            <span style={labelStyle}>Commission Rate</span>
                        </div>
                        <div style={{ fontSize: '44px', fontWeight: '800', color: '#fcd34d', lineHeight: 1 }}>
                            {influencer.commission_rate}%
                        </div>
                        <p style={{ margin: '10px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                            Per successful referral
                        </p>
                    </div>
                </div>

                {/* Referrals Table */}
                <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        padding: '24px 28px',
                        borderBottom: '1px solid rgba(255,255,255,0.07)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                        <div>
                            <h3 style={{ margin: '0 0 4px', fontWeight: '700', fontSize: '17px' }}>Referral Activity</h3>
                            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Every purchase made using your promo code</p>
                        </div>
                        <span style={{
                            padding: '4px 12px', borderRadius: '20px',
                            background: 'rgba(139,92,246,0.2)', color: '#c4b5fd',
                            fontSize: '12px', fontWeight: '700', border: '1px solid rgba(139,92,246,0.3)'
                        }}>
                            {referrals.length} total
                        </span>
                    </div>

                    {referrals.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                            <div style={{
                                width: '72px', height: '72px', borderRadius: '20px',
                                background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 20px', fontSize: '28px', color: '#8b5cf6'
                            }}>
                                <i className="fa-solid fa-share-nodes"></i>
                            </div>
                            <h4 style={{ margin: '0 0 8px', fontWeight: '700', fontSize: '18px' }}>No referrals yet</h4>
                            <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
                                Share your promo code <strong style={{ color: '#c4b5fd' }}>{influencer.promo_code.toUpperCase()}</strong> to start earning commissions!
                            </p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                        {['Date', 'Course', 'Customer Email', 'Sale Amount', 'Your Commission'].map(h => (
                                            <th key={h} style={{
                                                padding: '14px 20px', textAlign: 'left',
                                                color: 'rgba(255,255,255,0.4)', fontWeight: '600',
                                                fontSize: '12px', letterSpacing: '0.5px', textTransform: 'uppercase'
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {referrals.map((ref, i) => (
                                        <tr key={ref.id} style={{
                                            borderBottom: i < referrals.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                            transition: 'background 0.15s'
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>
                                                {new Date(ref.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.85)', fontWeight: '500' }}>
                                                {ref.course_title}
                                            </td>
                                            <td style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>
                                                {ref.purchaser_email}
                                            </td>
                                            <td style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>
                                                ₹{Number(ref.amount_paid).toLocaleString('en-IN')}
                                            </td>
                                            <td style={{ padding: '16px 20px' }}>
                                                <span style={{
                                                    color: '#6ee7b7', fontWeight: '700',
                                                    background: 'rgba(16,185,129,0.12)',
                                                    padding: '4px 10px', borderRadius: '6px',
                                                    border: '1px solid rgba(16,185,129,0.25)'
                                                }}>
                                                    +₹{Number(ref.commission_earned).toLocaleString('en-IN')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p style={{ textAlign: 'center', marginTop: '40px', fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>
                    GyanSchool Collaborator Program · Questions? Contact your program manager.
                </p>
            </div>
        </div>
    );
}

// ─── Shared sub-styles ────────────────────────────────────────────────────────
function cardStyle(accent) {
    return {
        padding: '24px',
        borderRadius: '18px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        border: `1px solid rgba(255,255,255,0.08)`,
        boxShadow: `0 0 0 0px ${accent}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
    };
}
function iconStyle(bg, color) {
    return {
        width: '44px', height: '44px', borderRadius: '12px',
        background: bg, color: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
    };
}
const labelStyle = {
    fontSize: '12px', fontWeight: '700', letterSpacing: '0.6px',
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)'
};
