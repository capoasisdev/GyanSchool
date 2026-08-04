import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useSearchParams, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import Courses from './components/Courses';
import Trainers from './components/Trainers';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import QuizModal from './components/QuizModal';
import AuthModal from './components/AuthModal';
import Learn from './components/Learn';
import CoursePlayer from './components/CoursePlayer';
import Admin from './components/Admin';
import InfluencerPortal from './components/InfluencerPortal';
import useReveal from './hooks/useReveal';
import { AuthProvider, useAuth } from './context/AuthContext';
import MobileAppHome from './components/MobileAppHome';
import ErrorBoundary from './components/ErrorBoundary';
import { supabase } from './utils/supabaseClient';


function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const isCapacitorApp = !!window.Capacitor;
    // In the native app, if user is already set (e.g. mock login), skip loading state
    // This prevents the black loading screen when navigating to CoursePlayer
    if (loading && !(isCapacitorApp && user)) {
        return (
            <div className="dl-empty-state" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', color: '#1e293b' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '16px', color: '#0c4983' }}></i>
                <h2 style={{ color: '#1e293b' }}>Loading your progress...</h2>
            </div>
        );
    }
    if (!user) {
        return <Navigate to="/" replace />;
    }
    return children;
}

function AppContent() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [appQuizStep, setAppQuizStep] = useState(null);
    const [mobileHomeView, setMobileHomeView] = useState('main');
    const isCapacitorApp = !!window.Capacitor || searchParams.get('testApp') === 'true';

    const quizStepParam = isCapacitorApp ? appQuizStep : searchParams.get('step');
    const quizOpen = quizStepParam !== null;
    const { user, loading, isPasswordRecovery, setIsPasswordRecovery } = useAuth();
    const [authOpen, setAuthOpen] = useState(false);

    // Sync privileged/admin emails from Supabase database on app load
    useEffect(() => {
        const syncPrivileged = async () => {
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
                console.error("Failed to sync privileged emails on load:", err);
            }
        };
        syncPrivileged();
    }, []);

    // Auto-redirect logged-in app users from root landing page to dashboard
    useEffect(() => {
        if (user && isCapacitorApp && location.pathname === '/') {
            navigate('/learn', { replace: true });
        }
    }, [user, isCapacitorApp, location.pathname, navigate]);

    // After auth completes (page reload from OAuth redirect or email confirmation),
    // restore the intended quiz step from sessionStorage
    useEffect(() => {
        if (!loading) {
            const savedRedirect = sessionStorage.getItem('gyanschool_auth_redirect');
            if (savedRedirect && user) {
                sessionStorage.removeItem('gyanschool_auth_redirect');
                const params = new URLSearchParams(savedRedirect);
                if (params.get('step')) {
                    if (isCapacitorApp) {
                        setAppQuizStep(params.get('step'));
                    } else {
                        setSearchParams(params);
                    }
                }
            }
        }
    }, [loading, user, setSearchParams, isCapacitorApp]);

    useReveal([quizOpen, location.pathname]);

    // Centralized Android/Capacitor back navigation coordinator
    useEffect(() => {
        if (typeof window === 'undefined' || !window.Capacitor) return;
        
        const registerBackButton = async () => {
            const { App } = await import('@capacitor/app');
            return App.addListener('backButton', async (data) => {
                // 1. If AuthModal is open:
                if (authOpen) {
                    setAuthOpen(false);
                    return;
                }
                
                // 2. If QuizModal/checkout is open:
                if (quizOpen) {
                    const backBtn = document.querySelector('.quiz-back-btn');
                    if (backBtn) {
                        backBtn.click();
                    } else {
                        handleCloseQuiz();
                    }
                    return;
                }

                // 3. If in CoursePlayer/learn route:
                if (location.pathname.startsWith('/learn')) {
                    const isCoursePlayer = location.pathname.split('/').filter(Boolean).length > 1;
                    if (isCoursePlayer) {
                        const cpBackBtn = document.querySelector('.cp-back-btn') || 
                                          document.querySelector('.cp-header-back') || 
                                          document.querySelector('button[aria-label="Go Back"]');
                        if (cpBackBtn) {
                            cpBackBtn.click();
                        } else {
                            navigate('/learn');
                        }
                    } else {
                        // We are in the main dashboard tab layout /learn
                        const homeTabBtn = document.querySelector('.dl-bottom-nav button:first-child');
                        const isHomeActive = homeTabBtn && homeTabBtn.classList.contains('active');
                        if (homeTabBtn && !isHomeActive) {
                            homeTabBtn.click();
                        } else {
                            App.exitApp();
                        }
                    }
                    return;
                }

                // 4. If on the root route ('/'):
                if (location.pathname === '/' || location.pathname === '') {
                    const mobileBackBtn = document.querySelector('.mobile-app-back-btn');
                    if (mobileBackBtn) {
                        mobileBackBtn.click();
                    } else {
                        App.exitApp();
                    }
                    return;
                }
                
                // Fallback:
                if (data.canGoBack) {
                    window.history.back();
                } else {
                    App.exitApp();
                }
            });
        };
        
        const handlerPromise = registerBackButton();
        return () => {
            handlerPromise.then(handler => handler && handler.remove());
        };
    }, [authOpen, quizOpen, location.pathname, navigate]);

    const handleOpenQuiz = () => {
        // Clear any specific course override so the quiz recommended course works normally
        localStorage.removeItem('gyanschool_checkout_course_idx');
        if (isCapacitorApp) {
            setAppQuizStep('1');
        } else {
            setSearchParams({ step: '1' });
        }
    };

    const handleSelectCourse = (index) => {
        localStorage.setItem('gyanschool_checkout_course_idx', index.toString());
        localStorage.setItem('gyanschool_checkout_plan', 'real-purchase');
        sessionStorage.setItem('gyanschool_quiz_token', 'direct_' + Math.random().toString(36).substring(2, 11)); // authorized checkout token
        
        // Go straight to checkout screen
        if (isCapacitorApp) {
            setAppQuizStep('checkout');
        } else {
            setSearchParams({ step: 'checkout' });
        }
    };
    
    const handleCloseQuiz = () => {
        if (isCapacitorApp) {
            setAppQuizStep(null);
        } else {
            setSearchParams({});
        }
    };

    return (
        <div className="app-container">
            <div
                id="main-site-content"
                style={{ display: quizOpen ? 'none' : 'block' }}
            >
                {!location.pathname.startsWith('/learn') && location.pathname !== '/admin' && location.pathname !== '/influencer' && !isCapacitorApp && <Header />}
                <main>
                    <Routes>
                        <Route path="/" element={
                            isCapacitorApp ? (
                                <MobileAppHome 
                                    onStartQuiz={handleOpenQuiz} 
                                    onSelectCourse={handleSelectCourse} 
                                    onOpenAuth={() => setAuthOpen(true)}
                                    view={mobileHomeView}
                                    setView={setMobileHomeView}
                                />
                            ) : (
                                <>
                                    <Hero onStartQuiz={handleOpenQuiz} onSelectCourse={handleSelectCourse} />
                                    <Stats />
                                    <About />
                                    <Courses onSelectCourse={handleSelectCourse} />
                                    <Trainers />
                                    <Testimonials />
                                    <FAQ />
                                    </>
                            )
                        } />
                        <Route path="/learn" element={
                            <ProtectedRoute>
                                <Learn />
                            </ProtectedRoute>
                        } />
                        <Route path="/learn/:courseId" element={
                            <ProtectedRoute>
                                <ErrorBoundary>
                                    <CoursePlayer />
                                </ErrorBoundary>
                            </ProtectedRoute>
                        } />
                        <Route path="/learn/:courseId/lesson/:lessonNum" element={
                            <ProtectedRoute>
                                <ErrorBoundary>
                                    <CoursePlayer />
                                </ErrorBoundary>
                            </ProtectedRoute>
                        } />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/influencer" element={<InfluencerPortal />} />
                    </Routes>
                </main>

                {/* Global Mobile Bottom Tab Navigation for Logged-in App Users */}
                {isCapacitorApp && user && location.pathname.startsWith('/learn') && (
                    <nav className="dl-bottom-nav-container">
                        <ul>
                            <li className={location.pathname === '/learn' && (searchParams.get('tab') || 'home') === 'home' ? 'active' : ''}>
                                <a onClick={() => navigate('/learn?tab=home')}>
                                    <div className="svg-container">
                                        <i className="fa-solid fa-house" style={{ fontSize: '20px', lineHeight: '36px', color: '#64748b' }}></i>
                                    </div>
                                    <div className="text-container">
                                        <span>Home</span>
                                    </div>
                                </a>
                            </li>
                            <li className={(location.pathname === '/learn' && searchParams.get('tab') === 'courses') || location.pathname.split('/').filter(Boolean).length > 1 ? 'active' : ''}>
                                <a onClick={() => navigate('/learn?tab=courses')}>
                                    <div className="svg-container">
                                        <i className="fa-solid fa-graduation-cap" style={{ fontSize: '20px', lineHeight: '36px', color: '#64748b' }}></i>
                                    </div>
                                    <div className="text-container">
                                        <span>Learn</span>
                                    </div>
                                </a>
                            </li>
                            <li className={location.pathname === '/learn' && searchParams.get('tab') === 'files' ? 'active' : ''}>
                                <a onClick={() => navigate('/learn?tab=files')}>
                                    <div className="svg-container">
                                        <i className="fa-solid fa-folder-open" style={{ fontSize: '20px', lineHeight: '36px', color: '#64748b' }}></i>
                                    </div>
                                    <div className="text-container">
                                        <span>Files</span>
                                    </div>
                                </a>
                            </li>
                            <li className={location.pathname === '/learn' && searchParams.get('tab') === 'profile' ? 'active' : ''}>
                                <a onClick={() => navigate('/learn?tab=profile')}>
                                    <div className="svg-container">
                                        <i className="fa-solid fa-user" style={{ fontSize: '20px', lineHeight: '36px', color: '#64748b' }}></i>
                                    </div>
                                    <div className="text-container">
                                        <span>Profile</span>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </nav>
                )}

                {!location.pathname.startsWith('/learn') && location.pathname !== '/admin' && location.pathname !== '/influencer' && !isCapacitorApp && <Footer />}
            </div>
            <QuizModal 
                isOpen={quizOpen} 
                onClose={handleCloseQuiz} 
                initialStep={isCapacitorApp ? appQuizStep : null}
                onStepChange={isCapacitorApp ? setAppQuizStep : null}
            />
            <AuthModal isOpen={isPasswordRecovery} onClose={() => setIsPasswordRecovery(false)} initialTab="reset" />
            <AuthModal
                isOpen={authOpen}
                onClose={() => setAuthOpen(false)}
                onSuccess={() => {
                    const isDirect = localStorage.getItem('gyanschool_checkout_course_idx') !== null;
                    setSearchParams({ step: isDirect ? 'checkout' : '1' });
                }}
                onStartQuiz={handleOpenQuiz}
                onExploreCourses={() => {
                    if (isCapacitorApp) {
                        setMobileHomeView('explore-courses');
                    } else {
                        navigate('/');
                        setTimeout(() => {
                            document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                    }
                }}
                authRedirectUrl={window.location.origin + window.location.pathname + (localStorage.getItem('gyanschool_checkout_course_idx') !== null ? '?step=checkout' : '?step=1')}
            />
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
