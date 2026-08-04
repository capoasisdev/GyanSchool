import React from 'react';

export default function TextBorderPromo({ onStartQuiz }) {
    const textPattern = "GYANSCHOOL • AI COURSES • GYANSCHOOL • AI COURSES • GYANSCHOOL • AI COURSES • GYANSCHOOL • AI COURSES • ";

    return (
        <section className="tbp-section">
            {/* Top Border */}
            <div className="tbp-border tbp-top">
                <div className="tbp-marquee">
                    <span>{textPattern}{textPattern}</span>
                    <span>{textPattern}{textPattern}</span>
                </div>
            </div>

            {/* Bottom Border */}
            <div className="tbp-border tbp-bottom">
                <div className="tbp-marquee marquee-reverse">
                    <span>{textPattern}{textPattern}</span>
                    <span>{textPattern}{textPattern}</span>
                </div>
            </div>

            {/* Left Border */}
            <div className="tbp-border tbp-left">
                <div className="tbp-marquee-vertical">
                    <span>{textPattern}{textPattern}</span>
                    <span>{textPattern}{textPattern}</span>
                </div>
            </div>

            {/* Right Border */}
            <div className="tbp-border tbp-right">
                <div className="tbp-marquee-vertical marquee-vertical-reverse">
                    <span>{textPattern}{textPattern}</span>
                    <span>{textPattern}{textPattern}</span>
                </div>
            </div>

            {/* Inner Centered Content */}
            <div className="tbp-container">
                <span className="tbp-badge">Special Opportunity</span>
                <h2 className="tbp-heading">Are you ready to outpace the AI curve?</h2>
                <p className="tbp-description">
                    Take our 2-minute AI matching quiz to find the perfect learning track and unlock a starter discount on professional certification.
                </p>
                <button onClick={onStartQuiz} className="tbp-btn">
                    Launch AI Quiz <i className="fa-solid fa-bolt"></i>
                </button>
            </div>
        </section>
    );
}
