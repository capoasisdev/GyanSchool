import React from 'react';

const testimonials = {
    daniel: {
        name: "Sneha Gupta",
        title: "Verified Graduate",
        image: "images/student_4.png",
        quote1: "I received a promotion mid-course, and the AI tools I learned were immediately applicable to our daily operations. I honestly feel I got every penny’s worth.",
        quote2: "“I was working in manual data operations for years before I joined GyanSchool. I wanted to learn how to leverage automation and heard amazing things about their workflows. I signed up for the free intro modules and was hooked! I enrolled shortly thereafter. The curriculum was highly practical and structured. Since completing the course, I’ve successfully transitioned our entire team's workflow, automating lead gen and reporting, saving us hours daily.”"
    },
    jonathan: {
        name: "Amit Patel",
        title: "Verified Graduate",
        image: "images/student_3.png",
        quote1: "I learned how to use AI tools to create content and scale my business. It’s like having a superpower.",
        quote2: "“Within weeks of completing the program, my startup’s organic reach doubled because we could produce high-quality marketing copy at scale.”"
    },
    jeanette: {
        name: "Priya Sharma",
        title: "Verified Graduate",
        image: "images/student_2.png",
        quote1: "An overall wonderful and rewarding experience.",
        quote2: "“The AI for Finance course helped me automate reports and dashboards. Now I finish my analysis in minutes and focus on what really matters.”"
    },
    patrick: {
        name: "Rahul Verma",
        title: "Verified Graduate",
        image: "images/student_1.png",
        quote1: "The AI for Marketing course completely changed how I work. I now create campaigns, content, and ads in a fraction of the time.",
        quote2: "“The program gave me the confidence necessary to present myself as an AI-driven marketing expert. The curriculum is highly relevant, the support is amazing, and it is worth every single penny.”"
    },
    kira: {
        name: "Anjali Rao",
        title: "Verified Graduate",
        image: "images/student_6.png",
        quote1: "Such a life-changing experience. Highly recommended!",
        quote2: "“Before joining, I was overwhelmed by video editing, script writing, and social media posting. The curriculum breaks it down step by step and shows how to set up automated pipelines. I was encouraged to enroll by a colleague of mine who had an amazing experience, and the entire platform did not disappoint. They were very hands-on, and the interactive projects, in particular, were outstanding. It took my business to the next level in a way that no basic tutorial ever could. I've already recommended it to several other creators looking to leverage automation. It is easily one of the best career decisions I have made, 100% recommend!”"
    }
};

export default function Testimonials() {
    return (
        <section className="testimonials section bg-light" id="testimonials-section">
            <div className="container">
                <div className="courses-header-glass reveal">
                    <div className="courses-header-info">
                        <h2>What Our <span className="highlight">Students Say</span></h2>
                        <p>Join thousands of successful learners who transformed their careers with GyanSchool.</p>
                    </div>
                </div>

                <div id="testimonials-grid">
                    {/* Daniel Card */}
                    <figure className="testimonial-grid-card daniel reveal reveal-left">
                        <figcaption>
                            <img src={testimonials.daniel.image} alt={testimonials.daniel.name} loading="lazy" />
                            <div className="author-details">
                                <p className="name">{testimonials.daniel.name}</p>
                                <p className="title">{testimonials.daniel.title}</p>
                            </div>
                        </figcaption>
                        <blockquote>
                            <h3 className="quote-part-1">{testimonials.daniel.quote1}</h3>
                            <p className="quote-part-2">{testimonials.daniel.quote2}</p>
                        </blockquote>
                    </figure>

                    {/* Jonathan Card */}
                    <figure className="testimonial-grid-card jonathan reveal reveal-top">
                        <figcaption>
                            <img src={testimonials.jonathan.image} alt={testimonials.jonathan.name} loading="lazy" />
                            <div className="author-details">
                                <p className="name">{testimonials.jonathan.name}</p>
                                <p className="title">{testimonials.jonathan.title}</p>
                            </div>
                        </figcaption>
                        <blockquote>
                            <h3 className="quote-part-1">{testimonials.jonathan.quote1}</h3>
                            <p className="quote-part-2">{testimonials.jonathan.quote2}</p>
                        </blockquote>
                    </figure>

                    {/* Jeanette Card */}
                    <figure className="testimonial-grid-card jeanette reveal reveal-left">
                        <figcaption>
                            <img src={testimonials.jeanette.image} alt={testimonials.jeanette.name} loading="lazy" />
                            <div className="author-details">
                                <p className="name">{testimonials.jeanette.name}</p>
                                <p className="title">{testimonials.jeanette.title}</p>
                            </div>
                        </figcaption>
                        <blockquote>
                            <h3 className="quote-part-1">{testimonials.jeanette.quote1}</h3>
                            <p className="quote-part-2">{testimonials.jeanette.quote2}</p>
                        </blockquote>
                    </figure>

                    {/* Patrick Card */}
                    <figure className="testimonial-grid-card patrick reveal reveal-bottom">
                        <figcaption>
                            <img src={testimonials.patrick.image} alt={testimonials.patrick.name} loading="lazy" />
                            <div className="author-details">
                                <p className="name">{testimonials.patrick.name}</p>
                                <p className="title">{testimonials.patrick.title}</p>
                            </div>
                        </figcaption>
                        <blockquote>
                            <h3 className="quote-part-1">{testimonials.patrick.quote1}</h3>
                            <p className="quote-part-2">{testimonials.patrick.quote2}</p>
                        </blockquote>
                    </figure>

                    {/* Kira Card */}
                    <figure className="testimonial-grid-card kira reveal reveal-right">
                        <figcaption>
                            <img src={testimonials.kira.image} alt={testimonials.kira.name} loading="lazy" />
                            <div className="author-details">
                                <p className="name">{testimonials.kira.name}</p>
                                <p className="title">{testimonials.kira.title}</p>
                            </div>
                        </figcaption>
                        <blockquote>
                            <h3 className="quote-part-1">{testimonials.kira.quote1}</h3>
                            <p className="quote-part-2">{testimonials.kira.quote2}</p>
                        </blockquote>
                    </figure>
                </div>
            </div>
        </section>
    );
}
