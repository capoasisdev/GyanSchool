import React from 'react';

const teamMembers = [
    {
        name: "Kamlesh Rohra",
        title: "Founder",
        image: "images/kamlesh-sir.webp",
        description: "Empowering the generation with the skill of using AI tools for content generation and video creation, helping achieve higher ROI."
    },
    {
        name: "Pranav Patil",
        title: "CTO & Platform Architect",
        image: "images/CTO.png",
        description: "Architect of the GyanSchool platform, empowering learners to build AI agents and full-service applications using Python and business automation."
    },
    {
        name: "Rohan Baviskar",
        title: "Curriculum Developer",
        image: "images/Rohan.png",
        description: "Designing structured and industry-aligned AI learning paths to ensure learners gain highly practical, directly applicable skills.",
        customClass: "rohan-img"
    },
    {
        name: "Suchita Bhosale",
        title: "Curriculum Developer",
        image: "images/Suchita Bhosale Trainer.png",
        description: "Creating interactive curriculum modules and projects focused on cutting-edge AI technologies and hands-on automation tools.",
        customClass: "suchita-img"
    },
    {
        name: "Raj Rohra",
        title: "Curriculum Developer",
        image: "images/trainer_3.png",
        description: "Developing comprehensive learning content, case studies, and tutorials that guide students from foundations to advanced AI mastery."
    },
    {
        name: "Palak Gharti",
        title: "Quality Assurance Associate",
        image: "images/trainer_2.png",
        description: "Ensuring the educational content, video tutorials, and interactive exercises meet the highest standards of clarity, accuracy, and engagement."
    }
];
export default function Trainers() {
    return (
        <section id="trainers" className="trainers section">
            {/* Background decoration elements */}
            <img src="images/section2_svg.png" className="team-decor-blob top-right" alt="" />
            <img src="images/section2_svg.png" className="team-decor-blob bottom-left" alt="" />
            
            <div className="container">
                <div className="courses-header-glass reveal">
                    <div className="courses-header-info">
                        <h2>Meet The <span className="highlight">Team</span></h2>
                        <p>Meet the visionary minds building the future of education and technology.</p>
                    </div>
                </div>
                <div className="team-grid-container">
                    <div className="team-grid">
                        {teamMembers.map((member, index) => (
                            <div key={index} className={`team-member-card reveal reveal-delay-${(index % 3) + 1}`}>
                                <div className="team-member-img-wrapper">
                                    <img src={member.image} alt={member.name} loading="lazy" className={member.customClass || ""} />
                                </div>
                                <div className="team-member-info">
                                    <h3>{member.name}</h3>
                                    <span className="team-member-role">{member.title}</span>
                                    <p className="team-member-desc">{member.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
