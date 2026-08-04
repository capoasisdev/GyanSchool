import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getEnrichedCourses } from '../data/courses';
import { getPurchasedCourses, getPurchasedCoursesDetails, getCourseProgress, addPurchasedCourse, completeLesson, getAllLessonWatchedPercents, getLocalDateString, getCourseSteps, OFFICIAL_MODULES } from '../utils/progressTracker';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
// ─────────────────────────────────────────────────────────────────────────────

const lessonsData = [
    { title: 'Introduction', duration: '5 min', icon: 'fa-star' },
    { title: 'Core Concepts', duration: '10 min', icon: 'fa-code' },
    { title: 'Practice & Prep', duration: '15 min', icon: 'fa-dumbbell' },
    { title: 'Application', duration: '12 min', icon: 'fa-rocket' },
    { title: 'Quick Review', duration: '8 min', icon: 'fa-repeat' },
    { title: 'Build Project', duration: '20 min', icon: 'fa-gear' },
    { title: 'Share Work', duration: '10 min', icon: 'fa-share-nodes' },
    { title: 'Mastery check', duration: '15 min', icon: 'fa-trophy' }
];



/* ── Help & Resources sub-components ─────────────────────────────── */

function HelpFaqItem({ question, answer }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`dl-faq-item ${open ? 'open' : ''}`}>
            <button
                className="dl-faq-question"
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
            >
                <span>{question}</span>
                <i className={`fa-solid ${open ? 'fa-chevron-up' : 'fa-chevron-down'} dl-faq-chevron`}></i>
            </button>
            <div className={`dl-faq-answer ${open ? 'visible' : ''}`}>
                <p>{answer}</p>
            </div>
        </div>
    );
}

export default function Learn() {
    const courses = getEnrichedCourses();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, logout } = useAuth();
    const isCapacitorApp = !!window.Capacitor || searchParams.get('testApp') === 'true';
    const tabParam = searchParams.get('tab');
    const [currentTab, setCurrentTab] = useState(tabParam || (isCapacitorApp ? 'home' : 'learn')); // 'learn' | 'home' | 'courses' | 'files' | 'profile' | 'leaderboards' | 'quests' | 'shop' | 'more'
    const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
    const [displayName, setDisplayName] = useState(() => localStorage.getItem('gs_display_name') || user?.name || '');
    const [displayNameSaved, setDisplayNameSaved] = useState(false);
    const [openLearnModules, setOpenLearnModules] = useState(() => new Set());

    const toggleLearnModule = (mIdx) => {
        setOpenLearnModules(prev => {
            const next = new Set(prev);
            if (next.has(mIdx)) next.delete(mIdx);
            else next.add(mIdx);
            return next;
        });
    };

    const handleSaveName = () => {
        if (displayName.trim()) {
            localStorage.setItem('gs_display_name', displayName.trim());
            setDisplayNameSaved(true);
            setTimeout(() => setDisplayNameSaved(false), 2000);
            window.dispatchEvent(new Event('storage'));
        }
    };

    useEffect(() => {
        setCurrentTab(tabParam || (isCapacitorApp ? 'home' : 'learn'));
    }, [tabParam, isCapacitorApp]);

    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        const userId = user?.id;
        setPurchases(getPurchasedCoursesDetails(userId));
    }, [user?.id]);

    const allPurchasedIndices = purchases.map(p => p.courseIndex);

    const enrolledCourses = allPurchasedIndices
        .filter(idx => idx >= 0 && idx < courses.length)
        .map(idx => {
            const purchaseDetail = purchases.find(p => p.courseIndex === idx);
            return {
                ...courses[idx],
                index: idx,
                progress: getCourseProgress(idx, user?.id),
                expired: purchaseDetail?.expired ?? false,
                expiryDate: purchaseDetail?.expiryDate ?? null,
                planName: purchaseDetail?.planName ?? 'lifetime'
            };
        });

    const [activeCourseId, setActiveCourseId] = useState(null);

    useEffect(() => {
        if (allPurchasedIndices.length > 0) {
            const saved = localStorage.getItem(user?.id ? `gyanschool_active_course_${user.id}` : 'gyanschool_active_course');
            if (saved && allPurchasedIndices.includes(parseInt(saved, 10))) {
                setActiveCourseId(parseInt(saved, 10));
            } else {
                setActiveCourseId(enrolledCourses[0]?.index ?? 0);
            }
        }
    }, [purchases, user?.id]);

    const activeCourse = enrolledCourses.find(c => c.index === activeCourseId) || enrolledCourses[0];
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Productivity', 'Marketing & Sales', 'Finance', 'Tech & Auto', 'Career'];

    const getCourseCategory = (index) => {
        switch (index) {
            case 0:
            case 5:
            case 9:
                return 'Productivity';
            case 1:
            case 3:
                return 'Marketing & Sales';
            case 2:
                return 'Finance';
            case 4:
            case 7:
                return 'Tech & Auto';
            case 6:
            case 8:
                return 'Career';
            default:
                return 'Other';
        }
    };

    const filteredCourses = courses.map((course, idx) => ({ ...course, originalIndex: idx })).filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = activeCategory === 'All' || getCourseCategory(course.originalIndex) === activeCategory;
        return matchesSearch && matchesCategory;
    });

    // User states
    const [profileRestored, setProfileRestored] = useState(false);
    const [restoredUserId, setRestoredUserId] = useState(null);

    useEffect(() => {
        setProfileRestored(false);
        setRestoredUserId(null);
    }, [user?.id]);

    const [selectedNode, setSelectedNode] = useState(null);
    const nodeRefs = useRef([]);



    const [showCourseDropdown, setShowCourseDropdown] = useState(false);
    const [showNavbarDropdown, setShowNavbarDropdown] = useState(false);
    const [showAddCoursePopup, setShowAddCoursePopup] = useState(false);
    const [showGuidebook, setShowGuidebook] = useState(false);
    const [showMobileMoreMenu, setShowMobileMoreMenu] = useState(false);

    // Video watch progress map for the active course
    const [lessonWatchMap, setLessonWatchMap] = useState({});

    // Load watch map whenever active course changes
    useEffect(() => {
        setLessonWatchMap(getAllLessonWatchedPercents(activeCourseId, user?.id));
    }, [activeCourseId, user?.id]);

    useEffect(() => {
        if (activeCourse) {
            const activeCourseKey = user?.id ? `gyanschool_active_course_${user.id}` : 'gyanschool_active_course';
            localStorage.setItem(activeCourseKey, activeCourse.index.toString());
        }
    }, [activeCourseId, user?.id]);

    const [renewPlan, setRenewPlan] = useState('1-week');
    useEffect(() => {
        if (activeCourse) {
            setRenewPlan(activeCourse.planName || '1-week');
        }
    }, [activeCourseId, activeCourse]);

    const handleRenewAutopay = (courseIndex) => {
        addPurchasedCourse(courseIndex, user?.id, renewPlan);
        alert(`Success! Autopay transaction processed. Your plan has been renewed for ${renewPlan}.`);
        setPurchases(getPurchasedCoursesDetails(user?.id));
    };

    const handleRenewManual = (courseIndex) => {
        localStorage.setItem('gyanschool_checkout_course_idx', courseIndex.toString());
        localStorage.setItem('gyanschool_checkout_plan', renewPlan);
        sessionStorage.setItem('gyanschool_quiz_token', 'renew_' + Math.random().toString(36).substring(2, 11));
        navigate('/?step=checkout');
    };

    const handleNodeClick = (index, type, precedingLessonIndex) => {
        if (activeCourse?.expired) {
            return;
        }
        if (type === 'chest') {
            const progress = getCourseProgress(activeCourse?.index, user?.id);
            const precedingCompleted = progress.completed.includes(precedingLessonIndex);
            if (!precedingCompleted) return;
        }

        const nodeEl = nodeRefs.current[index];
        const pathAreaEl = nodeEl?.closest('.dl-path-area');
        if (!nodeEl || !pathAreaEl) return;

        const nodeRect = nodeEl.getBoundingClientRect();
        const pathAreaRect = pathAreaEl.getBoundingClientRect();

        const top = nodeRect.top - pathAreaRect.top;
        const left = nodeRect.left - pathAreaRect.left;

        if (selectedNode && selectedNode.index === index && selectedNode.type === type) {
            setSelectedNode(null);
            return;
        }

        setSelectedNode({
            type,
            index,
            precedingLessonIndex,
            top,
            left,
            width: nodeRect.width
        });
    };



    // Fetch and restore profile data from Supabase on login
    useEffect(() => {
        if (user?.id) {
            setProfileRestored(false);
            setRestoredUserId(null);
            const restoreProfile = async () => {
                try {
                    const { data } = await supabase
                        .from('profiles')
                        .select('name')
                        .eq('id', user.id)
                        .maybeSingle();

                    if (data) {
                        if (data.name) {
                            localStorage.setItem('gs_display_name', data.name);
                        }
                    }
                } catch (err) {
                    console.error("Failed to restore profile from Supabase:", err);
                } finally {
                    setRestoredUserId(user.id);
                    setProfileRestored(true);
                }
            };
            restoreProfile();
        } else {
            setRestoredUserId(null);
            setProfileRestored(true);
        }
    }, [user?.id]);

    // Sync profile to Supabase
    useEffect(() => {
        if (user && profileRestored && restoredUserId === user.id) {
            const syncProfile = async () => {
                try {
                    const activeName = localStorage.getItem('gs_display_name') || user.name;
                    await supabase.from('profiles').upsert({
                        id: user.id,
                        name: activeName,
                        email: user.email,
                        updated_at: new Date().toISOString()
                    });
                } catch (err) {
                    console.error("Failed to sync profile to Supabase:", err);
                }
            };
            syncProfile();
        }
    }, [user, profileRestored, restoredUserId]);



    if (!activeCourse && currentTab === 'learn') {
        return (
            <>
                <div className="dl-empty-state" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-graduation-cap" style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1rem' }}></i>
                    <h2>No courses enrolled</h2>
                    <button
                        className="dl-browse-btn"
                        onClick={() => setShowAddCoursePopup(true)}
                        style={{ cursor: 'pointer', padding: '12px 24px', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', marginTop: '1rem' }}
                    >
                        Browse Courses
                    </button>
                </div>

                {showAddCoursePopup && (
                    <div className="all-courses-overlay" onClick={() => setShowAddCoursePopup(false)} style={{ display: 'flex', zIndex: 99999 }}>
                        <div className="all-courses-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="all-courses-header">
                                <div className="all-courses-header-left">
                                    <h2>Browse &amp; Add Courses</h2>
                                    <p className="all-courses-subtitle">Choose from our curated AI learning tracks and accelerate your career</p>
                                </div>
                                <button className="all-courses-close" onClick={() => setShowAddCoursePopup(false)}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            <div className="all-courses-filters-row">
                                <div className="all-courses-search-bar">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                    <input
                                        type="text"
                                        placeholder="Search courses..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && <button className="all-courses-clear-search" onClick={() => setSearchQuery('')}><i className="fa-solid fa-xmark"></i></button>}
                                </div>
                                <div className="all-courses-categories">
                                    {['All', 'Professional', 'Student', 'Earning'].map(cat => (
                                        <button key={cat} className={`all-courses-cat-tab ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="all-courses-grid">
                                {filteredCourses.map((course) => {
                                    const index = course.originalIndex;
                                    const isEnrolled = allPurchasedIndices.includes(index);
                                    return (
                                        <div key={index} className={`all-course-card ${isEnrolled ? 'selected' : ''}`}>
                                            <div className="all-course-img">
                                                <img src={course.image} alt={course.title} />
                                            </div>
                                            <div className="all-course-info">
                                                <div className="all-course-details-main">
                                                    <div className="all-course-card-top">
                                                        <span className="all-course-badge">{course.badge}</span>
                                                    </div>
                                                    <h3>{course.title}</h3>
                                                    <p className="all-course-desc">{course.description}</p>
                                                </div>
                                                <div className="all-course-actions">
                                                    {isEnrolled ? (
                                                        <button className="all-course-add-btn enrolled-btn" disabled>
                                                            <i className="fa-solid fa-circle-check"></i> Enrolled
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="all-course-add-btn enroll-now-btn"
                                                            onClick={() => {
                                                                localStorage.setItem('gyanschool_checkout_course_idx', index.toString());
                                                                localStorage.setItem('gyanschool_checkout_plan', 'real-purchase');
                                                                sessionStorage.setItem('gyanschool_quiz_token', 'direct_' + Math.random().toString(36).substring(2, 11));
                                                                setShowAddCoursePopup(false);
                                                                navigate('/?step=checkout');
                                                            }}
                                                        >
                                                            Enroll Now <i className="fa-solid fa-arrow-right"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {filteredCourses.length === 0 && (
                                    <div className="all-courses-empty">
                                        <i className="fa-solid fa-graduation-cap"></i>
                                        <h3>No programs found</h3>
                                        <p>Try refining your search keyword or selecting a different learning track category.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    const completedLessons = activeCourse?.progress?.completed ?? [];
    const currentStep = activeCourse?.progress?.currentStep ?? 0;

    const getLessonStatus = (index) => {
        if (completedLessons.includes(index)) return 'completed';
        if (index === currentStep) return 'active';
        return 'locked';
    };

    // Render active tab view in the center
    const renderCenterContent = () => {
        switch (currentTab) {
            case 'home': {
                const totalCompleted = enrolledCourses.reduce((acc, c) => acc + (c.progress?.completed?.length || 0), 0);

                // Get next lesson to continue
                let nextLessonTitle = "Start Learning";
                let nextLessonPath = null;
                if (activeCourse) {
                    const lessons = getCourseSteps(activeCourse) || [];
                    const currentStep = activeCourse.progress?.currentStep ?? 0;
                    const nextLesson = lessons[currentStep] || lessons[lessons.length - 1];
                    const nextLessonNum = currentStep < lessons.length ? currentStep + 1 : lessons.length;
                    nextLessonTitle = nextLesson ? nextLesson.title : "Start Learning";
                    nextLessonPath = `/learn/${activeCourse.index}/lesson/${nextLessonNum}`;
                }

                // Filter courses user hasn't enrolled in yet for recommended catalog
                const enrolledIdxs = enrolledCourses.map(c => c.index);
                const recommended = courses
                    .map((c, i) => ({ ...c, index: i }))
                    .filter(c => !enrolledIdxs.includes(c.index));

                // Calculate progress % based on total steps
                const totalSteps = activeCourse ? (getCourseSteps(activeCourse)?.length || 1) : 1;
                const completedCount = activeCourse ? (activeCourse.progress?.completed?.length || 0) : 0;
                const progressPercent = Math.round((completedCount / totalSteps) * 100);

                return (
                    <div className="dl-tab-view dl-home-welcome" style={{ paddingTop: isCapacitorApp ? '12px' : '24px' }}>
                        <div className="dl-tab-header" style={{ marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '0' }}>
                                Welcome back, {(localStorage.getItem('gs_display_name') || user?.name || 'Learner').trim().split(' ')[0]} 👋
                            </h2>
                        </div>

                        {/* Continue Learning Widget — full-width image with overlay title */}
                        {activeCourse ? (
                            <div className="dl-home-continue-widget">
                                <div className="dl-home-continue-header">Continue Learning</div>
                                {/* Full-width landscape image with title overlaid at bottom */}
                                <div className="dl-home-continue-img-wrap">
                                    <img src={activeCourse.image} alt={activeCourse.title} className="dl-home-continue-img-full" />
                                    <div className="dl-home-continue-img-overlay">
                                        <div className="dl-home-continue-title-overlay" style={{ color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.85)', margin: 0, fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.35 }}>{activeCourse.title}</div>
                                    </div>
                                </div>
                                {/* Progress bar */}
                                <div style={{ marginTop: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#a5b4fc', marginBottom: '6px', fontWeight: 600 }}>
                                        <span>Progress</span>
                                        <span>{progressPercent}%</span>
                                    </div>
                                    <div className="dl-home-continue-pbar">
                                        <div
                                            className="dl-home-continue-pfill"
                                            style={{ width: `${progressPercent}%` }}
                                        ></div>
                                    </div>
                                </div>
                                {nextLessonPath && (
                                    <button
                                        onClick={() => navigate(nextLessonPath)}
                                        className="dl-home-continue-btn"
                                        style={{ marginTop: '14px' }}
                                    >
                                        <span>Continue: {nextLessonTitle}</span>
                                        <i className="fa-solid fa-circle-play"></i>
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="dl-home-continue-widget" style={{ textAlign: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b' }}>
                                <i className="fa-solid fa-graduation-cap" style={{ fontSize: '2.5rem', color: '#64748b', marginBottom: '12px' }}></i>
                                <div style={{ color: '#0f172a', margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: 700 }}>Get Started!</div>
                                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '16px' }}>Enroll in a learning program to begin tracking your progress.</p>
                                <button className="split-continue-btn" onClick={() => setShowAddCoursePopup(true)} style={{ margin: '0 auto' }}>
                                    Browse Course Catalog
                                </button>
                            </div>
                        )}

                        {/* Explore Courses Grid — show all courses EXCEPT the one in continue learning */}
                        <div style={{ marginTop: '28px' }}>
                            <h3 className="dl-home-explore-title">Explore Courses</h3>
                            <div className="dl-home-allcourses-grid">
                                {courses.map((course, idx) => {
                                    // Skip the course currently showing in the continue learning widget
                                    if (activeCourse && idx === activeCourse.index) return null;

                                    const isEnrolled = enrolledIdxs.includes(idx);
                                    return (
                                        <div key={idx} className="dl-home-allcourse-card">
                                            <div className="dl-home-allcourse-img-wrap">
                                                <img src={course.image} alt={course.title} className="dl-home-allcourse-img" />
                                                {isEnrolled && (
                                                    <div className="dl-home-allcourse-enrolled-badge">
                                                        <i className="fa-solid fa-circle-check"></i> Enrolled
                                                    </div>
                                                )}
                                            </div>
                                            <div className="dl-home-allcourse-info">
                                                <div className="dl-home-allcourse-title" style={{ color: '#0f172a', margin: '0 0 8px 0', fontWeight: 700, fontSize: '0.95rem' }}>{course.title}</div>
                                                {isEnrolled ? (
                                                    <button
                                                        className="dl-home-allcourse-btn enrolled"
                                                        onClick={() => {
                                                            setActiveCourseId(idx);
                                                            navigate('/learn?tab=courses');
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-play"></i> Go to Course
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="dl-home-allcourse-btn buy"
                                                        onClick={() => {
                                                            localStorage.setItem('gyanschool_checkout_course_idx', idx.toString());
                                                            localStorage.setItem('gyanschool_checkout_plan', 'real-purchase');
                                                            sessionStorage.setItem('gyanschool_quiz_token', 'direct_' + Math.random().toString(36).substring(2, 11));
                                                            navigate('/?step=checkout');
                                                        }}
                                                    >
                                                        Enroll Now
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            }

            case 'files': {
                const courseFiles = [];

                // Add White Collar Executive AI resources if enrolled
                const hasWhiteCollar = enrolledCourses.some(c => c.index === 0);
                if (hasWhiteCollar) {
                    courseFiles.push(
                        {
                            title: 'ChatGPT Guide for White Collar Professionals',
                            type: 'PDF Document',
                            size: '644 KB',
                            icon: 'fa-file-pdf',
                            color: '#ef4444',
                            url: '/ChatGPT_Guide_for_White_Collar_Professionals.pdf'
                        }
                    );
                }

                const handleDownload = (title) => {
                    // No-op or native alert if needed
                };

                return (
                    <div className="dl-tab-view dl-files-view" style={{ paddingTop: isCapacitorApp ? '12px' : '24px' }}>
                        <div className="dl-tab-header" style={{ marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', margin: '0' }}>Resources & Downloads</h2>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Access downloadable worksheets, cheat sheets, and templates for your courses.</p>
                        </div>

                        {courseFiles.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                                <i className="fa-solid fa-folder-open" style={{ fontSize: '2.5rem', marginBottom: '12px', color: '#cbd5e1' }}></i>
                                <p style={{ fontSize: '0.9rem', margin: 0 }}>No resources available yet. Enroll in a course to get access to its resources.</p>
                            </div>
                        ) : (
                            <div className="dl-files-list">
                                {courseFiles.map((file, idx) => (
                                    <div key={idx} className="dl-file-card">
                                        <div className="dl-file-icon-wrap" style={{ backgroundColor: file.color + '15', color: file.color }}>
                                            <i className={`fa-solid ${file.icon}`}></i>
                                        </div>
                                        <div className="dl-file-details">
                                            <h4 className="dl-file-name">{file.title}</h4>
                                            <span className="dl-file-meta">{file.type} • {file.size}</span>
                                        </div>
                                        <a
                                            href={isCapacitorApp ? '#' : file.url}
                                            download={!isCapacitorApp}
                                            target={isCapacitorApp ? undefined : "_blank"}
                                            rel="noopener noreferrer"
                                            className="dl-file-dl-btn"
                                            onClick={(e) => {
                                                if (isCapacitorApp) {
                                                    e.preventDefault();
                                                    window.open('https://gyanschool.com' + file.url, '_system');
                                                } else {
                                                    handleDownload(file.title);
                                                }
                                            }}
                                        >
                                            <i className="fa-solid fa-download"></i>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            }

            case 'profile': {
                const userInitials = user?.name
                    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
                    : '?';
                const totalCompleted = enrolledCourses.reduce((acc, c) => acc + (c.progress?.completed?.length || 0), 0);
                return (
                    <div className="dl-tab-view dl-profile-view" style={{ paddingTop: isCapacitorApp ? '12px' : '24px' }}>
                        <div className="dl-tab-header" style={{ marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', margin: '0' }}>My Profile</h2>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Manage your display name and view your course stats.</p>
                        </div>

                        {/* Minimalist Profile Hero Card */}
                        <div className="dl-profile-minimal-card" style={{ padding: '20px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#0c4983', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem' }}>
                                    {userInitials}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                                        {localStorage.getItem('gs_display_name') || user?.name || 'Learner'}
                                    </h3>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <i className="fa-solid fa-envelope"></i> {user?.email || 'Not signed in'}
                                    </p>
                                </div>
                            </div>

                            {/* Minimal Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '16px 0', marginBottom: '16px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0c4983' }}>{enrolledCourses.length}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Enrolled Tracks</div>
                                </div>
                                <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0' }}>
                                    <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#10b981' }}>{totalCompleted}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Lessons Completed</div>
                                </div>
                            </div>

                            {/* Simple Display Name Edit Section */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                    Display Name
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={e => setDisplayName(e.target.value)}
                                        placeholder="Your name"
                                        maxLength={40}
                                        style={{ flex: 1, padding: '10px 14px', fontSize: '0.88rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#ffffff' }}
                                    />
                                    <button
                                        onClick={handleSaveName}
                                        style={{ padding: '0 16px', background: '#0c4983', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                                    >
                                        {displayNameSaved ? <><i className="fa-solid fa-check"></i> Saved</> : 'Save'}
                                    </button>
                                </div>
                            </div>

                            {/* Sign Out Button */}
                            <button
                                onClick={() => logout && logout()}
                                style={{ width: '100%', padding: '12px', background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}
                            >
                                <i className="fa-solid fa-right-from-bracket"></i> Sign Out
                            </button>

                            {/* Account Deletion Section */}
                            <div style={{ marginTop: '24px', borderTop: '1px dashed #cbd5e1', paddingTop: '20px', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 12px 0' }}>
                                    Need to delete your account? You can request to delete your profile and all associated learning data.
                                </p>
                                <a 
                                    href="https://www.gyanschool.com/privacy.html#delete-account" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    style={{ fontSize: '0.82rem', color: '#ef4444', fontWeight: 600, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                >
                                    <i className="fa-solid fa-user-slash"></i> Request Account Deletion
                                </a>
                            </div>
                        </div>
                    </div>
                );
            }

            case 'learn':
            case 'courses':

            default: {
                if (!activeCourse) {
                    return (
                        <div className="dl-tab-view" style={{ textAlign: 'center', padding: '40px' }}>
                            <h2 style={{ color: '#0f172a' }}>Welcome to GyanSchool</h2>
                            <p style={{ color: '#64748b' }}>Please enroll in a course to view your curriculum steps.</p>
                            <Link to="/courses" className="split-continue-btn" style={{ display: 'inline-flex', marginTop: '16px', textDecoration: 'none' }}>
                                Browse Courses
                            </Link>
                        </div>
                    );
                }
                const courseSteps = getCourseSteps(activeCourse);

                return (
                    <>
                        {/* Course Switcher Header — clickable title with dropdown */}
                        <div style={{
                            padding: '12px 0 1.5rem 0',
                            borderBottom: '1px solid #e2e8f0',
                            marginBottom: '2rem',
                            position: 'sticky',
                            top: 0,
                            background: '#ffffff',
                            zIndex: 100
                        }}>
                            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, letterSpacing: '0.05em' }}>
                                MY COURSE
                            </span>
                            {/* Clickable title row */}
                            <div
                                className="dl-course-tab-switcher"
                                onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                    <h2 className="dl-course-tab-title" style={{ marginRight: '8px' }}>
                                        {activeCourse.title}
                                    </h2>
                                    <i className={`fa-solid fa-chevron-${showCourseDropdown ? 'up' : 'down'} dl-course-tab-chevron`}></i>
                                </div>
                                
                                {/* Circular progress bar on the right side */}
                                {activeCourse && (() => {
                                    const totalSteps = getCourseSteps(activeCourse)?.length || 1;
                                    const completedCount = activeCourse.progress?.completed?.length || 0;
                                    const activeCourseProgressPct = Math.round((completedCount / totalSteps) * 100);
                                    return (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>
                                                {activeCourseProgressPct}%
                                            </span>
                                            <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                                                <svg width="40" height="40" viewBox="0 0 44 44">
                                                    {/* Track circle */}
                                                    <circle cx="22" cy="22" r="18" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                                                    {/* Filled circle */}
                                                    <circle
                                                        cx="22"
                                                        cy="22"
                                                        r="18"
                                                        fill="none"
                                                        stroke="#10b981"
                                                        strokeWidth="4"
                                                        strokeDasharray="113"
                                                        strokeDashoffset={113 - (113 * activeCourseProgressPct) / 100}
                                                        strokeLinecap="round"
                                                        transform="rotate(-90 22 22)"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                            {/* Dropdown */}
                            {showCourseDropdown && (
                                <div className="dl-course-tab-dropdown">
                                    <div className="dl-course-tab-dropdown-label">Switch Course</div>
                                    {enrolledCourses.map(course => {
                                        const cTotalSteps = getCourseSteps(course)?.length || 1;
                                        const cCompletedCount = course.progress?.completed?.length || 0;
                                        const cProgressPercent = Math.round((cCompletedCount / cTotalSteps) * 100);
                                        return (
                                            <div
                                                key={course.index}
                                                className={`dl-course-tab-dropdown-item ${course.index === activeCourseId ? 'active' : ''}`}
                                                onClick={() => {
                                                    setActiveCourseId(course.index);
                                                    setShowCourseDropdown(false);
                                                    setSelectedNode(null);
                                                }}
                                            >
                                                <img src={course.image} alt={course.title} className="dl-course-tab-dropdown-thumb" />
                                                <div>
                                                    <div className="dl-course-tab-dropdown-name">{course.title}</div>
                                                    <div className="dl-course-tab-dropdown-prog">
                                                        {cProgressPercent}% complete
                                                    </div>
                                                </div>
                                                {course.index === activeCourseId && (
                                                    <i className="fa-solid fa-circle-check" style={{ marginLeft: 'auto', color: '#5048e5', fontSize: '0.9rem' }}></i>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Professional Flat Curriculum Steps Container */}
                        <div className="curriculum-container" style={{ marginTop: '20px' }}>
                            <style>{`
                                .curriculum-step-card {
                                    background: #ffffff !important;
                                    border: 1px solid #f1f5f9 !important;
                                    border-radius: 4px !important;
                                    padding: 1.25rem 1.5rem !important;
                                    margin-bottom: 1rem !important;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    transition: all 0.2s ease;
                                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02) !important;
                                }
                                .curriculum-step-card:hover {
                                    background: #ffffff !important;
                                    border-color: var(--brand-primary) !important;
                                }
                                .curriculum-step-card:hover .curriculum-step-info h3 {
                                    color: var(--brand-primary) !important;
                                }
                                .curriculum-step-card.locked {
                                    cursor: not-allowed;
                                    background: #ffffff !important;
                                    box-shadow: none !important;
                                    border-color: #f1f5f9 !important;
                                }
                                .curriculum-step-card.locked .curriculum-step-left,
                                .curriculum-step-card.locked .curriculum-start-btn {
                                    opacity: 0.4;
                                }
                                .curriculum-step-left {
                                    display: flex;
                                    align-items: center;
                                    gap: 15px;
                                    min-width: 0;
                                    flex: 1;
                                }
                                .curriculum-step-icon {
                                    font-size: 1rem;
                                    width: 36px;
                                    height: 36px;
                                    border-radius: 50%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    flex-shrink: 0;
                                }
                                .curriculum-step-icon.completed {
                                    background: transparent !important;
                                    color: #10b981 !important;
                                    border: 1.5px solid #10b981 !important;
                                }
                                .curriculum-step-icon.active {
                                    background: transparent !important;
                                    color: #5048e5 !important;
                                    border: 1.5px solid #5048e5 !important;
                                }
                                .curriculum-step-icon.locked {
                                    background: transparent !important;
                                    color: #94a3b8 !important;
                                    border: 1.5px solid #cbd5e1 !important;
                                }
                                .curriculum-step-info {
                                    min-width: 0;
                                    flex: 1;
                                }
                                .curriculum-step-info h3 {
                                    font-size: 1.05rem;
                                    font-weight: 500;
                                    color: #1e293b !important;
                                    margin: 0 0 4px 0;
                                    text-align: left;
                                    white-space: normal;
                                    word-break: break-word;
                                    overflow-wrap: break-word;
                                    transition: color 0.2s ease;
                                }
                                .curriculum-step-info span {
                                    font-size: 0.8rem;
                                    color: #64748b !important;
                                    font-weight: 400;
                                    text-transform: none;
                                    display: block;
                                    text-align: left;
                                }
                                .curriculum-start-btn {
                                    border: none;
                                    border-radius: 10px;
                                    padding: 8px 18px;
                                    font-weight: 500;
                                    font-size: 0.85rem;
                                    cursor: pointer;
                                    transition: all 0.2s;
                                    flex-shrink: 0;
                                    margin-left: 1.5rem;
                                }
                                .curriculum-start-btn.primary {
                                    background: #0c4983;
                                    color: #fff;
                                    box-shadow: 0 4px 0 #08345e;
                                }
                                .curriculum-start-btn.primary:hover {
                                    background: #093967;
                                    transform: translateY(1px);
                                    box-shadow: 0 3px 0 #08345e;
                                }
                                .curriculum-start-btn.secondary {
                                    background: #f1f5f9;
                                    border: 1.5px solid #cbd5e1;
                                    color: #475569;
                                }
                                .curriculum-start-btn.secondary:hover {
                                    background: #e2e8f0;
                                }
                                .curriculum-section-header {
                                    font-size: 0.95rem;
                                    color: #475569 !important;
                                    font-weight: 500;
                                    text-transform: none;
                                    letter-spacing: 0.02em;
                                    margin: 0;
                                    padding: 1.5rem 0 0.75rem 0;
                                    text-align: left;
                                    top: 70px;
                                    background: #ffffff;
                                    z-index: 90;
                                }
                            `}</style>

                            <div className="curriculum-steps-list">
                                {courseSteps.map((step, globalIdx) => {
                                    const isCompleted = completedLessons.includes(globalIdx);
                                    const isLocked = globalIdx > 0 && !completedLessons.includes(globalIdx - 1) && !completedLessons.includes(globalIdx);

                                    let status = 'locked';
                                    if (isCompleted) status = 'completed';
                                    else if (!isLocked) status = 'active';

                                    let icon = 'fa-circle-play';
                                    if (step.type === 'course_intro') icon = 'fa-circle-info';
                                    else if (step.type === 'tool_intro') icon = 'fa-volume-high';
                                    else if (step.type === 'tool_assignment' || step.type === 'master_assignment') icon = 'fa-pen-to-square';
                                    else if (step.type === 'tool_test' || step.type === 'master_test') icon = 'fa-circle-question';
                                    else if (step.type === 'master_certificate') icon = 'fa-certificate';

                                    // Determine module header & dropdown collapse state
                                    let sectionHeader = null;
                                    let isModuleOpen = true;

                                    if (globalIdx === 0) {
                                        sectionHeader = <div className="curriculum-section-header" style={{ fontWeight: 700, color: '#0c4983', fontSize: '1rem', paddingBottom: '8px' }}>Course Overview</div>;
                                    } else if (step.toolIndex !== undefined && (globalIdx === 1 || courseSteps[globalIdx - 1].toolIndex !== step.toolIndex)) {
                                        const mIdx = step.toolIndex;
                                        const modInfo = OFFICIAL_MODULES[mIdx];
                                        const isOpen = openLearnModules.has(mIdx);
                                        isModuleOpen = isOpen;

                                        const modLessonsCount = courseSteps.filter(s => s.toolIndex === mIdx && s.type === 'lecture').length;

                                        sectionHeader = (
                                            <div
                                                onClick={() => toggleLearnModule(mIdx)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '16px',
                                                    padding: '16px 20px',
                                                    background: isOpen ? '#f8faff' : '#f8f9fc',
                                                    border: `2px solid ${isOpen ? '#0c4983' : '#e2e8f0'}`,
                                                    borderRadius: '12px',
                                                    margin: '20px 0 8px 0',
                                                    cursor: 'pointer',
                                                    userSelect: 'none',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                {/* Module number badge */}
                                                <div style={{
                                                    minWidth: '40px',
                                                    height: '40px',
                                                    borderRadius: '10px',
                                                    background: isOpen ? '#0c4983' : '#e2e8f0',
                                                    color: isOpen ? '#ffffff' : '#64748b',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 800,
                                                    fontSize: '0.95rem',
                                                    flexShrink: 0,
                                                    transition: 'all 0.2s ease'
                                                }}>
                                                    {mIdx + 1}
                                                </div>

                                                {/* Title + objective */}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>
                                                        {modInfo?.title || step.toolName}
                                                    </div>
                                                    {modInfo?.objective && (
                                                        <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 400 }}>
                                                            {modInfo.objective}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Lesson count + chevron */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                                                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                                                        {modLessonsCount} lesson{modLessonsCount !== 1 ? 's' : ''}
                                                    </span>
                                                    <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`}
                                                        style={{ color: isOpen ? '#0c4983' : '#94a3b8', fontSize: '0.8rem', transition: 'color 0.2s' }}></i>
                                                </div>
                                            </div>
                                        );
                                    } else if (globalIdx === courseSteps.length - 3) {
                                        const isOpen = openLearnModules.has('master');
                                        isModuleOpen = isOpen;

                                        sectionHeader = (
                                            <div
                                                onClick={() => toggleLearnModule('master')}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '16px',
                                                    padding: '16px 20px',
                                                    background: isOpen ? '#f8faff' : '#f8f9fc',
                                                    border: `2px solid ${isOpen ? '#0c4983' : '#e2e8f0'}`,
                                                    borderRadius: '12px',
                                                    margin: '20px 0 8px 0',
                                                    cursor: 'pointer',
                                                    userSelect: 'none',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <div style={{
                                                    minWidth: '40px',
                                                    height: '40px',
                                                    borderRadius: '10px',
                                                    background: isOpen ? '#0c4983' : '#e2e8f0',
                                                    color: isOpen ? '#ffffff' : '#64748b',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 800,
                                                    fontSize: '0.85rem',
                                                    flexShrink: 0,
                                                    transition: 'all 0.2s ease'
                                                }}>
                                                    <i className="fa-solid fa-trophy" style={{ fontSize: '0.9rem' }}></i>
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>
                                                        Master Graduation
                                                    </div>
                                                    <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 400 }}>
                                                        Final project, master exam, and certificate
                                                    </div>
                                                </div>
                                                <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`}
                                                    style={{ color: isOpen ? '#0c4983' : '#94a3b8', fontSize: '0.8rem', flexShrink: 0, transition: 'color 0.2s' }}></i>
                                            </div>
                                        );
                                    } else {
                                        if (step.toolIndex !== undefined) {
                                            isModuleOpen = openLearnModules.has(step.toolIndex);
                                        } else if (globalIdx >= courseSteps.length - 3) {
                                            isModuleOpen = openLearnModules.has('master');
                                        }
                                    }

                                    if (!isModuleOpen && sectionHeader === null) {
                                        return null;
                                    }

                                    return (
                                        <React.Fragment key={globalIdx}>
                                            {sectionHeader}
                                            {isModuleOpen && (
                                                <div
                                                    className={`curriculum-step-card ${isLocked ? 'locked' : ''}`}
                                                    style={{ position: 'sticky', top: '130px', zIndex: globalIdx }}
                                                >
                                                <div className="curriculum-step-left">
                                                    <div className={`curriculum-step-icon ${status}`}>
                                                        <i className={`fa-solid ${isCompleted ? 'fa-circle-check' : icon}`}></i>
                                                    </div>
                                                    <div className="curriculum-step-info">
                                                        <h3>{step.title}</h3>
                                                        <span>{step.type.replace('_', ' ')}</span>
                                                    </div>
                                                </div>
                                                {!isLocked && (
                                                    <button
                                                        className={`curriculum-start-btn ${isCompleted ? 'secondary' : 'primary'}`}
                                                        onClick={() => navigate(`/learn/${activeCourse.index}/lesson/${globalIdx + 1}`)}
                                                    >
                                                        {isCompleted ? 'Review' : 'Start'}
                                                    </button>
                                                )}
                                            </div>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                );
            }
        }
    };

    return (
        <div className="dl-layout" style={{ background: '#ffffff', color: '#1e293b' }}>
            {/* Top Navigation Bar */}
            {!isCapacitorApp && (
                <header className="dl-top-bar" style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 24px',
                    borderBottom: '2px solid #f1f5f9',
                    backgroundColor: '#ffffff',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    boxSizing: 'border-box'
                }}>
                    {/* Left Side: Logo (No cap icon, styled black) */}
                    <div>
                        <Link to="/" className="dl-brand" style={{ margin: 0, padding: 0, display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', fontWeight: 500, fontSize: '1.4rem', color: '#0f172a', letterSpacing: '2px' }}>
                            <span>gyanschool</span>
                        </Link>
                    </div>

                    {/* Right Side: Logout (Sentence case, regular weight, text transform none) */}
                    <div>
                        <button
                            onClick={() => { logout && logout(); }}
                            className="dl-nav-item dl-nav-logout"
                            style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, fontSize: '0.9rem', color: '#ef4444', textTransform: 'none', padding: '8px 12px', borderRadius: '8px' }}
                        >
                            <i className="fa-solid fa-right-from-bracket"></i>
                            <span>Logout</span>
                        </button>
                    </div>
                </header>
            )}

            {/* Center Content Panel */}
            <main className="dl-center-container">
                {renderCenterContent()}
            </main>


            {showGuidebook && activeCourse && (() => {
                const tools = activeCourse.lessonsList
                    ?.filter(l => l.toolName)
                    ?.reduce((acc, l) => {
                        if (!acc.find(t => t.name === l.toolName)) {
                            acc.push({ name: l.toolName, url: l.toolUrl });
                        }
                        return acc;
                    }, []) || [];

                return (
                    <div className="guidebook-overlay" onClick={() => setShowGuidebook(false)}>
                        <div className="guidebook-modal" onClick={e => e.stopPropagation()}>
                            <button className="guidebook-close-btn" onClick={() => setShowGuidebook(false)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>

                            <div className="guidebook-header">
                                <div className="guidebook-icon">
                                    <i className="fa-solid fa-book-open"></i>
                                </div>
                                <h2>{activeCourse.title}</h2>
                            </div>

                            <div className="guidebook-body">
                                <div className="guidebook-section">
                                    <h3><i className="fa-solid fa-circle-info"></i> About This Course</h3>
                                    <p>{activeCourse.description}</p>
                                </div>

                                <div className="guidebook-meta-row">
                                    <div className="guidebook-meta-item">
                                        <i className="fa-solid fa-book-open"></i>
                                        <span>{activeCourse.lessonsList?.length || activeCourse.lessons} Lessons</span>
                                    </div>
                                    <div className="guidebook-meta-item">
                                        <i className="fa-solid fa-clock"></i>
                                        <span>{
                                            activeCourse.lessonsList?.reduce((t, l) => {
                                                const mins = parseInt(l.duration);
                                                return t + (isNaN(mins) ? 0 : mins);
                                            }, 0) || '—'
                                        } min total</span>
                                    </div>
                                    <div className="guidebook-meta-item">
                                        <i className="fa-solid fa-star"></i>
                                        <span>{activeCourse.rating} ⭐ ({activeCourse.ratingText})</span>
                                    </div>
                                </div>

                                <div className="guidebook-section">
                                    <h3><i className="fa-solid fa-list"></i> Course Curriculum</h3>
                                    <div className="guidebook-lessons">
                                        {activeCourse.lessonsList?.map((lesson, i) => (
                                            <div key={i} className="guidebook-lesson-item">
                                                <span className="guidebook-lesson-num">{i + 1}</span>
                                                <div className="guidebook-lesson-info">
                                                    <span className="guidebook-lesson-title">{lesson.title}</span>
                                                    <span className="guidebook-lesson-duration"><i className="fa-regular fa-clock"></i> {lesson.duration}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {tools.length > 0 && (
                                    <div className="guidebook-section">
                                        <h3><i className="fa-solid fa-screwdriver-wrench"></i> Tools You'll Use</h3>
                                        <div className="guidebook-tools">
                                            {tools.map((tool, i) => (
                                                <a key={i} href={tool.url} target="_blank" rel="noopener noreferrer" className="guidebook-tool-chip">
                                                    <i className="fa-solid fa-link"></i>
                                                    {tool.name}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })()}
            {showAddCoursePopup && (
                <div className="all-courses-overlay" onClick={() => setShowAddCoursePopup(false)} style={{ display: 'flex', zIndex: 99999 }}>
                    <div className="all-courses-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="all-courses-header">
                            <div className="all-courses-header-left">
                                <h2>Browse & Add Courses</h2>
                                <p className="all-courses-subtitle">Choose from our curated AI learning tracks and accelerate your career</p>
                            </div>
                            <button className="all-courses-close" onClick={() => setShowAddCoursePopup(false)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="all-courses-filters-row">
                            <div className="all-courses-search-bar">
                                <i className="fa-solid fa-magnifying-glass"></i>
                                <input
                                    type="text"
                                    placeholder="Search by title, topic or skills..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button className="all-courses-clear-search" onClick={() => setSearchQuery('')}>
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                )}
                            </div>
                            <div className="all-courses-categories">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        className={`all-courses-cat-tab ${activeCategory === cat ? 'active' : ''}`}
                                        onClick={() => setActiveCategory(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="all-courses-grid">
                            {filteredCourses.map((course) => {
                                const index = course.originalIndex;
                                const isEnrolled = allPurchasedIndices.includes(index);
                                return (
                                    <div key={index} className={`all-course-card ${isEnrolled ? 'selected' : ''}`}>
                                        <div className="all-course-img">
                                            <img src={course.image} alt={course.title} />
                                        </div>
                                        <div className="all-course-info">
                                            <div className="all-course-details-main">
                                                <div className="all-course-card-top">
                                                    <span className="all-course-badge">{course.badge}</span>
                                                    {course.rating && (
                                                        <span className="all-course-rating">
                                                            <i className="fa-solid fa-star"></i> {course.ratingText ? course.ratingText.replace(/[()]/g, '') : course.rating}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3>{course.title}</h3>
                                                {course.description && <p className="all-course-desc">{course.description}</p>}
                                            </div>

                                            <div className="all-course-actions">
                                                {isEnrolled ? (
                                                    <button className="all-course-add-btn enrolled-btn" disabled>
                                                        <i className="fa-solid fa-circle-check"></i> Enrolled
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="all-course-add-btn enroll-now-btn"
                                                        onClick={() => {
                                                            localStorage.setItem('gyanschool_checkout_course_idx', index.toString());
                                                            localStorage.setItem('gyanschool_checkout_plan', 'real-purchase');
                                                            sessionStorage.setItem('gyanschool_quiz_token', 'direct_' + Math.random().toString(36).substring(2, 11));
                                                            setShowAddCoursePopup(false);
                                                            navigate('/?step=checkout');
                                                        }}
                                                    >
                                                        Enroll Now <i className="fa-solid fa-arrow-right"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {filteredCourses.length === 0 && (
                                <div className="all-courses-empty">
                                    <i className="fa-solid fa-graduation-cap"></i>
                                    <h3>No programs found</h3>
                                    <p>Try refining your search keyword or selecting a different learning track category.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}
