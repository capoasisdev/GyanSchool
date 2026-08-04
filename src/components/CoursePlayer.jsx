import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEnrichedCourses } from '../data/courses';
import {
    getCourseProgress, completeLesson, setCurrentLesson,
    saveVideoProgress, getVideoProgress,
    getAllLessonWatchedPercents, updateTodayStats
} from '../utils/progressTracker';
import { useAuth } from '../context/AuthContext';
import { getCourseSteps, OFFICIAL_MODULES } from '../utils/progressTracker';

function getEmbedUrl(url) {
    if (!url) return '';
    if (url.includes('/embed/') || url.includes('player.vimeo.com/video/')) {
        return url;
    }
    const ytReg = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const ytMatch = url.match(ytReg);
    if (ytMatch && ytMatch[2].length === 11) {
        return `https://www.youtube.com/embed/${ytMatch[2]}`;
    }
    const ytShortsReg = /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/;
    const ytShortsMatch = url.match(ytShortsReg);
    if (ytShortsMatch) {
        return `https://www.youtube.com/embed/${ytShortsMatch[1]}`;
    }
    const vimeoReg = /vimeo\.com\/([0-9]+)/;
    const vimeoMatch = url.match(vimeoReg);
    if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return url;
}

/* ────────────────── CUSTOM TEXT TO SPEECH COMPONENT ────────────────── */
function AudioIntroPlayer({ text }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(-1);
    const words = text.split(' ');
    const utteranceRef = useRef(null);

    // Sync speech synthesis state
    useEffect(() => {
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const speak = () => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        const voices = window.speechSynthesis.getVoices();
        const premiumVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.lang.startsWith('en'));
        if (premiumVoice) utterance.voice = premiumVoice;

        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                const charIndex = event.charIndex;
                // Determine word index based on character index
                let sum = 0;
                let wordIdx = 0;
                for (let i = 0; i < words.length; i++) {
                    if (sum >= charIndex) {
                        wordIdx = i;
                        break;
                    }
                    sum += words[i].length + 1; // +1 for space
                }
                setCurrentWordIndex(wordIdx);
            }
        };

        utterance.onend = () => {
            setIsPlaying(false);
            setCurrentWordIndex(-1);
        };

        utterance.onerror = () => {
            setIsPlaying(false);
            setCurrentWordIndex(-1);
        };

        setIsPlaying(true);
        if (window.speechSynthesis) {
            window.speechSynthesis.speak(utterance);
        }
    };

    const pause = () => {
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
                setIsPlaying(true);
            } else {
                window.speechSynthesis.pause();
                setIsPlaying(false);
            }
        }
    };

    const stop = () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        setIsPlaying(false);
        setCurrentWordIndex(-1);
    };

    const togglePlay = () => {
        if (isPlaying) {
            pause();
        } else {
            speak();
        }
    };

    return (
        <div className="audio-tts-card">
            <div className="audio-tts-controls">
                <button onClick={togglePlay} className="tts-control-btn play">
                    <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-volume-high'}`}></i>
                    <span>{isPlaying ? 'Pause Intro Audio' : 'Listen to Introduction'}</span>
                </button>
                {isPlaying && (
                    <button onClick={stop} className="tts-control-btn stop">
                        <i className="fa-solid fa-stop"></i>
                        <span>Stop</span>
                    </button>
                )}
            </div>

            <div className="tts-text-display">
                {words.map((word, idx) => (
                    <span
                        key={idx}
                        className={`tts-word ${idx === currentWordIndex ? 'highlighted-word' : ''}`}
                    >
                        {word}{' '}
                    </span>
                ))}
            </div>
        </div>
    );
}

/* ────────────────── MAIN PLAYER COMPONENT ────────────────── */
export default function CoursePlayer() {
    const { courseId, lessonNum } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const idx = parseInt(courseId, 10);
    const enrichedCourses = getEnrichedCourses();
    const course = enrichedCourses[idx];

    // Steps array
    const steps = getCourseSteps(course);

    const progress = getCourseProgress(idx, user?.id);
    const currentStepIndex = lessonNum ? parseInt(lessonNum, 10) - 1 : progress.currentStep;

    const currentStep = steps[currentStepIndex] || steps[0];


    const videoRef = useRef(null);
    const bufferTimerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [videoError, setVideoError] = useState(null);

    // Assignment state
    const [assignmentImage, setAssignmentImage] = useState(null);
    const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);

    // Quiz States
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [quizAnswerChecked, setQuizAnswerChecked] = useState(false);
    const [quizScore, setQuizScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);

    // Sidebar collapse state
    const [openModules, setOpenModules] = React.useState(() => {
        const initialSet = new Set([0, 'master']);
        return initialSet;
    });



    // Reset component states when switching step
    const [isPlayingIntro, setIsPlayingIntro] = useState(true);
    const [isVideoBuffering, setIsVideoBuffering] = useState(false);
    const [showPdfModal, setShowPdfModal] = useState(false);

    const videoSrc = currentStep && (isPlayingIntro ? '/images/intro_video.mp4' : getEmbedUrl(currentStep.videoUrl || currentStep.introVideoUrl));
    const isHtml5 = currentStep && (isPlayingIntro || (videoSrc && videoSrc.endsWith('.mp4')) || (currentStep.videoUrl?.includes('.mp4')) || (currentStep.introVideoUrl?.includes('.mp4')));

    const isCapacitorApp = !!window.Capacitor || new URLSearchParams(window.location.search).get('testApp') === 'true';

    // Sync video loading and playback when src changes
    useEffect(() => {
        if (videoRef.current && videoSrc) {
            videoRef.current.load();
            if (isPlayingIntro) {
                // Autoplay the looping intro preview silently
                videoRef.current.play().then(() => {
                    setIsPlaying(false); // keep the play button overlay showing
                }).catch(err => {
                    console.warn("Looping preview autoplay failed:", err);
                });
            } else {
                videoRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch(err => {
                    console.warn("Auto-play actual video failed:", err);
                });
            }
        }
    }, [videoSrc, isPlayingIntro]);

    useEffect(() => {
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        setPlaybackSpeed(1);
        setShowSpeedMenu(false);
        setVideoError(null);
        setIsPlayingIntro(true);
        clearTimeout(bufferTimerRef.current);
        setIsVideoBuffering(false);
        setShowPdfModal(false);

        // Reset assignment uploader
        setAssignmentImage(null);
        setAssignmentSubmitted(false);

        // Reset Quiz states
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setQuizAnswerChecked(false);
        setQuizScore(0);
        setQuizFinished(false);

        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }, [currentStepIndex]);

    // Fullscreen event listener
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    // Apply playback speed rate changes
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackSpeed;
        }
    }, [playbackSpeed, currentStepIndex]);

    if (!course) {
        return (
            <div className="gf-error">
                <div className="gf-error-content">
                    <span className="gf-error-emoji">🎓</span>
                    <h2>Course not found</h2>
                    <button onClick={() => navigate('/learn')}>Go Back</button>
                </div>
            </div>
        );
    }

    const totalSteps = steps.length;
    const completedCount = progress.completed.length;

    const handleNodeClick = (index) => {
        const isUnlocked = index === 0 || progress.completed.includes(index - 1) || progress.completed.includes(index);
        if (!isUnlocked) return;
        navigate(`/learn/${idx}/lesson/${index + 1}`);
    };

    const handleCompleteStep = () => {
        completeLesson(idx, currentStepIndex, user?.id);
        updateTodayStats('lessonsCompleted', 1, user?.id);

        if (currentStepIndex < totalSteps - 1) {
            navigate(`/learn/${idx}/lesson/${currentStepIndex + 2}`);
        } else {
            navigate('/learn');
        }
    };

    /* ─── VIDEO CONTROLS ─── */
    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            if (isPlayingIntro) {
                setIsPlayingIntro(false);
                return;
            }
            videoRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(err => {
                setVideoError("The video could not be loaded. Please ensure you have a stable network connection.");
            });
        }
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        setCurrentTime(videoRef.current.currentTime);
        const pct = duration > 0 ? Math.round((videoRef.current.currentTime / duration) * 100) : 0;

        // Auto-complete lecture step at 85%
        if (pct >= 85 && !isPlayingIntro && !progress.completed.includes(currentStepIndex)) {
            handleCompleteStep(15, 20);
        }
    };

    const handleVideoEnded = () => {
        if (isPlayingIntro) {
            setIsPlayingIntro(false);
        }
    };

    const handleSeek = (e) => {
        if (!videoRef.current) return;
        const newTime = (parseFloat(e.target.value) / 100) * duration;
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (e) => {
        if (!videoRef.current) return;
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        videoRef.current.volume = newVolume;
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        const nextMute = !isMuted;
        setIsMuted(nextMute);
        videoRef.current.muted = nextMute;
    };

    const formatTime = (timeInSeconds) => {
        if (isNaN(timeInSeconds)) return '00:00';
        const mins = Math.floor(timeInSeconds / 60);
        const secs = Math.floor(timeInSeconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    /* ─── ASSIGNMENT CONTROLS ─── */
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (uploadEvent) => {
                setAssignmentImage(uploadEvent.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submitAssignment = () => {
        if (!assignmentImage) {
            alert("Please upload a file or screenshot before submitting!");
            return;
        }
        setAssignmentSubmitted(true);
        // Save local assignment submission flag
        const subKey = `gs_submission_${idx}_step_${currentStepIndex}_${user?.id || 'guest'}`;
        localStorage.setItem(subKey, "true");

        setTimeout(() => {
            handleCompleteStep(30, 40); // Larger rewards for assignments
        }, 1500);
    };

    /* ─── QUIZ CONTROLS ─── */
    const handleOptionSelect = (optIdx) => {
        if (quizAnswerChecked) return;
        setSelectedOption(optIdx);
    };

    const checkQuizAnswer = () => {
        if (selectedOption === null) return;
        setQuizAnswerChecked(true);
        const currentQ = currentStep.questions[currentQuestionIndex];
        if (selectedOption === currentQ.answer) {
            setQuizScore(prev => prev + 1);
        }
    };

    const nextQuizQuestion = () => {
        setSelectedOption(null);
        setQuizAnswerChecked(false);
        if (currentQuestionIndex < currentStep.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setQuizFinished(true);
            // Save quiz score
            const scorePercent = Math.round(((quizScore + (selectedOption === currentStep.questions[currentQuestionIndex].answer ? 1 : 0)) / currentStep.questions.length) * 100);
            const scoreKey = `gs_score_${idx}_step_${currentStepIndex}_${user?.id || 'guest'}`;
            localStorage.setItem(scoreKey, scorePercent.toString());
        }
    };

    /* ─── COLLAPSIBLE SIDEBAR STATE ─── */
    const toggleModule = (key) => {
        setOpenModules(prev => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    const getStepTypeLabel = (step) => {
        switch (step.type) {
            case 'course_intro': return 'Introduction';
            case 'tool_intro': return 'Module Intro';
            case 'lecture': return 'Video';
            case 'tool_assignment':
            case 'master_assignment': return 'Assignment';
            case 'tool_test':
            case 'master_test': return 'Quiz';
            case 'certificate': return 'Certificate';
            default: return 'Lesson';
        }
    };

    const renderSidebarItem = (step, globalIdx) => {
        const isCompleted = progress.completed.includes(globalIdx);
        const isActive = currentStepIndex === globalIdx;
        const isLocked = globalIdx > 0 && !progress.completed.includes(globalIdx - 1) && !progress.completed.includes(globalIdx);
        const typeLabel = getStepTypeLabel(step);
        return (
            <div
                key={globalIdx}
                className={`cp-lesson-item ${isActive ? 'cp-active' : ''} ${isLocked ? 'cp-locked' : ''}`}
                onClick={() => !isLocked && handleNodeClick(globalIdx)}
                style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
            >
                <div className="cp-lesson-check">
                    {isCompleted ? (
                        <i className="fa-solid fa-circle-check" style={{ color: 'green', fontSize: '1.4rem' }}></i>
                    ) : isLocked ? (
                        <i className="fa-solid fa-lock" style={{ color: '#9ca3af', fontSize: '0.85rem' }}></i>
                    ) : (
                        <div className={`cp-lesson-dot ${isActive ? 'cp-dot-active' : ''}`}></div>
                    )}
                </div>
                <div className="cp-lesson-meta">
                    <span className="cp-lesson-title">{step.title}</span>
                    <span className="cp-lesson-sub">{typeLabel}</span>
                </div>
            </div>
        );
    };

    const hasNext = currentStepIndex < totalSteps - 1;
    const isLocked = hasNext && currentStepIndex > 0 && !progress.completed.includes(currentStepIndex) && !progress.completed.includes(currentStepIndex - 1);
    const isCurrentStepCompleted = progress.completed.includes(currentStepIndex);

    const renderCenterFooter = () => {
        return (
            <div className="cp-center-footer">
                {hasNext && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {!isCurrentStepCompleted ? (
                            <button
                                className="split-continue-btn"
                                onClick={() => handleCompleteStep(15, 20)}
                                disabled={isLocked}
                            >
                                <i className="fa-solid fa-circle-check"></i> Complete & Continue
                            </button>
                        ) : (
                            <button
                                className="split-continue-btn"
                                onClick={() => navigate(`/learn/${idx}/lesson/${currentStepIndex + 2}`)}
                                disabled={isLocked}
                            >
                                Go to next item <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    /* ─── STEP VIEW RENDERING ─── */
    const renderCenterContent = () => {


        // Normalize tool_intro to match lecture shape so we can reuse the same rendering
        const step = currentStep.type === 'tool_intro'
            ? { ...currentStep, type: 'lecture', videoUrl: currentStep.introVideoUrl, title: currentStep.toolName }
            : currentStep;

        switch (step.type) {
            case 'course_intro':
                return (
                    <div className="cp-card">
                        <div className="cp-details-wrapper">
                            <div className="cp-badge"><i className="fa-solid fa-star"></i> WELCOME</div>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#111827', margin: '0 0 0.75rem' }}>{course.title}</h2>
                            <p style={{ color: '#4b5563', lineHeight: 1.7, marginBottom: '1.5rem' }}>{currentStep.aboutText}</p>

                            <div className="cp-highlight-grid">
                                <div className="cp-highlight-item">
                                    <i className="fa-solid fa-screwdriver-wrench"></i>
                                    <div><strong>Tool-based Learning</strong><span>Master Canva, Gamma AI, Napkin, NotebookLM & more.</span></div>
                                </div>
                                <div className="cp-highlight-item">
                                    <i className="fa-solid fa-upload"></i>
                                    <div><strong>Assignments & Projects</strong><span>Build real works, upload screenshots and get feedback.</span></div>
                                </div>
                                <div className="cp-highlight-item">
                                    <i className="fa-solid fa-graduation-cap"></i>
                                    <div><strong>Digital Certificate</strong><span>Qualify for a certified resume credential at &gt;60% score.</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'lecture': {
                return (
                    <div className="cp-card">
                        <div className="cp-video-container" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                            {isHtml5 ? (
                                <div className="custom-video-wrapper" style={{ position: 'relative', width: '100%', height: '100%' }}>
                                    {isVideoBuffering && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 0, left: 0, right: 0, bottom: 0,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: '#000',
                                            zIndex: 20
                                        }}>
                                            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2.5rem', color: 'rgba(255,255,255,0.85)', marginBottom: '12px' }}></i>
                                            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Loading video...</span>
                                        </div>
                                    )}
                                    <video
                                        ref={videoRef}
                                        src={videoSrc}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#000' }}
                                        onTimeUpdate={handleTimeUpdate}
                                        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                                        onClick={togglePlay}
                                        onEnded={handleVideoEnded}
                                        onWaiting={() => {
                                            // Only show loader after 1.5s of buffering to avoid flash
                                            bufferTimerRef.current = setTimeout(() => setIsVideoBuffering(true), 1500);
                                        }}
                                        onCanPlay={() => {
                                            clearTimeout(bufferTimerRef.current);
                                            setIsVideoBuffering(false);
                                        }}
                                        onPlaying={() => {
                                            clearTimeout(bufferTimerRef.current);
                                            setIsVideoBuffering(false);
                                        }}
                                        autoPlay={isPlayingIntro}
                                        loop={isPlayingIntro}
                                        muted={isPlayingIntro || isMuted}
                                        playsInline
                                    ></video>

                                    {isPlayingIntro && (
                                        <button
                                            onClick={() => handleVideoEnded()}
                                            style={{
                                                position: 'absolute',
                                                top: '20px',
                                                right: '20px',
                                                background: 'rgba(15, 23, 42, 0.8)',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                color: '#ffffff',
                                                padding: '8px 16px',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                zIndex: 100,
                                                backdropFilter: 'blur(4px)',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.95)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)'}
                                        >
                                            <span>Skip Intro</span>
                                            <i className="fa-solid fa-forward"></i>
                                        </button>
                                    )}

                                    {!isPlaying && (
                                        <div className="cp-video-overlay-play" onClick={togglePlay}>
                                            <i className="fa-solid fa-play"></i>
                                        </div>
                                    )}

                                    <div className="cp-video-controls" style={isPlayingIntro ? { display: 'none' } : {}}>
                                        <input
                                            type="range" min="0" max="100"
                                            value={duration ? (currentTime / duration) * 100 : 0}
                                            onChange={handleSeek}
                                            className="video-progress-slider"
                                            style={{ '--progress-percent': `${duration ? (currentTime / duration) * 100 : 0}%` }}
                                        />
                                        <div className="cp-controls-row">
                                            <div className="cp-controls-left">
                                                <button onClick={togglePlay} className="cp-ctrl-btn">
                                                    <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                                                </button>
                                                <button onClick={toggleMute} className="cp-ctrl-btn">
                                                    <i className={`fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
                                                </button>
                                                <span className="cp-ctrl-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
                                            </div>
                                            <div className="cp-controls-right">
                                                <div style={{ position: 'relative' }}>
                                                    <button
                                                        onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                                                        className="cp-ctrl-btn"
                                                        style={{ fontWeight: 800, fontSize: '0.8rem', minWidth: '36px' }}
                                                    >
                                                        {playbackSpeed}x
                                                    </button>
                                                    {showSpeedMenu && (
                                                        <div className="cp-speed-menu">
                                                            {[0.5, 1, 1.25, 1.5, 2].map(speed => (
                                                                <button
                                                                    key={speed}
                                                                    onClick={() => { setPlaybackSpeed(speed); setShowSpeedMenu(false); }}
                                                                    className={`cp-speed-item ${playbackSpeed === speed ? 'active' : ''}`}
                                                                >{speed}x</button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <button onClick={() => {
                                                    const el = videoRef.current?.parentElement;
                                                    if (el) {
                                                        if (document.fullscreenElement) document.exitFullscreen();
                                                        else el.requestFullscreen().catch(() => { });
                                                    }
                                                }} className="cp-ctrl-btn" title="Fullscreen">
                                                    <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <iframe
                                    src={videoSrc}
                                    title={step.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                                ></iframe>
                            )}
                        </div>
                        {videoError && <div className="cp-video-error">{videoError}</div>}

                        <div className="cp-details-wrapper">
                            <div className="cp-lesson-details-row">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{step.title}</h2>
                                    <div className="cp-lesson-actions" style={{ display: 'flex', gap: '4px', marginLeft: '-8px' }}>
                                        <button className="cp-action-icon" title="Like"><i className="fa-regular fa-thumbs-up"></i></button>
                                        <button className="cp-action-icon" title="Dislike"><i className="fa-regular fa-thumbs-down"></i></button>
                                        <button className="cp-action-icon" title="Flag"><i className="fa-regular fa-flag"></i></button>
                                    </div>
                                </div>

                                {/* Next button rendered directly in the card body on the right side */}
                                {hasNext && (
                                    <div style={{ flexShrink: 0 }}>
                                        {!isCurrentStepCompleted ? (
                                            <button
                                                className="split-continue-btn"
                                                onClick={() => handleCompleteStep(15, 20)}
                                                disabled={isLocked}
                                            >
                                                <i className="fa-solid fa-circle-check"></i> Complete & Continue
                                            </button>
                                        ) : (
                                            <button
                                                className="split-continue-btn"
                                                onClick={() => navigate(`/learn/${idx}/lesson/${currentStepIndex + 2}`)}
                                                disabled={isLocked}
                                            >
                                                Go to next item <i className="fa-solid fa-arrow-right"></i>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            {course.title === "White Collar Executive AI" && step.toolName === "ChatGPT" && (
                                <div className="cp-resource-box">
                                    <div className="cp-resource-info">
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            background: '#e0f2fe',
                                            color: '#0284c7',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.25rem',
                                            flexShrink: 0
                                        }}>
                                            <i className="fa-solid fa-file-pdf"></i>
                                        </div>
                                        <div>
                                            <h4 style={{ margin: '0 0 2px 0', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                                                ChatGPT Guide for White Collar Professionals
                                            </h4>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                                                Download the accompanying guide resource for this lesson.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="cp-resource-actions">
                                        <button
                                            onClick={() => {
                                                if (isCapacitorApp) {
                                                    window.open('https://gyanschool.com/ChatGPT_Guide_for_White_Collar_Professionals.pdf', '_system');
                                                } else {
                                                    setShowPdfModal(true);
                                                }
                                            }}
                                            className="split-continue-btn"
                                            style={{
                                                textDecoration: 'none',
                                                padding: '10px 20px',
                                                fontSize: '0.85rem',
                                                background: 'var(--primary-color)',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow: 'none',
                                                whiteSpace: 'nowrap',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                display: 'inline-flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <i className="fa-solid fa-download" style={{ marginRight: '8px' }}></i> Download Guide (PDF)
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            }

            case 'tool_assignment':
                return (
                    <div className="cp-card">
                        <div className="cp-badge"><i className="fa-solid fa-pen-clip"></i> PRACTICAL ASSIGNMENT</div>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#111827', margin: '0 0 1rem' }}>{currentStep.title}</h3>
                        <div className="cp-assign-box">
                            <i className="fa-solid fa-pen-clip"></i>
                            <p style={{ margin: 0, fontWeight: '500' }}>{currentStep.questionText}</p>
                        </div>

                        {assignmentSubmitted ? (
                            <div className="cp-submission-banner">
                                <i className="fa-solid fa-circle-check fa-bounce"></i>
                                <div>
                                    <h4 style={{ margin: '0 0 4px', color: '#065f46' }}>Assignment Submitted Successfully!</h4>
                                    <p style={{ margin: 0, color: '#4b5563', fontSize: '0.85rem' }}>Your work has been saved locally. Preparing your rewards...</p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="cp-uploader-zone">
                                    {assignmentImage ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                            <img src={assignmentImage} alt="Assignment Proof" style={{ maxWidth: '100%', maxHeight: '240px', borderRadius: '10px', border: '1px solid #e5e7eb' }} />
                                            <button onClick={() => setAssignmentImage(null)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                                                <i className="fa-solid fa-trash-can"></i> Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '2rem', color: '#6b7280' }}></i>
                                            <strong style={{ color: '#374151' }}>Click to upload screenshot</strong>
                                            <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>PNG, JPG, GIF (Max 2MB)</span>
                                            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                        </label>
                                    )}
                                </div>
                                <button
                                    onClick={submitAssignment}
                                    className="split-continue-btn"
                                    disabled={!assignmentImage}
                                    style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center' }}
                                >
                                    Submit Work <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        )}
                    </div>
                );

            case 'master_assignment':
                return (
                    <div className="cp-card">
                        <div className="cp-badge" style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', color: '#b45309', border: '1px solid #fcd34d', fontWeight: '800' }}>
                            <i className="fa-solid fa-trophy"></i> MASTER CAPSTONE PROJECT
                        </div>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: '0 0 1.25rem', fontFamily: 'var(--font-heading)' }}>
                            {currentStep.title}
                        </h3>

                        {/* Premium Golden Spec Box */}
                        <div style={{
                            display: 'flex',
                            gap: '16px',
                            alignItems: 'flex-start',
                            background: '#fffbeb',
                            border: '3px double #d4af37',
                            borderRadius: '8px',
                            padding: '1.5rem',
                            margin: '1.25rem 0 2rem',
                            color: '#78350f',
                            fontSize: '1rem',
                            lineHeight: '1.7',
                            boxShadow: 'inset 0 0 12px rgba(212,175,55,0.05)'
                        }}>
                            <i className="fa-solid fa-scroll" style={{ color: '#d4af37', fontSize: '1.5rem', flexShrink: 0, marginTop: '2px' }}></i>
                            <div>
                                <strong style={{ display: 'block', fontSize: '1.05rem', marginBottom: '6px', color: '#451a03' }}>Project Deliverable Requirements:</strong>
                                <p style={{ margin: 0, fontWeight: '500' }}>{currentStep.questionText}</p>
                            </div>
                        </div>

                        {/* Requirements checklist for capstone */}
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
                            <h4 style={{ margin: '0 0 10px', fontSize: '0.9rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
                                Graduation Checklist
                            </h4>
                            <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <li>Ensure your screenshot clearly shows the final integrated workflow.</li>
                                <li>All tool integrations described in the lectures should be clearly visible.</li>
                                <li>Submitting this project unlocks your final course exam step.</li>
                            </ul>
                        </div>

                        {assignmentSubmitted ? (
                            <div className="cp-submission-banner" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1.5rem', borderRadius: '8px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <i className="fa-solid fa-graduation-cap fa-bounce" style={{ fontSize: '2.2rem', color: '#10b981' }}></i>
                                <div>
                                    <h4 style={{ margin: '0 0 4px', color: '#065f46', fontSize: '1.1rem', fontWeight: '700' }}>Capstone Project Submitted!</h4>
                                    <p style={{ margin: 0, color: '#374151', fontSize: '0.9rem' }}>Excellent work. Your graduation project is saved. Proceed to the Final Exam.</p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {/* Premium gold-tinted upload zone */}
                                <div className="cp-uploader-zone" style={{ border: '2px dashed #d4af37', background: '#faf9f5' }}>
                                    {assignmentImage ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                            <img src={assignmentImage} alt="Capstone Proof" style={{ maxWidth: '100%', maxHeight: '280px', borderRadius: '8px', border: '2px solid #d4af37', boxShadow: '0 4px 12px rgba(212,175,55,0.1)' }} />
                                            <button onClick={() => setAssignmentImage(null)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                                                <i className="fa-solid fa-trash-can"></i> Remove Screenshot
                                            </button>
                                        </div>
                                    ) : (
                                        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                            <i className="fa-solid fa-award" style={{ fontSize: '2.5rem', color: '#d4af37' }}></i>
                                            <strong style={{ color: '#451a03', fontSize: '1.05rem' }}>Upload Capstone Demonstration Proof</strong>
                                            <span style={{ color: '#78350f', opacity: 0.7, fontSize: '0.82rem' }}>PNG, JPG, GIF (Max 5MB)</span>
                                            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                        </label>
                                    )}
                                </div>
                                <button
                                    onClick={submitAssignment}
                                    className="split-continue-btn"
                                    disabled={!assignmentImage}
                                    style={{
                                        marginTop: '1.5rem',
                                        width: '100%',
                                        justifyContent: 'center',
                                        background: assignmentImage ? 'linear-gradient(135deg, #1e1b4b, #110c22)' : '#e2e8f0',
                                        boxShadow: assignmentImage ? '0 4px 12px rgba(17, 12, 34, 0.15)' : 'none'
                                    }}
                                >
                                    Submit &amp; Unlock Final Exam <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        )}
                    </div>
                );

            case 'tool_test': {
                const questions = currentStep.questions || [];
                const currentQuestion = questions[currentQuestionIndex];

                if (quizFinished) {
                    const finalScorePercent = Math.round((quizScore / questions.length) * 100);
                    const isPassing = finalScorePercent >= 60;
                    return (
                        <div className="cp-card">
                            <div className="cp-badge"><i className="fa-solid fa-trophy"></i> QUIZ COMPLETED</div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#111827', margin: '0 0 1.5rem' }}>Exam Results</h3>

                            <div className="cp-score-badge" style={{ backgroundColor: isPassing ? '#059669' : '#ef4444' }}>
                                <span className="cp-score-pct">{finalScorePercent}%</span>
                                <span className="cp-score-lbl">{isPassing ? 'PASSED' : 'FAILED'}</span>
                            </div>

                            <p style={{ color: '#4b5563', lineHeight: 1.6, marginBottom: '2rem' }}>
                                {isPassing
                                    ? `Congratulations! You scored ${quizScore} out of ${questions.length} correct. You have cleared the requirements for this module.`
                                    : `You scored ${quizScore} out of ${questions.length}. You need at least 60% to pass. You can retake anytime.`
                                }
                            </p>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => { setCurrentQuestionIndex(0); setQuizScore(0); setQuizFinished(false); setSelectedOption(null); setQuizAnswerChecked(false); }}
                                    className="cp-btn-secondary"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                >
                                    <i className="fa-solid fa-arrow-rotate-right"></i> Retake
                                </button>
                                {isPassing ? (
                                    <button onClick={() => handleCompleteStep(40, 50)} className="split-continue-btn" style={{ flex: 1, justifyContent: 'center' }}>
                                        Continue <i className="fa-solid fa-arrow-right"></i>
                                    </button>
                                ) : (
                                    <button onClick={() => handleCompleteStep(10, 10)} className="split-continue-btn" style={{ flex: 1, justifyContent: 'center' }}>
                                        Skip for now <i className="fa-solid fa-chevron-right"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                }

                if (!currentQuestion) {
                    return (
                        <div className="cp-card">
                            <h3 style={{ color: '#111827' }}>No Questions Found</h3>
                            <button onClick={() => handleCompleteStep(10, 10)} className="split-continue-btn">Continue</button>
                        </div>
                    );
                }

                return (
                    <div className="cp-card">
                        <div className="cp-quiz-pbar">
                            <div className="cp-quiz-pbar-fill" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#6b7280', fontWeight: 600, marginBottom: '1rem' }}>
                            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                            <span>Score: {quizScore}</span>
                        </div>

                        <h3 style={{ fontSize: '2rem', fontWeight: 400, color: '#111827', marginBottom: '1.5rem', lineHeight: 1.5 }}>{currentQuestion.question}</h3>

                        <div>
                            {currentQuestion.options.map((opt, oIdx) => {
                                let cls = '';
                                if (selectedOption === oIdx) cls = 'selected';
                                if (quizAnswerChecked) {
                                    if (oIdx === currentQuestion.answer) cls = 'correct';
                                    else if (selectedOption === oIdx) cls = 'incorrect';
                                    else cls = 'disabled';
                                }
                                return (
                                    <button
                                        key={oIdx}
                                        onClick={() => handleOptionSelect(oIdx)}
                                        className={`cp-quiz-option ${cls}`}
                                        disabled={quizAnswerChecked}
                                    >
                                        <span className="cp-option-letter">{String.fromCharCode(65 + oIdx)}</span>
                                        <span style={{ flex: 1 }}>{opt}</span>
                                        {quizAnswerChecked && oIdx === currentQuestion.answer && <i className="fa-solid fa-circle-check" style={{ color: '#059669' }}></i>}
                                        {quizAnswerChecked && selectedOption === oIdx && oIdx !== currentQuestion.answer && <i className="fa-solid fa-circle-xmark" style={{ color: '#ef4444' }}></i>}
                                    </button>
                                );
                            })}
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            {!quizAnswerChecked ? (
                                <button onClick={checkQuizAnswer} className="split-continue-btn" disabled={selectedOption === null} style={{ width: '100%', justifyContent: 'center' }}>
                                    Check Answer
                                </button>
                            ) : (
                                <button onClick={nextQuizQuestion} className="split-continue-btn" style={{ width: '100%', justifyContent: 'center' }}>
                                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'} <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            )}
                        </div>
                    </div>
                );
            }

            case 'master_test': {
                const questions = currentStep.questions || [];
                const currentQuestion = questions[currentQuestionIndex];

                if (quizFinished) {
                    const finalScorePercent = Math.round((quizScore / questions.length) * 100);
                    const isPassing = finalScorePercent >= 60;
                    return (
                        <div className="cp-card">
                            <div className="cp-badge" style={{ background: 'linear-gradient(135deg, #1e1b4b, #110c22)', color: '#fff', border: '1px solid #1e1b4b', fontWeight: '800' }}>
                                <i className="fa-solid fa-graduation-cap"></i> EXAM COMPLETED
                            </div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: '0 0 1.5rem', fontFamily: 'var(--font-heading)' }}>
                                Graduation Examination Results
                            </h3>

                            <div className="cp-score-badge" style={{
                                width: '130px',
                                height: '130px',
                                borderRadius: '50%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 2rem',
                                color: '#fff',
                                fontWeight: 800,
                                backgroundColor: isPassing ? '#059669' : '#ef4444',
                                boxShadow: isPassing ? '0 4px 14px rgba(5,150,105,0.3)' : '0 4px 14px rgba(239,68,68,0.3)'
                            }}>
                                <span className="cp-score-pct" style={{ fontSize: '2.2rem' }}>{finalScorePercent}%</span>
                                <span className="cp-score-lbl" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>{isPassing ? 'PASSED' : 'FAILED'}</span>
                            </div>

                            <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.98rem', marginBottom: '2rem', textAlign: 'center' }}>
                                {isPassing
                                    ? `Congratulations! You scored ${quizScore} out of ${questions.length} correct. You have successfully cleared the final examination and qualified for graduation.`
                                    : `You scored ${quizScore} out of ${questions.length}. You need at least 60% to clear this final examination and qualify for your course certificate. Retake whenever you are ready.`
                                }
                            </p>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => { setCurrentQuestionIndex(0); setQuizScore(0); setQuizFinished(false); setSelectedOption(null); setQuizAnswerChecked(false); }}
                                    className="cp-btn-secondary"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                >
                                    <i className="fa-solid fa-arrow-rotate-right"></i> Retake Exam
                                </button>
                                {isPassing && (
                                    <button
                                        onClick={() => handleCompleteStep(50, 100)}
                                        className="split-continue-btn"
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            background: 'linear-gradient(135deg, #d4af37, #b45309)',
                                            color: '#fff',
                                            boxShadow: '0 4px 12px rgba(212,175,55,0.2)'
                                        }}
                                    >
                                        Proceed to Graduation <i className="fa-solid fa-graduation-cap"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                }

                if (!currentQuestion) {
                    return (
                        <div className="cp-card">
                            <h3 style={{ color: '#111827' }}>No Questions Found</h3>
                            <button onClick={() => handleCompleteStep(10, 10)} className="split-continue-btn">Continue</button>
                        </div>
                    );
                }

                return (
                    <div className="cp-card">
                        <div className="cp-badge" style={{ background: 'linear-gradient(135deg, #1e1b4b, #110c22)', color: '#fff', border: '1px solid #1e1b4b', fontWeight: '800' }}>
                            <i className="fa-solid fa-pen-nib"></i> FINAL GRADUATION EXAM
                        </div>

                        {/* Exam Status Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: '#f8fafc', padding: '12px 18px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '700' }}>QUESTION {currentQuestionIndex + 1} OF {questions.length}</span>
                            <span style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: '700' }}><i className="fa-solid fa-clock-rotate-left"></i> CLOSED EXAM BOOK</span>
                        </div>

                        <div className="cp-quiz-pbar" style={{ height: '6px', borderRadius: '3px', background: '#e2e8f0', overflow: 'hidden', marginBottom: '2rem' }}>
                            <div className="cp-quiz-pbar-fill" style={{ height: '100%', background: '#110c22', width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                        </div>

                        {/* Exam passing criteria info box */}
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'center',
                            background: '#fefbeb',
                            border: '1px solid #fde68a',
                            borderRadius: '6px',
                            padding: '10px 14px',
                            marginBottom: '2rem',
                            color: '#b45309',
                            fontSize: '0.85rem',
                            fontWeight: '500'
                        }}>
                            <i className="fa-solid fa-circle-info"></i>
                            <span>You need a passing score of at least <strong>60%</strong> to clear this exam and qualify for the course certificate.</span>
                        </div>

                        <h3 style={{ fontSize: '2rem', fontWeight: 400, color: '#0f172a', marginBottom: '2rem', lineHeight: 1.5 }}>
                            {currentQuestion.question}
                        </h3>

                        <div style={{ marginBottom: '2rem' }}>
                            {currentQuestion.options.map((opt, oIdx) => {
                                let cls = '';
                                if (selectedOption === oIdx) cls = 'selected';
                                if (quizAnswerChecked) {
                                    if (oIdx === currentQuestion.answer) cls = 'correct';
                                    else if (selectedOption === oIdx) cls = 'incorrect';
                                    else cls = 'disabled';
                                }
                                return (
                                    <button
                                        key={oIdx}
                                        onClick={() => handleOptionSelect(oIdx)}
                                        className={`cp-quiz-option ${cls}`}
                                        disabled={quizAnswerChecked}
                                    >
                                        <span className="cp-option-letter">{String.fromCharCode(65 + oIdx)}</span>
                                        <span style={{ flex: 1 }}>{opt}</span>
                                        {quizAnswerChecked && oIdx === currentQuestion.answer && <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }}></i>}
                                        {quizAnswerChecked && selectedOption === oIdx && oIdx !== currentQuestion.answer && <i className="fa-solid fa-circle-xmark" style={{ color: '#f43f5e' }}></i>}
                                    </button>
                                );
                            })}
                        </div>

                        <div>
                            {!quizAnswerChecked ? (
                                <button onClick={checkQuizAnswer} className="split-continue-btn" disabled={selectedOption === null} style={{ width: '100%', justifyContent: 'center' }}>
                                    Check Answer
                                </button>
                            ) : (
                                <button onClick={nextQuizQuestion} className="split-continue-btn" style={{ width: '100%', justifyContent: 'center' }}>
                                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Examination'} <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            )}
                        </div>
                    </div>
                );
            }

            case 'certificate': {
                const masterScore = localStorage.getItem(`gs_score_${idx}_step_${totalSteps - 2}_${user?.id || 'guest'}`);
                const passedMaster = masterScore ? parseInt(masterScore, 10) >= 60 : false;
                const studentName = localStorage.getItem('gs_display_name') || user?.name || user?.email || 'GyanSchool Graduate';

                if (!passedMaster) {
                    return (
                        <div className="cp-card">
                            <div className="cp-badge"><i className="fa-solid fa-lock"></i> CERTIFICATE LOCKED</div>
                            <i className="fa-solid fa-lock" style={{ fontSize: '2.5rem', color: '#9ca3af', margin: '1rem 0', display: 'block' }}></i>
                            <h3 style={{ fontSize: '1.3rem', color: '#111827', fontWeight: 700 }}>Certificate of Completion</h3>
                            <p style={{ color: '#4b5563', lineHeight: 1.6 }}>You must pass the Master Course Exam with a score above 60% to unlock your official GyanSchool Certificate.</p>
                            <button
                                onClick={() => navigate(`/learn/${idx}/lesson/${totalSteps - 1}`)}
                                className="cp-btn-primary"
                                style={{ marginTop: '1.5rem' }}
                            >
                                Take Master Exam <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    );
                }

                return (
                    <div className="cp-card">
                        <div className="cp-cert-wrapper">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: 800, color: '#0056d2', marginBottom: '2rem' }}>
                                <i className="fa-solid fa-graduation-cap"></i>
                                <span>GyanSchool</span>
                            </div>
                            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#0056d2', marginBottom: '0.5rem' }}>Certificate of Completion</h1>
                            <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: '#64748b', marginBottom: '2rem' }}>THIS CREDENTIAL IS PROUDLY PRESENTED TO</p>

                            <h2 style={{ fontFamily: 'Times New Roman, serif', fontSize: '2.2rem', fontStyle: 'italic', color: '#1e293b', marginBottom: '1.5rem' }}>{studentName}</h2>
                            <div style={{ width: '60%', height: '2px', background: 'linear-gradient(to right, transparent, #d4af37, transparent)', margin: '0 auto 1.5rem' }}></div>

                            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, maxWidth: '80%', margin: '0 auto 1rem' }}>
                                for successfully mastering advanced AI tools and professional productivity pipelines in the course:
                            </p>
                            <h3 style={{ fontSize: '1.4rem', color: '#0056d2', fontWeight: 800, marginBottom: '2.5rem' }}>"{course.title}"</h3>

                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', fontSize: '0.8rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ color: '#94a3b8', fontWeight: 700 }}>DATE</span>
                                    <strong style={{ color: '#1e293b' }}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ color: '#94a3b8', fontWeight: 700 }}>INSTRUCTOR</span>
                                    <strong style={{ color: '#1e293b' }}>Kamlesh Rohra, GyanSchool</strong>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ color: '#94a3b8', fontWeight: 700 }}>CREDENTIAL ID</span>
                                    <strong style={{ color: '#1e293b' }}>GS-{idx}-{Math.floor(100000 + Math.random() * 900000)}</strong>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => window.print()} className="split-continue-btn" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>
                            <i className="fa-solid fa-print"></i> Print or Download PDF
                        </button>
                    </div>
                );
            }

            default:
                return null;
        }
    };


    return (
        <div className="cp-page">
            <style>{`
                /* ──── Coursera-style Player ──── */
                .cp-page {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    background: #f8f9fa; /* Light grey main background like Coursera */
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    overflow: hidden;
                }

                /* Top Bar */
                .cp-topbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 60px;
                    border-bottom: 1px solid #e2e8f0;
                    padding: 0 24px;
                    background: #fff;
                    z-index: 100;
                    flex-shrink: 0;
                    gap: 16px;
                }
                .cp-back-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 0.88rem;
                    color: #1f2937;
                    font-weight: 500;
                    padding: 8px 12px;
                    border-radius: 4px;
                    transition: background 0.15s;
                    white-space: nowrap;
                }
                .cp-back-btn:hover { background: #f1f5f9; }
                .cp-back-btn i { font-size: 0.85rem; color: #475569; }

                .cp-topbar-progress {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex: 1;
                    max-width: 400px;
                    margin: 0 auto;
                }
                .cp-progress-label {
                    font-size: 0.82rem;
                    color: #475569;
                    white-space: nowrap;
                    font-weight: 600;
                }
                .cp-progress-track {
                    flex: 1;
                    height: 8px;
                    background: #e2e8f0;
                    border-radius: 99px;
                    overflow: hidden;
                }
                .cp-progress-fill {
                    height: 100%;
                    background: #0056d2;
                    border-radius: 99px;
                    transition: width 0.4s ease;
                }

                .cp-topbar-right {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .cp-stat-pill {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 99px;
                    padding: 5px 12px;
                    font-size: 0.82rem;
                    font-weight: 600;
                    color: #334155;
                }

                /* Body: 3-column grid */
                .cp-body {
                    display: flex;
                    flex: 1;
                    overflow: hidden;
                }

                /* ── Left Sidebar ── */
                .cp-sidebar {
                    width: 320px; /* Slightly wider sidebar like Coursera */
                    flex-shrink: 0;
                    border-right: 1px solid #e2e8f0;
                    background: #fff;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                .cp-sidebar-header {
                    padding: 24px 20px 16px;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-shrink: 0;
                }
                .cp-sidebar-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #1e293b;
                    line-height: 1.3;
                    flex: 1;
                    margin-right: 8px;
                }
                .cp-sidebar-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #94a3b8;
                    font-size: 1rem;
                    padding: 4px;
                    transition: color 0.15s;
                }
                .cp-sidebar-close:hover { color: #1e293b; }

                .cp-sidebar-scroll {
                    flex: 1;
                    overflow-y: auto;
                }
                .cp-sidebar-scroll::-webkit-scrollbar { width: 6px; }
                .cp-sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
                .cp-sidebar-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }

                /* Module group */
                .cp-module-group { border-bottom: 1px solid #f1f5f9; }
                .cp-module-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    padding: 20px;
                    cursor: pointer;
                    user-select: none;
                    transition: background 0.15s;
                }
                .cp-module-header:hover { background: #f8fafc; }
                .cp-module-header-left { display: flex; flex-direction: column; gap: 4px; }
                .cp-module-label {
                    font-size: 0.72rem;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .cp-module-name {
                    font-size: 0.92rem;
                    font-weight: 700;
                    color: #1e293b;
                    line-height: 1.4;
                }
                .cp-module-chevron {
                    font-size: 0.8rem;
                    color: #64748b;
                    transition: transform 0.2s;
                    flex-shrink: 0;
                    margin-top: 4px;
                }
                .cp-module-chevron.open { transform: rotate(180deg); }

                .cp-module-lessons {
                    padding: 0 0 12px 0;
                }

                /* Lesson items */
                .cp-lesson-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 12px 24px;
                    transition: background 0.15s;
                    border-left: 4px solid transparent;
                }
                .cp-lesson-item:hover { background: #f8fafc; }
                .cp-lesson-item.cp-active {
                    background: #f1f5f9;
                    border-left-color: #0056d2;
                }
                .cp-lesson-item.cp-locked { opacity: 0.5; }
                .cp-lesson-check {
                    margin-top: 3px;
                    width: 20px;
                    display: flex;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .cp-lesson-dot {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    border: 2px solid #cbd5e1;
                    background: #fff;
                }
                .cp-lesson-dot.cp-dot-active {
                    border-color: #0056d2;
                    background: #0056d2;
                }
                .cp-lesson-meta { display: flex; flex-direction: column; gap: 3px; }
                .cp-lesson-title {
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: #334155;
                    line-height: 1.4;
                }
                .cp-lesson-item.cp-active .cp-lesson-title {
                    color: #0056d2;
                    font-weight: 700;
                }
                .cp-lesson-sub {
                    font-size: 0.75rem;
                    color: #64748b;
                }

                /* ── Center Pane ── */
                .cp-center {
                    flex: 1;
                    overflow-y: auto;
                    background: #fff;
                    display: flex;
                    flex-direction: column;
                }
                .cp-center::-webkit-scrollbar { width: 6px; }
                .cp-center::-webkit-scrollbar-track { background: transparent; }
                .cp-center::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }

                .cp-content-area {
                    flex: 1;
                }

                .cp-center-footer {
                    padding: 24px 48px;
                    margin-top: auto;
                    background: #fff;
                    max-width: 960px;
                    width: 100%;
                    margin: 0 auto;
                }
                .cp-lesson-title-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                }
                .cp-lesson-heading {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0;
                    line-height: 1.3;
                }
                .cp-lesson-actions {
                    display: flex;
                    gap: 8px;
                    flex-shrink: 0;
                }
                .cp-action-icon {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #64748b;
                    font-size: 1.05rem;
                    padding: 8px;
                    border-radius: 50%;
                    transition: color 0.15s, background 0.15s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .cp-action-icon:hover { color: #1e293b; background: #f1f5f9; }

                /* ── Content Types ── */
                /* Lecture: raw 16:9 video, no card wrapper */
                .cp-video-container {
                    position: relative;
                    aspect-ratio: 16/9;
                    background: #000;
                    width: 100%;
                    max-width: 960px;
                    margin: 0 auto;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .cp-video-container iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                    display: block;
                }
                .cp-video-container video {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    display: block;
                }
                .cp-video-overlay-play {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    background: rgba(0,86,210,0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-size: 1.5rem;
                    cursor: pointer;
                    transition: transform 0.2s, background 0.2s;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                    padding-left: 4px;
                }
                .cp-video-overlay-play:hover { background: rgba(0,86,210,1); transform: translate(-50%, -50%) scale(1.08); }

                /* Video controls */
                .cp-video-controls {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(transparent, rgba(0,0,0,0.7));
                    padding: 24px 16px 12px;
                }
                .cp-video-controls .video-progress-slider {
                    width: 100%;
                    margin-bottom: 8px;
                }
                .cp-controls-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 8px;
                }
                .cp-controls-left, .cp-controls-right {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .cp-ctrl-btn {
                    background: none;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    font-size: 1.5rem;
                    padding: 6px 10px;
                    border-radius: 4px;
                    transition: background 0.15s;
                    line-height: 1;
                }
                .cp-ctrl-btn:hover { background: rgba(255,255,255,0.15); }
                .cp-ctrl-time {
                    color: #e5e7eb;
                    font-size: 0.8rem;
                    font-weight: 600;
                    user-select: none;
                }

                /* Intro / Tool intro / Assignment / Quiz cards — light */
                .cp-card {
                    background: #fff;
                    padding: 36px;
                    max-width: 960px;
                    margin: 24px auto;
                    width: 100%;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                .cp-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: #eff6ff;
                    color: #0056d2;
                    font-size: 0.72rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    padding: 4px 10px;
                    border-radius: 4px;
                    margin-bottom: 1.25rem;
                }

                /* Light player action buttons */
                .cp-btn-primary {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #0056d2;
                    color: #fff;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 4px;
                    font-size: 0.92rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.15s;
                }
                .cp-btn-primary:hover { background: #00419e; }

                .cp-btn-secondary {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #f1f5f9;
                    color: #334155;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 4px;
                    font-size: 0.92rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.15s;
                }
                .cp-btn-secondary:hover { background: #e2e8f0; }

                /* Resource Boxes */
                .cp-resource-box {
                    margin-top: 24px;
                    padding: 16px 20px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                }
                .cp-resource-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .cp-resource-actions {
                    display: flex;
                    gap: 8px;
                    flex-shrink: 0;
                }

                /* highlight items / intro cards */
                .cp-highlight-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin: 1.5rem 0 2.5rem;
                }
                .cp-highlight-item {
                    display: flex;
                    gap: 16px;
                    align-items: flex-start;
                    padding: 16px 20px;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    background: #f8fafc;
                }
                .cp-highlight-item i {
                    color: #0056d2;
                    font-size: 1.2rem;
                    margin-top: 2px;
                    flex-shrink: 0;
                }
                .cp-highlight-item strong { display: block; color: #1e293b; font-size: 0.95rem; margin-bottom: 3px; }
                .cp-highlight-item span { color: #64748b; font-size: 0.88rem; }

                /* TTS card */
                .cp-tts-card {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    padding: 1.5rem;
                    margin-top: 1.5rem;
                }
                .cp-tts-controls { display: flex; gap: 10px; margin-bottom: 1rem; }

                /* Assignment */
                .cp-assign-box {
                    display: flex;
                    gap: 16px;
                    align-items: flex-start;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 1.25rem 1.5rem;
                    margin: 1.25rem 0 2rem;
                    color: #334155;
                    font-size: 0.95rem;
                    line-height: 1.6;
                }
                .cp-assign-box i { color: #64748b; font-size: 1.25rem; flex-shrink: 0; margin-top: 2px; }
 
                .cp-uploader-zone {
                    border: 1px dashed #cbd5e1;
                    border-radius: 8px;
                    padding: 3.5rem 2rem;
                    text-align: center;
                    transition: all 0.2s ease;
                    cursor: pointer;
                    background: #f8fafc;
                }
                .cp-uploader-zone:hover {
                    border-color: #110c22;
                    background: #f1f5f9;
                }

                /* Quiz */
                .cp-quiz-option {
                    display: flex;
                    align-items: center;
                    padding: 16px 20px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    background: #fff;
                    color: #334155;
                    cursor: pointer;
                    text-align: left;
                    font-size: 0.92rem;
                    line-height: 1.5;
                    transition: all 0.15s ease;
                    width: 100%;
                    gap: 16px;
                    margin-bottom: 20px;
                    font-family: inherit;
                }
                .cp-quiz-option:hover:not(:disabled) {
                    border-color: #110c22;
                    background: #f8fafc;
                    color: #110c22;
                }
                .cp-quiz-option.selected {
                    border-color: #110c22;
                    background: #f1f5f9;
                    color: #110c22;
                    font-weight: 600;
                    box-shadow: 0 0 0 1px #110c22;
                }
                .cp-quiz-option.correct {
                    border-color: #10b981;
                    background: #f0fdf4;
                    color: #065f46;
                    box-shadow: 0 0 0 1px #10b981;
                }
                .cp-quiz-option.incorrect {
                    border-color: #f43f5e;
                    background: #fff1f2;
                    color: #9f1239;
                    box-shadow: 0 0 0 1px #f43f5e;
                }
                .cp-quiz-option.disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                }
                .cp-option-letter {
                    width: 28px; height: 28px;
                    border-radius: 6px;
                    background: #f1f5f9;
                    color: #475569;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.82rem; font-weight: 700;
                    flex-shrink: 0;
                    transition: all 0.15s ease;
                }
                .cp-quiz-option:hover:not(:disabled) .cp-option-letter {
                    background: #e2e8f0;
                    color: #0f172a;
                }
                .cp-quiz-option.selected .cp-option-letter {
                    background: #110c22;
                    color: #fff;
                }
                .cp-quiz-option.correct .cp-option-letter {
                    background: #10b981;
                    color: #fff;
                }
                .cp-quiz-option.incorrect .cp-option-letter {
                    background: #f43f5e;
                    color: #fff;
                }

                /* Score badge */
                .cp-score-badge {
                    width: 120px; height: 120px;
                    border-radius: 50%;
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    margin: 0 auto 2rem;
                    color: #fff;
                    font-weight: 800;
                }
                .cp-score-pct { font-size: 2rem; }
                .cp-score-lbl { font-size: 0.7rem; letter-spacing: 0.05em; }

                /* Certificate */
                .cp-cert-wrapper {
                    border: 6px double #d4af37;
                    background: #faf9f5;
                    border-radius: 8px;
                    padding: 2.5rem;
                    text-align: center;
                    box-shadow: inset 0 0 40px rgba(212,175,55,0.1);
                }

                /* Print */
                @media print {
                    body * { visibility: hidden; }
                    .cp-cert-wrapper, .cp-cert-wrapper * { visibility: visible; }
                    .cp-cert-wrapper { position: absolute; left: 0; top: 0; width: 100%; }
                }

                /* Speed menu */
                .cp-speed-menu {
                    position: absolute;
                    bottom: 44px;
                    right: 0;
                    background: rgba(15,23,42,0.95);
                    border: 1px solid rgba(255,255,255,0.15);
                    border-radius: 8px;
                    padding: 4px;
                    min-width: 72px;
                    z-index: 99;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
                }
                .cp-speed-item {
                    background: none; border: none; color: #e2e8f0;
                    padding: 6px 12px; font-size: 0.82rem; font-weight: 700;
                    text-align: left; cursor: pointer; border-radius: 4px;
                    width: 100%; transition: background 0.1s;
                }
                .cp-speed-item:hover { background: rgba(255,255,255,0.1); }
                .cp-speed-item.active { background: #0056d2; color: #fff; }

                /* video slider overrides */
                .cp-video-controls .video-progress-slider {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 100%;
                    height: 4px;
                    border-radius: 99px;
                    background: linear-gradient(to right,
                        rgba(255,255,255,0.8) var(--progress-percent, 0%),
                        rgba(255,255,255,0.2) var(--progress-percent, 0%)
                    );
                    cursor: pointer;
                    margin-bottom: 8px;
                }
                .cp-video-controls .video-progress-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 12px; height: 12px;
                    border-radius: 50%;
                    background: #fff;
                    cursor: pointer;
                }

                /* TTS highlighted word */
                .tts-word { padding: 0 2px; border-radius: 4px; transition: background 0.1s; }
                .highlighted-word { background: #0056d2 !important; color: #fff; font-weight: 700; }

                /* Submission success */
                .cp-submission-banner {
                    display: flex; align-items: center; gap: 14px;
                    background: #ecfdf5; border: 1.5px solid #059669;
                    border-radius: 12px; padding: 1.25rem;
                }
                .cp-submission-banner i { font-size: 1.8rem; color: #059669; }

                /* Quiz progress */
                .cp-quiz-pbar {
                    background: #e5e7eb; height: 6px; border-radius: 99px; overflow: hidden; margin-bottom: 1.25rem;
                }
                .cp-quiz-pbar-fill {
                    background: #0056d2; height: 100%; transition: width 0.3s;
                }

                /* Error message */
                .cp-video-error {
                    background: #fef2f2; border: 1px solid #fecaca; color: #991b1b;
                    padding: 1rem; border-radius: 8px; font-size: 0.85rem;
                    text-align: center; margin: 1rem 0;
                }

                @media (max-width: 768px) {
                    .cp-sidebar { display: none; }
                    .cp-page {
                        background: #ffffff;
                        height: auto;
                        min-height: 100vh;
                        overflow-y: auto;
                    }
                    .cp-body {
                        height: auto;
                        overflow: visible;
                    }
                    .cp-center {
                        background: #ffffff;
                        overflow: visible;
                        height: auto;
                    }

                    /* Topbar mobile */
                    .cp-topbar {
                        padding: 0 16px;
                        height: 56px;
                        gap: 12px;
                        background: #ffffff;
                        border-bottom: 1px solid #f1f5f9;
                    }
                    .cp-back-btn {
                        padding: 8px 12px;
                        font-size: 0.85rem;
                    }
                    .cp-back-btn span {
                        display: none;
                    }
                    .cp-back-btn::after {
                        content: 'Back';
                    }
                    .cp-topbar-progress {
                        max-width: 180px;
                        gap: 8px;
                    }
                    .cp-progress-label {
                        font-size: 0.72rem;
                    }

                    .cp-card {
                        padding: 0 !important;
                        margin-top: 0 !important;
                        margin-bottom: 0 !important;
                        border: none !important;
                        background: transparent !important;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                    }
                    
                    /* Indent all course player cards contents except the video player on mobile */
                    .cp-card > .cp-badge,
                    .cp-card > h3,
                    .cp-card > div:not(.cp-video-container),
                    .cp-card > p {
                        padding-left: 20px !important;
                        padding-right: 20px !important;
                        box-sizing: border-box !important;
                    }
                    
                    /* Flush video player */
                    .cp-video-container {
                        margin-bottom: 0 !important;
                        border-radius: 0 !important;
                        width: 100vw !important;
                        aspect-ratio: 16/9;
                    }
                    .custom-video-wrapper button {
                        top: 12px !important;
                        right: 12px !important;
                        padding: 8px 14px !important;
                        font-size: 0.75rem !important;
                    }

                    /* Details wrapper padding */
                    .cp-details-wrapper {
                        padding: 24px 20px 40px !important; /* bottom padding for breathing space */
                    }

                    /* Split details column layout */
                    .cp-lesson-details-row {
                        flex-direction: column !important;
                        align-items: stretch !important;
                        gap: 16px !important;
                        margin-top: 0 !important;
                    }
                    .cp-lesson-details-row h2 {
                        font-size: 1.45rem !important;
                        font-weight: 700 !important;
                        color: #0f172a !important;
                        margin: 0 !important;
                        line-height: 1.3 !important;
                    }
                    .cp-lesson-actions {
                        margin-top: 4px !important;
                        margin-bottom: 4px !important;
                        gap: 10px !important;
                    }
                    .cp-action-icon {
                        width: 42px !important;
                        height: 42px !important;
                        border-radius: 99px !important;
                        background: #f1f5f9 !important;
                        color: #475569 !important;
                        display: inline-flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        font-size: 1.1rem !important;
                        border: none !important;
                        padding: 0 !important;
                    }
                    .cp-lesson-details-row .split-continue-btn {
                        width: 100%;
                        justify-content: center;
                        padding: 14px 24px !important;
                        font-size: 1rem !important;
                        margin-top: 4px !important;
                        border-radius: 8px !important;
                    }
                    
                    /* Resource box stack */
                    .cp-resource-box {
                        flex-direction: column !important;
                        align-items: stretch !important;
                        gap: 16px !important;
                        padding: 20px 16px !important;
                        border-radius: 12px !important;
                        border: 1px solid #e2e8f0 !important;
                        background: #f8fafc !important;
                        margin-top: 24px !important;
                    }
                    .cp-resource-info {
                        flex-direction: row !important;
                        align-items: center !important;
                        gap: 12px !important;
                    }
                    .cp-resource-actions {
                        flex-direction: column !important;
                        width: 100% !important;
                        gap: 10px !important;
                    }
                    .cp-resource-actions button,
                    .cp-resource-actions a {
                        width: 100% !important;
                        justify-content: center !important;
                        box-sizing: border-box !important;
                    }

                    /* Center Footer padding */
                    .cp-center-footer {
                        padding: 16px !important;
                        background: #f8f9fa;
                    }
                    .cp-center-footer .split-continue-btn {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>

            {/* ── Top Bar ── */}
            <div className="cp-topbar">
                <button className="cp-back-btn" onClick={() => navigate('/learn')}>
                    <i className="fa-solid fa-arrow-left"></i>
                    <span>Back to Dashboard</span>
                </button>

                <div className="cp-topbar-progress">
                    <span className="cp-progress-label">{completedCount} / {totalSteps} items</span>
                    <div className="cp-progress-track">
                        <div className="cp-progress-fill" style={{ width: `${Math.round((completedCount / totalSteps) * 100)}%` }}></div>
                    </div>
                </div>

                <div className="cp-topbar-right">
                    {/* Gems and streaks stats removed for minimal player design */}
                </div>
            </div>

            {/* ── Body ── */}
            <div className="cp-body">

                {/* ── Left Sidebar ── */}
                <div className="cp-sidebar">
                    <div className="cp-sidebar-header">
                        <span className="cp-sidebar-title">{course.title}</span>
                        <button className="cp-sidebar-close" onClick={() => navigate('/learn')}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <div className="cp-sidebar-scroll">
                        {/* Course Intro */}
                        <div className="cp-module-group">
                            {renderSidebarItem(steps[0], 0)}
                        </div>

                        {/* Modules & Lessons */}
                        {OFFICIAL_MODULES.map((mod, tIdx) => {
                            const toolSteps = steps.filter(s => s.toolIndex === tIdx);
                            const isOpen = openModules.has(tIdx);
                            const modCleanTitle = mod.title.includes(':') ? mod.title.split(':')[1].trim() : mod.title;
                            return (
                                <div key={tIdx} className="cp-module-group">
                                    <div className="cp-module-header" onClick={() => toggleModule(tIdx)}>
                                        <div className="cp-module-header-left">
                                            <span className="cp-module-label">Module {tIdx + 1}</span>
                                            <span className="cp-module-name">{modCleanTitle}</span>
                                        </div>
                                        <i className={`fa-solid fa-chevron-down cp-module-chevron ${isOpen ? 'open' : ''}`}></i>
                                    </div>
                                    {isOpen && (
                                        <div className="cp-module-lessons">
                                            {toolSteps.map((step) => {
                                                const globalIdx = steps.findIndex(s => s === step);
                                                return renderSidebarItem(step, globalIdx);
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Master Graduation */}
                        <div className="cp-module-group">
                            <div className="cp-module-header" onClick={() => toggleModule('master')}>
                                <div className="cp-module-header-left">
                                    <span className="cp-module-label">Final</span>
                                    <span className="cp-module-name">Master Graduation</span>
                                </div>
                                <i className={`fa-solid fa-chevron-down cp-module-chevron ${openModules.has('master') ? 'open' : ''}`}></i>
                            </div>
                            {openModules.has('master') && (
                                <div className="cp-module-lessons">
                                    {renderSidebarItem(steps[totalSteps - 3], totalSteps - 3)}
                                    {renderSidebarItem(steps[totalSteps - 2], totalSteps - 2)}
                                    {renderSidebarItem(steps[totalSteps - 1], totalSteps - 1)}
                                </div>
                            )}
                        </div>


                    </div>
                </div>

                {/* ── Center Pane ── */}
                <div className="cp-center">
                    <div className="cp-content-area">
                        {renderCenterContent()}
                    </div>
                    {!['lecture', 'tool_intro', 'tool_assignment', 'master_assignment', 'tool_test', 'master_test'].includes(currentStep.type) && renderCenterFooter()}
                </div>


            </div>
            {showPdfModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    padding: '20px'
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '1000px',
                        height: '85vh',
                        background: '#ffffff',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px 24px',
                            borderBottom: '1px solid #e2e8f0',
                            background: '#f8fafc'
                        }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
                                ChatGPT Guide for White Collar Professionals
                            </h3>
                            <button
                                onClick={() => setShowPdfModal(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.25rem',
                                    color: '#64748b',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        {/* Modal Body */}
                        <div style={{ flex: 1, background: '#f1f5f9' }}>
                            <iframe
                                src="/ChatGPT_Guide_for_White_Collar_Professionals.pdf"
                                width="100%"
                                height="100%"
                                style={{ border: 'none' }}
                                title="ChatGPT Guide PDF"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
