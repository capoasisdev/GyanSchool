import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Footer() {
    const [searchParams] = useSearchParams();
    const [showAndroidBanner, setShowAndroidBanner] = useState(false);

    useEffect(() => {
        const isAndroid = /Android/i.test(navigator.userAgent);
        const isMobile = window.innerWidth <= 768;
        const testOverride = searchParams.get('testAndroid') === 'true';
        const isDismissed = localStorage.getItem('android_banner_dismissed') === 'true';
        const isNative = !!window.Capacitor;
        
        if ((testOverride || (isAndroid && isMobile)) && !isDismissed && !isNative) {
            setShowAndroidBanner(true);
        }
    }, [searchParams]);

    return (
        <>
            {/* Minimal Android App Download Banner */}
            {showAndroidBanner && (
                <section className="android-minimal-banner section">
                    <div className="container">
                        <div className="android-minimal-banner-card">
                            <div className="android-minimal-banner-info">
                                <i className="fa-brands fa-android android-minimal-icon"></i>
                                <div className="android-minimal-text-wrapper">
                                    <span className="android-minimal-title">GyanSchool for Android</span>
                                    <p className="android-minimal-desc">Get the official app for a faster, native experience on the go.</p>
                                </div>
                            </div>
                            <div className="android-minimal-actions">
                                <a href="/gyanschool-app.apk" download className="android-minimal-download-btn">
                                    Download App
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Slogan Impact Section */}
            <section className="slogan-impact section reveal">
                <div className="container text-center">
                    <h2 className="slogan-text">"Empowering <span className="highlight-orange">minds</span>, transforming <span className="highlight-orange">careers</span>, and building the <span className="highlight-orange">future</span> of technology worldwide."</h2>
                </div>
            </section>

            {/* Footer */}
            <footer id="footer" className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-col brand-col">
                            <a href="#" className="logo footer-logo">
                                <i className="fa-solid fa-graduation-cap"></i> GyanSchool <span className="logo-sub">by CapOasis</span>
                            </a>
                            <p>Empowering the next generation of tech leaders with cutting-edge skills and practical knowledge. Your journey to excellence starts here.</p>
                            <div className="social-links">
                                <a href="https://www.facebook.com/share/19CUbVHGB4/"><i className="fa-brands fa-facebook-f"></i></a>
                                <a href="http://twitter.com/capoasistech"><i className="fa-brands fa-twitter"></i></a>
                                <a href="https://www.instagram.com/capoasis/"><i className="fa-brands fa-instagram"></i></a>
                                <a href="https://in.linkedin.com/company/capoasis-technology-pvt-ltd"><i className="fa-brands fa-linkedin-in"></i></a>
                                <a href="https://www.youtube.com/@capoasistech"><i className="fa-brands fa-youtube"></i></a>
                            </div>
                        </div>

                        <div className="footer-col">
                            <h3>Quick Links</h3>
                            <ul>
                                <li><a href="#">Home</a></li>
                                <li><a href="#about">About Us</a></li>
                                <li><a href="#courses">Program Curriculum</a></li>
                                <li><a href="#trainers">Leadership</a></li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h3>Support</h3>
                            <ul>
                                <li><a href="#faq">FAQ</a></li>
                                <li><a href="#">Terms of Service</a></li>
                                <li><a href="privacy.html">Privacy Policy</a></li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h3>Contact Us</h3>
                            <ul className="contact-info">
                                <li><i className="fa-solid fa-envelope"></i> info@capoasis.com</li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>&copy; {new Date().getFullYear()} GyanSchool by CapOasis. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
