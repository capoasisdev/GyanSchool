import React, { useState, useEffect } from 'react';
import Courses from './Courses';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MobileAppHome({ onStartQuiz, onSelectCourse, onOpenAuth, view = 'main', setView }) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAlreadyLearner = () => {
        if (user) {
            navigate('/learn');
        } else {
            onOpenAuth(); // opens login modal
        }
    };

    if (view === 'explore-courses') {
        return (
            <div className="mobile-app-explore-container">
                <div className="mobile-app-back-header">
                    <button className="mobile-app-back-btn" onClick={() => setView('new-here')}>
                        <i className="fa-solid fa-arrow-left"></i> Back
                    </button>
                    <span className="mobile-app-header-title">Explore Courses</span>
                </div>
                <Courses onSelectCourse={onSelectCourse} />
            </div>
        );
    }

    if (view === 'new-here') {
        return (
            <div className="mobile-app-page-wrapper">
                <div className="mobile-app-back-header">
                    <button className="mobile-app-back-btn" onClick={() => setView('main')}>
                        <i className="fa-solid fa-arrow-left"></i> Back
                    </button>
                </div>
                
                <div className="mobile-app-hero">
                    <div className="mobile-app-logo-mark" style={{ background: 'transparent', boxShadow: 'none' }}>
                        <img src="/images/gyanschool_logo.png" alt="Logo" style={{ width: '100%', height: '100%', borderRadius: '18px', objectFit: 'contain' }} />
                    </div>
                    <h1>Find Your Path</h1>
                    <p>Select how you'd like to explore our professional AI programs.</p>
                </div>

                <div className="mobile-app-options">
                    <button 
                        className="mobile-app-card-btn primary-gradient"
                        onClick={onStartQuiz}
                    >
                        <div className="mobile-app-card-icon">
                            <i className="fa-solid fa-circle-question"></i>
                        </div>
                        <div className="mobile-app-card-text">
                            <h3>Take the Quiz</h3>
                            <p>Answer a few questions & let us recommend the perfect AI program for you.</p>
                        </div>
                        <i className="fa-solid fa-chevron-right arrow-icon"></i>
                    </button>

                    <button 
                        className="mobile-app-card-btn outline-dark"
                        onClick={() => setView('explore-courses')}
                    >
                        <div className="mobile-app-card-icon">
                            <i className="fa-solid fa-compass"></i>
                        </div>
                        <div className="mobile-app-card-text">
                            <h3>Explore All Courses</h3>
                            <p>Browse our entire catalog of individual certifications and skills.</p>
                        </div>
                        <i className="fa-solid fa-chevron-right arrow-icon"></i>
                    </button>
                </div>
            </div>
        );
    }

    // Main initial screen
    return (
        <div className="mobile-app-page-wrapper">
            <div className="mobile-app-hero">
                <div className="mobile-app-logo-mark" style={{ background: 'transparent', boxShadow: 'none' }}>
                    <img src="/images/gyanschool_logo.png" alt="Logo" style={{ width: '100%', height: '100%', borderRadius: '18px', objectFit: 'contain' }} />
                </div>
                <h1>GyanSchool</h1>
                <p>Learn real-world AI skills from industry professionals.</p>
            </div>

            <div className="mobile-app-options">
                <button 
                    className="mobile-app-card-btn primary-gradient"
                    onClick={() => setView('new-here')}
                >
                    <div className="mobile-app-card-icon">
                        <i className="fa-solid fa-rocket"></i>
                    </div>
                    <div className="mobile-app-card-text">
                        <h3>Get AI Certified</h3>
                        <p>New here? Let's kickstart your AI education and get certified.</p>
                    </div>
                    <i className="fa-solid fa-chevron-right arrow-icon"></i>
                </button>

                <button 
                    className="mobile-app-card-btn outline-dark"
                    onClick={handleAlreadyLearner}
                >
                    <div className="mobile-app-card-icon">
                        <i className="fa-solid fa-user-check"></i>
                    </div>
                    <div className="mobile-app-card-text">
                        <h3>Already a Learner</h3>
                        <p>Sign in to access your dashboard, courses, and resume tracking.</p>
                    </div>
                    <i className="fa-solid fa-chevron-right arrow-icon"></i>
                </button>
            </div>
        </div>
    );
}
