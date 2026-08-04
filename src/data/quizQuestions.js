export const quizQuestions = [
    {
        id: "intro",
        type: "split",
        title: '"More than 2,000,000" people joined GyanSchool to master AI',
        subtitle: "We've helped non-technical professionals save up to 10+ hours a week and secure high-paying remote roles. Your personalized curriculum will be designed using the same successful roadmap.",
        image: "images/step1_img.png",
        buttonText: "CONTINUE"
    },
    {
        id: "status",
        type: "choice",
        title: "What best describes your current profile?",
        subtitle: "We will customize your learning track to fit your professional background",
        choices: [
            { text: "White Collar Executive / Business Leader", value: "executive", icon: "fa-solid fa-user-tie" },
            { text: "Marketer / Content Creator", value: "marketing", icon: "fa-solid fa-bullhorn" },
            { text: "Sales / Business Development Representative", value: "sales", icon: "fa-solid fa-chart-line" },
            { text: "Operations Manager / Business Analyst", value: "operations", icon: "fa-solid fa-gears" },
            { text: "Student / Recent MBA Graduate", value: "graduate", icon: "fa-solid fa-user-graduate" },
            { text: "Entrepreneur / Freelancer", value: "freelancer", icon: "fa-solid fa-hand-holding-dollar" },
            { text: "Teacher / Educator", value: "teacher", icon: "fa-solid fa-chalkboard-user" }
        ]
    },
    {
        id: "goal",
        type: "choice",
        title: "What is your primary goal with AI?",
        subtitle: "Let's align your path with the specific outcome you want to achieve",
        choices: [
            { text: "Automate manual tasks & optimize workflows", value: "automation", icon: "fa-solid fa-robot" },
            { text: "Create high-converting graphics, videos & ads", value: "creative", icon: "fa-solid fa-palette" },
            { text: "Generate B2B leads & scale outreach campaigns", value: "outreach", icon: "fa-solid fa-envelope-open-text" },
            { text: "Build custom web and mini-apps without code", value: "appmaking", icon: "fa-solid fa-laptop-code" },
            { text: "Improve job hunt, resume score & interview prep", value: "career", icon: "fa-solid fa-id-card" },
            { text: "Boost overall personal & office productivity", value: "productivity", icon: "fa-solid fa-bolt" }
        ]
    },
    {
        id: "comfortable",
        type: "choice",
        title: "How comfortable are you with AI tools?",
        subtitle: "Like ChatGPT, Midjourney, Canva AI, etc.",
        choices: [
            { text: "Beginner (I have never used AI tools)", value: "beginner", icon: "fa-solid fa-seedling" },
            { text: "Intermediate (I use ChatGPT sometimes)", value: "intermediate", icon: "fa-solid fa-sliders" },
            { text: "Advanced (I use multiple AI tools regularly)", value: "advanced", icon: "fa-solid fa-rocket" }
        ]
    },
    {
        id: "daily_goal",
        type: "choice",
        title: "Let's set your daily learning goal",
        subtitle: "Consistent daily sessions guarantee the best results",
        choices: [
            { text: "10 min/day", value: "10m", icon: "fa-solid fa-hourglass-start" },
            { text: "15 min/day", value: "15m", icon: "fa-solid fa-hourglass-half" },
            { text: "20 min/day", value: "20m", icon: "fa-solid fa-hourglass-end" }
        ]
    }
];

export const syllabusMap = {
    0: {
        w1: "AI Foundations & Productivity (ChatGPT, Claude AI, Gemini basics, prompting frameworks)",
        w2: "Smart Search & AI Research (Perplexity, NotebookLM, visual decks creation with Gamma)",
        w3: "Creative Design & Copywriting (Design in Canva, document correction with Grammarly, layouts in Napkin AI)",
        w4: "AI Audio & Workflow Automations (Voice synthesis in ElevenLabs, Zapier flows, Pomelli timers)"
    },
    1: {
        w1: "Creative Writing & AI Search (ChatGPT, Claude AI, Gemini for high-converting marketing copywriting)",
        w2: "Graphic Design & Audio Assets (Brand visual creation with Canva, Gamma slide decks, ElevenLabs audio ads)",
        w3: "Sound Campaigns & Research (Vocal soundtracks in Suno, marketing grammar check, Perplexity competitor search)",
        w4: "Video Ad Campaigns & Zaps (Speaking avatars in Heygen, Zapier lead workflows, Pomelli task timers)"
    },
    2: {
        w1: "Sales Targeting & Cold Outreach (Prospecting with Apollo AI, warmups & outreach campaigns in Instantly)",
        w2: "Creative Prospect Pitching (Writing templates with ChatGPT, Claude AI logic, Gemini workspace extensions)",
        w3: "Web Search & Copy Correction (Competitor research with Perplexity, Grammarly emails, Canva sales sheets)",
        w4: "Automating Follow-ups & Avatars (Zapier funnel workflows, Heygen custom videos, ElevenLabs vocal tracks)"
    },
    3: {
        w1: "Business Automation Setup (Building trigger-action recipes in Zapier, custom scripts with ChatGPT)",
        w2: "Document Pipelines & AI Reasoning (Large context file analysis with Claude AI, Google Gemini integrations)",
        w3: "Search & Design Automations (Perplexity web queries, Canva brand kits, Gamma deck templates)",
        w4: "Study Summaries & Task Focus (NotebookLM document grounding, Grammarly check, Pomelli timer setups)"
    },
    4: {
        w1: "MBA Productivity Foundations (ChatGPT, Claude AI, Gemini workspace prompt hacks)",
        w2: "Graduate Research & Decks (Perplexity web search, NotebookLM documents summary, Gamma presentations)",
        w3: "Branding & Copywriting (Canva visuals, Grammarly business emails, Napkin AI mind mapping)",
        w4: "Voiceovers & Automated Tasks (ElevenLabs narrations, Zapier integrations, Pomelli time tracking)"
    },
    5: {
        w1: "Career Planning CRM & Resumes (Job board setup in Huntr AI, ATS resume tailoring in Teal AI)",
        w2: "Targeted Correspondence (ChatGPT writing templates, Claude AI reasoning, Perplexity industry research)",
        w3: "Outreach & Graphics (Grammarly recruiter messages, Canva profile banners & assets)",
        w4: "Study Guides & Pitch Slides (NotebookLM career research, Gamma presentation decks)"
    },
    6: {
        w1: "App Development Setup (In-browser app generation with Lovable, Bolt.new prompt setups)",
        w2: "Frontend Prompts & Integrations (Writing templates with ChatGPT, Claude AI helper, Gemini API connections)",
        w3: "Workflow Actions & Research (Zapier webhooks, Perplexity database queries, Canva graphics)",
        w4: "Slide Decks & Audio Effects (Gamma website builders, ElevenLabs vocal sound effects)"
    },
    7: {
        w1: "Freelancing Copy & Visuals (ChatGPT templates, Claude AI client proposals, Canva portfolio assets)",
        w2: "Presentations & Audios (Gamma slide pitches, ElevenLabs narrations, Suno backing tracks)",
        w3: "App Building & Connections (Lovable MVPs, Bolt.new full-stack forms, Zapier client alerts)",
        w4: "Search, Writing & Extensions (Perplexity references, Grammarly proofreading, Gemini workspace tools)"
    },
    8: {
        w1: "Smart Lesson Planners (Educational materials with MagicSchool AI, ChatGPT study guides, Claude AI logic)",
        w2: "Educational Visuals & Research (Gemini worksheets, NotebookLM audio summaries, Gamma classroom slides)",
        w3: "Creative Materials & Narration (Canva classroom worksheets, ElevenLabs audio guides)",
        w4: "Admin & Text Visuals (Grammarly updates, Perplexity source references, Napkin AI diagrams)"
    }
};
