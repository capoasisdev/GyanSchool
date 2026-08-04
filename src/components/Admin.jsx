import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEnrichedCourses, courses as defaultCourses } from '../data/courses';
import { supabase } from '../utils/supabaseClient';
import { createClient } from '@supabase/supabase-js';



export default function Admin() {
    const navigate = useNavigate();
    
    // Auth State
    const [isLoggedIn, setIsLoggedIn] = useState(
        sessionStorage.getItem('gyanschool_admin_logged_in') === 'true'
    );
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');

    // Course Data States
    const [coursesList, setCoursesList] = useState([]);
    const [selectedCourseIdx, setSelectedCourseIdx] = useState(0);
    const [activeTab, setActiveTab] = useState('meta'); // 'meta' | 'tools' | 'master' | 'backup'
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // UI Modal & Accordion states
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [expandedToolIdx, setExpandedToolIdx] = useState(0); // Which tool accordion is open
    const [toolSubTab, setToolSubTab] = useState('setup'); // 'setup' | 'lectures' | 'quizzes'
    const [jsonBackupText, setJsonBackupText] = useState('');
    
    // MCQ Collapsible States
    const [expandedMcqs, setExpandedMcqs] = useState({}); // key: `${tIdx}-${qIdx}`, value: boolean
    const [expandedMasterMcqs, setExpandedMasterMcqs] = useState({}); // key: qIdx, value: boolean
    
    // Drag and Drop States for visual targets
    const [dragOverIdx, setDragOverIdx] = useState(null);
    const [dragOverType, setDragOverType] = useState(null);

    // Custom Alert Modal state
    const [alertPopup, setAlertPopup] = useState(null); // { title: string, message: string, type: 'success' | 'error' }

    // Privileged/Admin Access Emails Settings State
    const [privilegedEmails, setPrivilegedEmails] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('gyanschool_privileged_emails')) || [];
        } catch {
            return [];
        }
    });
    const [newEmailInput, setNewEmailInput] = useState('');

    // Influencer System states
    const [influencers, setInfluencers] = useState([]);
    const [adminReferrals, setAdminReferrals] = useState([]);
    const [infName, setInfName] = useState('');
    const [infEmail, setInfEmail] = useState('');
    const [infPassword, setInfPassword] = useState('');
    const [infPromoCode, setInfPromoCode] = useState('');
    const [infDiscount, setInfDiscount] = useState(10);
    const [infCommission, setInfCommission] = useState(15);

    const fetchInfluencerData = async () => {
        try {
            const { data: infData } = await supabase.from('influencers').select('*').order('created_at', { ascending: false });
            setInfluencers(infData || []);

            const { data: refData } = await supabase.from('referrals').select('*').order('created_at', { ascending: false });
            setAdminReferrals(refData || []);
        } catch (err) {
            console.error("Failed to load influencer data:", err);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchInfluencerData();
        }
    }, [isLoggedIn]);

    const handleAddInfluencer = async (e) => {
        e.preventDefault();
        const code = infPromoCode.trim().toLowerCase();
        if (!infName.trim() || !infEmail.trim() || !infPassword.trim() || !code) {
            triggerAlert("Please fill in all required fields.", "Error", "error");
            return;
        }
        try {
            const { error } = await supabase.from('influencers').insert([{
                name: infName.trim(),
                email: infEmail.trim().toLowerCase(),
                password: infPassword.trim(),
                promo_code: code,
                discount_percent: Number(infDiscount),
                commission_rate: Number(infCommission)
            }]);

            if (error) throw error;

            triggerAlert("Influencer created successfully!", "Success", "success");
            setInfName('');
            setInfEmail('');
            setInfPassword('');
            setInfPromoCode('');
            setInfDiscount(10);
            setInfCommission(15);
            fetchInfluencerData();
        } catch (err) {
            console.error("Failed to create influencer:", err);
            triggerAlert("Failed to create influencer. Ensure email or promo code is unique.", "Error", "error");
        }
    };

    const handleDeleteInfluencer = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete influencer ${name}?`)) {
            try {
                const { error } = await supabase.from('influencers').delete().eq('id', id);
                if (error) throw error;
                triggerAlert("Influencer deleted.", "Deleted", "success");
                fetchInfluencerData();
            } catch (err) {
                console.error("Failed to delete influencer:", err);
                triggerAlert("Failed to delete.", "Error", "error");
            }
        }
    };

    const syncPrivilegedToSupabase = async (updatedList) => {
        try {
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
            const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'placeholder-key';
            const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
                auth: { persistSession: false }
            });
            const { data: authData } = await tempClient.auth.signInWithPassword({
                email: 'admin_config@gyanschool.com',
                password: 'GyanAdminConfig123!'
            });
            if (authData?.user) {
                await tempClient.from('profiles').upsert({
                    id: authData.user.id,
                    email: 'admin_config@gyanschool.com',
                    name: JSON.stringify(updatedList),
                    updated_at: new Date().toISOString()
                });
            }
        } catch (err) {
            console.error("Failed to sync privileged emails to Supabase:", err);
        }
    };

    const handleAddEmail = async (e) => {
        e.preventDefault();
        const trimmed = newEmailInput.trim().toLowerCase();
        if (!trimmed) return;
        if (!trimmed.includes('@')) {
            triggerAlert("Please enter a valid email address.", "Invalid Email", "error");
            return;
        }
        if (privilegedEmails.includes(trimmed)) {
            triggerAlert("This email is already in the list.", "Duplicate", "error");
            return;
        }
        const updated = [...privilegedEmails, trimmed];
        setPrivilegedEmails(updated);
        localStorage.setItem('gyanschool_privileged_emails', JSON.stringify(updated));
        
        // Sync to Supabase
        await syncPrivilegedToSupabase(updated);

        setNewEmailInput('');
        triggerAlert("Email added to privileged list successfully!", "Added", "success");
    };

    const handleRemoveEmail = async (emailToRemove) => {
        if (window.confirm(`Are you sure you want to remove ${emailToRemove} from admin/privileged access?`)) {
            const updated = privilegedEmails.filter(e => e !== emailToRemove);
            setPrivilegedEmails(updated);
            localStorage.setItem('gyanschool_privileged_emails', JSON.stringify(updated));
            
            // Sync to Supabase
            await syncPrivilegedToSupabase(updated);

            triggerAlert("Email removed successfully.", "Removed", "success");
        }
    };



    // Load custom courses or fallback to static list
    useEffect(() => {
        let activeList = [];
        try {
            activeList = getEnrichedCourses();
        } catch (e) {
            console.error("Failed to load enriched courses:", e);
            activeList = defaultCourses;
        }
        setCoursesList(JSON.parse(JSON.stringify(activeList))); // Deep copy
    }, []);

    // Load JSON text on tab selection
    useEffect(() => {
        if (activeTab === 'backup') {
            setJsonBackupText(JSON.stringify(coursesList, null, 2));
        }
    }, [activeTab, coursesList]);

    // Custom Alert Popup trigger helper
    const triggerAlert = (message, title = "Notification", type = "success") => {
        setAlertPopup({ title, message, type });
    };

    // Login Handler
    const handleLogin = (e) => {
        e.preventDefault();
        if (email === 'admin@gyanschool.com' && password === 'admin@123') {
            sessionStorage.setItem('gyanschool_admin_logged_in', 'true');
            setIsLoggedIn(true);
            setAuthError('');
        } else {
            setAuthError('Invalid credentials. Hint: admin@gyanschool.com / admin@123');
        }
    };

    // Logout Handler
    const handleLogout = () => {
        sessionStorage.removeItem('gyanschool_admin_logged_in');
        setIsLoggedIn(false);
    };

    // Reset Defaults Handler
    const handleResetDefaults = () => {
        if (window.confirm("Are you sure you want to discard all customization and reset to standard GyanSchool courses?")) {
            localStorage.removeItem('gyanschool_custom_courses');
            setCoursesList(JSON.parse(JSON.stringify(defaultCourses)));
            setSaveSuccess(true);
            setTimeout(() => {
                setSaveSuccess(false);
                window.location.reload();
            }, 1000);
        }
    };

    // Save Changes Handler
    const handleSave = () => {
        try {
            localStorage.setItem('gyanschool_custom_courses', JSON.stringify(coursesList));
            setSaveSuccess(true);
            setTimeout(() => {
                setSaveSuccess(false);
                // Trigger page refresh to re-evaluate static modules imports
                window.location.reload();
            }, 1200);
        } catch (e) {
            triggerAlert("Error saving courses data. LocalStorage might be full.", "Save Error", "error");
        }
    };

    // Import Backup JSON
    const handleImportJson = () => {
        try {
            const parsed = JSON.parse(jsonBackupText);
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title) {
                setCoursesList(parsed);
                triggerAlert("Backup data successfully parsed. Click 'Save All Changes' to apply.", "Import Success", "success");
            } else {
                triggerAlert("Invalid format: Must be a JSON array of course objects.", "Import Error", "error");
            }
        } catch (e) {
            triggerAlert("JSON Syntax Error: Please paste a valid JSON string.", "Syntax Error", "error");
        }
    };

    // Add New Course Handler
    const handleAddNewCourse = () => {
        const newCourse = {
            title: "",
            badge: "",
            image: "",
            rating: 5,
            ratingText: "",
            lessons: 0,
            students: "",
            description: "",
            aboutText: "",
            tools: [],
            masterAssignment: {
                questionText: ""
            },
            masterTest: []
        };
        const updated = [...coursesList, newCourse];
        setCoursesList(updated);
        setSelectedCourseIdx(updated.length - 1);
        triggerAlert("New blank course added successfully! Remember to click 'Save All Changes' in the sidebar to finalize it.", "Success", "success");
    };

    // Delete Course Handler
    const handleDeleteCourse = () => {
        if (coursesList.length <= 1) {
            triggerAlert("You must keep at least one course in the curriculum database.", "Alert", "error");
            return;
        }
        if (window.confirm(`Are you sure you want to delete the course "${currentCourse.title || 'Untitled Course'}"? This action cannot be undone.`)) {
            const updated = coursesList.filter((_, idx) => idx !== selectedCourseIdx);
            
            // Save to LocalStorage immediately to sync with home page
            try {
                localStorage.setItem('gyanschool_custom_courses', JSON.stringify(updated));
                setCoursesList(updated);
                setSelectedCourseIdx(0);
                setSaveSuccess(true);
                setTimeout(() => {
                    setSaveSuccess(false);
                    // Reload to update static modules and sync with home page
                    window.location.reload();
                }, 1200);
            } catch (e) {
                triggerAlert("Error saving deleted state to LocalStorage.", "Save Error", "error");
            }
        }
    };

    // Drag and Drop Logic
    const handleDragStart = (e, type, idx, parentIdx = null) => {
        e.dataTransfer.setData("drag-type", type);
        e.dataTransfer.setData("drag-idx", idx.toString());
        if (parentIdx !== null) {
            e.dataTransfer.setData("drag-parent-idx", parentIdx.toString());
        }
    };

    const handleDragOver = (e, type, idx) => {
        e.preventDefault();
        setDragOverType(type);
        setDragOverIdx(idx);
    };

    const handleDragLeave = () => {
        setDragOverType(null);
        setDragOverIdx(null);
    };

    const handleDrop = (e, targetType, targetIdx, targetParentIdx = null) => {
        e.preventDefault();
        setDragOverType(null);
        setDragOverIdx(null);

        const dragType = e.dataTransfer.getData("drag-type");
        if (dragType !== targetType) return;
        
        const dragIdx = parseInt(e.dataTransfer.getData("drag-idx"), 10);
        if (dragIdx === targetIdx) return;

        const updated = [...coursesList];
        const course = updated[selectedCourseIdx];
        
        if (targetType === 'tool') {
            const [moved] = course.tools.splice(dragIdx, 1);
            course.tools.splice(targetIdx, 0, moved);
            setCoursesList(updated);
            setExpandedToolIdx(targetIdx);
        } else if (targetType === 'lecture') {
            const dragParentIdx = parseInt(e.dataTransfer.getData("drag-parent-idx"), 10);
            if (dragParentIdx !== targetParentIdx) return;
            
            const [moved] = course.tools[targetParentIdx].lectures.splice(dragIdx, 1);
            course.tools[targetParentIdx].lectures.splice(targetIdx, 0, moved);
            setCoursesList(updated);
        } else if (targetType === 'quiz') {
            const dragParentIdx = parseInt(e.dataTransfer.getData("drag-parent-idx"), 10);
            if (dragParentIdx !== targetParentIdx) return;
            
            const [moved] = course.tools[targetParentIdx].mcqTest.splice(dragIdx, 1);
            course.tools[targetParentIdx].mcqTest.splice(targetIdx, 0, moved);
            setCoursesList(updated);
        }
    };

    // Toggle MCQ Accordion
    const toggleMcq = (tIdx, qIdx) => {
        const key = `${tIdx}-${qIdx}`;
        setExpandedMcqs(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Toggle Master MCQ Accordion
    const toggleMasterMcq = (qIdx) => {
        setExpandedMasterMcqs(prev => ({
            ...prev,
            [qIdx]: !prev[qIdx]
        }));
    };

    // Form Update Handlers
    const updateCourseMeta = (field, value) => {
        const updated = [...coursesList];
        updated[selectedCourseIdx][field] = value;
        setCoursesList(updated);
    };

    // Tools Handlers
    const addTool = () => {
        const updated = [...coursesList];
        const newTool = {
            name: "",
            introText: "",
            lectures: [],
            assignment: { questionText: "" },
            mcqTest: []
        };
        if (!updated[selectedCourseIdx].tools) updated[selectedCourseIdx].tools = [];
        updated[selectedCourseIdx].tools.push(newTool);
        setCoursesList(updated);
        setExpandedToolIdx(updated[selectedCourseIdx].tools.length - 1);
    };

    const deleteTool = (e, tIdx) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete tool module "${currentCourse.tools[tIdx].name || 'Untitled Module'}"?`)) {
            const updated = [...coursesList];
            updated[selectedCourseIdx].tools.splice(tIdx, 1);
            setCoursesList(updated);
            if (expandedToolIdx >= updated[selectedCourseIdx].tools.length) {
                setExpandedToolIdx(Math.max(0, updated[selectedCourseIdx].tools.length - 1));
            }
        }
    };

    const updateToolMeta = (tIdx, field, value) => {
        const updated = [...coursesList];
        updated[selectedCourseIdx].tools[tIdx][field] = value;
        setCoursesList(updated);
    };

    // Lectures Handlers
    const addLecture = (tIdx) => {
        const updated = [...coursesList];
        const newLec = { title: "", videoUrl: "", duration: "" };
        if (!updated[selectedCourseIdx].tools[tIdx].lectures) updated[selectedCourseIdx].tools[tIdx].lectures = [];
        updated[selectedCourseIdx].tools[tIdx].lectures.push(newLec);
        setCoursesList(updated);
    };

    const deleteLecture = (tIdx, lIdx) => {
        const updated = [...coursesList];
        updated[selectedCourseIdx].tools[tIdx].lectures.splice(lIdx, 1);
        setCoursesList(updated);
    };

    const updateLecture = (tIdx, lIdx, field, value) => {
        const updated = [...coursesList];
        updated[selectedCourseIdx].tools[tIdx].lectures[lIdx][field] = value;
        setCoursesList(updated);
    };

    // MCQ Handlers
    const addMcq = (tIdx) => {
        const updated = [...coursesList];
        const newQ = { question: "", options: ["", "", "", ""], answer: 0 };
        if (!updated[selectedCourseIdx].tools[tIdx].mcqTest) updated[selectedCourseIdx].tools[tIdx].mcqTest = [];
        updated[selectedCourseIdx].tools[tIdx].mcqTest.push(newQ);
        setCoursesList(updated);
        // Automatically expand the new question
        const qIdx = updated[selectedCourseIdx].tools[tIdx].mcqTest.length - 1;
        setExpandedMcqs(prev => ({ ...prev, [`${tIdx}-${qIdx}`]: true }));
    };

    const deleteMcq = (e, tIdx, qIdx) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this question?")) {
            const updated = [...coursesList];
            updated[selectedCourseIdx].tools[tIdx].mcqTest.splice(qIdx, 1);
            setCoursesList(updated);
        }
    };

    const updateMcq = (tIdx, qIdx, field, value) => {
        const updated = [...coursesList];
        updated[selectedCourseIdx].tools[tIdx].mcqTest[qIdx][field] = value;
        setCoursesList(updated);
    };

    const updateMcqOption = (tIdx, qIdx, oIdx, value) => {
        const updated = [...coursesList];
        updated[selectedCourseIdx].tools[tIdx].mcqTest[qIdx].options[oIdx] = value;
        setCoursesList(updated);
    };

    // Master MCQ Handlers
    const addMasterMcq = () => {
        const updated = [...coursesList];
        const newQ = { question: "", options: ["", "", "", ""], answer: 0 };
        if (!updated[selectedCourseIdx].masterTest) updated[selectedCourseIdx].masterTest = [];
        updated[selectedCourseIdx].masterTest.push(newQ);
        setCoursesList(updated);
        // Automatically expand the new question
        const qIdx = updated[selectedCourseIdx].masterTest.length - 1;
        setExpandedMasterMcqs(prev => ({ ...prev, [qIdx]: true }));
    };

    const deleteMasterMcq = (e, qIdx) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this graduation question?")) {
            const updated = [...coursesList];
            updated[selectedCourseIdx].masterTest.splice(qIdx, 1);
            setCoursesList(updated);
        }
    };

    const updateMasterMcq = (qIdx, field, value) => {
        const updated = [...coursesList];
        updated[selectedCourseIdx].masterTest[qIdx][field] = value;
        setCoursesList(updated);
    };

    const updateMasterMcqOption = (qIdx, oIdx, value) => {
        const updated = [...coursesList];
        updated[selectedCourseIdx].masterTest[qIdx].options[oIdx] = value;
        setCoursesList(updated);
    };

    // Wait for data load
    if (coursesList.length === 0) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#4f46e5' }}></i>
            </div>
        );
    }

    const currentCourse = coursesList[selectedCourseIdx] || coursesList[0];

    // Filter courses based on search term
    const filteredCourses = coursesList.map((course, idx) => ({ ...course, originalIndex: idx }))
        .filter(course => course.title.toLowerCase().includes(searchTerm.toLowerCase()));

    // Metrics Calculations
    const totalTools = currentCourse.tools?.length || 0;
    const totalLectures = currentCourse.tools?.reduce((acc, t) => acc + (t.lectures?.length || 0), 0) || 0;
    const totalQuizzes = currentCourse.tools?.reduce((acc, t) => acc + (t.mcqTest?.length || 0), 0) || 0;
    const totalMasterExam = currentCourse.masterTest?.length || 0;

    // Render Login Screen
    if (!isLoggedIn) {
        return (
            <div className="admin-login-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, #f1f5f9 0%, #cbd5e1 100%)', fontFamily: 'Outfit, sans-serif', padding: '20px' }}>
                <div className="login-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '30px', padding: '3rem', width: '100%', maxWidth: '440px', boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{ background: 'rgba(79, 70, 229, 0.1)', width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                            <i className="fa-solid fa-screwdriver-wrench" style={{ color: '#4f46e5', fontSize: '1.75rem' }}></i>
                        </div>
                        <h2 style={{ color: '#1e293b', fontWeight: '800', margin: '0 0 6px 0', fontSize: '1.8rem', letterSpacing: '-0.5px' }}>GyanSchool</h2>
                        <span style={{ color: '#64748b', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Curriculum Control Center</span>
                    </div>
                    
                    {authError && (
                        <div style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '14px', padding: '12px 16px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fa-solid fa-triangle-exclamation"></i>
                            <span>{authError}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                            <label style={{ color: '#475569', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.5px' }}>ADMIN EMAIL</label>
                            <input 
                                type="email" 
                                required
                                placeholder="admin@gyanschool.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', color: '#1e293b', outline: 'none', transition: 'border-color 0.2s' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                            <label style={{ color: '#475569', fontWeight: '700', fontSize: '0.8', letterSpacing: '0.5px' }}>PASSWORD</label>
                            <input 
                                type="password" 
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', padding: '14px 18px', borderRadius: '14px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', color: '#1e293b', outline: 'none', transition: 'border-color 0.2s' }}
                            />
                        </div>
                        <button 
                            type="submit"
                            style={{ background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '14px', padding: '16px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', marginTop: '10px', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            <span>Enter Dashboard</span>
                            <i className="fa-solid fa-arrow-right"></i>
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-page" style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f8fafc', color: '#1e293b', fontFamily: 'Outfit, sans-serif' }}>
            
            {/* Sidebar Column */}
            <div style={{ width: '320px', background: '#ffffff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 1000, boxShadow: '2px 0 10px rgba(0,0,0,0.01)' }}>
                {/* Logo Section */}
                <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(79, 70, 229, 0.1)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-screwdriver-wrench" style={{ color: '#4f46e5', fontSize: '1.1rem' }}></i>
                    </div>
                    <div>
                        <h2 style={{ color: '#1e293b', fontWeight: '800', margin: 0, fontSize: '1.25rem', letterSpacing: '-0.3px' }}>GyanSchool</h2>
                        <span style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admin Console</span>
                    </div>
                </div>

                {/* Sidebar Navigation Options */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Course Selection Card Trigger */}
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ color: '#64748b', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Active Course</label>
                        <div 
                            onClick={() => setIsCourseModalOpen(true)}
                            style={{ background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'all 0.2s' }}
                            className="course-select-trigger"
                        >
                            <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800', color: '#4f46e5', lineHeight: '1.3' }}>{currentCourse.title}</h4>
                            <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <i className="fa-solid fa-arrow-right-arrow-left"></i>
                                <span>Change Course...</span>
                            </div>
                        </div>
                        <button
                            onClick={handleAddNewCourse}
                            style={{ width: '100%', marginTop: '10px', background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '12px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.15)', transition: 'all 0.2s' }}
                        >
                            <i className="fa-solid fa-plus"></i>
                            <span>Create New Course</span>
                        </button>
                    </div>

                    {/* Section Tabs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ color: '#64748b', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px', textAlign: 'left' }}>EDITOR TABS</label>
                        <button 
                            onClick={() => setActiveTab('meta')}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '10px', border: 'none', background: activeTab === 'meta' ? 'rgba(79, 70, 229, 0.08)' : 'transparent', color: activeTab === 'meta' ? '#4f46e5' : '#475569', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            <i className="fa-solid fa-circle-info" style={{ width: '16px' }}></i>
                            <span>Course Meta Info</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('tools')}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '10px', border: 'none', background: activeTab === 'tools' ? 'rgba(79, 70, 229, 0.08)' : 'transparent', color: activeTab === 'tools' ? '#4f46e5' : '#475569', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            <i className="fa-solid fa-cubes" style={{ width: '16px' }}></i>
                            <span>Curriculum Modules</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('master')}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '10px', border: 'none', background: activeTab === 'master' ? 'rgba(79, 70, 229, 0.08)' : 'transparent', color: activeTab === 'master' ? '#4f46e5' : '#475569', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            <i className="fa-solid fa-graduation-cap" style={{ width: '16px' }}></i>
                            <span>Graduation Settings</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('backup')}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '10px', border: 'none', background: activeTab === 'backup' ? 'rgba(79, 70, 229, 0.08)' : 'transparent', color: activeTab === 'backup' ? '#4f46e5' : '#475569', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            <i className="fa-solid fa-database" style={{ width: '16px' }}></i>
                            <span>Backup & Restore</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('emails')}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '10px', border: 'none', background: activeTab === 'emails' ? 'rgba(79, 70, 229, 0.08)' : 'transparent', color: activeTab === 'emails' ? '#4f46e5' : '#475569', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            <i className="fa-solid fa-envelope" style={{ width: '16px' }}></i>
                            <span>Privileged/Admin Emails</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('influencers')}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '10px', border: 'none', background: activeTab === 'influencers' ? 'rgba(79, 70, 229, 0.08)' : 'transparent', color: activeTab === 'influencers' ? '#4f46e5' : '#475569', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            <i className="fa-solid fa-users" style={{ width: '16px' }}></i>
                            <span>Influencers</span>
                        </button>
                    </div>

                    {/* Live Preview Minimap */}
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '12px', textAlign: 'left' }}>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Homepage Card Preview</span>
                        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', overflow: 'hidden', pointerEvents: 'none', opacity: 0.8 }}>
                            <div style={{ padding: '8px', borderBottom: '1px solid #f1f5f9', fontSize: '0.75rem', fontWeight: '800', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {currentCourse.title}
                            </div>
                            <div style={{ padding: '8px', background: '#f1f5f9', fontSize: '0.65rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Badge: {currentCourse.badge}</span>
                                <span>{totalLectures} Lessons</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Sidebar Bottom Controls */}
                <div style={{ padding: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button 
                        onClick={handleSave}
                        style={{ background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.15)', transition: 'all 0.2s' }}
                    >
                        <i className="fa-solid fa-floppy-disk"></i>
                        <span>Save All Changes</span>
                    </button>
                    <button 
                        onClick={() => navigate('/learn')}
                        style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '10px', fontWeight: '700', color: '#475569', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>Exit to Learners</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, marginLeft: '320px', display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
                
                {/* Save alert toast */}
                {saveSuccess && (
                    <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#10b981', color: '#ffffff', borderRadius: '16px', padding: '16px 24px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.3)', zIndex: 10000 }}>
                        <i className="fa-solid fa-circle-check" style={{ fontSize: '1.2rem' }}></i>
                        <span>Curriculum Synced!</span>
                    </div>
                )}

                {/* Top Toolbar */}
                <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 900 }}>
                    <div style={{ textAlign: 'left' }}>
                        <span style={{ fontSize: '0.7rem', color: '#4f46e5', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SELECTED CURRICULUM</span>
                        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1rem', fontWeight: '800' }}>{currentCourse.title}</h4>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button 
                            onClick={handleResetDefaults}
                            style={{ background: '#fef2f2', border: '1.5px solid #fee2e2', borderRadius: '10px', padding: '8px 14px', fontWeight: '700', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            <i className="fa-solid fa-arrow-rotate-left"></i> Reset Defaults
                        </button>
                        <button 
                            onClick={handleDeleteCourse}
                            style={{ background: '#fff1f2', border: '1.5px solid #ffe4e6', borderRadius: '10px', padding: '8px 14px', fontWeight: '700', color: '#e11d48', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
                        >
                            <i className="fa-solid fa-trash-can"></i> Delete Course
                        </button>
                        <button 
                            onClick={handleLogout}
                            style={{ background: '#f1f5f9', border: 'none', borderRadius: '10px', padding: '8px 14px', fontWeight: '700', color: '#475569', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            <i className="fa-solid fa-right-from-bracket"></i> Logout
                        </button>
                    </div>
                </div>

                {/* Editing Layout Container */}
                <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', width: '100%', flex: 1 }}>
                    
                    {/* Metrics Dashboard Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
                        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ background: 'rgba(79, 70, 229, 0.08)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fa-solid fa-cubes" style={{ color: '#4f46e5', fontSize: '1rem' }}></i>
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>Modules</span>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#1e293b' }}>{totalTools}</h3>
                            </div>
                        </div>
                        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ background: 'rgba(16, 185, 129, 0.08)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fa-solid fa-video" style={{ color: '#10b981', fontSize: '1rem' }}></i>
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>Videos</span>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#1e293b' }}>{totalLectures}</h3>
                            </div>
                        </div>
                        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ background: 'rgba(245, 158, 11, 0.08)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fa-solid fa-circle-question" style={{ color: '#f59e0b', fontSize: '1rem' }}></i>
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>Quizzes</span>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#1e293b' }}>{totalQuizzes}</h3>
                            </div>
                        </div>
                        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ background: 'rgba(236, 72, 153, 0.08)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fa-solid fa-award" style={{ color: '#ec4899', fontSize: '1rem' }}></i>
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>Exam MCQs</span>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#1e293b' }}>{totalMasterExam}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Main Workspace Frame */}
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)', minHeight: '500px' }}>
                        
                        {/* Tab 1: Meta Config */}
                        {activeTab === 'meta' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <label style={{ color: '#475569', fontWeight: '700', fontSize: '0.85rem' }}>COURSE TITLE</label>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }} title="The display title of this course package">(?)</span>
                                </div>
                                <input 
                                    type="text" 
                                    value={currentCourse.title || ''}
                                    onChange={(e) => updateCourseMeta('title', e.target.value)}
                                    style={{ padding: '14px 18px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', color: '#1e293b', outline: 'none' }}
                                />
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <label style={{ color: '#475569', fontWeight: '700', fontSize: '0.85rem' }}>PRICING BADGE</label>
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }} title="The price banner shown on the course select card (e.g. ₹7999)">(?)</span>
                                    </div>
                                    <input 
                                        type="text" 
                                        value={currentCourse.badge || ''}
                                        onChange={(e) => updateCourseMeta('badge', e.target.value)}
                                        style={{ padding: '14px 18px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', color: '#1e293b', outline: 'none' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <label style={{ color: '#475569', fontWeight: '700', fontSize: '0.85rem' }}>IMAGE URL / COVER PATH</label>
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }} title="Path to course cover graphic or upload local image file">(?)</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <input 
                                            type="text" 
                                            value={currentCourse.image || ''}
                                            onChange={(e) => updateCourseMeta('image', e.target.value)}
                                            placeholder="images/cover.jpg or paste URL"
                                            style={{ flex: 1, padding: '14px 18px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', color: '#1e293b', outline: 'none' }}
                                        />
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '14px 18px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700', color: '#475569', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
                                            <i className="fa-solid fa-cloud-arrow-up"></i>
                                            <span>Upload</span>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (uploadEvent) => {
                                                            updateCourseMeta('image', uploadEvent.target.result);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }} 
                                                style={{ display: 'none' }} 
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <label style={{ color: '#475569', fontWeight: '700', fontSize: '0.85rem' }}>SHORT DESCRIPTION (HOME PAGE)</label>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }} title="Brief description shown under the course card on the landing page">(?)</span>
                                </div>
                                <textarea 
                                    rows={3}
                                    value={currentCourse.description || ''}
                                    onChange={(e) => updateCourseMeta('description', e.target.value)}
                                    style={{ padding: '14px 18px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', color: '#1e293b', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <label style={{ color: '#475569', fontWeight: '700', fontSize: '0.85rem' }}>COURSE ABOUT / WELCOME TEXT (LEARNING VIEW)</label>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }} title="Comprehensive details read by students in their course lobby description panel">(?)</span>
                                </div>
                                <textarea 
                                    rows={5}
                                    value={currentCourse.aboutText || ''}
                                    onChange={(e) => updateCourseMeta('aboutText', e.target.value)}
                                    style={{ padding: '14px 18px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', color: '#1e293b', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                                />
                            </div>
                          </div>
                        )}

                        {/* Tab 2: Curriculum Modules Setup */}
                        {activeTab === 'tools' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h3 style={{ color: '#1e293b', fontWeight: '800', fontSize: '1.15rem', margin: 0 }}>Course Curriculum Modules</h3>
                                        <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.75rem' }}>Drag by the handle <i className="fa-solid fa-grip-vertical"></i> to change module sequence. Click to expand.</p>
                                    </div>
                                    <button 
                                        onClick={addTool}
                                        style={{ background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                                    >
                                        <i className="fa-solid fa-plus"></i> Add Tool Module
                                    </button>
                                </div>

                                {/* Accordion Tool List */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {(currentCourse.tools || []).map((tool, tIdx) => {
                                        const isExpanded = expandedToolIdx === tIdx;
                                        const isDraggedOver = dragOverType === 'tool' && dragOverIdx === tIdx;
                                        return (
                                            <div 
                                                key={tIdx} 
                                                draggable={true}
                                                onDragStart={(e) => handleDragStart(e, 'tool', tIdx)}
                                                onDragOver={(e) => handleDragOver(e, 'tool', tIdx)}
                                                onDragLeave={handleDragLeave}
                                                onDrop={(e) => handleDrop(e, 'tool', tIdx)}
                                                style={{ border: isDraggedOver ? '2px dashed #4f46e5' : '1px solid #cbd5e1', borderRadius: '16px', overflow: 'hidden', background: '#ffffff', boxShadow: isExpanded ? '0 4px 12px rgba(0,0,0,0.03)' : 'none', transform: isDraggedOver ? 'scale(0.99)' : 'none', transition: 'all 0.15s' }}
                                            >
                                                {/* Accordion Title Header Strip */}
                                                <div 
                                                    onClick={() => setExpandedToolIdx(isExpanded ? -1 : tIdx)}
                                                    style={{ background: isExpanded ? 'rgba(79, 70, 229, 0.03)' : '#ffffff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: isExpanded ? '1px solid #cbd5e1' : 'none' }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <i className="fa-solid fa-grip-vertical drag-handle" style={{ cursor: 'grab', color: '#94a3b8', fontSize: '1rem', padding: '4px' }} title="Drag to reorder module"></i>
                                                        <span style={{ background: '#4f46e5', color: '#ffffff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800' }}>
                                                            {tIdx + 1}
                                                        </span>
                                                        <h4 style={{ margin: 0, color: '#1e293b', fontWeight: '800', fontSize: '0.95rem' }}>{tool.name || 'Unnamed Module'}</h4>
                                                        <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px' }}>
                                                            {tool.lectures?.length || 0} Lectures • {tool.mcqTest?.length || 0} MCQs
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                        <button 
                                                            onClick={(e) => deleteTool(e, tIdx)}
                                                            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.95rem', cursor: 'pointer' }}
                                                            title="Delete Module"
                                                        >
                                                            <i className="fa-solid fa-trash-can"></i>
                                                        </button>
                                                        <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ color: '#64748b', fontSize: '0.85rem' }}></i>
                                                    </div>
                                                </div>

                                                {/* Accordion Expanded Workspace */}
                                                {isExpanded && (
                                                    <div style={{ padding: '24px', background: '#ffffff' }}>
                                                        
                                                        {/* In-Module Navigation Segment Bar */}
                                                        <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', marginBottom: '20px', gap: '6px' }}>
                                                            <button 
                                                                onClick={() => setToolSubTab('setup')}
                                                                style={{ padding: '10px 16px', border: 'none', borderBottom: toolSubTab === 'setup' ? '2px solid #4f46e5' : '2px solid transparent', color: toolSubTab === 'setup' ? '#4f46e5' : '#64748b', fontWeight: '700', fontSize: '0.8rem', background: 'none', cursor: 'pointer' }}
                                                            >
                                                                ⚙️ Module Setup
                                                            </button>
                                                            <button 
                                                                onClick={() => setToolSubTab('lectures')}
                                                                style={{ padding: '10px 16px', border: 'none', borderBottom: toolSubTab === 'lectures' ? '2px solid #4f46e5' : '2px solid transparent', color: toolSubTab === 'lectures' ? '#4f46e5' : '#64748b', fontWeight: '700', fontSize: '0.8rem', background: 'none', cursor: 'pointer' }}
                                                            >
                                                                🎥 Video Lessons ({tool.lectures?.length || 0})
                                                            </button>
                                                            <button 
                                                                onClick={() => setToolSubTab('quizzes')}
                                                                style={{ padding: '10px 16px', border: 'none', borderBottom: toolSubTab === 'quizzes' ? '2px solid #4f46e5' : '2px solid transparent', color: toolSubTab === 'quizzes' ? '#4f46e5' : '#64748b', fontWeight: '700', fontSize: '0.8rem', background: 'none', cursor: 'pointer' }}
                                                            >
                                                                📝 Quiz Questions ({tool.mcqTest?.length || 0})
                                                            </button>
                                                        </div>

                                                        {/* Sub-tab 1: Setup */}
                                                        {toolSubTab === 'setup' && (
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                                    <label style={{ color: '#475569', fontWeight: '700', fontSize: '0.8rem' }}>MODULE NAME / BRAND TOOL</label>
                                                                    <input 
                                                                        type="text"
                                                                        value={tool.name || ''}
                                                                        onChange={(e) => updateToolMeta(tIdx, 'name', e.target.value)}
                                                                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', color: '#1e293b', outline: 'none' }}
                                                                    />
                                                                </div>

                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                        <label style={{ color: '#475569', fontWeight: '700', fontSize: '0.8rem' }}>SPEECH INTRO TEXT (TEXT-TO-SPEECH READOUT)</label>
                                                                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }} title="Narrated aloud by the audio reader when the student selects this module. Keep it engaging.">(?)</span>
                                                                    </div>
                                                                    <textarea 
                                                                        rows={3}
                                                                        value={tool.introText || ''}
                                                                        onChange={(e) => updateToolMeta(tIdx, 'introText', e.target.value)}
                                                                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', color: '#1e293b', outline: 'none', resize: 'vertical' }}
                                                                    />
                                                                </div>

                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                        <label style={{ color: '#475569', fontWeight: '700', fontSize: '0.8rem' }}>ASSIGNMENT TASK QUESTION</label>
                                                                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }} title="Practical test task that students must execute in this module before taking the quiz.">(?)</span>
                                                                    </div>
                                                                    <input 
                                                                        type="text"
                                                                        value={tool.assignment?.questionText || ''}
                                                                        onChange={(e) => {
                                                                            const updated = [...coursesList];
                                                                            if (!updated[selectedCourseIdx].tools[tIdx].assignment) {
                                                                                updated[selectedCourseIdx].tools[tIdx].assignment = {};
                                                                            }
                                                                            updated[selectedCourseIdx].tools[tIdx].assignment.questionText = e.target.value;
                                                                            setCoursesList(updated);
                                                                        }}
                                                                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', color: '#1e293b', outline: 'none' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Sub-tab 2: Lectures */}
                                                        {toolSubTab === 'lectures' && (
                                                            <div>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                                                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Drag handle <i className="fa-solid fa-grip-vertical"></i> to reorder video lessons.</span>
                                                                    <button 
                                                                        onClick={() => addLecture(tIdx)}
                                                                        style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 12px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}
                                                                    >
                                                                        <i className="fa-solid fa-plus"></i> Add Video Link
                                                                    </button>
                                                                </div>

                                                                {(tool.lectures || []).map((lec, lIdx) => {
                                                                    const isLecDraggedOver = dragOverType === 'lecture' && dragOverIdx === lIdx;
                                                                    return (
                                                                        <div 
                                                                            key={lIdx} 
                                                                            draggable={true}
                                                                            onDragStart={(e) => handleDragStart(e, 'lecture', lIdx, tIdx)}
                                                                            onDragOver={(e) => handleDragOver(e, 'lecture', lIdx)}
                                                                            onDragLeave={handleDragLeave}
                                                                            onDrop={(e) => handleDrop(e, 'lecture', lIdx, tIdx)}
                                                                            style={{ display: 'grid', gridTemplateColumns: '30px 1.5fr 2fr 100px 30px', gap: '10px', alignItems: 'center', background: isLecDraggedOver ? 'rgba(79, 70, 229, 0.05)' : '#f8fafc', border: isLecDraggedOver ? '1.5px dashed #4f46e5' : '1px solid #cbd5e1', borderRadius: '10px', padding: '8px', marginBottom: '8px', transition: 'all 0.15s' }}
                                                                        >
                                                                            <i className="fa-solid fa-grip-vertical" style={{ cursor: 'grab', color: '#94a3b8', padding: '4px' }} title="Drag to reorder lesson"></i>
                                                                            <input 
                                                                                type="text"
                                                                                placeholder="Lecture Title"
                                                                                value={lec.title || ''}
                                                                                onChange={(e) => updateLecture(tIdx, lIdx, 'title', e.target.value)}
                                                                                style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.8rem', outline: 'none', background: '#ffffff', width: '100%' }}
                                                                            />
                                                                            <input 
                                                                                type="text"
                                                                                placeholder="Video URL (.mp4)"
                                                                                value={lec.videoUrl || ''}
                                                                                onChange={(e) => updateLecture(tIdx, lIdx, 'videoUrl', e.target.value)}
                                                                                style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.8rem', outline: 'none', background: '#ffffff', width: '100%' }}
                                                                            />
                                                                            <input 
                                                                                type="text"
                                                                                placeholder="12 min"
                                                                                value={lec.duration || ''}
                                                                                onChange={(e) => updateLecture(tIdx, lIdx, 'duration', e.target.value)}
                                                                                style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.8rem', outline: 'none', background: '#ffffff', width: '100%' }}
                                                                            />
                                                                            <button 
                                                                                onClick={() => deleteLecture(tIdx, lIdx)}
                                                                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                                                            >
                                                                                <i className="fa-solid fa-circle-xmark"></i>
                                                                            </button>
                                                                        </div>
                                                                    );
                                                                })}
                                                                {(!tool.lectures || tool.lectures.length === 0) && (
                                                                    <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '0.8rem' }}>No lessons added. Click 'Add Video Link' to start.</div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Sub-tab 3: Quizzes */}
                                                        {toolSubTab === 'quizzes' && (
                                                            <div>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                                                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Drag handle <i className="fa-solid fa-grip-vertical"></i> to reorder. Click question title bar to edit.</span>
                                                                    <button 
                                                                        onClick={() => addMcq(tIdx)}
                                                                        style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 12px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}
                                                                    >
                                                                        <i className="fa-solid fa-plus"></i> Add Question
                                                                    </button>
                                                                </div>

                                                                {(tool.mcqTest || []).map((mcq, qIdx) => {
                                                                    const isQuizDraggedOver = dragOverType === 'quiz' && dragOverIdx === qIdx;
                                                                    const isMcqExpanded = !!expandedMcqs[`${tIdx}-${qIdx}`];
                                                                    return (
                                                                        <div 
                                                                            key={qIdx} 
                                                                            draggable={true}
                                                                            onDragStart={(e) => handleDragStart(e, 'quiz', qIdx, tIdx)}
                                                                            onDragOver={(e) => handleDragOver(e, 'quiz', qIdx)}
                                                                            onDragLeave={handleDragLeave}
                                                                            onDrop={(e) => handleDrop(e, 'quiz', qIdx, tIdx)}
                                                                            style={{ background: isQuizDraggedOver ? 'rgba(79, 70, 229, 0.05)' : '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', marginBottom: '10px', overflow: 'hidden', boxShadow: isMcqExpanded ? '0 3px 6px rgba(0,0,0,0.02)' : 'none', transition: 'all 0.15s' }}
                                                                        >
                                                                            {/* Collapsible MCQ Header Row */}
                                                                            <div 
                                                                                onClick={() => toggleMcq(tIdx, qIdx)}
                                                                                style={{ padding: '12px 18px', background: isMcqExpanded ? 'rgba(79, 70, 229, 0.02)' : '#ffffff', borderBottom: isMcqExpanded ? '1px solid #cbd5e1' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                                                                            >
                                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, marginRight: '16px', overflow: 'hidden' }}>
                                                                                    <i className="fa-solid fa-grip-vertical" style={{ cursor: 'grab', color: '#94a3b8', padding: '4px' }} onClick={(e) => e.stopPropagation()} title="Drag to reorder question"></i>
                                                                                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b' }}>Q{qIdx + 1}</span>
                                                                                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                                        {mcq.question || 'New Quiz Question?'}
                                                                                    </span>
                                                                                </div>
                                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                                    <button 
                                                                                        onClick={(e) => deleteMcq(e, tIdx, qIdx)}
                                                                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                                                                    >
                                                                                        <i className="fa-solid fa-trash-can"></i>
                                                                                    </button>
                                                                                    {isMcqExpanded ? (
                                                                                        <i className="fa-solid fa-chevron-up" style={{ color: 'rgb(100, 116, 139)', fontSize: '0.85rem' }}></i>
                                                                                    ) : (
                                                                                        <i className="fa-solid fa-chevron-down" style={{ color: 'rgb(100, 116, 139)', fontSize: '0.85rem' }}></i>
                                                                                    )}
                                                                                </div>
                                                                            </div>

                                                                            {/* Collapsible MCQ Content Editor */}
                                                                            {isMcqExpanded && (
                                                                                <div style={{ padding: '18px', background: '#ffffff' }}>
                                                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                                                        <input 
                                                                                            type="text"
                                                                                            placeholder="Question statement"
                                                                                            value={mcq.question || ''}
                                                                                            onChange={(e) => updateMcq(tIdx, qIdx, 'question', e.target.value)}
                                                                                            style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', width: '100%', fontWeight: '700', outline: 'none', background: '#ffffff' }}
                                                                                        />
                                                                                        
                                                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                                                                            {(mcq.options || []).map((opt, oIdx) => (
                                                                                                <input 
                                                                                                    key={oIdx}
                                                                                                    type="text"
                                                                                                    placeholder={`Option ${oIdx + 1}`}
                                                                                                    value={opt || ''}
                                                                                                    onChange={(e) => updateMcqOption(tIdx, qIdx, oIdx, e.target.value)}
                                                                                                    style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.8rem', outline: 'none', background: '#ffffff' }}
                                                                                                />
                                                                                            ))}
                                                                                        </div>

                                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                                                                                            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>CORRECT ANSWER:</span>
                                                                                            <select 
                                                                                                value={mcq.answer}
                                                                                                onChange={(e) => updateMcq(tIdx, qIdx, 'answer', parseInt(e.target.value, 10))}
                                                                                                style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: '700', background: '#ffffff', cursor: 'pointer' }}
                                                                                            >
                                                                                                {[0,1,2,3].map(oIdx => (
                                                                                                    <option key={oIdx} value={oIdx}>Option {oIdx + 1}</option>
                                                                                                ))}
                                                                                            </select>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                                {(!tool.mcqTest || tool.mcqTest.length === 0) && (
                                                                    <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '0.8rem' }}>No quizzes added. Click 'Add Question' to start.</div>
                                                                )}
                                                            </div>
                                                        )}

                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    {(!currentCourse.tools || currentCourse.tools.length === 0) && (
                                        <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '16px', color: '#94a3b8' }}>
                                            No modules exist in this curriculum. Click "Add Tool Module" to start compiling your course.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tab 3: Graduation Settings */}
                        {activeTab === 'master' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <label style={{ color: '#475569', fontWeight: '700', fontSize: '0.85rem' }}>MASTER CAPSTONE ASSIGNMENT INSTRUCTIONS</label>
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }} title="Final project requirement prompt. Students must resolve this assignment to lock in graduation credentials.">(?)</span>
                                    </div>
                                    <textarea 
                                        rows={4}
                                        value={currentCourse.masterAssignment?.questionText || ''}
                                        onChange={(e) => {
                                            const updated = [...coursesList];
                                            if (!updated[selectedCourseIdx].masterAssignment) {
                                                updated[selectedCourseIdx].masterAssignment = {};
                                            }
                                            updated[selectedCourseIdx].masterAssignment.questionText = e.target.value;
                                            setCoursesList(updated);
                                        }}
                                        style={{ padding: '14px 18px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', color: '#1e293b', outline: 'none', resize: 'vertical' }}
                                    />
                                </div>

                                {/* Master Exam Quiz */}
                                <div style={{ borderTop: '1.5px solid #cbd5e1', marginTop: '30px', paddingTop: '30px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <div>
                                            <h3 style={{ color: '#1e293b', fontWeight: '800', fontSize: '1.15rem', margin: 0 }}>Course Graduation Master Exam</h3>
                                            <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.75rem' }}>Final verification test. Click question title bar to edit. Drag handle <i className="fa-solid fa-grip-vertical"></i> to reorder.</p>
                                        </div>
                                        <button 
                                            onClick={addMasterMcq}
                                            style={{ background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                                        >
                                            <i className="fa-solid fa-plus"></i> Add Exam MCQ
                                        </button>
                                    </div>

                                    {(currentCourse.masterTest || []).map((mcq, qIdx) => {
                                        const isExamDraggedOver = dragOverType === 'exam' && dragOverIdx === qIdx;
                                        const isExamMcqExpanded = !!expandedMasterMcqs[qIdx];
                                        return (
                                            <div 
                                                key={qIdx} 
                                                draggable={true}
                                                onDragStart={(e) => handleDragStart(e, 'exam', qIdx)}
                                                onDragOver={(e) => handleDragOver(e, 'exam', qIdx)}
                                                onDragLeave={handleDragLeave}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    setDragOverType(null);
                                                    setDragOverIdx(null);
                                                    const dragType = e.dataTransfer.getData("drag-type");
                                                    if (dragType !== 'exam') return;
                                                    const dragIdx = parseInt(e.dataTransfer.getData("drag-idx"), 10);
                                                    if (dragIdx === qIdx) return;
                                                    const updated = [...coursesList];
                                                    const [moved] = updated[selectedCourseIdx].masterTest.splice(dragIdx, 1);
                                                    updated[selectedCourseIdx].masterTest.splice(qIdx, 0, moved);
                                                    setCoursesList(updated);
                                                }}
                                                style={{ background: isExamDraggedOver ? 'rgba(79, 70, 229, 0.05)' : '#ffffff', border: isExamDraggedOver ? '1.5px dashed #4f46e5' : '1px solid #cbd5e1', borderRadius: '16px', marginBottom: '12px', overflow: 'hidden', boxShadow: isExamMcqExpanded ? '0 3px 6px rgba(0,0,0,0.02)' : 'none', transition: 'all 0.15s' }}
                                            >
                                                {/* Collapsible Header for Graduation MCQ */}
                                                <div 
                                                    onClick={() => toggleMasterMcq(qIdx)}
                                                    style={{ padding: '14px 20px', background: isExamMcqExpanded ? 'rgba(79, 70, 229, 0.02)' : '#ffffff', borderBottom: isExamMcqExpanded ? '1px solid #cbd5e1' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, marginRight: '16px', overflow: 'hidden' }}>
                                                        <i className="fa-solid fa-grip-vertical" style={{ cursor: 'grab', color: '#94a3b8', padding: '4px' }} onClick={(e) => e.stopPropagation()} title="Drag to reorder question"></i>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b' }}>Exam Q{qIdx + 1}</span>
                                                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {mcq.question || 'New Exam Question?'}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <button 
                                                            onClick={(e) => deleteMasterMcq(e, qIdx)}
                                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                                        >
                                                            <i className="fa-solid fa-trash-can"></i>
                                                        </button>
                                                        {isExamMcqExpanded ? (
                                                            <i className="fa-solid fa-chevron-up" style={{ color: 'rgb(100, 116, 139)', fontSize: '0.85rem' }}></i>
                                                        ) : (
                                                            <i className="fa-solid fa-chevron-down" style={{ color: 'rgb(100, 116, 139)', fontSize: '0.85rem' }}></i>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Collapsible Content */}
                                                {isExamMcqExpanded && (
                                                    <div style={{ padding: '20px', background: '#ffffff' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                                            <input 
                                                                type="text"
                                                                placeholder="Question Statement"
                                                                value={mcq.question || ''}
                                                                onChange={(e) => updateMasterMcq(qIdx, 'question', e.target.value)}
                                                                style={{ padding: '12px 16px', border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '0.9rem', width: '100%', fontWeight: '700', outline: 'none', background: '#ffffff' }}
                                                            />

                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                                {(mcq.options || []).map((opt, oIdx) => (
                                                                    <input 
                                                                        key={oIdx}
                                                                        type="text"
                                                                        placeholder={`Option ${oIdx + 1}`}
                                                                        value={opt || ''}
                                                                        onChange={(e) => updateMasterMcqOption(qIdx, oIdx, e.target.value)}
                                                                        style={{ padding: '10px 14px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', background: '#ffffff' }}
                                                                    />
                                                                ))}
                                                            </div>

                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                                                                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>CORRECT ANSWER:</span>
                                                                <select 
                                                                    value={mcq.answer}
                                                                    onChange={(e) => updateMasterMcq(qIdx, 'answer', parseInt(e.target.value, 10))}
                                                                    style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', fontWeight: '700', background: '#ffffff', cursor: 'pointer' }}
                                                                >
                                                                    {[0,1,2,3].map(oIdx => (
                                                                        <option key={oIdx} value={oIdx}>Option {oIdx + 1}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        );
                                    })}
                                    {(!currentCourse.masterTest || currentCourse.masterTest.length === 0) && (
                                        <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '0.85rem' }}>No graduation exam questions configured yet. Click 'Add Exam MCQ' to start.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tab 4: Backup & Restore */}
                        {activeTab === 'backup' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
                                <div>
                                    <h3 style={{ color: '#1e293b', fontWeight: '800', fontSize: '1.15rem', margin: 0 }}>Backup & Restore Curriculum JSON</h3>
                                    <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.75rem' }}>Export the entire curriculum as a JSON payload for backups or import raw JSON to sync data.</p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ color: '#475569', fontWeight: '700', fontSize: '0.85rem' }}>RAW JSON PAYLOAD</label>
                                    <textarea 
                                        rows={12}
                                        value={jsonBackupText}
                                        onChange={(e) => setJsonBackupText(e.target.value)}
                                        style={{ padding: '14px 18px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.8rem', color: '#0f172a', outline: 'none', fontFamily: 'Courier, monospace', resize: 'vertical', background: '#f8fafc' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button 
                                        onClick={handleImportJson}
                                        style={{ background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                        <i className="fa-solid fa-file-import"></i> Parse & Load JSON
                                    </button>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(jsonBackupText);
                                            triggerAlert("Curriculum JSON copied to clipboard!", "Copied", "success");
                                        }}
                                        style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '10px 20px', fontSize: '0.85rem', fontWeight: '700', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                        <i className="fa-solid fa-copy"></i> Copy JSON
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Tab 5: Privileged/Admin Emails */}
                        {activeTab === 'emails' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
                                <div>
                                    <h3 style={{ color: '#1e293b', fontWeight: '800', fontSize: '1.15rem', margin: 0 }}>Privileged / Admin Access Emails</h3>
                                    <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.75rem' }}>Users with these email addresses will automatically unlock and gain full access to all courses.</p>
                                </div>

                                <form onSubmit={handleAddEmail} style={{ display: 'flex', gap: '12px' }}>
                                    <input 
                                        type="email"
                                        placeholder="Add email address..."
                                        value={newEmailInput}
                                        onChange={(e) => setNewEmailInput(e.target.value)}
                                        style={{ flex: 1, padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                                    />
                                    <button 
                                        type="submit"
                                        style={{ background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}
                                    >
                                        Add Email
                                    </button>
                                </form>

                                <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '14px', overflow: 'hidden' }}>
                                    <div style={{ padding: '12px 16px', borderBottom: '1.5px solid #cbd5e1', background: '#f8fafc', fontWeight: '700', fontSize: '0.8rem', color: '#475569' }}>
                                        ACTIVE PRIVILEGED EMAILS ({privilegedEmails.length})
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        {privilegedEmails.map((email, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: idx < privilegedEmails.length - 1 ? '1px solid #cbd5e1' : 'none' }}>
                                                <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '500' }}>{email}</span>
                                                <button 
                                                    onClick={() => handleRemoveEmail(email)}
                                                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem', padding: '4px 8px' }}
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        ))}
                                        {privilegedEmails.length === 0 && (
                                            <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '0.85rem' }}>No emails configured yet. Add one above.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 6: Influencer Management */}
                        {activeTab === 'influencers' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'left' }}>
                                <div>
                                    <h3 style={{ color: '#1e293b', fontWeight: '800', fontSize: '1.15rem', margin: 0 }}>Collaborators / Influencers Manager</h3>
                                    <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.75rem' }}>Create codes and passwords to grant influencers access to their referral tracking dashboard.</p>
                                </div>

                                {/* Form to Create New Influencer */}
                                <form onSubmit={handleAddInfluencer} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', padding: '20px', border: '1.5px dashed #cbd5e1', borderRadius: '14px', background: '#f8fafc' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569' }}>Name</label>
                                        <input type="text" placeholder="e.g. John Doe" value={infName} onChange={e => setInfName(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} required />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569' }}>Email</label>
                                        <input type="email" placeholder="john@example.com" value={infEmail} onChange={e => setInfEmail(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} required />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569' }}>Portal Password</label>
                                        <input type="text" placeholder="Password for login" value={infPassword} onChange={e => setInfPassword(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} required />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569' }}>Promo Code (unique)</label>
                                        <input type="text" placeholder="e.g. JOHN10" value={infPromoCode} onChange={e => setInfPromoCode(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} required />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569' }}>Discount %</label>
                                        <input type="number" placeholder="10" value={infDiscount} onChange={e => setInfDiscount(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} required />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569' }}>Commission %</label>
                                        <input type="number" placeholder="15" value={infCommission} onChange={e => setInfCommission(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} required />
                                    </div>
                                    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                                        <button type="submit" style={{ background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}>
                                            Create Collaborator Code
                                        </button>
                                    </div>
                                </form>

                                {/* List of Active Influencers */}
                                <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '14px', overflow: 'hidden' }}>
                                    <div style={{ padding: '12px 16px', borderBottom: '1.5px solid #cbd5e1', background: '#f8fafc', fontWeight: '700', fontSize: '0.8rem', color: '#475569' }}>
                                        ACTIVE COLLABORATORS / INFLUENCERS ({influencers.length})
                                    </div>
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                            <thead>
                                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                                                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Name / Email</th>
                                                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Code</th>
                                                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Discount / Commission</th>
                                                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Total Referrals</th>
                                                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Total Commission</th>
                                                    <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {influencers.map((inf) => {
                                                    const infRefs = adminReferrals.filter(r => r.influencer_id === inf.id);
                                                    const totalComm = infRefs.reduce((s, r) => s + Number(r.commission_earned), 0);
                                                    return (
                                                        <tr key={inf.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                            <td style={{ padding: '12px 16px' }}>
                                                                <div style={{ fontWeight: '600', color: '#1e293b' }}>{inf.name}</div>
                                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{inf.email} (PW: {inf.password})</div>
                                                            </td>
                                                            <td style={{ padding: '12px 16px', fontWeight: '700', color: '#4f46e5' }}>{inf.promo_code.toUpperCase()}</td>
                                                            <td style={{ padding: '12px 16px' }}>{inf.discount_percent}% off / {inf.commission_rate}% comm</td>
                                                            <td style={{ padding: '12px 16px', fontWeight: '600' }}>{infRefs.length}</td>
                                                            <td style={{ padding: '12px 16px', fontWeight: '600', color: '#10b981' }}>₹{totalComm.toLocaleString('en-IN')}</td>
                                                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                                <button onClick={() => handleDeleteInfluencer(inf.id, inf.name)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem' }}>
                                                                    <i className="fa-solid fa-trash"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                {influencers.length === 0 && (
                                                    <tr>
                                                        <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>No influencers configured yet. Create one above.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </div>

            {/* Course Selector Popup Card Modal */}
            {isCourseModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}>
                    <div style={{ background: '#ffffff', borderRadius: '24px', padding: '30px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #e2e8f0' }}>
                        
                        {/* Modal Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                            <div>
                                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.3px' }}>Select Course to Manage</h3>
                                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.8rem', fontWeight: '500' }}>Choose one of the curriculum packages to configure its modules, lessons and quizzes.</p>
                            </div>
                            <button 
                                onClick={() => setIsCourseModalOpen(false)}
                                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        {/* Search Bar in Modal */}
                        <div style={{ position: 'relative' }}>
                            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem' }}></i>
                            <input 
                                type="text"
                                placeholder="Search courses by title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', color: '#1e293b', outline: 'none' }}
                            />
                        </div>

                        {/* Courses Card Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                            {filteredCourses.map((course) => {
                                const isSelected = selectedCourseIdx === course.originalIndex;
                                return (
                                    <div 
                                        key={course.originalIndex}
                                        onClick={() => {
                                            setSelectedCourseIdx(course.originalIndex);
                                            setIsCourseModalOpen(false);
                                        }}
                                        style={{ background: '#ffffff', border: isSelected ? '2px solid #4f46e5' : '1.5px solid #cbd5e1', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', transform: isSelected ? 'scale(1.02)' : 'none', boxShadow: isSelected ? '0 10px 20px rgba(79, 70, 229, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)', textAlign: 'left', position: 'relative' }}
                                        className="modal-course-card"
                                    >
                                        {/* Selected Badge */}
                                        {isSelected && (
                                            <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#4f46e5', color: '#ffffff', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
                                                <i className="fa-solid fa-check" style={{ fontSize: '0.75rem' }}></i>
                                            </div>
                                        )}

                                        {/* Image Header */}
                                        <div style={{ height: '110px', background: '#f1f5f9', position: 'relative' }}>
                                            {course.image && (
                                                <img src={course.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                                            )}
                                            <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#58cc02', color: '#fff', fontSize: '0.7rem', fontWeight: '800', padding: '3px 8px', borderRadius: '6px' }}>
                                                {course.badge}
                                            </span>
                                        </div>

                                        {/* Details */}
                                        <div style={{ padding: '14px' }}>
                                            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.85rem', fontWeight: '800', color: '#1e293b', lineHeight: '1.3' }}>{course.title}</h4>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>{course.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            {filteredCourses.length === 0 && (
                                <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                                    No courses found matching your criteria.
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}

            {/* Custom Alert Popup Card Modal */}
            {alertPopup && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
                    <div style={{ background: '#ffffff', borderRadius: '24px', padding: '28px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <div style={{ background: alertPopup.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(79, 70, 229, 0.1)', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                            <i className={alertPopup.type === 'error' ? "fa-solid fa-circle-exclamation" : "fa-solid fa-circle-check"} style={{ color: alertPopup.type === 'error' ? '#ef4444' : '#4f46e5', fontSize: '1.5rem' }}></i>
                        </div>
                        <h3 style={{ margin: '0 0 10px 0', color: '#1e293b', fontSize: '1.2rem', fontWeight: '800' }}>{alertPopup.title}</h3>
                        <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '0.875rem', lineHeight: '1.5', fontWeight: '500' }}>{alertPopup.message}</p>
                        <button 
                            onClick={() => setAlertPopup(null)}
                            style={{ width: '100%', background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '12px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.15)', transition: 'all 0.2s' }}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
