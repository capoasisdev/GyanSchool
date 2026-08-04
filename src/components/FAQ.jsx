import React, { useState } from 'react';

const faqItems = [
    {
        question: "College & MBA students — this is for YOU.",
        answer: "Gyanschool is LIVE! No more confusion. No more wasted time. Just skills that get you hired. Visit now: www.gyanschool.com"
    },
    {
        question: "Do I get a certificate after completion?",
        answer: "Yes! Upon successfully completing any course, you receive an industry-recognised digital certificate that you can share on LinkedIn or add to your resume."
    },
    {
        question: "Are the courses self-paced?",
        answer: "Absolutely. All courses are fully self-paced, so you can learn whenever and wherever it suits you best."
    },
    {
        question: "Is there any support available if I get stuck?",
        answer: "Yes! You'll have access to our community forum, instructor Q&A, and a dedicated support team to help you through any challenges."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleItem = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="faq section bg-light">
            <div className="container">
                <div className="faq-split-layout">
                    {/* Left Column: Info & Graphic card */}
                    <div className="faq-info-card reveal">
                        <h2>Have <span className="highlight">Questions?</span></h2>
                        <p className="faq-desc">
                            Find answers to common questions about GyanSchool courses, certificates, and community. Can't find what you're looking for? Reach out anytime!
                        </p>
                        
                        <div className="faq-support-box">
                            <div className="support-avatar-group">
                                <img src="images/student_1.png" alt="Student" />
                                <img src="images/student_2.png" alt="Student" />
                                <img src="images/student_3.png" alt="Student" />
                            </div>
                            <div className="support-text">
                                <h4>Join our WhatsApp channel</h4>
                                <p>Get the latest updates, tips, and resources directly.</p>
                            </div>
                            <a href="https://whatsapp.com/channel/0029VbDGC0u5kg75qnQcI51f" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm support-btn">Join Channel</a>
                        </div>
                    </div>

                    {/* Right Column: Accordion list */}
                    <div className="faq-list reveal reveal-delay-1">
                        {faqItems.map((item, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div key={index} className={`faq-item ${isOpen ? 'open' : ''}`}>
                                    <button 
                                        className="faq-question" 
                                        aria-expanded={isOpen ? "true" : "false"}
                                        onClick={() => toggleItem(index)}
                                    >
                                        <span>{item.question}</span>
                                        <div className="faq-icon-wrapper">
                                            <i className="fa-solid fa-plus faq-icon"></i>
                                        </div>
                                    </button>
                                    <div className="faq-answer">
                                        <p>{item.answer}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
