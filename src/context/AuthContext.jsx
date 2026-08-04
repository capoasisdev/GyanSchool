import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
    // Tracks whether the user was set via local/Capacitor mock login
    // Prevents getSession() from overriding the mock user with null
    const isMockUserRef = React.useRef(false);

    useEffect(() => {
        // Check hash or search params for recovery type
        const hasRecoveryHash = window.location.hash.includes('type=recovery');
        const hasRecoverySearch = window.location.search.includes('type=recovery');
        if (hasRecoveryHash || hasRecoverySearch) {
            setIsPasswordRecovery(true);
            if (hasRecoveryHash) {
                // Clear the hash without reloading the page
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
        }

        // Add a 5-second timeout safety net so loading never hangs forever
        // (critical for Capacitor webview where localStorage may be unavailable)
        const loadingTimeout = setTimeout(() => {
            setLoading(false);
        }, 5000);

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            clearTimeout(loadingTimeout);
            // If user was already set via mock login, don't override them
            if (isMockUserRef.current) {
                setLoading(false);
                return;
            }
            if (session?.user) {
                const userId = session.user.id;
                const email = session.user.email;
                
                localStorage.setItem(`gs_user_email_${userId}`, email);

                const tempKey = `gyanschool_purchased_${email}`;
                const tempPurchases = localStorage.getItem(tempKey);
                if (tempPurchases) {
                    const userKey = `gyanschool_purchased_${userId}`;
                    localStorage.setItem(userKey, tempPurchases);
                    localStorage.removeItem(tempKey);
                }
                
                setUser({
                    id: userId,
                    email: email,
                    name: session.user.user_metadata?.name || email.split('@')[0],
                    avatarUrl: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        }).catch(() => {
            // If getSession fails (e.g. Capacitor webview storage blocked), just continue unauthenticated
            clearTimeout(loadingTimeout);
            if (!isMockUserRef.current) {
                setUser(null);
            }
            setLoading(false);
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            // Don't let Supabase auth state changes override a mock user session
            if (isMockUserRef.current) return;
            if (event === 'PASSWORD_RECOVERY') {
                setIsPasswordRecovery(true);
            }
            if (session?.user) {
                const userId = session.user.id;
                const email = session.user.email;
                
                localStorage.setItem(`gs_user_email_${userId}`, email);

                const tempKey = `gyanschool_purchased_${email}`;
                const tempPurchases = localStorage.getItem(tempKey);
                if (tempPurchases) {
                    const userKey = `gyanschool_purchased_${userId}`;
                    localStorage.setItem(userKey, tempPurchases);
                    localStorage.removeItem(tempKey);
                }
                
                setUser({
                    id: userId,
                    email: email,
                    name: session.user.user_metadata?.name || email.split('@')[0],
                    avatarUrl: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signup = async (name, email, password, redirectTo) => {
        const options = {
            data: { name },
        };
        if (redirectTo) {
            options.emailRedirectTo = redirectTo;
        }
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options,
        });
        if (error) {
            return { error: error.message };
        }
        return { error: null };
    };

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            return { error: error.message };
        }
        return { error: null };
    };

    const loginWithGoogle = async (redirectTo) => {
        const options = {};
        if (redirectTo) {
            options.redirectTo = redirectTo;
        }
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options,
        });
        if (error) {
            console.error("Google Auth Error:", error.message);
        }
    };

    const resetPassword = async (email) => {
        const redirectUrl = window.location.origin + '/';
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectUrl,
        });
        if (error) {
            return { error: error.message };
        }
        return { error: null };
    };

    const updatePassword = async (newPassword) => {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });
        if (error) {
            return { error: error.message };
        }
        return { error: null };
    };

    const logout = async () => {
        isMockUserRef.current = false;
        await supabase.auth.signOut();
        setUser(null);
    };

    const sendOtp = async (email) => {
        const emailLower = email.trim().toLowerCase();
        if (emailLower === 'tester@gyanschool.com') {
            return { error: null, isMock: true };
        }
        try {
            // signInWithOtp works for both Magic Link links and 6-digit code OTPs depending on Supabase email templates
            const { error } = await supabase.auth.signInWithOtp({
                email: email.trim()
            });
            if (error) throw error;
            return { error: null };
        } catch (err) {
            console.error("Failed to send OTP:", err.message);
            return { error: err.message };
        }
    };

    const verifyOtp = async (email, token) => {
        const emailLower = email.trim().toLowerCase();
        if (emailLower === 'tester@gyanschool.com') {
            if (token.trim() === '123456') {
                isMockUserRef.current = true;
                const mockUserId = 'google-play-test-user-id';
                localStorage.setItem(`gs_user_email_${mockUserId}`, 'tester@gyanschool.com');
                setUser({
                    id: mockUserId,
                    email: 'tester@gyanschool.com',
                    name: 'Play Store Reviewer',
                    avatarUrl: null
                });
                return { error: null };
            } else {
                return { error: 'Invalid verification code.' };
            }
        }
        try {
            const { data, error } = await supabase.auth.verifyOtp({
                email: email.trim(),
                token: token.trim(),
                type: 'email'
            });
            if (error) throw error;
            if (data?.user) {
                const userId = data.user.id;
                const userEmail = data.user.email;
                
                localStorage.setItem(`gs_user_email_${userId}`, userEmail);

                setUser({
                    id: userId,
                    email: userEmail,
                    name: data.user.user_metadata?.name || userEmail.split('@')[0],
                    avatarUrl: data.user.user_metadata?.avatar_url || null
                });
            }
            return { error: null };
        } catch (err) {
            console.error("OTP verification failed:", err.message);
            return { error: err.message };
        }
    };

    const sendMagicLink = async (email) => {
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email: email.trim(),
                options: {
                    emailRedirectTo: window.location.origin + '/learn'
                }
            });
            if (error) throw error;
            return { error: null };
        } catch (err) {
            console.error("Failed to send magic link:", err.message);
            return { error: err.message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signup, login, loginWithGoogle, resetPassword, updatePassword, logout, isPasswordRecovery, setIsPasswordRecovery, sendMagicLink, sendOtp, verifyOtp }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
