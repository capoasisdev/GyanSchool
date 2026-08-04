import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { quizQuestions, syllabusMap } from '../data/quizQuestions';
import { courses } from '../data/courses';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { addPurchasedCourse } from '../utils/progressTracker';
import { supabase } from '../utils/supabaseClient';

export default function QuizModal({ isOpen, onClose, initialStep, onStepChange }) {
    const navigate = useNavigate();
    const [routerSearchParams, routerSetSearchParams] = useSearchParams();
    const [localStep, setLocalStep] = useState('1');
    const isCapacitorApp = !!window.Capacitor || routerSearchParams.get('testApp') === 'true';

    useEffect(() => {
        if (isCapacitorApp && initialStep) {
            setLocalStep(initialStep);
        }
    }, [initialStep, isCapacitorApp]);

    const setSearchParams = (paramsObj) => {
        if (isCapacitorApp) {
            if (paramsObj.step) {
                setLocalStep(paramsObj.step);
                if (onStepChange) onStepChange(paramsObj.step);
            } else {
                setLocalStep('1');
                if (onStepChange) onStepChange(null);
            }
        } else {
            routerSetSearchParams(paramsObj);
        }
    };

    const searchParams = {
        get: (key) => {
            if (key === 'step') {
                return isCapacitorApp ? localStep : routerSearchParams.get('step');
            }
            return routerSearchParams.get(key);
        }
    };

    const { user, sendMagicLink } = useAuth();
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [userAnswers, setUserAnswers] = useState({});
    const [createdAccount, setCreatedAccount] = useState(null);
    const [authError, setAuthError] = useState(null);

    const stepParam = searchParams.get('step') || '1';

    // Check if the user is attempting to access a protected pitch/checkout/payment screen directly
    const isProtectedScreen = ["pitch1", "pitch2", "pitch3", "pitch5", "checkout", "payment", "success"].includes(stepParam);
    const hasActiveQuizToken = sessionStorage.getItem('gyanschool_quiz_token') !== null || routerSearchParams.get('course') !== null;

    useEffect(() => {
        const urlCourse = routerSearchParams.get('course');
        const urlPlan = routerSearchParams.get('plan');
        const urlEmail = routerSearchParams.get('email');
        const urlName = routerSearchParams.get('name');

        if (urlCourse !== null) {
            localStorage.setItem('gyanschool_checkout_course_idx', urlCourse);
            sessionStorage.setItem('gyanschool_quiz_token', 'direct_url_' + Math.random().toString(36).substring(2, 11));
        }
        if (urlPlan !== null && ["1-week", "1-month", "3-month"].includes(urlPlan)) {
            setSelectedPlan(urlPlan);
        }
        if (urlEmail !== null) {
            setEmailInput(urlEmail);
            setUserEmail(urlEmail);
        }
        if (urlName !== null) {
            setNameInput(urlName);
            setUserName(urlName);
        }
    }, [routerSearchParams]);

    useEffect(() => {
        if (isOpen && isProtectedScreen && !hasActiveQuizToken) {
            // User tried to access results/payment directly. Reset to step 1.
            setSearchParams({ step: '1' });
        }
    }, [isOpen, stepParam, isProtectedScreen, hasActiveQuizToken, setSearchParams]);

    useEffect(() => {
        if (!isOpen) {
            // Expire token when the modal is closed
            sessionStorage.removeItem('gyanschool_quiz_token');
        }
    }, [isOpen]);

    // Derive currentStep and currentCustomScreen from stepParam URL query variable
    let currentStep = 0;
    let currentCustomScreen = "";

    const customScreens = ["loader", "lead", "pitch1", "pitch2", "pitch3", "pitch5", "checkout", "payment", "success"];
    if (customScreens.includes(stepParam)) {
        currentCustomScreen = stepParam;
        currentStep = quizQuestions.length - 1;
    } else {
        const parsed = parseInt(stepParam, 10);
        currentStep = isNaN(parsed) ? 0 : Math.max(0, Math.min(parsed - 1, quizQuestions.length - 1));
        currentCustomScreen = "";
    }

    // User Profile
    const [userName, setUserName] = useState("Pranav");
    const [userEmail, setUserEmail] = useState("pranav@example.com");
    const [userPhone, setUserPhone] = useState("");

    // Form inputs state
    const [nameInput, setNameInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [phoneInput, setPhoneInput] = useState("");

    // Checkout Details
    const [selectedPlan, setSelectedPlan] = useState(() => {
        const stored = localStorage.getItem('gyanschool_checkout_plan');
        if (stored === "1-week" || stored === "1-month" || stored === "3-month") {
            return stored;
        }
        return "1-month";
    });
    const [discountMultiplier, setDiscountMultiplier] = useState(0.5);
    const [voucherCode, setVoucherCode] = useState('');
    const [appliedVoucher, setAppliedVoucher] = useState(null);
    const [voucherError, setVoucherError] = useState('');
    const [voucherSuccess, setVoucherSuccess] = useState('');

    const [promoInput, setPromoInput] = useState('');
    const [appliedInfluencer, setAppliedInfluencer] = useState(null);
    const [promoError, setPromoError] = useState('');
    const [promoSuccess, setPromoSuccess] = useState('');

    const handleApplyPromoCode = async () => {
        setPromoError('');
        setPromoSuccess('');
        if (!promoInput.trim()) {
            setPromoError('Please enter a promo code.');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('influencers')
                .select('*')
                .eq('promo_code', promoInput.trim().toLowerCase())
                .maybeSingle();

            if (error) throw error;

            if (data) {
                setAppliedInfluencer(data);
                setPromoSuccess(`Promo code applied successfully! Enjoy ${data.discount_percent}% off.`);
            } else {
                setPromoError('Invalid promo code.');
                setAppliedInfluencer(null);
            }
        } catch (err) {
            console.error('Failed to validate promo code:', err);
            setPromoError('Error validating code. Please try again.');
        }
    };

    const vouchersKey = user?.id ? `gyanschool_vouchers_${user.id}` : 'gyanschool_vouchers';

    const handleApplyVoucher = () => {
        setVoucherError('');
        setVoucherSuccess('');

        if (!voucherCode.trim()) {
            setVoucherError('Please enter a voucher code.');
            return;
        }

        let savedVouchers = [];
        try {
            savedVouchers = JSON.parse(localStorage.getItem(vouchersKey)) || [];
        } catch (e) {
            savedVouchers = [];
        }

        const foundVoucher = savedVouchers.find(v => v.code === voucherCode.trim());

        if (!foundVoucher) {
            setVoucherError('Invalid voucher code.');
            return;
        }

        if (foundVoucher.used) {
            setVoucherError('This voucher has already been used.');
            return;
        }

        const isExpired = new Date() > new Date(foundVoucher.expiryDate);
        if (isExpired) {
            setVoucherError('This voucher has expired.');
            return;
        }

        setAppliedVoucher(foundVoucher);
        setVoucherSuccess(`Successfully applied ${foundVoucher.percent}% discount!`);
        setDiscountMultiplier(prev => Math.min(0.95, prev + foundVoucher.percent / 100));
    };

    const handlePaymentSuccess = async () => {
        if (appliedVoucher) {
            let savedVouchers = [];
            try {
                savedVouchers = JSON.parse(localStorage.getItem(vouchersKey)) || [];
            } catch (e) {
                savedVouchers = [];
            }
            const updatedVouchers = savedVouchers.map(v => {
                if (v.code === appliedVoucher.code) {
                    return { ...v, used: true };
                }
                return v;
            });
            localStorage.setItem(vouchersKey, JSON.stringify(updatedVouchers));
        }

        let targetUserId = user?.id;

        // Send Magic Link to guest user
        if (!user) {
            const signupEmail = (userEmail || emailInput || '').trim();

            // Try to resolve existing user ID from profiles table
            try {
                const { data: existingProfile } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('email', signupEmail)
                    .maybeSingle();
                if (existingProfile?.id) {
                    targetUserId = existingProfile.id;
                } else {
                    targetUserId = signupEmail;
                }
            } catch (e) {
                targetUserId = signupEmail;
            }

            const result = await sendMagicLink(signupEmail);
            if (result.error) {
                setAuthError(result.error);
            } else {
                setCreatedAccount({
                    email: signupEmail,
                    realEmail: signupEmail
                });
            }
        }

        const overrideIdxStr = localStorage.getItem('gyanschool_checkout_course_idx');
        let finalCourseIdx = recommendedCourse.index;
        if (overrideIdxStr !== null) {
            finalCourseIdx = parseInt(overrideIdxStr, 10);
            addPurchasedCourse(finalCourseIdx, targetUserId, selectedPlan);
            localStorage.removeItem('gyanschool_checkout_course_idx');
            localStorage.removeItem('gyanschool_checkout_plan');
        } else {
            addPurchasedCourse(recommendedCourse.index, targetUserId, selectedPlan);
        }
        selectedExtraCourses.forEach(idx => addPurchasedCourse(idx, targetUserId, selectedPlan));

        // Log referral if influencer code is applied
        if (appliedInfluencer) {
            try {
                const invoiceDetails = getInvoicePriceDetails();
                const courseTitle = courses[finalCourseIdx]?.title || "GyanSchool Course Bundle";
                const signupEmail = (userEmail || emailInput || '').trim();
                const commEarned = Math.round((invoiceDetails.finalPrice * appliedInfluencer.commission_rate) / 100);

                await supabase.from('referrals').insert([{
                    influencer_id: appliedInfluencer.id,
                    influencer_code: appliedInfluencer.promo_code,
                    purchaser_email: signupEmail,
                    course_title: courseTitle,
                    amount_paid: invoiceDetails.finalPrice,
                    commission_earned: commEarned
                }]);
            } catch (err) {
                console.error("Failed to log referral to Supabase:", err);
            }
        }

        // Switch to the custom success screen
        setSearchParams({ step: 'success' });
    };
    const [secondsLeft, setSecondsLeft] = useState(() => {
        const savedEndTime = localStorage.getItem('gyanschool_checkout_end_time');
        if (savedEndTime) {
            const parsed = parseInt(savedEndTime, 10);
            if (!isNaN(parsed)) {
                const remaining = Math.max(0, Math.floor((parsed - Date.now()) / 1000));
                if (remaining > 0) {
                    return remaining;
                }
            }
        }
        const newEndTime = Date.now() + 600 * 1000;
        localStorage.setItem('gyanschool_checkout_end_time', newEndTime.toString());
        return 600;
    });
    const [progress, setProgress] = useState(0);
    const [spinState, setSpinState] = useState({ disabled: false, rotatedDeg: 0 });
    const wheelSvgRef = useRef(null);
    const wheelPointerRef = useRef(null);
    const [showClaimModal, setShowClaimModal] = useState(false);
    const [showExitIntent, setShowExitIntent] = useState(false);
    const [showAllCourses, setShowAllCourses] = useState(false);
    const [selectedExtraCourses, setSelectedExtraCourses] = useState([]);

    // CC Inputs
    const [ccNumber, setCcNumber] = useState("");
    const [ccExpiry, setCcExpiry] = useState("");
    const [ccCvv, setCcCvv] = useState("");
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [leadSubmitting, setLeadSubmitting] = useState(false);



    // Razorpay Config — replace with your actual key
    const razorpayKey = import.meta.env.VITE_RAZORPAY_API_KEY || "rzp_live_xxxxxxxxxxxx";

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) { resolve(true); return; }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // Refs
    const modalRef = useRef(null);
    const isTransitioningRef = useRef(false);   // Prevents double-fire skip bug
    const exitIntentShownRef = useRef(false);   // Only show exit intent once per session

    // Loader progress effect
    useEffect(() => {
        if (currentCustomScreen === "loader") {
            setProgress(0);
            let active = true;
            let currentVal = 0;

            const runProgress = () => {
                if (!active) return;

                // Calculate next interval delay dynamically based on percentage milestones
                let delay = 30; // base speed in ms

                if (currentVal >= 22 && currentVal <= 34) {
                    // Milestone slowdown 1 (Analyzing answers)
                    delay = 120 + Math.random() * 80;
                } else if (currentVal >= 60 && currentVal <= 72) {
                    // Milestone slowdown 2 (Structuring syllabus)
                    delay = 140 + Math.random() * 100;
                } else if (currentVal >= 88 && currentVal <= 96) {
                    // Milestone slowdown 3 (Finalizing discount offer)
                    delay = 160 + Math.random() * 120;
                } else {
                    // Fast bursts with subtle random jitter
                    delay = 15 + Math.random() * 20;
                }

                setTimeout(() => {
                    if (!active) return;
                    currentVal += 1;
                    setProgress(currentVal);

                    if (currentVal < 100) {
                        runProgress();
                    }
                }, delay);
            };

            runProgress();

            return () => {
                active = false;
            };
        }
    }, [currentCustomScreen]);

    // Navigate to lead step when loader completes
    useEffect(() => {
        if (currentCustomScreen === "loader" && progress >= 100) {
            setSearchParams({ step: "lead" });
        }
    }, [progress, currentCustomScreen, setSearchParams]);

    // Countdown timer effect
    useEffect(() => {
        if (currentCustomScreen === "checkout" && secondsLeft > 0) {
            const timer = setInterval(() => {
                setSecondsLeft(prev => {
                    if (prev <= 1) clearInterval(timer);
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [currentCustomScreen, secondsLeft]);

    // Exit Intent Handler — only activates on the checkout screen,
    // with an 800ms startup delay so the page-transition doesn't accidentally trigger it.
    useEffect(() => {
        if (currentCustomScreen !== "checkout") return;

        let listenerActive = false;
        const startupTimer = setTimeout(() => {
            listenerActive = true;
        }, 800);

        const handleMouseLeave = (e) => {
            if (listenerActive && e.clientY <= 0 && !exitIntentShownRef.current) {
                exitIntentShownRef.current = true; // Only show once
                setShowExitIntent(true);
            }
        };

        document.addEventListener("mouseleave", handleMouseLeave);
        return () => {
            clearTimeout(startupTimer);
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [currentCustomScreen]);

    if (!isOpen) return null;

    // Matches best course based on goals and choices
    const getBestMatchCourse = () => {
        const overrideIdxStr = localStorage.getItem('gyanschool_checkout_course_idx');
        if (overrideIdxStr !== null) {
            const overrideIdx = parseInt(overrideIdxStr, 10);
            if (!isNaN(overrideIdx) && courses[overrideIdx]) {
                return {
                    ...courses[overrideIdx],
                    index: overrideIdx,
                    matchScore: 100
                };
            }
        }

        // course map:
        // 0: White Collar Executive AI
        // 1: AI for Marketing
        // 2: AI for Sales
        // 3: AI for Business Workflow Automation
        // 4: Degree & MBA Graduate Productivity
        // 5: Job & Career Planning
        // 6: AI for Mini-App Making
        // 7: Earning-Focused AI
        // 8: AI for Teachers

        const status = userAnswers.status || '';
        const goal = userAnswers.goal || '';

        let matchedIdx = 0; // Default: White Collar Executive AI

        if (status === 'teacher') {
            matchedIdx = 8; // AI for Teachers
        } else if (goal === 'career') {
            matchedIdx = 5; // Job & Career Planning
        } else if (goal === 'appmaking') {
            matchedIdx = 6; // AI for Mini-App Making
        } else if (status === 'graduate') {
            matchedIdx = 4; // Degree & MBA Graduate Productivity
        } else if (status === 'marketing' || goal === 'creative') {
            matchedIdx = 1; // AI for Marketing
        } else if (status === 'sales' || goal === 'outreach') {
            matchedIdx = 2; // AI for Sales
        } else if (status === 'freelancer') {
            matchedIdx = 7; // Earning-Focused AI
        } else if (goal === 'automation' || status === 'operations') {
            matchedIdx = 3; // AI for Business Workflow Automation
        } else {
            matchedIdx = 0; // White Collar Executive AI
        }

        return {
            ...courses[matchedIdx],
            index: matchedIdx,
            matchScore: 98
        };
    };

    const recommendedCourse = getBestMatchCourse();

    const parsePrice = (badge) => {
        const num = parseInt(badge.replace(/[^0-9]/g, ''), 10);
        return isNaN(num) ? 0 : num;
    };

    const usdToInr = 83;
    const extraCoursesTotal = selectedExtraCourses.reduce((sum, idx) => {
        return sum + parsePrice(courses[idx].badge);
    }, 0);

    const extraCoursesDiscountRate = 0.15;
    const extraCoursesTotalUsd = Math.round((extraCoursesTotal / usdToInr) * 100) / 100;
    const extraCoursesDiscount = Math.round((extraCoursesTotalUsd * extraCoursesDiscountRate) * 100) / 100;
    const extraCoursesFinal = Math.round((extraCoursesTotalUsd - extraCoursesDiscount) * 100) / 100;

    // Get pricing totals
    const getInvoicePriceDetails = () => {
        let originalPrice = 2198;
        let basePrice = 1099;
        let label = "1 Month AI Challenge";

        if (selectedPlan === "1-week") {
            originalPrice = 1198;
            basePrice = 599;
            label = "1-Week AI Challenge";
        } else if (selectedPlan === "1-month") {
            originalPrice = 2198;
            basePrice = 1099;
            label = "1 Month AI Challenge";
        } else if (selectedPlan === "3-month") {
            originalPrice = 5998;
            basePrice = 2999;
            label = "3 Month AI Challenge";
        }

        let discountAmount = originalPrice - basePrice;
        const vatPercent = 0.0;

        const combinedBase = basePrice;
        const vatAmount = 0.0;
        let finalPrice = combinedBase;
        if (appliedInfluencer) {
            const promoDiscount = Math.round((finalPrice * appliedInfluencer.discount_percent) / 100);
            finalPrice = finalPrice - promoDiscount;
            discountAmount += promoDiscount;
        }

        return { originalPrice, basePrice, discountAmount, vatAmount, finalPrice, label, extraCoursesTotalUsd: 0, extraCoursesDiscount: 0, extraCoursesFinal: 0 };
    };

    const invoice = getInvoicePriceDetails();



    // Form continue click handler
    const handleLeadSubmit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

        if (!nameInput.trim()) {
            alert("Please enter your name.");
            return;
        }
        if (!emailInput.trim() || !emailRegex.test(emailInput)) {
            alert("Please enter a valid email address.");
            return;
        }

        setUserName(nameInput.trim());
        setUserEmail(emailInput.trim());
        setUserPhone("");

        setLeadSubmitting(true);


        // Supabase DB insertion
        try {
            await supabase.from('quiz_submissions').insert([{
                user_id: user?.id || null,
                name: nameInput.trim(),
                email: emailInput.trim(),
                phone: "",
                answers: userAnswers
            }]);
        } catch (err) {
            console.error("Failed to write to Supabase:", err);
        }

        // Set temporary session token to authorize results and checkout screens access
        sessionStorage.setItem('gyanschool_quiz_token', 'valid_' + Math.random().toString(36).substring(2, 11));

        setLeadSubmitting(false);
        setSearchParams({ step: "pitch1" });
    };

    // Spin wheel callback with custom multi-phase easing and peg tick animation
    const handleSpin = () => {
        if (spinState.disabled) return;
        setSpinState(prev => ({ ...prev, disabled: true }));

        const duration = 4800; // 4.8 seconds
        const start = performance.now();

        const animate = (now) => {
            const elapsed = now - start;
            const t = Math.min(elapsed / duration, 1);

            // 50% off is Sector 4 (index 4).
            // To align perfectly at 12 o'clock, the angle needs to be N * 360 + 157.5.
            const totalRotation = 1800 + 157.5;
            // The boundary edge between 45% off (Sector 5) and 50% off (Sector 4) is at N * 360 + 135.
            const edgeRotation = 1800 + 135;

            let R = 0;
            if (t < 0.78) {
                // Phase 1: Fast spin decelerating towards the boundary edge (1° before the line)
                const nt = t / 0.78;
                const ease = 1 - Math.pow(1 - nt, 3); // Cubic ease out
                R = (edgeRotation - 1) * ease;
            } else if (t < 0.88) {
                // Phase 2: Tension/creep phase - wheel almost stops completely on the peg line (edge)
                const nt = (t - 0.78) / 0.1;
                // Creep forward slowly across the edge (from 1° before to 1° after the boundary line)
                R = (edgeRotation - 1) + nt * 2;
            } else {
                // Phase 3: Fall/slip phase - suddenly slips off the peg into the 50% off center with a bounce
                const nt = (t - 0.88) / 0.12;
                const startVal = edgeRotation + 1;
                const endVal = totalRotation;

                // easeOutBack for a realistic bounce landing
                const c1 = 1.70158;
                const c3 = c1 + 1;
                const easeBack = 1 + c3 * Math.pow(nt - 1, 3) + c1 * Math.pow(nt - 1, 2);
                R = startVal + (endVal - startVal) * easeBack;
            }

            // Apply rotation to SVG wheel
            if (wheelSvgRef.current) {
                wheelSvgRef.current.style.transform = `rotate(${R}deg)`;
            }

            // Simulate peg ticking: tilt pointer as pegs (every 45 degrees) pass by
            if (wheelPointerRef.current) {
                const phase = R % 45;
                let tilt = 0;

                // Ticking tick/stagger logic: peak tilt at peg division (phase = 0), snap back immediately after
                if (phase < 8) {
                    tilt = 18 - (phase / 8) * 22; // snap back from 18deg to -4deg
                } else if (phase < 20) {
                    tilt = -4 + ((phase - 8) / 12) * 4; // return from -4deg to 0deg
                } else if (phase > 35) {
                    tilt = ((phase - 35) / 10) * 18; // next peg approaches: push to 18deg
                } else {
                    tilt = 0;
                }

                // Dampen the pointer tilt at high speed to avoid visual jitter
                const speedDampening = Math.min(1, Math.max(0, (1 - t) * 2));
                tilt = tilt * speedDampening;

                wheelPointerRef.current.style.transform = `translateX(-50%) rotate(${tilt}deg)`;
            }

            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                // Update React state for consistency
                setSpinState({ disabled: true, rotatedDeg: totalRotation });
                setTimeout(() => {
                    setShowClaimModal(true);
                }, 400);
            }
        };

        requestAnimationFrame(animate);
    };

    const handleRazorpayPayment = async () => {
        // Redirect to system browser if running inside Capacitor to bypass WebView app-intent restrictions
        if (isCapacitorApp) {
            const overrideIdxStr = localStorage.getItem('gyanschool_checkout_course_idx');
            const targetIdx = overrideIdxStr !== null ? overrideIdxStr : recommendedCourse.index;
            const checkoutUrl = `https://gyanschool.com/?step=checkout&course=${targetIdx}&plan=${selectedPlan}&email=${encodeURIComponent(user?.email || emailInput || '')}&name=${encodeURIComponent(user?.name || nameInput || '')}`;
            
            window.open(checkoutUrl, '_system');
            setPaymentProcessing(false);
            return;
        }

        // ─── TEMPORARY BYPASS ─────────────────────────────────────────────────
        // Set to `false` to restore the full Razorpay payment flow immediately.
        const BYPASS_PAYMENT = false;
        if (BYPASS_PAYMENT) {
            setPaymentProcessing(true);
            setTimeout(() => {
                setPaymentProcessing(false);
                handlePaymentSuccess();
            }, 800);
            return;
        }
        // ──────────────────────────────────────────────────────────────────────

        // If using placeholder key, run simulated sandbox payment
        if (razorpayKey === "rzp_live_xxxxxxxxxxxx") {
            setPaymentProcessing(true);
            setTimeout(() => {
                setPaymentProcessing(false);
                handlePaymentSuccess();
                alert("TEST MODE: Payment simulated successfully! The courses have been unlocked in your account.");
            }, 1500);
            return;
        }

        const loaded = await loadRazorpayScript();
        if (!loaded) {
            alert("Failed to load payment gateway. Please try again.");
            return;
        }

        setPaymentProcessing(true);

        let amountPaise;
        const overrideIdxStr = localStorage.getItem('gyanschool_checkout_course_idx');
        if (overrideIdxStr !== null) {
            const overrideIdx = parseInt(overrideIdxStr, 10);
            const selectedCourseObj = courses[overrideIdx];
            const baseInr = selectedCourseObj ? parsePrice(selectedCourseObj.badge) : 0;
            // Add extra courses (already in INR)
            const extrasInr = selectedExtraCourses.reduce((sum, idx) => sum + parsePrice(courses[idx].badge), 0);
            // Deduct 15% bundle discount if extra courses are added
            const totalBeforeDiscount = baseInr + extrasInr;
            const discountInr = extrasInr > 0 ? Math.round((extrasInr * 0.15) * 100) / 100 : 0;
            const subtotalInr = totalBeforeDiscount - discountInr;
            const finalInr = subtotalInr;

            amountPaise = finalInr > 0 ? Math.round(finalInr * 100) : 100;
        } else {
            amountPaise = Math.round(invoice.finalPrice * 100);
        }

        const subscriptionIdMap = {
            "1-week": "sub_T7MXuhRU14GfMz",
            "1-month": "sub_T7MaY4wH65GNAl",
            "3-month": "sub_T7MbRiO27rcTEE"
        };
        const pregeneratedSubId = subscriptionIdMap[selectedPlan];

        const planIdMap = {
            "1-week": "plan_T7M7gzpt26X1cR",
            "1-month": "plan_T7MCLYFzHSoUe0",
            "3-month": "plan_T7MCqVDl53pRrm"
        };
        const selectedPlanId = planIdMap[selectedPlan];
        const razorpaySecret = import.meta.env.VITE_RAZORPAY_SECRET || "";

        let subscriptionId = "";

        // Only attempt dynamic generation if there's no pregenerated sub ID
        if (!pregeneratedSubId && selectedPlanId && razorpaySecret && overrideIdxStr === null) {
            try {
                const response = await fetch("https://api.razorpay.com/v1/subscriptions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Basic " + btoa(razorpayKey + ":" + razorpaySecret)
                    },
                    body: JSON.stringify({
                        plan_id: selectedPlanId,
                        total_count: selectedPlan === "1-week" ? 52 : (selectedPlan === "1-month" ? 12 : 4),
                        quantity: 1,
                        customer_notify: 1
                    })
                });
                const data = await response.json();
                if (data && data.id) {
                    subscriptionId = data.id;
                }
            } catch (err) {
                console.error("Dynamic subscription failed, falling back", err);
            }
        }

        const finalSubId = pregeneratedSubId || subscriptionId;

        const options = {
            key: razorpayKey,
            subscription_id: finalSubId ? finalSubId : undefined,
            amount: finalSubId ? undefined : amountPaise,
            currency: finalSubId ? undefined : "INR",
            name: "GyanSchool",
            description: recommendedCourse.title,
            image: "https://gyanschool.com/favicon.ico",
            prefill: {
                name: user?.name || userName,
                email: user?.email || userEmail,
                contact: userPhone || ""
            },
            notes: {
                plan_id: selectedPlanId,
                plan_name: invoice.label
            },
            theme: { color: "#535bfc" },
            config: {
                display: {
                    blocks: {
                        upi: {
                            name: 'UPI / QR Code',
                            instruments: [
                                { method: 'upi', flows: ['intent', 'collect', 'qr'] }
                            ]
                        }
                    },
                    sequence: ['block.upi', 'block.other'],
                    preferences: {
                        show_default_blocks: true
                    }
                }
            },
            handler: function (response) {
                setPaymentProcessing(false);
                handlePaymentSuccess();
            },
            modal: {
                ondismiss: function () {
                    setPaymentProcessing(false);
                }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
            setPaymentProcessing(false);
            alert("Payment failed. Please try again.");
        });
        rzp.open();
    };

    // When user clicks GET MY PLAN — navigate directly to payment screen
    const handleGetMyPlan = () => {
        setSearchParams({ step: "payment" });
    };

    // Advance to the next step — used by text_slide and split Continue buttons
    const goNext = () => {
        if (isTransitioningRef.current) return;
        isTransitioningRef.current = true;

        if (currentStep < quizQuestions.length - 1) {
            setSearchParams({ step: (currentStep + 2).toString() });
        } else {
            setSearchParams({ step: "loader" });
        }

        // Release lock after slide renders; 600ms safety valve prevents permanent lock
        const release = setTimeout(() => { isTransitioningRef.current = false; }, 400);
        setTimeout(() => { clearTimeout(release); isTransitioningRef.current = false; }, 600);
    };

    // Standard multi-option choice clicks (records answer + auto-advances after 250ms)
    const handleChoiceSelect = (questionId, value) => {
        if (isTransitioningRef.current) return;
        isTransitioningRef.current = true;

        setUserAnswers(prev => ({ ...prev, [questionId]: value }));

        // 600ms safety valve: if the inner setTimeout never fires, release the lock anyway
        const safetyValve = setTimeout(() => { isTransitioningRef.current = false; }, 600);

        setTimeout(() => {
            clearTimeout(safetyValve);
            if (currentStep < quizQuestions.length - 1) {
                setSearchParams({ step: (currentStep + 2).toString() });
            } else {
                setSearchParams({ step: "loader" });
            }
            setTimeout(() => { isTransitioningRef.current = false; }, 150);
        }, 250);
    };

    // Back nav triggers
    const handleBack = () => {
        // Always clear any stuck transition lock before navigating back
        isTransitioningRef.current = false;

        if (currentCustomScreen === "payment") {
            const isDirect = localStorage.getItem('gyanschool_checkout_course_idx') !== null;
            if (isDirect) {
                localStorage.removeItem('gyanschool_checkout_course_idx');
                onClose();
            } else {
                setSearchParams({ step: "checkout" });
            }
        } else if (currentCustomScreen === "checkout") {
            const isDirect = localStorage.getItem('gyanschool_checkout_course_idx') !== null;
            if (isDirect) {
                localStorage.removeItem('gyanschool_checkout_course_idx');
                localStorage.removeItem('gyanschool_checkout_plan');
                onClose();
            } else {
                setSearchParams({ step: "pitch5" });
            }
        } else if (currentCustomScreen === "pitch5") {
            setSearchParams({ step: "pitch3" });
        } else if (currentCustomScreen === "pitch3") {
            setSearchParams({ step: "pitch2" });
        } else if (currentCustomScreen === "pitch2") {
            setSearchParams({ step: "pitch1" });
        } else if (currentCustomScreen === "pitch1") {
            setSearchParams({ step: "lead" });
        } else if (currentCustomScreen === "lead" || currentCustomScreen === "loader") {
            setSearchParams({ step: quizQuestions.length.toString() });
        } else {
            if (currentStep > 0) {
                setSearchParams({ step: currentStep.toString() });
            } else {
                onClose();
            }
        }
    };

    const currentQuestion = quizQuestions[currentStep];

    // Next navigation in header logic
    const showHeaderNext = currentCustomScreen === "" && currentQuestion && currentQuestion.type !== "split";
    let isHeaderNextDisabled = false;
    let nextButtonText = "NEXT";

    if (currentQuestion) {
        if (currentQuestion.type === "choice") {
            isHeaderNextDisabled = !userAnswers[currentQuestion.id];
            nextButtonText = currentQuestion.buttonText || "NEXT";
        } else if (currentQuestion.type === "multichoice") {
            isHeaderNextDisabled = !(userAnswers[currentQuestion.id] || []).length;
            nextButtonText = currentQuestion.buttonText || "NEXT";
        } else if (currentQuestion.type === "text_slide") {
            isHeaderNextDisabled = false;
            nextButtonText = currentQuestion.buttonText || "CONTINUE";
        }
    }

    const handleHeaderNext = () => {
        if (!currentQuestion) return;
        if (currentQuestion.type === "text_slide") {
            goNext();
        } else if (currentQuestion.type === "choice") {
            if (userAnswers[currentQuestion.id]) {
                if (currentStep < quizQuestions.length - 1) {
                    setSearchParams({ step: (currentStep + 2).toString() });
                } else {
                    setSearchParams({ step: "loader" });
                }
            }
        } else if (currentQuestion.type === "multichoice") {
            if ((userAnswers[currentQuestion.id] || []).length > 0) {
                handleChoiceSelect(currentQuestion.id, userAnswers[currentQuestion.id]);
            }
        }
    };

    return (
        <div id="quiz-container" className={!(currentStep === 0 && currentCustomScreen === "") ? "plain-white-bg" : ""} style={{ display: 'flex', opacity: 1 }}>
            {/* Header */}
            {currentCustomScreen === "payment" || currentCustomScreen === "success" ? null : (
                <div className="quiz-header" style={{ display: 'block' }}>
                    <div className="quiz-header-nav">
                        <div className="quiz-nav-controls" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button className="quiz-back-btn" onClick={handleBack} aria-label="Go Back" style={{ display: 'flex' }}>
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                            {showHeaderNext && (
                                <button
                                    className="quiz-next-header-btn"
                                    onClick={handleHeaderNext}
                                    disabled={isHeaderNextDisabled}
                                    aria-label="Go Forward"
                                    style={{ display: 'inline-flex' }}
                                >
                                    <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            )}
                        </div>
                        <div className="quiz-logo">
                            <i className="fa-solid fa-graduation-cap"></i> GyanSchool <span className="quiz-logo-sub">by CapOasis</span>
                        </div>
                        {currentCustomScreen === "" && (
                            <div className="quiz-step-counter">{currentStep + 1} / {quizQuestions.length}</div>
                        )}
                        {currentCustomScreen === "checkout" && (
                            <div className="quiz-step-counter checkout-countdown-counter" style={{ display: 'block' }}>
                                <i className="fa-solid fa-clock"></i> <span>Discount expires in </span>
                                <strong id="header-timer">
                                    {Math.floor(secondsLeft / 60).toString().padStart(2, "0")}:{(secondsLeft % 60).toString().padStart(2, "0")}
                                </strong>
                            </div>
                        )}
                    </div>
                    {currentCustomScreen === "" && (
                        <div className="quiz-progress-wrapper" style={{ display: 'block' }}>
                            <div className="quiz-progress-bar-fill" style={{ width: `${((currentStep + 1) / quizQuestions.length) * 100}%` }}></div>
                        </div>
                    )}
                </div>
            )}

            {/* Body */}
            <div className="quiz-body-container" style={{ overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <div
                    className={`quiz-body ${currentCustomScreen === "checkout" ? "results-mode" : ""}`}
                    style={currentCustomScreen === "checkout" ? { maxWidth: 'none', width: '100%', boxSizing: 'border-box' } : {}}
                >

                    {/* 1. Onboarding Questions */}
                    {currentCustomScreen === "" && (
                        <>
                            {currentQuestion.type === "split" && (
                                <div className="split-slide">
                                    <div className="split-content">
                                        {currentQuestion.badge && (
                                            <span className="split-social-badge"><i className="fa-solid fa-star"></i> {currentQuestion.badge}</span>
                                        )}
                                        <h2 className="split-title">{currentQuestion.title}</h2>
                                        <p className="split-subtitle">{currentQuestion.subtitle}</p>
                                        <button className="split-continue-btn" onClick={goNext}>
                                            {currentQuestion.buttonText || "CONTINUE"} <i className="fa-solid fa-arrow-right"></i>
                                        </button>
                                    </div>
                                    <div className="split-image-wrapper">
                                        <img src={currentQuestion.image} alt={currentQuestion.title} className="split-image" />
                                        {currentQuestion.imageLabel && <div className="split-image-label">{currentQuestion.imageLabel}</div>}
                                    </div>
                                </div>
                            )}

                            {currentQuestion.type === "text_slide" && (
                                <div className="text-slide">
                                    <div className="text-slide-quote-icon">
                                        <i className={currentQuestion.quoteIcon || "fa-solid fa-quote-left"}></i>
                                    </div>
                                    <h2 className="text-slide-title">{currentQuestion.title}</h2>
                                    <p className="text-slide-subtitle">{currentQuestion.subtitle}</p>
                                </div>
                            )}

                            {currentQuestion.type === "choice" && (
                                <div className="question-slide">
                                    <h2 className="question-title">{currentQuestion.title}</h2>
                                    <p className="question-subtitle">{currentQuestion.subtitle}</p>
                                    <div className="choices-container grid-choices">
                                        {currentQuestion.choices.map((choice, i) => {
                                            const isSelected = userAnswers[currentQuestion.id] === choice.value;
                                            return (
                                                <button
                                                    key={i}
                                                    className={`choice-card option-card-v2 ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => handleChoiceSelect(currentQuestion.id, choice.value)}
                                                >
                                                    <div className="choice-card-content">
                                                        {choice.icon && <i className={`${choice.icon} option-icon`}></i>}
                                                        <span className="choice-text">{choice.text}</span>
                                                    </div>
                                                    <div className="choice-indicator"></div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {currentQuestion.type === "multichoice" && (
                                <div className="question-slide">
                                    <h2 className="question-title">{currentQuestion.title}</h2>
                                    <p className="question-subtitle">{currentQuestion.subtitle}</p>
                                    <div className="choices-container grid-choices">
                                        {currentQuestion.choices.map((choice, i) => {
                                            const isSel = (userAnswers[currentQuestion.id] || []).includes(choice.value);
                                            return (
                                                <button
                                                    key={i}
                                                    className={`choice-card multi option-card-v2 ${isSel ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        const currentSel = userAnswers[currentQuestion.id] || [];
                                                        const nextSel = currentSel.includes(choice.value)
                                                            ? currentSel.filter(x => x !== choice.value)
                                                            : [...currentSel, choice.value];
                                                        setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: nextSel }));
                                                    }}
                                                >
                                                    <div className="choice-card-content">
                                                        {choice.icon && <i className={`${choice.icon} option-icon`}></i>}
                                                        <span className="choice-text">{choice.text}</span>
                                                    </div>
                                                    <div className="choice-indicator"></div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* 2. Loader Slide */}
                    {currentCustomScreen === "loader" && (
                        <div className="loader-slide">
                            <div className="loader-progress-container">
                                <div className="loader-circle-wrapper">
                                    <svg className="loader-svg" viewBox="0 0 100 100">
                                        <circle className="loader-svg-bg" cx="50" cy="50" r="45"></circle>
                                        <circle className="loader-svg-fill" cx="50" cy="50" r="45" style={{ strokeDashoffset: 283 - (283 * progress) / 100 }}></circle>
                                    </svg>
                                    <div className="loader-percent" id="loader-count">{progress}%</div>
                                </div>
                            </div>
                            <h2 className="loader-title">
                                {progress < 30 && "Analyzing responses..."}
                                {progress >= 30 && progress < 70 && "Generating custom roadmap..."}
                                {progress >= 70 && "Finalizing your Personal AI Challenge..."}
                            </h2>

                            <div className="loader-trustpilot" id="loader-review-box">
                                <div className="loader-stars">
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                </div>
                                <div className="loader-review-title">
                                    {progress < 50 ? "Outstanding platform" : "The experience is topnotch"}
                                </div>
                                <p className="loader-review-text">
                                    {progress < 50
                                        ? `"I am very happy it is so easy to learn with GyanSchool. Often, I feel lost and feel I have a pool of great AI apps and I'm not sure how to line them up to create wonderful things. Now, I feel, I'm on my way."`
                                        : `"Excellent service, clear communication, and a real commitment to quality made my experience outstanding. They create a seamless, positive journey where customers feel valued - rare and truly appreciated."`
                                    }
                                </p>
                                <div className="loader-review-author">{progress < 50 ? "Tina" : "Jeremy"}</div>
                            </div>
                        </div>
                    )}

                    {/* 3. Lead Capture Form */}
                    {currentCustomScreen === "lead" && (
                        <div className="lead-slide">
                            <h2 className="lead-title">Enter your details to get your Personal AI Challenge!</h2>
                            <p className="lead-subtitle">Make sure your details are valid — don't miss your BONUS!</p>

                             <div className="lead-input-wrapper">
                                <input type="text" className="lead-input" placeholder="Your name" value={nameInput} onChange={(e) => setNameInput(e.target.value)} required />
                            </div>
                            <div className="lead-input-wrapper">
                                <input type="email" className="lead-input" placeholder="Your email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required />
                            </div>

                            <p className="lead-privacy">
                                <i className="fa-solid fa-shield-halved"></i> We respect your privacy and are committed to protecting your personal data. Your data will be processed in accordance with our Privacy Policy.
                            </p>

                            <button className="split-continue-btn" onClick={handleLeadSubmit} disabled={leadSubmitting} style={{ width: '100%' }}>
                                {leadSubmitting ? <>SUBMITTING <i className="fa-solid fa-spinner fa-spin"></i></> : <>CONTINUE <i className="fa-solid fa-arrow-right"></i></>}
                            </button>
                        </div>
                    )}

                    {/* 4. Pitch 1: Transformation - Before / After */}
                    {currentCustomScreen === "pitch1" && (() => {
                        const statusLabels = {
                            executive: "White Collar Executive",
                            marketing: "Marketer / Content Creator",
                            sales: "Sales Professional",
                            operations: "Operations Manager",
                            graduate: "MBA Graduate",
                            freelancer: "Entrepreneur / Freelancer",
                            teacher: "Teacher / Educator"
                        };
                        const goalLabels = {
                            automation: "Automate Workflows",
                            creative: "Create AI Graphics & Ads",
                            outreach: "Scale B2B Outreach",
                            appmaking: "Build Apps Without Code",
                            career: "Land a High-Paying Role",
                            productivity: "Boost Productivity"
                        };
                        const comfortable = userAnswers.comfortable || "beginner";
                        const goal = userAnswers.goal || "productivity";
                        const status = userAnswers.status || "executive";

                        const beforeMap = {
                            beginner: [
                                "Overwhelmed by AI tools, don't know where to start",
                                "Spending 3× more time on tasks that AI could handle in seconds",
                                "Watching others advance while staying stuck with manual work",
                                "Zero confidence using AI in a professional setting"
                            ],
                            intermediate: [
                                "Only using ChatGPT for basic Q&A — barely scratching the surface",
                                "No structured strategy for applying AI to your actual work",
                                "Missing out on 15+ powerful AI tools beyond ChatGPT",
                                "Not sure how to turn AI knowledge into real career advantage"
                            ],
                            advanced: [
                                "Using AI tools but no unified workflow connecting them all",
                                "Struggling to scale output without sacrificing quality",
                                "Missing niche tools that could save hours every week",
                                "No certificate or credential to prove your AI expertise"
                            ]
                        };
                        const afterMap = {
                            automation: [
                                "Automate repetitive tasks using Zapier + AI in under 1 hour",
                                "Build no-code workflows that run 24/7 without your involvement",
                                "Reclaim 10+ hours every week for high-impact strategic work",
                                "Lead your team with AI-powered systems that scale effortlessly"
                            ],
                            creative: [
                                "Create scroll-stopping graphics & ads with Canva AI and Midjourney",
                                "Generate professional video content using Heygen avatars",
                                "Produce branded audio in minutes using ElevenLabs",
                                "Deliver agency-level creative output at a fraction of the cost"
                            ],
                            outreach: [
                                "Build ultra-targeted B2B prospect lists with Apollo AI",
                                "Send personalised cold outreach campaigns that actually convert",
                                "Automate follow-up sequences with Zapier + Instantly",
                                "Fill your pipeline on autopilot while you focus on closing"
                            ],
                            appmaking: [
                                "Launch a fully functional web app in 48 hours — zero code",
                                "Turn your ideas into products using Lovable and Bolt.new",
                                "Connect APIs and automate backend logic without any engineering",
                                "Go from idea to prototype to launch, all independently"
                            ],
                            career: [
                                "Land interviews faster with an ATS-optimised AI resume",
                                "Craft compelling cover letters tailored to every job in minutes",
                                "Walk into interviews with AI-researched preparation that impresses",
                                "Stand out from 90% of applicants who still don't use AI"
                            ],
                            productivity: [
                                "Compress hours of work into focused 15-minute AI-powered sessions",
                                "Organise, prioritise and execute your entire day with AI",
                                "Use NotebookLM to absorb information 3× faster",
                                "Become the most productive person in any room you walk into"
                            ]
                        };

                        const beforeItems = beforeMap[comfortable] || beforeMap.beginner;
                        const afterItems = afterMap[goal] || afterMap.productivity;
                        const roleLabel = statusLabels[status] || "Professional";
                        const goalLabel = goalLabels[goal] || "Boost Productivity";

                        return (
                            <div className="pitch-transform-slide">
                                <div className="pitch-transform-header">
                                    <h2 className="pitch-transform-title">Where you are — and where you're going</h2>
                                    <p className="pitch-transform-subtitle">Based on your answers, here's your personalized transformation roadmap</p>
                                </div>

                                <div className="pitch-transform-cards">
                                    {/* Before Card */}
                                    <div className="transform-card transform-before-card">
                                        <div className="transform-card-header">
                                            <div className="transform-card-icon transform-icon-before">
                                                <i className="fa-solid fa-circle-xmark"></i>
                                            </div>
                                            <div>
                                                <div className="transform-card-eyebrow">RIGHT NOW</div>
                                                <div className="transform-card-title-text">Where You Are</div>
                                            </div>
                                        </div>
                                        <ul className="transform-bullet-list">
                                            {beforeItems.map((item, idx) => (
                                                <li key={idx} className="transform-bullet-item transform-bullet-before">
                                                    <i className="fa-solid fa-xmark"></i>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Arrow divider */}
                                    <div className="transform-arrow-divider">
                                        <div className="transform-arrow-line"></div>
                                        <div className="transform-arrow-circle">
                                            <i className="fa-solid fa-arrow-right"></i>
                                        </div>
                                        <div className="transform-arrow-line"></div>
                                    </div>

                                    {/* After Card */}
                                    <div className="transform-card transform-after-card">
                                        <div className="transform-card-header">
                                            <div className="transform-card-icon transform-icon-after">
                                                <i className="fa-solid fa-circle-check"></i>
                                            </div>
                                            <div>
                                                <div className="transform-card-eyebrow">AFTER GYANSCHOOL</div>
                                                <div className="transform-card-title-text">Where You'll Be</div>
                                            </div>
                                        </div>
                                        <ul className="transform-bullet-list">
                                            {afterItems.map((item, idx) => (
                                                <li key={idx} className="transform-bullet-item transform-bullet-after">
                                                    <i className="fa-solid fa-check"></i>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Personalization strip */}
                                <div className="transform-personalization-strip">
                                    <i className="fa-solid fa-user-check"></i>
                                    <span>Personalized for <strong>{roleLabel}</strong> · Goal: <strong>{goalLabel}</strong></span>
                                </div>

                                <button className="next-step-btn" style={{ width: '100%', marginTop: '1.25rem' }} onClick={() => setSearchParams({ step: "pitch2" })}>
                                    SEE MY ROADMAP <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        );
                    })()}

                    {/* 5. Pitch 2: struggles comparison */}
                    {currentCustomScreen === "pitch2" && (
                        <div className="pitch-summary-slide" style={{ maxWidth: '650px' }}>
                            <h2 className="pitch-title" style={{ fontSize: '2rem' }}>Your Personal 28-Day AI Challenge</h2>
                            <p className="pitch-subtitle" style={{ marginBottom: '1.5rem' }}>We expect you to Master AI skills by <strong>{new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</strong></p>

                            <div className="pitch-scrollable-content">
                                <table className="struggles-table">
                                    <thead>
                                        <tr>
                                            <th style={{ color: '#ef4444', borderBottom: '2px solid #fee2e2' }}>Struggles:</th>
                                            <th style={{ color: '#10b981', borderBottom: '2px solid #d1fae5' }}>Solutions with GyanSchool:</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="struggles-col"><i className="fa-solid fa-circle-xmark table-icon"></i> Unclear where to start</td>
                                            <td className="solutions-col"><i className="fa-solid fa-circle-check table-icon"></i> Personal roadmap</td>
                                        </tr>
                                        <tr>
                                            <td className="struggles-col"><i className="fa-solid fa-circle-xmark table-icon"></i> No structured learning</td>
                                            <td className="solutions-col"><i className="fa-solid fa-circle-check table-icon"></i> Structured learning</td>
                                        </tr>
                                        <tr>
                                            <td className="struggles-col"><i className="fa-solid fa-circle-xmark table-icon"></i> Low trust in AI tools</td>
                                            <td className="solutions-col"><i className="fa-solid fa-circle-check table-icon"></i> Reliable results from AI</td>
                                        </tr>
                                        <tr>
                                            <td className="struggles-col"><i className="fa-solid fa-circle-xmark table-icon"></i> Limited by few generic tools</td>
                                            <td className="solutions-col"><i className="fa-solid fa-circle-check table-icon"></i> Unlock top tools for every task</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <button className="next-step-btn" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => setSearchParams({ step: "pitch3" })}>
                                CONTINUE <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    )}

                    {/* 6. Pitch 3: Ease bullets */}
                    {currentCustomScreen === "pitch3" && (
                        <div className="pitch-summary-slide" style={{ maxWidth: '600px' }}>
                            <h2 className="pitch-title" style={{ fontSize: '2.1rem' }}>AI is Easier Than You Think</h2>
                            <p className="pitch-subtitle" style={{ marginBottom: '1.5rem' }}>Our challenge is designed to make a difference in your AI Knowledge from day one</p>

                            <div className="pitch-scrollable-content">
                                <div className="stats-checklist-grid">
                                    <div className="checklist-stat-card">
                                        <span className="checklist-icon-wrapper"><i className="fa-solid fa-check"></i></span>
                                        <span className="checklist-text">No prior AI knowledge is required</span>
                                    </div>
                                    <div className="checklist-stat-card">
                                        <span className="checklist-icon-wrapper"><i className="fa-solid fa-check"></i></span>
                                        <span className="checklist-text">No need for a university degree</span>
                                    </div>
                                    <div className="checklist-stat-card">
                                        <span className="checklist-icon-wrapper"><i className="fa-solid fa-check"></i></span>
                                        <span className="checklist-text">Work at your own pace and terms</span>
                                    </div>
                                </div>

                                <p style={{ textAlign: 'left', fontWeight: 700, color: 'var(--secondary-color)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Try GyanSchool and you will:</p>
                                <ul className="pitch-bullets-list">
                                    <li className="pitch-bullet-item"><i className="fa-solid fa-check"></i> Master AI tools that can boost your income</li>
                                    <li className="pitch-bullet-item"><i className="fa-solid fa-check"></i> Access the world's top AI tools: ChatGPT, Gemini, Claude and more — all in one place</li>
                                    <li className="pitch-bullet-item"><i className="fa-solid fa-check"></i> Get certified in AI and stand out from 90% of people who still don't get it</li>
                                    <li className="pitch-bullet-item"><i className="fa-solid fa-check"></i> Progress tracking to see your growth and build confidence with each lesson</li>
                                </ul>
                            </div>

                            <button className="next-step-btn" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => setSearchParams({ step: "pitch5" })}>
                                CONTINUE <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    )}

                    {/* 7. Pitch 5: Spin wheel */}
                    {currentCustomScreen === "pitch5" && (
                        <div className="pitch-summary-slide" style={{ maxWidth: '500px' }}>
                            {!showClaimModal ? (
                                <>
                                    <h2 className="pitch-title" style={{ fontSize: '2rem' }}>Spin & Unlock Your Personal AI Challenge!</h2>
                                    <p className="pitch-subtitle">Don't miss your chance to master AI with a personalized offer</p>

                                    <div className="wheel-container-outer">
                                        <div className="wheel-pointer" ref={wheelPointerRef} style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', width: '24px', height: '36px', background: '#f59e0b', clipPath: 'polygon(50% 100%, 0 0, 100% 0)', zIndex: 10, transformOrigin: '50% 0%', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }}></div>
                                        <div className="wheel-graphic" style={{ width: '100%', height: '100%' }}>
                                            <svg ref={wheelSvgRef} viewBox="0 0 300 300" style={{ width: '100%', height: '100%', transform: `rotate(${spinState.rotatedDeg}deg)` }}>
                                                <circle cx="150" cy="150" r="148" fill="#111827" stroke="#ffffff" strokeWidth="4" />
                                                {[
                                                    "10% off", "20% off", "15% off", "30% off", "50% off", "45% off", "5% off", "Free Gift"
                                                ].map((label, i) => {
                                                    const angle = i * 45;
                                                    const radStart = (angle - 90) * Math.PI / 180;
                                                    const radEnd = (angle + 45 - 90) * Math.PI / 180;
                                                    const x1 = 150 + 145 * Math.cos(radStart);
                                                    const y1 = 150 + 145 * Math.sin(radStart);
                                                    const x2 = 150 + 145 * Math.cos(radEnd);
                                                    const y2 = 150 + 145 * Math.sin(radEnd);
                                                    const colors = ["#5048E5", "#818CF8", "#4F46E5", "#6366F1", "#4338CA", "#3730A3", "#312E81", "#4F46E5"];
                                                    return (
                                                        <g key={i}>
                                                            <path d={`M 150 150 L ${x1} ${y1} A 145 145 0 0 1 ${x2} ${y2} Z`} fill={colors[i]} stroke="#ffffff" strokeWidth="2" />
                                                            <text x="150" y="150" transform={`rotate(${angle + 22.5} 150 150) translate(0, -90)`} textAnchor="middle" fill="#ffffff" fontWeight="800" fontSize="12" fontFamily="'Outfit', sans-serif">
                                                                {label}
                                                            </text>
                                                        </g>
                                                    );
                                                })}
                                                <circle cx="150" cy="150" r="25" fill="#ffffff" stroke="#111827" strokeWidth="3" />
                                            </svg>
                                        </div>
                                        <button className="wheel-spin-btn" onClick={handleSpin} disabled={spinState.disabled} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 5, width: '80px', height: '80px', fontSize: '1.1rem' }}>SPIN</button>
                                    </div>
                                </>
                            ) : (
                                <div className="wheel-claim-inline-container" style={{ textAlign: 'center', padding: '0', background: 'transparent', width: '100%' }}>
                                    <span className="wheel-popup-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '6px 16px', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '700', marginBottom: '1.5rem' }}>
                                        <i className="fa-solid fa-gift"></i> Winner!
                                    </span>
                                    <h2 className="pitch-title" style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: '#110c22' }}>Woohoo! 🎉</h2>
                                    <p className="pitch-subtitle" style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '2rem' }}>
                                        {userName}, you won a discount!
                                    </p>

                                    <div className="wheel-popup-discount" style={{ fontSize: '4.5rem', fontWeight: '900', color: '#6a31f0', margin: '1.5rem 0', letterSpacing: '-2px', textShadow: '0 4px 12px rgba(106, 49, 240, 0.15)' }}>
                                        50% off
                                    </div>

                                    <p style={{ color: '#4b5563', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                                        It will be applied automatically to your challenge details.
                                    </p>

                                    <button className="split-continue-btn" onClick={() => { setSearchParams({ step: "checkout" }); }} style={{ width: '100%' }}>
                                        CLAIM MY DISCOUNT <i className="fa-solid fa-arrow-right"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 9. Checkout Dashboard */}
                    {currentCustomScreen === "checkout" && (
                        <div className="results-dashboard-v3" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '40px 24px', boxSizing: 'border-box' }}>
                            <div className="checkout-top-container" style={{ width: '100%', textAlign: 'center', marginBottom: '48px' }}>
                                <h1 className="checkout-main-headline" style={{ textAlign: 'center', margin: '0 auto 3rem auto', fontSize: '1.8rem', fontWeight: '700', color: 'var(--text-h)' }}>
                                    {localStorage.getItem('gyanschool_checkout_course_idx') !== null
                                        ? `Complete Your Enrollment in ${recommendedCourse?.title || 'this Course'}`
                                        : 'Your Personalized AI Certificate Program is Ready!'
                                    }
                                </h1>

                                <div className="checkout-two-columns-layout" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '32px',
                                    width: '100%',
                                    justifyContent: 'center',
                                    boxSizing: 'border-box',
                                    textAlign: 'left'
                                }}>
                                    {/* Center Column: Plans and Buttons (Payment options) */}
                                    <div className="checkout-column-left" style={{ flex: '0 1 520px', maxWidth: '520px', width: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <h2 className="checkout-grid-section-title" style={{ marginTop: '0', textAlign: 'left', fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-h)', marginBottom: '20px' }}>Choose your plan</h2>

                                        <div className="checkout-plans-grid-row" style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', width: '100%' }}>
                                            <div className={`checkout-plan-selector-card ${selectedPlan === "1-week" ? "selected" : ""}`} onClick={() => { setSelectedPlan("1-week"); localStorage.setItem('gyanschool_checkout_plan', '1-week'); }} style={{ flex: '1 1 150px', borderRadius: '4px' }}>
                                                <div className="checkout-plan-selector-name-box" style={{ fontSize: '0.85rem' }}>
                                                    1-WEEK PLAN
                                                </div>
                                                <div className="checkout-plan-selector-price-block">
                                                    <span className="checkout-plan-selector-new-price">₹599</span>
                                                    <span className="checkout-plan-selector-old-price">₹1198</span>
                                                </div>
                                            </div>
                                            <div className={`checkout-plan-selector-card ${selectedPlan === "1-month" ? "selected" : ""}`} onClick={() => { setSelectedPlan("1-month"); localStorage.setItem('gyanschool_checkout_plan', '1-month'); }} style={{ flex: '1 1 180px', borderRadius: '4px' }}>
                                                <div className="checkout-plan-selector-name-box" style={{ fontSize: '0.85rem' }}>
                                                    1 Month Plan
                                                </div>
                                                <div className="checkout-plan-selector-price-block">
                                                    <span className="checkout-plan-selector-new-price">₹1099</span>
                                                    <span className="checkout-plan-selector-old-price">₹2198</span>
                                                </div>
                                            </div>
                                            <div className={`checkout-plan-selector-card ${selectedPlan === "3-month" ? "selected" : ""}`} onClick={() => { setSelectedPlan("3-month"); localStorage.setItem('gyanschool_checkout_plan', '3-month'); }} style={{ flex: '1 1 150px', borderRadius: '4px' }}>
                                                <div className="checkout-plan-selector-name-box" style={{ fontSize: '0.85rem' }}>
                                                    3 Month Plan
                                                </div>
                                                <div className="checkout-plan-selector-price-block">
                                                    <span className="checkout-plan-selector-new-price">₹2999</span>
                                                    <span className="checkout-plan-selector-old-price">₹5998</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="checkout-results-achieve-box" style={{ width: '100%', boxSizing: 'border-box', marginBottom: '16px', borderRadius: '4px', border: '1px solid var(--border)', background: 'transparent' }}>
                                            <p className="checkout-results-achieve-text" style={{ color: 'var(--text)' }}>
                                                * People using plan for <strong>3 months</strong> achieve twice as many results as for <strong>1 month</strong>
                                                <br />
                                                <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>According to research by GyanSchool, 2026</span>
                                            </p>

                                        </div>


                                        <div className="checkout-legal-disclaimer" style={{ fontSize: '0.78rem', lineHeight: '1.5', color: 'var(--text)', marginBottom: '24px', opacity: 0.8 }}>
                                            By clicking Get My Plan, you agree to pay <strong>₹{selectedPlan === "1-week" ? "599" : selectedPlan === "3-month" ? "2,999" : "1,099"}</strong> (excl. taxes) for your introductory <strong>{selectedPlan === "1-week" ? "week" : selectedPlan === "3-month" ? "3 months" : "month"}</strong>. Unless cancelled before it ends, your subscription will automatically renew at <strong>₹{selectedPlan === "1-week" ? "1,198/week" : selectedPlan === "3-month" ? "5,998 every 3 months" : "2,198/month"}</strong> (excl. taxes) until cancelled.
                                        </div>

                                        {/* Guest email capture — shown when buying directly from homepage (skips lead-slide) */}
                                        {!user && (
                                            <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                <p style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-h)', margin: '0 0 4px' }}>
                                                    <i className="fa-solid fa-envelope" style={{ marginRight: '6px' }}></i>Where should we send your login link?
                                                </p>
                                                <input
                                                    type="text"
                                                    placeholder="Your name"
                                                    value={nameInput}
                                                    onChange={(e) => { setNameInput(e.target.value); setUserName(e.target.value); }}
                                                    style={{
                                                        width: '100%', boxSizing: 'border-box',
                                                        padding: '12px 16px', borderRadius: '4px',
                                                        border: '1px solid var(--border)', fontSize: '0.9rem',
                                                        outline: 'none', background: 'var(--bg)',
                                                        color: 'var(--text)'
                                                    }}
                                                />
                                                <input
                                                    type="email"
                                                    placeholder="Your email address"
                                                    value={emailInput}
                                                    onChange={(e) => { setEmailInput(e.target.value); setUserEmail(e.target.value); }}
                                                    style={{
                                                        width: '100%', boxSizing: 'border-box',
                                                        padding: '12px 16px', borderRadius: '4px',
                                                        border: '1px solid var(--border)', fontSize: '0.9rem',
                                                        outline: 'none', background: 'var(--bg)',
                                                        color: 'var(--text)'
                                                    }}
                                                />
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text)', opacity: 0.6, margin: 0 }}>
                                                    <i className="fa-solid fa-shield-halved" style={{ marginRight: '4px' }}></i>Your login link will be emailed here after purchase.
                                                </p>
                                            </div>
                                        )}

                                        {/* Promo Code section */}
                                        <div style={{ marginBottom: '20px', border: '1px solid var(--border)', borderRadius: '4px', padding: '16px', backgroundColor: 'var(--code-bg)' }}>
                                            <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-h)', margin: '0 0 8px 0' }}>
                                                <i className="fa-solid fa-tag" style={{ marginRight: '6px', color: 'var(--accent)' }}></i>Have a Collaborator Promo Code?
                                            </p>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <input
                                                    type="text"
                                                    value={promoInput}
                                                    onChange={(e) => setPromoInput(e.target.value)}
                                                    placeholder="e.g. INFLUENCER10"
                                                    disabled={appliedInfluencer !== null}
                                                    style={{
                                                        flex: 1,
                                                        padding: '10px',
                                                        borderRadius: '4px',
                                                        border: '1px solid var(--border)',
                                                        fontSize: '0.85rem',
                                                        outline: 'none',
                                                        background: 'var(--bg)',
                                                        color: 'var(--text-h)',
                                                        textTransform: 'uppercase'
                                                    }}
                                                />
                                                {appliedInfluencer ? (
                                                    <button
                                                        onClick={() => {
                                                            setAppliedInfluencer(null);
                                                            setPromoInput('');
                                                            setPromoSuccess('');
                                                        }}
                                                        style={{
                                                            padding: '8px 16px',
                                                            borderRadius: '4px',
                                                            border: '1px solid #ef4444',
                                                            background: '#fee2e2',
                                                            color: '#dc2626',
                                                            fontSize: '0.85rem',
                                                            cursor: 'pointer',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={handleApplyPromoCode}
                                                        style={{
                                                            padding: '8px 16px',
                                                            borderRadius: '4px',
                                                            border: 'none',
                                                            background: 'var(--accent)',
                                                            color: '#fff',
                                                            fontSize: '0.85rem',
                                                            cursor: 'pointer',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        Apply
                                                    </button>
                                                )}
                                            </div>
                                            {promoError && <p style={{ fontSize: '0.8rem', color: '#ef4444', margin: '6px 0 0 0' }}>{promoError}</p>}
                                            {promoSuccess && <p style={{ fontSize: '0.8rem', color: '#10b981', margin: '6px 0 0 0', fontWeight: '600' }}>{promoSuccess}</p>}
                                        </div>

                                        <button className="checkout-main-submit-btn" onClick={handleRazorpayPayment} disabled={paymentProcessing || (!user && !emailInput.trim())}>
                                            {paymentProcessing ? "PROCESSING..." : "GET MY PLAN"}
                                        </button>

                                        {/* FUTURE ENABLE: Uncomment the block below to re-enable Test Checkout Bypass (₹0 Bypass)
                                        <button
                                            className="checkout-main-submit-btn"
                                            onClick={async () => {
                                                setPaymentProcessing(true);
                                                setTimeout(async () => {
                                                    setPaymentProcessing(false);
                                                    await handlePaymentSuccess();
                                                }, 800);
                                            }}
                                            disabled={paymentProcessing}
                                            style={{ marginTop: '12px', background: 'transparent', border: '1px solid #110c22', color: '#110c22', width: '100%' }}
                                        >
                                            {paymentProcessing ? (
                                                <>PROCESSING <i className="fa-solid fa-spinner fa-spin"></i></>
                                            ) : (
                                                <><i className="fa-solid fa-vial"></i> TEST CHECKOUT (₹0 BYPASS)</>
                                            )}
                                        </button>
                                        */}



                                        <div className="checkout-office-footnote" style={{ opacity: 0.5 }}>
                                            GyanSchool
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 11. Success Screen — Auto-Generated Credentials display */}
                    {currentCustomScreen === "success" && (
                        <div className="course-checkout-page" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '48px 32px', borderRadius: '24px', background: '#131f24', color: '#ffffff', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <div style={{ fontSize: '4.5rem', color: '#10b981', marginBottom: '24px', filter: 'drop-shadow(0 4px 12px rgba(16,185,129,0.25))' }}>
                                <i className="fa-solid fa-circle-check"></i>
                            </div>
                            <div style={{ fontSize: '2.2rem', margin: '0 0 12px', color: '#ffffff', fontWeight: '800', fontFamily: 'system-ui, sans-serif', letterSpacing: '-0.5px' }}>Payment Successful!</div>
                            <p style={{ color: '#9ca3af', marginBottom: '36px', fontSize: '1.1rem', lineHeight: '1.5' }}>Welcome to GyanSchool. Your course access has been unlocked.</p>

                            {createdAccount ? (
                                <div style={{ background: '#1c2d35', border: '1px solid #2d434f', borderRadius: '16px', padding: '24px', margin: '0 auto 30px', textAlign: 'left', lineHeight: '1.6' }}>
                                    <h3 style={{ margin: '0 0 12px 0', fontSize: '1.15rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="fa-solid fa-envelope-open-text"></i> Welcome Email Sent!
                                    </h3>
                                    <p style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#e5e7eb' }}>
                                        We have created your GyanSchool account and sent a login link to:
                                    </p>
                                    <div style={{ background: '#0e1619', padding: '10px 16px', borderRadius: '8px', border: '1px solid #2d434f', display: 'inline-block', fontWeight: 'bold', color: '#10b981', fontSize: '1rem', marginBottom: '12px' }}>
                                        {createdAccount.realEmail}
                                    </div>
                                    {createdAccount.password && (
                                        <div style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: '#e5e7eb' }}>
                                            Your temporary password is: <strong style={{ color: '#38bdf8', fontFamily: 'monospace', background: '#0e1619', padding: '2px 6px', borderRadius: '4px' }}>{createdAccount.password}</strong>
                                        </div>
                                    )}
                                    <p style={{ margin: '0', fontSize: '0.85rem', color: '#9ca3af' }}>
                                        Please check your inbox (and spam folder) for the secure login link. Click the link in the email to log in and start your courses!
                                    </p>
                                </div>
                            ) : null}

                            {authError && (
                                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '16px', marginBottom: '24px', color: '#fca5a5', fontSize: '0.95rem' }}>
                                    <i className="fa-solid fa-circle-info" style={{ marginRight: '8px' }}></i> {authError}
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button
                                    onClick={() => {
                                        onClose();
                                        navigate('/learn');
                                    }}
                                    style={{ background: '#aa3bff', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}
                                    onMouseOver={(e) => e.target.style.background = '#8b2ee6'}
                                    onMouseOut={(e) => e.target.style.background = '#aa3bff'}
                                >
                                    Start Learning Now <i className="fa-solid fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* All Courses Popup */}
                    {showAllCourses && (
                        <div className="all-courses-overlay" onClick={() => setShowAllCourses(false)}>
                            <div className="all-courses-modal" onClick={(e) => e.stopPropagation()}>
                                <div className="all-courses-header">
                                    <h2>All Courses</h2>
                                    <button className="all-courses-close" onClick={() => setShowAllCourses(false)}>
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                </div>
                                <div className="all-courses-grid">
                                    {courses.map((course, index) => {
                                        const isSelected = selectedExtraCourses.includes(index);
                                        return (
                                            <div key={index} className={`all-course-card ${isSelected ? 'selected' : ''}`}>
                                                <div className="all-course-img">
                                                    <img src={course.image} alt={course.title} />
                                                </div>
                                                <div className="all-course-info">
                                                    <div className="all-course-details-main">
                                                        <div className="all-course-card-top">
                                                            <span className="all-course-badge">{course.badge}</span>
                                                        </div>
                                                        <h3>{course.title}</h3>
                                                    </div>
                                                    <div className="all-course-actions">
                                                        <button
                                                            className={`all-course-add-btn ${isSelected ? 'added' : ''}`}
                                                            onClick={() => {
                                                                setSelectedExtraCourses(prev =>
                                                                    prev.includes(index)
                                                                        ? prev.filter(i => i !== index)
                                                                        : [...prev, index]
                                                                );
                                                            }}
                                                        >
                                                            {isSelected ? <><i className="fa-solid fa-check"></i> Added</> : <><i className="fa-solid fa-plus"></i> Add</>}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Auth modal */}
            <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                onSuccess={() => { setSearchParams({ step: "payment" }); }}
                onStartQuiz={() => {
                    localStorage.removeItem('gyanschool_checkout_course_idx');
                    setSearchParams({ step: '1' });
                }}
                onExploreCourses={() => {
                    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
                }}
                authRedirectUrl={window.location.origin + window.location.pathname + '?step=payment'}
            />
        </div>
    );
}
