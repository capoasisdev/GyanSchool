const STORAGE_KEY = 'gyanschool_purchased';
const PROGRESS_KEY = 'gyanschool_progress';

const getCoursesCount = () => {
    try {
        const saved = localStorage.getItem('gyanschool_custom_courses');
        if (saved) {
            const list = JSON.parse(saved);
            if (Array.isArray(list)) return list.length;
        }
    } catch {}
    return 10; // Default count
};

export const isUserPrivileged = (userId) => {
    if (!userId) return false;
    const email = localStorage.getItem(`gs_user_email_${userId}`);
    if (!email) return false;
    try {
        const emailLower = email.toLowerCase().trim();
        
        // Master admin/developer emails that always have full course access
        const masterEmails = [
            'pranavpatil13.2004@gmail.com',
            'developer@gyanschool.com',
            'tester@gyanschool.com'
        ];

        
        if (masterEmails.includes(emailLower)) {
            return true;
        }

        const privileged = JSON.parse(localStorage.getItem('gyanschool_privileged_emails')) || [];
        return privileged.map(e => e.toLowerCase().trim()).includes(emailLower);
    } catch {
        return false;
    }
};

export const getPurchasedCoursesDetails = (userId) => {
    if (isUserPrivileged(userId)) {
        const count = getCoursesCount();
        return Array.from({ length: count }, (_, i) => ({
            courseIndex: i,
            purchaseDate: new Date().toISOString(),
            expiryDate: null,
            expired: false,
            planName: 'lifetime'
        }));
    }
    const key = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
    try {
        const raw = JSON.parse(localStorage.getItem(key)) || [];
        return raw.map(item => {
            if (typeof item === 'number') {
                return { courseIndex: item, purchaseDate: null, expiryDate: null, expired: false, planName: 'lifetime' };
            }
            const expired = item.expiryDate ? new Date() > new Date(item.expiryDate) : false;
            return { ...item, expired };
        });
    } catch { return []; }
};

export const getPurchasedCourses = (userId) => {
    if (isUserPrivileged(userId)) {
        const count = getCoursesCount();
        return Array.from({ length: count }, (_, i) => i);
    }
    const details = getPurchasedCoursesDetails(userId);
    // Return only active (non-expired) course indices
    return details.filter(d => !d.expired).map(d => d.courseIndex);
};

export const addPurchasedCourse = (courseIndex, userId, planName = "4-week") => {
    const key = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
    const raw = JSON.parse(localStorage.getItem(key)) || [];
    
    const purchaseDate = new Date().toISOString();
    let expiryDate = null;
    
    if (planName === "1-week") {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        expiryDate = d.toISOString();
    } else if (planName === "4-week") {
        const d = new Date();
        d.setDate(d.getDate() + 28);
        expiryDate = d.toISOString();
    } else if (planName === "12-week") {
        const d = new Date();
        d.setDate(d.getDate() + 84);
        expiryDate = d.toISOString();
    }

    // Filter out existing purchase record for this specific course to prevent duplicates
    const updated = raw.filter(item => {
        const idx = typeof item === 'number' ? item : item.courseIndex;
        return idx !== courseIndex;
    });

    updated.push({
        courseIndex,
        purchaseDate,
        expiryDate,
        planName
    });

    localStorage.setItem(key, JSON.stringify(updated));
};

export const getCourseProgress = (courseIndex, userId) => {
    const key = userId ? `${PROGRESS_KEY}_${userId}` : PROGRESS_KEY;
    try {
        const all = JSON.parse(localStorage.getItem(key)) || {};
        return all[courseIndex] || { completed: [], currentStep: 0 };
    } catch { return { completed: [], currentStep: 0 }; }
};

export const completeLesson = (courseIndex, lessonIndex, userId) => {
    const key = userId ? `${PROGRESS_KEY}_${userId}` : PROGRESS_KEY;
    const all = JSON.parse(localStorage.getItem(key)) || {};
    if (!all[courseIndex]) all[courseIndex] = { completed: [], currentStep: 0 };
    let newlyCompleted = false;
    if (!all[courseIndex].completed.includes(lessonIndex)) {
        all[courseIndex].completed.push(lessonIndex);
        newlyCompleted = true;
    }
    all[courseIndex].currentStep = Math.max(all[courseIndex].currentStep, lessonIndex + 1);
    localStorage.setItem(key, JSON.stringify(all));
    if (newlyCompleted) {
        updateTodayStats('lessonsCompleted', 1, userId);
    }
};

export const setCurrentLesson = (courseIndex, lessonIndex, userId) => {
    const key = userId ? `${PROGRESS_KEY}_${userId}` : PROGRESS_KEY;
    const all = JSON.parse(localStorage.getItem(key)) || {};
    if (!all[courseIndex]) all[courseIndex] = { completed: [], currentStep: 0 };
    all[courseIndex].currentStep = lessonIndex;
    localStorage.setItem(key, JSON.stringify(all));
};

export const getLocalDateString = (d = new Date()) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const parseDateSafe = (str) => {
    if (!str) return null;
    
    // Parse YYYY-MM-DD format as local date to prevent timezone shift issues
    const parts = str.split(/[-/]/);
    if (parts.length === 3) {
        if (parts[0].length === 4) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            const testDate = new Date(year, month, day);
            if (!isNaN(testDate.getTime())) return testDate;
        } else if (parts[2].length === 4) {
            const year = parseInt(parts[2], 10);
            const month = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[0], 10);
            const testDate = new Date(year, month, day);
            if (!isNaN(testDate.getTime())) return testDate;
        }
    }
    
    let d = new Date(str);
    if (!isNaN(d.getTime())) return d;
    return null;
};

export const getDaysDifference = (date1Str, date2Str) => {
    const d1 = parseDateSafe(date1Str);
    const d2 = parseDateSafe(date2Str);
    if (!d1 || !d2) return null;
    
    d1.setHours(0,0,0,0);
    d2.setHours(0,0,0,0);
    
    const diffTime = d2.getTime() - d1.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

export const getStreak = (userId) => {
    const streakKey = userId ? `gyanschool_streak_${userId}` : `gyanschool_streak`;
    const dateKey = userId ? `gyanschool_last_date_${userId}` : `gyanschool_last_date`;
    
    let savedStreak = parseInt(localStorage.getItem(streakKey), 10);
    const lastDateStr = localStorage.getItem(dateKey);
    
    const todayStr = getLocalDateString();
    const stats = getTodayStats(userId);
    const completedToday = stats && stats.lessonsCompleted > 0;
    
    if (isNaN(savedStreak)) {
        // Fallback: If there are already completed lessons, give a starting streak of 1
        const progressKey = userId ? `${PROGRESS_KEY}_${userId}` : PROGRESS_KEY;
        try {
            const all = JSON.parse(localStorage.getItem(progressKey)) || {};
            const totalCompleted = Object.values(all).reduce((acc, c) => acc + (c.completed || []).length, 0);
            if (totalCompleted > 0) {
                localStorage.setItem(streakKey, '1');
                localStorage.setItem(dateKey, todayStr);
                return 1;
            }
        } catch (e) {}
        savedStreak = 0;
    }
    
    if (!lastDateStr) {
        if (completedToday) {
            localStorage.setItem(streakKey, '1');
            localStorage.setItem(dateKey, todayStr);
            return 1;
        }
        return savedStreak || 0;
    }
    
    const diff = getDaysDifference(lastDateStr, todayStr);
    
    if (diff === null) {
        if (completedToday) {
            localStorage.setItem(streakKey, '1');
            localStorage.setItem(dateKey, todayStr);
            return 1;
        }
        return savedStreak || 0;
    }
    
    if (diff === 0 || diff === 1) {
        // If the last date completed was today or yesterday, streak is at least 1
        const activeStreak = Math.max(savedStreak, 1);
        if (activeStreak !== savedStreak) {
            localStorage.setItem(streakKey, activeStreak.toString());
        }
        return activeStreak;
    } else {
        if (completedToday) {
            localStorage.setItem(streakKey, '1');
            localStorage.setItem(dateKey, todayStr);
            return 1;
        }
        localStorage.setItem(streakKey, '0');
        return 0;
    }
};

export const updateStreak = (userId) => {
    const streakKey = userId ? `gyanschool_streak_${userId}` : `gyanschool_streak`;
    const dateKey = userId ? `gyanschool_last_date_${userId}` : `gyanschool_last_date`;
    
    const currentStreak = getStreak(userId);
    const lastDateStr = localStorage.getItem(dateKey);
    const todayStr = getLocalDateString();
    
    const diff = getDaysDifference(lastDateStr, todayStr);
    
    let newStreak = currentStreak;
    if (diff !== 0) {
        if (diff === 1) {
            newStreak = Math.max(currentStreak, 1) + 1;
        } else {
            newStreak = 1;
        }
        localStorage.setItem(streakKey, newStreak.toString());
        localStorage.setItem(dateKey, todayStr);
    } else {
        newStreak = Math.max(currentStreak, 1);
        localStorage.setItem(streakKey, newStreak.toString());
        localStorage.setItem(dateKey, todayStr);
    }
    return newStreak;
};


/* ─── Video Watch Progress ──────────────────────────────────────────────── */

const VIDEO_PROGRESS_KEY = 'gyanschool_video_progress';

/**
 * Save how far the user has watched in a specific lesson.
 * @param {number} courseIndex
 * @param {number} lessonIndex
 * @param {number} currentTime   - seconds
 * @param {number} duration      - total seconds
 * @param {string|null} userId
 */
export const saveVideoProgress = (courseIndex, lessonIndex, currentTime, duration, userId) => {
    const key = userId ? `${VIDEO_PROGRESS_KEY}_${userId}` : VIDEO_PROGRESS_KEY;
    try {
        const all = JSON.parse(localStorage.getItem(key)) || {};
        if (!all[courseIndex]) all[courseIndex] = {};
        const pct = duration > 0 ? Math.round((currentTime / duration) * 100) : 0;
        // Keep the highest watched % seen so far (don't overwrite with lower value on rewind)
        const existing = all[courseIndex][lessonIndex] || { position: 0, watchedPct: 0 };
        all[courseIndex][lessonIndex] = {
            position: currentTime,
            watchedPct: Math.max(existing.watchedPct, pct),
        };
        localStorage.setItem(key, JSON.stringify(all));
    } catch (e) {}
};

/**
 * Get saved video progress for a specific lesson.
 * Returns { position: seconds, watchedPct: 0-100 }
 */
export const getVideoProgress = (courseIndex, lessonIndex, userId) => {
    const key = userId ? `${VIDEO_PROGRESS_KEY}_${userId}` : VIDEO_PROGRESS_KEY;
    try {
        const all = JSON.parse(localStorage.getItem(key)) || {};
        return (all[courseIndex] && all[courseIndex][lessonIndex]) || { position: 0, watchedPct: 0 };
    } catch { return { position: 0, watchedPct: 0 }; }
};

/**
 * Get the watched % (0-100) for every lesson in a course.
 * Returns an array of numbers indexed by lesson index.
 */
export const getAllLessonWatchedPercents = (courseIndex, userId) => {
    const key = userId ? `${VIDEO_PROGRESS_KEY}_${userId}` : VIDEO_PROGRESS_KEY;
    try {
        const all = JSON.parse(localStorage.getItem(key)) || {};
        return all[courseIndex] || {};
    } catch { return {}; }
};

export const getTodayStats = (userId) => {
    const key = userId ? `gyanschool_stats_today_${userId}` : `gyanschool_stats_today`;
    const todayStr = getLocalDateString();
    try {
        const data = JSON.parse(localStorage.getItem(key)) || {};
        if (data.date !== todayStr) {
            return { date: todayStr, xpEarned: 0, lessonsCompleted: 0, chestsOpened: 0, gemsEarned: 0 };
        }
        return data;
    } catch {
        return { date: todayStr, xpEarned: 0, lessonsCompleted: 0, chestsOpened: 0, gemsEarned: 0 };
    }
};


export const updateTodayStats = (field, amount, userId) => {
    const key = userId ? `gyanschool_stats_today_${userId}` : `gyanschool_stats_today`;
    const stats = getTodayStats(userId);
    stats[field] = (stats[field] || 0) + amount;
    localStorage.setItem(key, JSON.stringify(stats));
};

export const OFFICIAL_MODULES = [
    {
        title: "Module 1: AI Foundations",
        objective: "Understand AI and prompt engineering.",
        tools: ["ChatGPT", "Claude AI", "Gemini", "Perplexity"],
        lessons: [
            "What is Generative AI?",
            "Choosing the right AI for the task",
            "Prompt engineering fundamentals",
            "Research vs reasoning vs creativity",
            "AI workflow basics"
        ]
    },
    {
        title: "Module 2: AI Productivity",
        objective: "Become 10x more productive.",
        tools: ["NotebookLM", "Grammarly", "Gamma", "Napkin AI"],
        lessons: [
            "Smart note taking",
            "Document summarization",
            "Creating presentations in minutes",
            "Visual thinking",
            "Better writing"
        ]
    },
    {
        title: "Module 3: AI Content Creation",
        objective: "Create professional content.",
        tools: ["Canva", "Gamma", "ElevenLabs", "Suno"],
        lessons: [
            "Social media posts",
            "AI voiceovers",
            "Presentation videos",
            "AI music",
            "Marketing creatives"
        ]
    },
    {
        title: "Module 4: AI for Marketing",
        objective: "Run complete marketing campaigns.",
        tools: ["ChatGPT", "Canva", "Gamma", "Grammarly", "HeyGen", "ElevenLabs", "Suno", "Perplexity"],
        lessons: [
            "Ad copy",
            "Landing pages",
            "Instagram content",
            "Email marketing",
            "Video ads",
            "Marketing strategy"
        ]
    },
    {
        title: "Module 5: AI for Sales",
        objective: "Generate more customers.",
        tools: ["Apollo AI", "Instantly", "ChatGPT", "Claude AI", "Gemini", "Perplexity"],
        lessons: [
            "Finding leads",
            "Cold emails",
            "Personalized outreach",
            "Sales scripts",
            "Follow-up automation"
        ]
    },
    {
        title: "Module 6: AI Workflow Automation",
        objective: "Remove repetitive work.",
        tools: ["Zapier", "Pomelli", "ChatGPT", "Gemini"],
        lessons: [
            "Connecting apps",
            "Automating business processes",
            "AI agents",
            "No-code workflows"
        ]
    },
    {
        title: "Module 7: AI App Building",
        objective: "Build apps without coding.",
        tools: ["Lovable", "Bolt", "ChatGPT", "Claude AI"],
        lessons: [
            "Planning an app",
            "Building with AI",
            "Deploying",
            "Improving UI",
            "Publishing"
        ]
    },
    {
        title: "Module 8: AI for Career Growth",
        objective: "Get hired faster.",
        tools: ["Huntr AI", "Teal AI", "ChatGPT", "Grammarly", "Canva"],
        lessons: [
            "Resume creation",
            "ATS optimization",
            "LinkedIn profile",
            "Interview preparation",
            "Portfolio creation"
        ]
    },
    {
        title: "Module 9: AI for Education",
        objective: "Learn and teach using AI.",
        tools: ["MagicSchool AI", "NotebookLM", "ChatGPT", "Napkin AI", "Gamma"],
        lessons: [
            "Lesson planning",
            "Student notes",
            "Quiz generation",
            "Mind maps",
            "Classroom productivity"
        ]
    },
    {
        title: "Module 10: AI for Earning",
        objective: "Make money using AI.",
        tools: ["ChatGPT", "Canva", "Lovable", "Bolt", "Zapier", "ElevenLabs", "Suno"],
        lessons: [
            "Freelancing",
            "Selling digital products",
            "Building SaaS",
            "Content business",
            "AI agency",
            "Automation services",
            "Passive income ideas"
        ]
    },
    {
        title: "Module 11: Capstone Projects",
        objective: "Students complete real-world projects using everything they've learned.",
        tools: ["All Masterclass Tools"],
        lessons: [
            "Build an AI-powered website",
            "Create a marketing campaign",
            "Design a sales funnel",
            "Build an automated workflow",
            "Create a professional presentation",
            "Develop a mini AI app",
            "Produce a complete content package (graphics, voice, and music)",
            "Launch a freelancing portfolio"
        ]
    }
];

export const getCourseSteps = (course) => {
    const steps = [];
    if (!course) return steps;

    // Helper map of all tool objects
    const toolsMap = {};
    if (course.tools && Array.isArray(course.tools)) {
        course.tools.forEach(t => {
            if (t && t.name) {
                toolsMap[t.name.toLowerCase()] = t;
            }
        });
    }

    // 1. Course Intro
    steps.push({
        type: 'course_intro',
        title: 'Course Introduction',
        aboutText: course.aboutText || course.description
    });
    
    // 2. Modules & Tools & Lessons
    OFFICIAL_MODULES.forEach((mod, mIdx) => {
        // Module Intro Step
        steps.push({
            type: 'tool_intro',
            title: `${mod.title} – Overview`,
            toolName: mod.title,
            introText: `${mod.objective} Tools covered: ${mod.tools.join(', ')}.`,
            introVideoUrl: 'https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/ChatGPT/3f383b2dee3d4ced8942f11d11f66956.mp4',
            toolIndex: mIdx,
            isModuleHeader: true
        });

        // Loop over each tool in this module
        mod.tools.forEach((toolName, tSubIdx) => {
            const toolObj = toolsMap[toolName.toLowerCase()] || 
                            Object.values(toolsMap).find(t => t.name.toLowerCase().includes(toolName.toLowerCase())) || 
                            { name: toolName, lectures: [] };

            const lectures = toolObj.lectures && toolObj.lectures.length > 0
                ? toolObj.lectures
                : mod.lessons.map(l => ({ title: `${toolName} - ${l}`, duration: '12 min' }));

            lectures.forEach((lecture, lIdx) => {
                steps.push({
                    type: 'lecture',
                    title: lecture.title.startsWith(toolName) ? lecture.title : `${toolName} - ${lecture.title}`,
                    toolName: mod.title,
                    toolCategory: toolObj.name || toolName,
                    videoUrl: lecture.videoUrl || toolObj.introVideoUrl || 'https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/ChatGPT/1993f637bcca4546b0ba631f3ee105ea.mp4',
                    duration: lecture.duration || '12 min',
                    toolIndex: mIdx,
                    subToolIndex: tSubIdx,
                    lectureIndex: lIdx
                });
            });

            // Tool Assignment
            if (toolObj.assignment) {
                steps.push({
                    type: 'tool_assignment',
                    title: `${toolObj.name || toolName} – Practical Task`,
                    toolName: mod.title,
                    toolCategory: toolObj.name || toolName,
                    questionText: toolObj.assignment?.questionText || `Complete the practical task using ${toolName} and upload your work.`,
                    toolIndex: mIdx,
                    subToolIndex: tSubIdx
                });
            }

            // Tool MCQ Test
            if (toolObj.mcqTest && toolObj.mcqTest.length > 0) {
                steps.push({
                    type: 'tool_test',
                    title: `${toolObj.name || toolName} – Quiz`,
                    toolName: mod.title,
                    toolCategory: toolObj.name || toolName,
                    questions: toolObj.mcqTest,
                    toolIndex: mIdx,
                    subToolIndex: tSubIdx
                });
            }
        });
    });
    
    // 3. Master Assignment
    steps.push({
        type: 'master_assignment',
        title: 'Master Capstone Assignment',
        questionText: course.masterAssignment?.questionText || "Complete your master capstone assignment."
    });
    
    // 4. Master Test
    steps.push({
        type: 'master_test',
        title: 'Master Course Exam',
        questions: course.masterTest || []
    });

    // 5. Certificate
    steps.push({
        type: 'certificate',
        title: 'Course Certificate'
    });
    
    return steps;
};

export const hasPurchasedAnyCourse = (email, userId) => {
    if (email) {
        const emailLower = email.toLowerCase().trim();
        const masterEmails = [
            'pranavpatil13.2004@gmail.com',
            'developer@gyanschool.com',
            'tester@gyanschool.com'
        ];

        if (masterEmails.includes(emailLower)) {
            return true;
        }
        try {
            const privileged = JSON.parse(localStorage.getItem('gyanschool_privileged_emails')) || [];
            if (privileged.map(e => e.toLowerCase().trim()).includes(emailLower)) {
                return true;
            }
        } catch {}
    }

    const keys = [];
    if (userId) keys.push(`gyanschool_purchased_${userId}`);
    if (email) keys.push(`gyanschool_purchased_${email.toLowerCase().trim()}`);

    for (const key of keys) {
        try {
            const raw = JSON.parse(localStorage.getItem(key)) || [];
            if (Array.isArray(raw) && raw.length > 0) {
                return true;
            }
        } catch {}
    }

    return false;
};

