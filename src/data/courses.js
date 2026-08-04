import { introVideos } from './introVideos';

const ALL_TOOLS = {
   "ChatGPT": {
      name: "ChatGPT",
      introText: "ChatGPT is a state-of-the-art conversational AI developed by OpenAI. It excels at generating text, brainstorming ideas, writing and debugging code, translating languages, and acting as a virtual assistant across countless domains.",
      courseIntros: {
         "White Collar Executive AI": "In this Executive Productivity course, ChatGPT becomes your 24/7 AI chief of staff. Draft boardroom-ready memos, executive summaries, and strategic proposals in minutes. Use it to compress hours of research into sharp briefs, prepare yourself for high-stakes meetings, and handle professional communications that used to consume your entire afternoon.",
         "AI for Marketing": "In the AI for Marketing course, ChatGPT is your content engine. Generate campaign concepts, ad copy variations, email sequences, social media captions, and blog outlines in minutes. Use it to brief creative teams, ideate campaign strategies, and A/B test messaging — at scale and without creative fatigue.",
         "AI for Sales": "Use ChatGPT to craft highly personalized cold emails, sales pitch scripts, and objection-handling responses tailored to each prospect's industry and pain points. Generate follow-up sequences, proposal templates, and negotiation talking points — turning your AI into a senior sales writing partner available around the clock.",
         "AI for Business Workflow Automation": "In workflow automation, ChatGPT acts as an intelligent processing step inside your Zaps. Use it via Zapier's ChatGPT integration to automatically summarize incoming emails, classify customer feedback, draft responses to form submissions, or generate data reports — all without any human intervention in the loop.",
         "Degree & MBA Graduate Productivity": "For MBA and degree graduates, ChatGPT is your on-demand senior analyst, writing coach, and research assistant in one. Compress hours of case study research into structured briefings, draft executive-level reports, analyze business scenarios, and use it to prepare for high-stakes presentations or client pitches at your workplace.",
         "Job & Career Planning": "Use ChatGPT to craft compelling, personalized cover letters and prepare for interviews with tailored mock Q&A sessions. Rehearse your answers to common behavioral and technical questions, ask it to give you structured feedback on your responses, and simulate difficult interview scenarios for any specific role you are targeting.",
         "AI for Mini-App Making": "Use ChatGPT to plan your mini app before you build it. Describe your idea and ask it to outline the full feature set, database structure, user flow, and prompt strategy. It acts as your product manager — helping you architect and scope your app logically before you write a single line in Bolt or Lovable.",
         "Earning-Focused AI": "ChatGPT is your freelancing content engine. Write client proposals, service descriptions, project pitches, cold outreach messages, and service landing page copy in minutes. Use it to communicate your value convincingly to international clients, draft contracts, and handle professional correspondence that wins and retains high-paying work.",
         "AI for Teachers": "Use ChatGPT to design engaging classroom activities, generate discussion questions for any topic, create student handouts, and draft parent communication letters. It is also excellent for differentiation — generating the same lesson at three different reading levels or producing extension tasks for advanced learners."
      },
      lectures: [
         { title: "ChatGPT - Getting Started & Interface", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/ChatGPT/3f383b2dee3d4ced8942f11d11f66956.mp4", duration: "12 min" },
         { title: "ChatGPT - Advanced Prompting Techniques", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/ChatGPT/1993f637bcca4546b0ba631f3ee105ea.mp4", duration: "14 min" },
         { title: "ChatGPT - Writing & Content Generation", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/ChatGPT/f28d85cd12c747689589982aafe9ff18.mp4", duration: "15 min" },
         { title: "ChatGPT - Practical Use-Cases & GPTs", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/ChatGPT/b02f0ad0a5c54225b977a3584bb094e6.mp4", duration: "13 min" }
      ],
      assignment: { questionText: "Use ChatGPT to generate a comprehensive business proposal template for a startup. Take a screenshot of the output and upload it here." },
      mcqTest: [
         { question: "Who developed ChatGPT?", options: ["Google", "Microsoft", "OpenAI", "Meta"], answer: 2 },
         { question: "What is the primary function of ChatGPT?", options: ["Video rendering", "Generating and understanding text", "Running physical machines", "Calculating 3D models"], answer: 1 },
         { question: "Which of the following is a good practice when prompting?", options: ["Being as vague as possible", "Providing context, constraints, and examples", "Writing only single-word instructions", "Using random characters"], answer: 1 },
         { question: "Can ChatGPT analyze files like PDFs or images?", options: ["No, it only supports plain text inputs", "Yes, in modern versions it can parse documents, spreadsheets, and images", "Only if you convert them to binary first", "Only audio formats are supported"], answer: 1 },
         { question: "ChatGPT helps to:", options: ["Slow down daily operations", "Finish hours of text writing and research tasks in minutes", "Build physical furniture", "Replace the need for an operating system"], answer: 1 }
      ]
   },
   "Claude AI": {
      name: "Claude AI",
      introText: "Claude AI, created by Anthropic, is a next-generation AI assistant built on safety and deep reasoning. It is known for outstanding writing, coding, logical analysis, and processing very large documents via its huge context window.",
      courseIntros: {
         "White Collar Executive AI": "For white-collar professionals, Claude AI is your long-document powerhouse. Drop in contracts, annual reports, or policy documents and get instant, structured summaries. Claude's precision reasoning helps you extract action points from dense material and draft high-quality internal communications that reflect your seniority.",
         "AI for Marketing": "Claude AI helps marketers produce long-form, high-quality content that stays on brand. Draft full-length blogs, detailed product descriptions, email nurture sequences, and creative briefs with Claude's superior writing and tone consistency — then refine until it reads exactly as your brand voice requires.",
         "AI for Sales": "Claude AI helps sales professionals digest long RFP documents, prospect annual reports, and contract terms at speed. Use it to extract buyer signals, draft detailed proposals, and prepare for enterprise-level meetings with thorough, well-reasoned written responses that demonstrate genuine understanding.",
         "AI for Business Workflow Automation": "Integrate Claude AI into your automated workflows to handle long-form text processing at scale. Use it to auto-summarize support tickets, generate structured meeting notes, analyze uploaded documents, and produce professional written outputs triggered by business events — all without human intervention.",
         "Degree & MBA Graduate Productivity": "Upload long research papers, business case documents, or strategy frameworks and have Claude AI give you sharp, structured summaries and key insights. Perfect for graduate professionals who need to process dense material quickly and produce polished, well-argued written work that reflects graduate-level thinking.",
         "Job & Career Planning": "Claude AI helps you analyze job descriptions in detail, map your experience against the requirements, and draft polished application materials. Use its long-context ability to upload and review a full job spec alongside your resume and receive specific, structured advice on how to reposition yourself for each role.",
         "AI for Mini-App Making": "Claude AI helps you debug and improve your apps by analyzing error messages or code snippets and explaining exactly what went wrong. Its strong reasoning makes it excellent for thinking through complex logic, edge cases, and user experience improvements in the apps you are building.",
         "Earning-Focused AI": "Deliver exceptional client work faster with Claude AI. Use its superior writing ability to produce client-ready reports, polished articles, detailed content strategies, and consulting outputs that would normally take days — delivered in hours with the quality that justifies premium rates.",
         "AI for Teachers": "Claude AI helps teachers process and summarize long curriculum documents, academic research, and textbooks to extract teaching-ready content. Use it to draft detailed unit plans, create scenario-based assessment questions, and produce high-quality written feedback for student assignments at scale."
      },
      lectures: [
         { title: "Claude AI - Introduction & Capabilities", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Claude_AI/b182871b32c04d649c2302c41d119654.mp4", duration: "10 min" },
         { title: "Claude AI - Large Document Analysis", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Claude_AI/7dc12daffc8948fdb625150d63949986.mp4", duration: "12 min" },
         { title: "Claude AI - Logic & Reasoning Skills", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Claude_AI/e42135d6cfc44de7abd7477685618e39.mp4", duration: "11 min" },
         { title: "Claude AI - Coding Assistance & Artifacts", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Claude_AI/9a4a1a1b20074b6ab5f1cb3639c8993b.mp4", duration: "13 min" },
         { title: "Claude AI - Projects Feature & Custom Instructions", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Claude_AI/c212a1d210594952afc0068d3ea0a269.mp4", duration: "14 min" },
         { title: "Claude AI - Writing Copy & Content Tone", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Claude_AI/2f98b73aab424334ba242df9e05b2730.mp4", duration: "12 min" },
         { title: "Claude AI - Summary & Best Practices", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Claude_AI/7b8a0331bfc447dfaf0710161983c726.mp4", duration: "15 min" }
      ],
      assignment: { questionText: "Create a detailed step-by-step troubleshooting guide for a complex technical issue using Claude AI. Upload a screenshot of your chat." },
      mcqTest: [
         { question: "Who developed Claude AI?", options: ["OpenAI", "Anthropic", "Microsoft", "Meta"], answer: 1 },
         { question: "What feature in Claude lets you see renders or code in a side panel?", options: ["SideShow", "Claude Artifacts", "CodeViewer", "PromptPad"], answer: 1 },
         { question: "Which feature is Claude particularly known for?", options: ["Generating MP3 music", "Processing large document context with deep reasoning", "Hosting virtual servers", "3D printing layouts"], answer: 1 },
         { question: "What is a 'Project' in Claude?", options: ["A paid subscription only", "A workspace where you can upload documents and instructions for a specific context", "A tool to write compiler code", "A video editor"], answer: 1 },
         { question: "Claude AI is designed with a focus on:", options: ["High graphics gaming", "AI Safety and helpful, harmless interactions", "Automating automobile assembly", "Database replication"], answer: 1 }
      ]
   },
   "Gemini": {
      name: "Gemini",
      introText: "Gemini is Google's highly advanced multimodal AI system. It natively understands text, code, audio, images, and video, offering ultra-long context window processing and seamless integration with Google Workspace.",
      courseIntros: {
         "White Collar Executive AI": "Integrated into your Google Workspace, Gemini amplifies every tool you already use. Summarize Gmail threads, auto-draft replies, generate Slides decks from meeting notes, and analyze spreadsheets — all without leaving your existing workflow. It is the executive AI layer built on top of your daily office stack.",
         "AI for Marketing": "Gemini's multimodal capability is a marketer's secret weapon. Analyze campaign images, research competitor ads, summarize market reports, and integrate directly into Google Ads and Analytics workflows. It processes visuals and text together so your campaign insights are richer and faster than ever.",
         "AI for Sales": "Use Gemini to research prospects deeply by uploading their reports, website content, or pitch decks and asking specific questions. Integrated with Google Workspace, it helps you build CRM notes, prep sales slides, and draft outreach that references real, specific details about each prospect.",
         "AI for Business Workflow Automation": "Deploy Gemini within Google Workspace-centric automation workflows. Use it to auto-populate Docs from form inputs, generate Sheets summaries, draft Gmail responses to client inquiries, and create Slides from data triggers — eliminating manual repetition from your daily office operations.",
         "Degree & MBA Graduate Productivity": "Leverage Gemini's deep integration with Google Workspace to supercharge your graduate productivity. Auto-generate presentation slides from research notes, summarize long reports inside Docs, analyze data in Sheets, and compose polished emails — all within the tools you already use daily at work.",
         "Job & Career Planning": "Research target companies, industries, and interviewers with Gemini's real-time intelligence. Use it to draft your LinkedIn profile updates, prepare role-specific talking points, and generate structured company research briefs before networking calls or panel interviews.",
         "AI for Mini-App Making": "Use Gemini to generate creative app ideas, research similar existing tools, analyze your app's user interface visually, and draft the copy for your app's landing page. Its multimodal ability lets you describe an existing app screenshot and ask Gemini to help you replicate or improve upon the design.",
         "Earning-Focused AI": "Use Gemini to research client briefs deeply, analyze competitor content, process uploaded brand documents, and generate work across multiple formats. Its Google Workspace integration lets you deliver client reports, Docs, and Sheets outputs professionally — reinforcing your credibility as a thorough, organized freelancer.",
         "AI for Teachers": "Use Gemini directly inside Google Classroom, Docs, Slides, and Forms to accelerate lesson creation. Generate quiz questions inside Google Forms, create Slides decks from lesson outlines, and analyze student submission trends in Sheets — all with AI assistance built into your existing teaching environment."
      },
      lectures: [
         { title: "Gemini - Getting Started & Workspace Integration", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Gemini/fbf83cac127143189ef424e78b3bff72.mp4", duration: "11 min" },
         { title: "Gemini - Advanced Multimodality (Images & Files)", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Gemini/9c258c5590264d6cb6b1ebe6eec70443.mp4", duration: "13 min" },
         { title: "Gemini - Analyzing Long Videos & Audios", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Gemini/e131f19d78674e6782b03dfef8334faf.mp4", duration: "12 min" },
         { title: "Gemini - Building Custom Gems", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Gemini/6e91ffc54be9488eabe6c9a1e8b77745.mp4", duration: "14 min" },
         { title: "Gemini - Practical Tips & Worksheets Integration", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Gemini/2ccbee433230420cbd0cdf7c73f38b2c.mp4", duration: "15 min" }
      ],
      assignment: { questionText: "Upload a short video or image to Gemini, ask it to analyze the details, and upload a screenshot of Gemini's response." },
      mcqTest: [
         { question: "Gemini is developed by:", options: ["OpenAI", "Anthropic", "Google", "Microsoft"], answer: 2 },
         { question: "What is Gemini's multimodal ability?", options: ["It can only run on multiple computers", "It natively understands text, images, video, and audio", "It prints in multicolor", "It plays games on mobile"], answer: 1 },
         { question: "What is a custom 'Gem' in Gemini?", options: ["A precious stone", "A customized version of Gemini tailored for specific tasks", "A video filter", "A database query language"], answer: 1 },
         { question: "How does Gemini integrate with Google Docs/Gmail?", options: ["By exporting text manually", "Through @-extensions to directly read/write inside workspace files", "It doesn't support Google products", "Only via offline downloads"], answer: 1 },
         { question: "Gemini is capable of analyzing:", options: ["Only plain text files", "Extremely long documents and hours of video/audio inputs", "Only physical paper sheets", "Nothing, it's a basic calculator"], answer: 1 }
      ]
   },
   "Perplexity": {
      name: "Perplexity",
      introText: "Perplexity is an AI-powered conversational search engine. It answers questions with real-time web access, bringing structured summaries together with exact URL citations so you can verify sources immediately.",
      courseIntros: {
         "White Collar Executive AI": "As an executive, staying current is non-negotiable. Perplexity gives you real-time, cited intelligence on industry movements, competitor activity, and market shifts — delivered as a structured brief, not a wall of search results. Use it to prepare for board discussions, investor calls, and strategy sessions with confidence.",
         "AI for Marketing": "Use Perplexity to research market trends, analyze competitor campaigns, and gather real-time data on audience interests — all with cited sources you can include in strategy decks or client reports. Stay ahead of your market with intelligence that updates in real time rather than relying on outdated playbooks.",
         "AI for Sales": "Research any prospect, industry, or market trend instantly with Perplexity's real-time web intelligence. Use it to find recent company news, funding announcements, and competitor wins before your sales calls — arriving in every conversation fully informed, credible, and prepared to lead the discussion.",
         "AI for Business Workflow Automation": "Integrate real-time research into your automated business processes. Use Perplexity to automatically gather market intelligence, generate cited research briefs on incoming client topics, or enrich lead data with current industry context — feeding actionable intelligence directly into your operational workflow.",
         "Degree & MBA Graduate Productivity": "Graduate professionals need credible, current intelligence. Perplexity gives you real-time research with cited sources — perfect for building evidence-based business arguments, staying current on industry developments, and enriching presentations or proposals with up-to-date market data that impresses stakeholders.",
         "Job & Career Planning": "Research every company you are targeting with real-time intelligence and cited sources. Use Perplexity to understand a company's recent announcements, competitive landscape, and culture before interviews — so you can ask informed questions and position your value with precision during each conversation.",
         "AI for Mini-App Making": "Research the tools, APIs, and technologies that will help you build your mini app more effectively. Use Perplexity to get cited, up-to-date guidance on integration options, competitive alternatives, and technical documentation — making you a better-informed builder with every project.",
         "Earning-Focused AI": "Research any client's industry, competitors, and target market rapidly with real-time, cited intelligence. Delivering well-researched, informed work to clients is the single biggest differentiator between freelancers who compete on price and those who command premium rates.",
         "AI for Teachers": "Stay current on educational research, teaching methodologies, and subject-matter developments with Perplexity's real-time, cited web intelligence. Use it to verify lesson content accuracy, research emerging topics for your curriculum, and quickly find evidence-based teaching strategies to apply in your classroom."
      },
      lectures: [
         { title: "Perplexity - Search & Citations", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Perplexity/b9fae170de134426b3e3df543fc95f7e.mp4", duration: "10 min" },
         { title: "Perplexity - Focus Modes & Files", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Perplexity/91bbde1f945f4e57af79a333ff4d7034.mp4", duration: "12 min" },
         { title: "Perplexity - Collection Organization", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Perplexity/4e543cb01cce4684a3a744229c23fa52.mp4", duration: "11 min" },
         { title: "Perplexity - Writing vs Academic Modes", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Perplexity/96174066c5504bc7a340bb699e1c3113.mp4", duration: "13 min" },
         { title: "Perplexity - Pro Search & Deep Research", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Perplexity/602ecd6f83be42c28e4e0247e62866af.mp4", duration: "14 min" }
      ],
      assignment: { questionText: "Perform a deep-dive research query on a trending technology using Perplexity's Pro mode. Capture a screenshot showing the source citations and upload it here." },
      mcqTest: [
         { question: "What is Perplexity's main distinction?", options: ["It is a conversational AI search engine with real-time citations", "It generates 3D drawings", "It edits audio files", "It builds physical servers"], answer: 0 },
         { question: "What does Perplexity provide for every claim it makes?", options: ["Audio soundtracks", "Direct URL source citations", "Vibrant colors", "A random number"], answer: 1 },
         { question: "What are Perplexity Focus modes?", options: ["Timer settings", "Search filters (e.g. Academic, Writing, YouTube, Reddit)", "Screen dimming tools", "Memory optimization tools"], answer: 1 },
         { question: "Can you organize searches in Perplexity?", options: ["No, all searches disappear", "Yes, using Collections", "Only on desktop spreadsheets", "Only by bookmarking manually"], answer: 1 },
         { question: "Perplexity Pro Search helps by:", options: ["Paying utility bills", "Asking clarifying questions to run multi-step web searches", "Drawing vectors", "Configuring routing tables"], answer: 1 }
      ]
   },
   "NotebookLM": {
      name: "NotebookLM",
      introText: "NotebookLM is a personalized AI research assistant by Google. You can upload documents, PDFs, or links, and ask questions, generate summaries, and even create a natural-sounding audio podcast discussing the material.",
      courseIntros: {
         "White Collar Executive AI": "Upload your company reports, strategy decks, or research papers, and NotebookLM becomes a private AI analyst that answers only from your approved sources. Ideal for synthesizing quarterly results, building executive briefing packs, or turning raw data into a listen-anywhere audio overview for your commute.",
         "AI for Business Workflow Automation": "Use NotebookLM as your automated knowledge base within your business operations. Feed it your SOPs, process documents, and policy manuals, then automate team queries against your knowledge store — reducing the time spent searching for information across departments during busy operational periods.",
         "Degree & MBA Graduate Productivity": "Upload your research papers, textbooks, company reports, or case studies and use NotebookLM to interrogate your own private knowledge base. Ideal for pre-meeting research, generating study guides from course materials, or building structured briefings from multiple uploaded sources simultaneously.",
         "Job & Career Planning": "Upload your target company's annual reports, industry whitepapers, or interview prep guides and use NotebookLM to ask questions directly from those sources. Build a private research library for each target role and generate audio study guides you can listen to while preparing on the go.",
         "AI for Teachers": "Upload your curriculum guides, textbooks, and course materials into NotebookLM to build a private AI teaching resource. Ask questions, generate study guides, create audio podcast summaries for students, and produce revision notes — all grounded in your specific teaching materials rather than general web content."
      },
      lectures: [
         { title: "NotebookLM - Getting Started & Uploads", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/NotebookLM/65176591db9d4c698555345f9df6038f.mp4", duration: "12 min" },
         { title: "NotebookLM - Source Grounding & Queries", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/NotebookLM/3a277db8fa184592aa692a5fe52e8841.mp4", duration: "14 min" },
         { title: "NotebookLM - Study Guides & Summaries", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/NotebookLM/8b3e9c4df7174b11bb8d00c4a5352d7c.mp4", duration: "13 min" },
         { title: "NotebookLM - Customizing Audio Overviews", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/NotebookLM/ebbbd106bd7440968314665cf37c64de.mp4", duration: "15 min" },
         { title: "NotebookLM - Practical Research Workflows", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/NotebookLM/8eb76c3530014e7b8f8b71584953e4ea.mp4", duration: "14 min" }
      ],
      assignment: { questionText: "Upload a study guide or article to NotebookLM, ask it to summarize the core topics, screenshot the generated summary, and upload it here." },
      mcqTest: [
         { question: "NotebookLM is developed by which company?", options: ["Microsoft", "Google", "OpenAI", "Meta"], answer: 1 },
         { question: "What sources can you upload to NotebookLM?", options: ["Only MP3 music files", "PDFs, Google Docs, copy-pasted text, or web links", "EXE software installers", "Only raw video files"], answer: 1 },
         { question: "What is the unique Audio Overview feature in NotebookLM?", options: ["An automatic voice assistant like Siri", "A two-host AI-generated podcast discussing your sources", "A feature to transcribe phone calls", "A way to edit video sound"], answer: 1 },
         { question: "NotebookLM bases its answers on:", options: ["The entire open web without context", "Only the specific sources you upload", "Wikipedia exclusively", "A random database"], answer: 1 },
         { question: "NotebookLM is useful for:", options: ["Analyzing financial sheets", "Studying, summarizing documents, and quick research", "Creating web layouts", "Writing CSS code"], answer: 1 }
      ]
   },
   "Gamma": {
      name: "Gamma",
      introText: "Gamma is an AI-powered presentation maker. It allows you to create professional pitch decks, slides, and websites in just a few clicks by simply writing natural language prompts. It takes care of formatting, layout, and visual placement.",
      courseIntros: {
         "White Collar Executive AI": "Stop spending half your day in PowerPoint. Gamma generates polished, boardroom-ready presentations from a bullet-point brief in seconds. Use it to create strategy decks, stakeholder updates, and pitch materials that look professionally designed — without needing a designer on your team.",
         "AI for Marketing": "Build compelling marketing decks, campaign proposals, and client presentations in seconds with Gamma. Drop in your campaign strategy or target audience brief and get a fully formatted, visually rich presentation that is immediately ready to share with clients or internal stakeholders.",
         "AI for Business Workflow Automation": "Automate presentation creation within your business processes. Connect Gamma to your workflow so that when a report is generated or a project milestone is hit, a professional slide deck is automatically created and shared — no manual effort required from your team.",
         "Degree & MBA Graduate Productivity": "Create polished, graduate-level presentations in seconds instead of hours. Gamma generates well-structured slide decks from your research notes or briefing documents — perfect for academic presentations, client proposals, internship demos, and team project updates.",
         "Job & Career Planning": "Create a visually polished personal portfolio presentation or a 30-60-90 day plan deck to differentiate yourself in final-round interviews. Gamma generates professional slide decks from your talking points in seconds — leaving an impression that most candidates never bother to create.",
         "AI for Mini-App Making": "Create a polished pitch deck for your mini app — presenting the problem it solves, the target user, key features, and your roadmap. Gamma builds the entire deck from your notes in seconds, making it easy to share your app concept with clients, investors, or collaborators convincingly.",
         "Earning-Focused AI": "Win freelance clients with stunning presentation decks generated in seconds. Use Gamma to create service proposals, project concepts, case study decks, and business plans that look like they came from a full agency — and deliver them before competitors even open PowerPoint.",
         "AI for Teachers": "Create visually engaging lesson presentations in seconds with Gamma. Input your topic and learning objectives, and Gamma generates a fully formatted, attractive slide deck that you can edit and use in the classroom — eliminating hours of PowerPoint preparation before every new lesson."
      },
      lectures: [
         { title: "Gamma - Interface & Decks Generation", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Gamma/67a7bf9a9f254efe8a0c61702b4b0b40.mp4", duration: "12 min" },
         { title: "Gamma - Editing & Layout Styling", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Gamma/756c72a6b9524a91a1f42ec4496fa277.mp4", duration: "13 min" },
         { title: "Gamma - Generating Websites & Pages", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Gamma/ec6fddb22d8449cf92f62e4672dd0c88.mp4", duration: "14 min" },
         { title: "Gamma - Exporting Decks & Collaboration", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Gamma/6a6d4a321dce478fa4651766b608444e.mp4", duration: "11 min" }
      ],
      assignment: { questionText: "Create a 5-slide presentation about 'AI Trends in 2026' using Gamma. Take a screenshot of your generated deck and upload it here." },
      mcqTest: [
         { question: "What is Gamma primarily used for?", options: ["Editing audio files", "Creating presentations and web pages", "Writing backend code", "Analyzing spreadsheets"], answer: 1 },
         { question: "How does Gamma format layouts?", options: ["You must write custom CSS", "Automatically based on AI prompts", "It only allows plain text", "By drawing tables manually"], answer: 1 },
         { question: "Can you export Gamma decks?", options: ["No, they are online-only", "Yes, to PDF or PowerPoint", "Only as raw images", "Yes, to Excel format"], answer: 1 },
         { question: "Which input does Gamma accept to start a deck?", options: ["Text prompts or documents", "Only audio commands", "3D CAD designs", "SQL database tables"], answer: 0 },
         { question: "Gamma helps to finish presentations in:", options: ["Several days", "Minutes", "Exactly 1 hour", "It cannot generate slides"], answer: 1 }
      ]
   },
   "Canva": {
      name: "Canva",
      introText: "Canva is a leading graphic design platform that integrates advanced AI tools. Features like Magic Edit, Magic Design, and background removal allow anyone to design marketing collateral, slide decks, and social media posts effortlessly.",
      courseIntros: {
         "White Collar Executive AI": "Canva's AI tools give executives the power to produce branded, visually compelling collateral without a design team. From board presentation graphics to one-pagers and executive summaries with charts, Magic Design handles the layout so you can stay focused on the message itself.",
         "AI for Marketing": "Canva is the marketer's AI design studio. Create scroll-stopping social graphics, ad creatives, email banners, and brand materials in minutes using Magic Design, Magic Edit, and AI-generated images. No design team required — just your brief and your brand kit.",
         "AI for Sales": "Create visually compelling sales decks, one-pagers, case study PDFs, and proposal documents that stand out in a busy inbox. Canva's AI design tools make every sales asset look professionally crafted, reinforcing your credibility and professionalism with every client touchpoint.",
         "AI for Business Workflow Automation": "Automate the creation of branded visual assets within your business processes. Use Canva's API and Zapier integrations to trigger auto-generation of client reports, event banners, or presentation templates whenever a business condition or calendar event is met.",
         "Degree & MBA Graduate Productivity": "Professional visual communication is a graduate skill. Use Canva's AI tools to produce branded project reports, business case infographics, resume visuals, and presentation materials that reinforce your ideas with compelling design — without needing any design background.",
         "Job & Career Planning": "Design a visually striking resume, personal portfolio, LinkedIn banner, and cover letter header using Canva's professional templates. Standing out in a competitive job market often starts with how your application looks before it is even read by a recruiter.",
         "AI for Mini-App Making": "Design your app's logo, landing page hero images, app icons, and social media assets using Canva. A polished visual identity makes your mini app look credible and professional — essential whether you are pitching it to clients or publishing it publicly on the web.",
         "Earning-Focused AI": "Build your entire freelance visual service offering with Canva. Create client logos, branded social media templates, presentation decks, infographics, and digital products — then sell these as standalone offerings or bundle them into monthly retainer packages with ongoing clients.",
         "AI for Teachers": "Produce classroom worksheets, educational posters, seating charts, certificate templates, and visual learning aids using Canva's AI design tools. Build a library of reusable, beautifully designed classroom resources that keep students engaged and make your teaching environment more vibrant."
      },
      lectures: [
         { title: "Canva - Magic Design & Layouts", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Canva/bc0288c23a934e19abec88c5bcd229ae.mp4", duration: "12 min" },
         { title: "Canva - Magic Edit & Image Tools", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Canva/2803666e66484151a74762a286178ca6.mp4", duration: "14 min" },
         { title: "Canva - Branding & Presentations", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Canva/8ca205e94ce3477392067c10a1ec626f.mp4", duration: "13 min" },
         { title: "Canva - Video Editing & Templates", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Canva/af445b11df1e4b229f160d9fa79ba209.mp4", duration: "15 min" }
      ],
      assignment: { questionText: "Use Canva's Magic Edit tool to replace an object in an image. Save the modified design and upload the file here." },
      mcqTest: [
         { question: "What is Canva's 'Magic Edit'?", options: ["A tool to erase backgrounds", "An AI brush to replace or add elements in photos with text prompts", "A spell checker", "A template downloader"], answer: 1 },
         { question: "Which platform hosts Magic Studio AI tools?", options: ["Figma", "Canva", "Adobe Photoshop", "GIMP"], answer: 1 },
         { question: "Canva Magic Design helps to:", options: ["Generate complete branded presentation drafts instantly", "Write database queries", "Debug JavaScript", "Upload server files"], answer: 0 },
         { question: "Text-to-Image tools in Canva generate:", options: ["Vocal voiceovers", "Custom images from a written description", "HTML web pages", "PDF text reports"], answer: 1 },
         { question: "To resize designs automatically, Canva uses:", options: ["Manual crop", "Magic Switch (AI powered)", "A calculator", "Nothing, it's not possible"], answer: 1 }
      ]
   },
   "Grammarly": {
      name: "Grammarly",
      introText: "Grammarly is an AI writing assistant. It helps check grammar, spelling, punctuation, and tone, while offering real-time rewriting suggestions to optimize professional correspondence and report drafting.",
      courseIntros: {
         "White Collar Executive AI": "Every email, memo, and report you send reflects your personal brand. Grammarly ensures your professional writing is error-free, concise, and appropriately authoritative — adjusting tone on the fly to match boardroom formality or the clarity needed for a stakeholder-friendly update.",
         "AI for Marketing": "Every marketing message needs to land precisely. Grammarly ensures your copy is persuasive, error-free, and toned correctly — whether it is a casual Instagram caption or a formal brand partnership email. The AI rewrite feature lets you iterate on copy instantly until it resonates.",
         "AI for Sales": "Every proposal, follow-up, and sales email represents your professionalism. Grammarly ensures your outreach is polished, persuasive, and error-free — adjusting tone to match high-stakes enterprise deals or quick transactional conversations so nothing loses you a deal on a typo.",
         "AI for Business Workflow Automation": "Ensure every automated output from your business workflows meets professional writing standards. Integrate Grammarly to review and refine AI-generated emails, reports, and client-facing documents before they are automatically sent or published to maintain consistent quality.",
         "Degree & MBA Graduate Productivity": "At the graduate level, written communication defines your professional reputation. Grammarly ensures every email, report, memo, and presentation script is articulate, polished, and at the appropriate level of formality — helping you communicate with authority and precision from day one.",
         "Job & Career Planning": "Every piece of your job search depends on written communication — your resume, cover letter, LinkedIn profile, and thank-you emails. Grammarly ensures all of it is professional, error-free, and confident in tone, making a strong first impression at every single touchpoint.",
         "Earning-Focused AI": "As an international freelancer, impeccable written communication is your competitive advantage. Grammarly ensures every client proposal, deliverable, and email is professional, persuasive, and error-free — protecting your reputation and credibility across every client relationship you build.",
         "AI for Teachers": "Ensure all your professional communications — parent emails, report card comments, grant applications, and school policy documents — are polished, clear, and appropriately toned. Grammarly catches errors and refines clarity in seconds so every communication reflects your teaching professionalism."
      },
      lectures: [
         { title: "Grammarly - Setup & Grammar Basics", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Grammarly/43291566a9bf401995a75720dcc29727.mp4", duration: "11 min" },
         { title: "Grammarly - Tone Adjustment & Clarity", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Grammarly/973a4b2a36604ade851e233473b48af9.mp4", duration: "13 min" },
         { title: "Grammarly - AI Rewriting & Prompts", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Grammarly/0e2bcdbbc4a34cd494aaa10b30588633.mp4", duration: "12 min" },
         { title: "Grammarly - Writing Professional Emails", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Grammarly/b275a15c519141bab16dcb4eaae900d3.mp4", duration: "14 min" },
         { title: "Grammarly - Document Checks & Plagiarism", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Grammarly/ed39725a4d55459d9df86110aa9c55af.mp4", duration: "15 min" }
      ],
      assignment: { questionText: "Take a poorly written paragraph, use Grammarly to optimize it for a professional client tone, and upload a screenshot showing the suggestions." },
      mcqTest: [
         { question: "What is Grammarly's primary benefit?", options: ["Improving writing correctness, clarity, and tone", "Creating spreadsheet tables", "Rendering 3D logos", "Editing video assets"], answer: 0 },
         { question: "Which check is NOT standard in Grammarly?", options: ["Grammar & spelling corrections", "Compiling JavaScript logic", "Tone and style suggestions", "Plagiarism check"], answer: 1 },
         { question: "Grammarly's tone detector helps you understand:", options: ["How your email will sound to the recipient", "The audio pitch of your voice", "Your speed of typing", "The files on your server"], answer: 0 },
         { question: "To rewrite a full sentence instantly, Grammarly uses:", options: ["A dictionary lookup", "Generative AI rewrites", "A manual calculator", "It doesn't support sentence rewrites"], answer: 1 },
         { question: "Grammarly integrates with:", options: ["Browsers, MS Word, and email client interfaces", "Only Linux servers", "Only databases", "Smart TVs exclusively"], answer: 0 }
      ]
   },
   "Napkin AI": {
      name: "Napkin AI",
      introText: "Napkin AI converts plain text into diagrams, flowcharts, and mind maps. It enables quick visual storytelling for your business documentation, making complex workflows instantly understandable for clients and peers.",
      courseIntros: {
         "White Collar Executive AI": "Turn complex strategy documents and process descriptions into instant visual diagrams. Napkin AI is perfect for making your ideas boardroom-ready — converting written frameworks into flowcharts and mind maps that communicate your executive vision clearly to any audience in the room.",
         "Degree & MBA Graduate Productivity": "Translate complex business frameworks, data models, and strategic concepts from your coursework into clean visual diagrams. Napkin AI helps you communicate MBA-level thinking visually — making your reports and presentations significantly clearer and more memorable for any professional audience.",
         "AI for Teachers": "Transform complex subject concepts, learning frameworks, and curriculum structures into clear visual diagrams for classroom display. Napkin AI helps you create concept maps, process flowcharts, and visual timelines that make abstract content tangible and memorable for your students."
      },
      lectures: [
         { title: "Napkin AI - Visual Flowcharts Intro", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Napkin_AI/b8089e841e9140ba89a87566ff4158a4.mp4", duration: "12 min" },
         { title: "Napkin AI - Mind Maps Creation", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Napkin_AI/80814d4da88c42abae0e75b9215aaf9d.mp4", duration: "14 min" },
         { title: "Napkin AI - Structuring Text Data", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Napkin_AI/7723ee39fdd34b8f82ac35630efd26b4.mp4", duration: "13 min" },
         { title: "Napkin AI - Exporting Formats & Styling", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Napkin_AI/1b79e35046e94ae398afd1464e6d9740.mp4", duration: "15 min" }
      ],
      assignment: { questionText: "Paste a business workflow description into Napkin AI, generate a process flowchart, download the image, and upload it here." },
      mcqTest: [
         { question: "What is Napkin AI's main capability?", options: ["Converting text to visual diagrams", "Hosting web applications", "Managing databases", "Synthesizing vocal music"], answer: 0 },
         { question: "Which visuals can Napkin AI generate?", options: ["3D video animations", "Flowcharts, mind maps, and diagrams", "Only bar charts", "None, it only formats text"], answer: 1 },
         { question: "Napkin AI is best suited for:", options: ["Video editing", "Visualizing complex text concepts", "Compiling python code", "Financial audits"], answer: 1 },
         { question: "To generate a diagram in Napkin AI, you provide:", options: ["A text description or article", "A video file", "An audio clip", "A spreadsheet of numbers"], answer: 0 },
         { question: "Napkin AI helps document readers by:", options: ["Adding background music", "Providing visual context alongside text", "Translating documents to Spanish", "Encrypting files"], answer: 1 }
      ]
   },
   "ElevenLabs": {
      name: "ElevenLabs",
      introText: "ElevenLabs is a pioneer in realistic AI voice generation. It allows you to generate lifelike speech in multiple languages, clone your own voice, and produce clean audio content for narration or marketing videos.",
      courseIntros: {
         "White Collar Executive AI": "Give your executive communications a polished audio dimension. Use ElevenLabs to convert briefings into narrated audio, produce professional-sounding voiceovers for internal updates, or create quick-listen summaries of long documents for on-the-go consumption during your commute.",
         "AI for Marketing": "Produce professional-quality voiceovers for video ads, social media reels, and podcast promotions without hiring a voice artist. ElevenLabs generates ultra-realistic narration in your brand's tone — multilingual, scalable, and available on demand for any campaign asset.",
         "AI for Sales": "Convert your sales scripts and product explainers into high-quality audio narration for demo videos, video proposals, and training materials. ElevenLabs lets you produce professional-sounding sales media at scale without a recording studio or voice actor budget.",
         "Degree & MBA Graduate Productivity": "Convert your research summaries and study notes into narrated audio you can listen to during your commute. ElevenLabs also lets you add professional voiceovers to your presentation videos and project demos — a differentiator in competitive graduate professional environments.",
         "AI for Mini-App Making": "Add a professional voice assistant or audio feedback feature to your mini apps. Use ElevenLabs to generate narrated onboarding flows, in-app tutorials, or promotional voiceovers — adding a premium audio layer to every app you build and publish.",
         "Earning-Focused AI": "Offer AI voiceover services as a scalable freelance income stream. Use ElevenLabs to produce professional narrations for YouTube channels, corporate training videos, explainer animations, and podcast intros — delivering studio-quality audio to clients without any recording setup.",
         "AI for Teachers": "Convert your lesson content into high-quality audio narrations for students who benefit from audio-based learning. Create voiceover tutorials, listening comprehension exercises, and teacher-narrated video content — supporting diverse learning styles and making your lessons more accessible to every student."
      },
      lectures: [
         { title: "ElevenLabs - Synthesizing High-Quality Speech", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/ElevenLabs/bb8110b67afd4f5f864be4e90628ef1c.mp4", duration: "12 min" },
         { title: "ElevenLabs - Voice Cloning & Profiles", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/ElevenLabs/beecef8333fb420c8ac0be2f831e0635.mp4", duration: "14 min" },
         { title: "ElevenLabs - Sound Effects & Audio Editing", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/ElevenLabs/7a191ff5268d4d509547ced6b0bbbdba.mp4", duration: "13 min" }
      ],
      assignment: { questionText: "Generate a 30-second promotional script, convert it to a voiceover using ElevenLabs, and upload a screenshot of your audio project dashboard." },
      mcqTest: [
         { question: "ElevenLabs specializes in:", options: ["Lifelike AI speech synthesis and voice cloning", "Video rendering engines", "SQL servers", "Automobile machinery"], answer: 0 },
         { question: "What is 'Voice Cloning'?", options: ["Copying a script", "Generating speech that mimics a specific person's voice sample", "Setting up a conference call", "Recording an instrument"], answer: 1 },
         { question: "Can ElevenLabs generate voiceovers in multiple languages?", options: ["No, only English is supported", "Yes, it supports dozens of languages with high-fidelity pronunciation", "Only using manual translations", "Only in ancient languages"], answer: 1 },
         { question: "Sound effects generation in ElevenLabs accepts:", options: ["Natural language descriptions of sounds", "Only binary code", "Only vocal inputs", "Excel files"], answer: 0 },
         { question: "Which parameter adjusts speaker consistency?", options: ["Volume slider", "Clarity / Stability settings", "CPU clock speed", "File format"], answer: 1 }
      ]
   },
   "Bolt": {
      name: "Bolt",
      introText: "Bolt (Bolt.new) is an AI-powered development platform that lets you build, run, and deploy full-stack web applications entirely in your browser using natural language prompts without writing manual code.",
      courseIntros: {
         "AI for Mini-App Making": "Bolt.new is your in-browser full-stack development environment. Use it to build, run, and deploy interactive web tools, calculators, trackers, and mini SaaS apps entirely from your browser without installing anything. Prompt the AI to add features, fix bugs, and connect databases — all in plain English.",
         "Earning-Focused AI": "Deliver custom web tool builds and SaaS prototypes for clients using Bolt. Build, iterate, and deploy working apps entirely from your browser, then hand off a live URL to your client — charging development rates while eliminating the traditional coding overhead completely."
      },
      lectures: [
         { title: "Bolt - Application Setup & Prompts", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Bolt/fa9de711818e44a8a13dd75eb6c69baf.mp4", duration: "12 min" },
         { title: "Bolt - Adding Features & Database", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Bolt/6df7f75f60c94cdd90346a724bdc0d25.mp4", duration: "14 min" },
         { title: "Bolt - Deployment & App Hosting", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Bolt/a48521d93d78403da2dd4ad2579286cd.mp4", duration: "13 min" }
      ],
      assignment: { questionText: "Build a simple task manager or calculator web app in Bolt using prompt instructions. Take a screenshot of the running app preview and upload it." },
      mcqTest: [
         { question: "What is Bolt (Bolt.new)?", options: ["An AI development workspace that builds full-stack apps in the browser", "A spreadsheet template editor", "A command-line terminal emulator", "A vector design tool"], answer: 0 },
         { question: "Does Bolt require setting up a local IDE or node.js initially?", options: ["Yes, extensive local setup is needed", "No, it sets up an in-browser container automatically", "Only if you want to write HTML", "Only on Linux systems"], answer: 1 },
         { question: "To make a change to a Bolt application, you can:", options: ["Only edit files manually", "Simply prompt the AI in natural language to add or modify components", "Compile the code manually using a compiler", "Reinstall the package manager"], answer: 1 },
         { question: "Bolt.new is powered by what kind of technology?", options: ["In-browser web containers", "Traditional remote servers only", "Offline local binaries", "None, it's just a mockup editor"], answer: 0 },
         { question: "Which button in Bolt deploys the app to a live URL?", options: ["Compile", "Deploy / Publish", "Export to PDF", "Save to Desktop"], answer: 1 }
      ]
   },
   "Lovable": {
      name: "Lovable",
      introText: "Lovable is an advanced GPT-powered app builder that enables anyone to build, iterate, and ship clean frontend and backend software applications at lightning speed via visual conversation.",
      courseIntros: {
         "AI for Mini-App Making": "Lovable is your primary app builder in this course. Describe the tool, form, or web app you want in plain English, and Lovable builds clean, functional frontend and backend code in real time. Iterate conversationally until your app looks and behaves exactly as you need — no coding experience required.",
         "Earning-Focused AI": "Build client-facing web apps, tools, and portals as a premium freelance offering. Lovable lets you ship functional, production-ready applications for clients at a fraction of the usual development cost and time — allowing you to offer app development services confidently as a solo operator."
      },
      lectures: [
         { title: "Lovable - Building Interfaces Natively", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Lovable/dce2fa4400bb47d88855bb8187d8e939.mp4", duration: "11 min" },
         { title: "Lovable - Integrating APIs & Services", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Lovable/67c32f2383134d4ebb6396d9f9af34e7.mp4", duration: "13 min" },
         { title: "Lovable - State Management & Forms", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Lovable/37803da4608747d9ae3422d683b4fdb2.mp4", duration: "12 min" },
         { title: "Lovable - Live Publishing & Domains", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Lovable/9dd05eddb79f4688bc2889243390349a.mp4", duration: "14 min" }
      ],
      assignment: { questionText: "Use Lovable to create a user registration form layout. Take a screenshot of the app dashboard preview and upload it." },
      mcqTest: [
         { question: "What is Lovable?", options: ["An AI app development platform", "A dating website", "A photo collage tool", "A compiler utility"], answer: 0 },
         { question: "How do you build components in Lovable?", options: ["By writing manual C++ code", "By communicating with the AI assistant in natural language", "By using a drag-and-drop page builder without AI", "By uploading excel spreadsheets"], answer: 1 },
         { question: "Does Lovable support live deployments?", options: ["No, it's for offline mockups only", "Yes, you can publish apps directly to a live URL", "Only on local host servers", "Only on mobile device simulators"], answer: 1 },
         { question: "Lovable is particularly helpful for:", options: ["Designing high-speed aircraft", "Creating production-ready web apps and MVPs rapidly", "Editing high-fidelity audio tracks", "Writing database triggers"], answer: 1 },
         { question: "Can you export code from Lovable?", options: ["No, the code is private", "Yes, Lovable allows syncing or exporting code (e.g. to GitHub)", "Only as a PDF document", "Only as an image screenshot"], answer: 1 }
      ]
   },
   "Suno": {
      name: "Suno",
      introText: "Suno is a revolutionary AI music generator. It creates fully produced songs complete with lyrics, vocals, instruments, and polished mixes based on simple descriptive prompts.",
      courseIntros: {
         "AI for Marketing": "Create custom background music and audio branding for your marketing videos, reels, ads, and social content using Suno. Describe your brand's mood and get a fully produced, royalty-free track in minutes — giving your campaigns a professional sonic identity without any music budget.",
         "Earning-Focused AI": "Offer AI music production as a scalable freelancing service. Use Suno to generate custom jingles, background tracks for video content creators, promotional audio for brands, and original music for client projects — a high-demand creative service with near-zero production cost."
      },
      lectures: [
         { title: "Suno - Creating Custom Tracks", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Suno/2e3b1d98014f47308b59586dd0d320db.mp4", duration: "12 min" },
         { title: "Suno - Adjusting Lyrics & Styles", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Suno/ab3d75fc84c047bbad1b2198ee01d659.mp4", duration: "14 min" },
         { title: "Suno - Instrumental vs Vocal Modes", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Suno/04d247922c9b4677a1e524d96f2609d7.mp4", duration: "13 min" },
         { title: "Suno - Custom Audio Uploads", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Suno/fd5efe006c3a42feb7bd926b4ddb70d2.mp4", duration: "15 min" },
         { title: "Suno - Song Extensions & Splits", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Suno/87c1b268b3c64fdfac332606620dd62c.mp4", duration: "14 min" },
         { title: "Suno - Mastering & Quality Control", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Suno/637076b5d669439c915124ac1f5831d6.mp4", duration: "13 min" },
         { title: "Suno - Exporting Audio & Videos", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Suno/5c9c82cceac44580bcc255fd75e6149b.mp4", duration: "15 min" }
      ],
      assignment: { questionText: "Generate an AI marketing background song in Suno, copy-paste your lyrics prompt, and upload a screenshot of the generated track dashboard." },
      mcqTest: [
         { question: "What is Suno?", options: ["An AI music generator", "A photo organizer", "A file compressor", "A weather forecaster"], answer: 0 },
         { question: "Which options does Suno offer to create music?", options: ["Only plain instrumental tracks", "Fully produced tracks with vocals, lyrics, and instrumentals", "Only MIDI data files", "Only sheet music PDFs"], answer: 1 },
         { question: "What is the Custom Mode in Suno?", options: ["A mode to pay extra fees", "A setting that lets you write your own lyrics and specify the genre/style tag", "An offline mode", "A voice editor"], answer: 1 },
         { question: "How does the 'Extend' feature work in Suno?", options: ["It adds more instruments to the track", "It lets you continue a generated song from a specific second to make it longer", "It increases volume", "It compresses files"], answer: 1 },
         { question: "You can download generated tracks from Suno as:", options: ["Only raw text transcripts", "MP3 audio or MP4 video files", "Excel spreadsheets", "ZIP folders containing binary folders"], answer: 1 }
      ]
   },
   "Teal AI": {
      name: "Teal AI",
      introText: "Teal AI (Teal) is an all-in-one career guidance platform that helps you build optimized ATS-compliant resumes, manage job searches, track applications, and prepare for interviews.",
      courseIntros: {
         "Job & Career Planning": "Teal AI scores your resume against each job description to show you exactly how well your keywords match the ATS filters recruiters use. Upload your resume, paste a job description, and Teal tells you precisely what is missing — so you can tailor every application for maximum visibility before it even reaches a human recruiter."
      },
      lectures: [
         { title: "Teal AI - Dashboard Setup & Job Tracker", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Teal_AI/c162339d0f664112b0e2c389b1bedc70.mp4", duration: "12 min" },
         { title: "Teal AI - ATS Resume Optimization", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Teal_AI/83e0543b94e748949efdc24a037c4dac.mp4", duration: "14 min" },
         { title: "Teal AI - Tailoring Cover Letters", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Teal_AI/13c3b1bdd0624064bc40c270da5bb2b8.mp4", duration: "13 min" },
         { title: "Teal AI - Keyword Matching for Resumes", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Teal_AI/5beb7864419f4da69ad73ef00a513d5c.mp4", duration: "15 min" },
         { title: "Teal AI - Application Checklists & Reminders", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Teal_AI/bedc808c178a4387b7fadc9020f96fec.mp4", duration: "14 min" },
         { title: "Teal AI - Analytics & Job Search Progress", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Teal_AI/b5b1c75fc71b4584a3a4547603fc2650.mp4", duration: "15 min" }
      ],
      assignment: { questionText: "Use Teal AI to tailor a resume section to a specific job description. Upload a screenshot of your match score page." },
      mcqTest: [
         { question: "What is Teal AI?", options: ["An ATS resume builder and job application tracker", "A social media networking site", "An email marketing server", "A visual graphics program"], answer: 0 },
         { question: "What does ATS stand for?", options: ["Advanced Text Setup", "Applicant Tracking System", "Application Transition Server", "Automatic Tuning System"], answer: 1 },
         { question: "How does Teal AI assist with resume building?", options: ["By importing graphic illustrations", "By scoring and matching your resume bullets against job description keywords", "By editing photo files", "By hosting a local server"], answer: 1 },
         { question: "Can you track jobs from multiple boards in Teal?", options: ["No, it only tracks jobs from LinkedIn", "Yes, using the Teal Chrome extension, you can bookmark and track job openings from multiple sites", "Only by typing them in notepad", "Only if you copy-paste the raw database"], answer: 1 },
         { question: "Teal AI's job search tracker monitors:", options: ["Your daily step count", "The status of your job applications (Applied, Interviewing, Offer)", "Global temperature values", "Web server responses"], answer: 1 }
      ]
   },
   "Huntr AI": {
      name: "Huntr AI",
      introText: "Huntr AI (Huntr) is a modern job search CRM that organizes applications, generates tailored resumes, tracks tasks, and optimizes resumes using AI keyword extraction.",
      courseIntros: {
         "Job & Career Planning": "Huntr AI is your job search command center. Organize every application on a visual kanban board, log recruiter contacts, set follow-up reminders, and generate ATS-tailored resumes for each role. It ensures no opportunity falls through the cracks while keeping your entire search strategic and fully trackable from one dashboard."
      },
      lectures: [
         { title: "Huntr AI - Setup & Board Customization", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Huntr_AI/039de8a5000d4e14a87b9fcad26ec802.mp4", duration: "11 min" },
         { title: "Huntr AI - AI Resume Generator & Tailoring", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Huntr_AI/7c4bbd52159f4672b539963af3f2694b.mp4", duration: "13 min" },
         { title: "Huntr AI - Job Board Integrations", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Huntr_AI/1d98797bf4cc473abf78b67a91dc2fd5.mp4", duration: "12 min" },
         { title: "Huntr AI - Task Management & Deadlines", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Huntr_AI/c74eb60720a44d4cae5a716f4c472b96.mp4", duration: "14 min" },
         { title: "Huntr AI - Contact Logging & Networking", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Huntr_AI/1746d88d916b47849aae6ef3f25ca33e.mp4", duration: "15 min" },
         { title: "Huntr AI - Metrics & Interview Tracker", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Huntr_AI/f466ceda3143405babb08853d5fe68d2.mp4", duration: "13 min" },
         { title: "Huntr AI - Summary & Best Workflows", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Huntr_AI/d5b08c251b884998879ebbe0f601abc0.mp4", duration: "15 min" }
      ],
      assignment: { questionText: "Set up a Huntr job search board, add a target job card, and upload a screenshot of your active pipeline board." },
      mcqTest: [
         { question: "What is the primary purpose of Huntr AI?", options: ["A job application CRM and AI resume organizer", "Editing pictures", "Creating audio files", "Compressing files"], answer: 0 },
         { question: "Which feature is core to Huntr?", options: ["A visual kanban board for job application pipelines", "A compiler framework", "A vector layout editor", "An operating system shell"], answer: 0 },
         { question: "Can Huntr pull job details automatically?", options: ["No, everything must be entered manually", "Yes, using the Huntr browser extension, you can clip and save job details instantly", "Only if you write custom SQL scripts", "Only from local files"], answer: 1 },
         { question: "Huntr's resume builder uses AI to:", options: ["Translate resumes to Latin", "Highlight keyword gaps between resumes and job specs", "Draw cartoon caricatures", "Encrypt files"], answer: 1 },
         { question: "What should you log in Huntr?", options: ["Your music playlists", "Job application dates, contacts, notes, and task reminders", "Local computer files", "Browser cookies"], answer: 1 }
      ]
   },
   "MagicSchool AI": {
      name: "MagicSchool AI",
      introText: "MagicSchool AI is a dedicated platform for educators, providing dozens of AI-powered tools for lesson planning, quiz generation, worksheets, and rubric creation, helping teachers save hours of administrative work.",
      courseIntros: {
         "AI for Teachers": "MagicSchool AI is your primary AI teaching assistant in this course. Generate complete lesson plans aligned to curriculum objectives, create MCQ quizzes in seconds, build worksheets, design rubrics, write differentiated IEP suggestions, and produce student feedback reports — all from simple prompts. What used to take hours of admin work now takes minutes."
      },
      lectures: [
         { title: "MagicSchool AI - Introduction & Classroom Setup", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/MagicSchool_AI/f0002cc1bed74b2cba26257cc7f5d748.mp4", duration: "12 min" },
         { title: "MagicSchool AI - Lesson Planner & Objectives", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/MagicSchool_AI/4e9ec6cb5ef74a0baf7b25654d01621f.mp4", duration: "14 min" },
         { title: "MagicSchool AI - MCQ Quiz Generator", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/MagicSchool_AI/87f0cacc118f44e5ba76a9aa1e406578.mp4", duration: "13 min" },
         { title: "MagicSchool AI - Rubric Generator", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/MagicSchool_AI/676092867539450ca3938d40b8f1a36c.mp4", duration: "15 min" },
         { title: "MagicSchool AI - IEP Suggestion Helper", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/MagicSchool_AI/2ee6eb9d15434a6a8c33a0b0d5b67b7e.mp4", duration: "14 min" },
         { title: "MagicSchool AI - Student Feedback Generator", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/MagicSchool_AI/4dc4f1a972844f84b1936f980edfc75b.mp4", duration: "13 min" },
         { title: "MagicSchool AI - Video Questions Generator", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/MagicSchool_AI/80b27bedf1bf457e82623e3adf688b65.mp4", duration: "15 min" },
         { title: "MagicSchool AI - Worksheet Creator", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/MagicSchool_AI/796017158c834665bb1c2eb3a5957de6.mp4", duration: "14 min" },
         { title: "MagicSchool AI - Summary & Sharing Options", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/MagicSchool_AI/b4a7413ee6a84cb18a1a2ae20b5d1503.mp4", duration: "15 min" }
      ],
      assignment: { questionText: "Use MagicSchool AI's Lesson Planner to generate a 1-hour lesson outline for any topic. Save the plan and upload a screenshot." },
      mcqTest: [
         { question: "What is MagicSchool AI?", options: ["An AI productivity suite specifically designed for educators", "A gaming application", "A server management interface", "An operating system"], answer: 0 },
         { question: "Which generator is NOT found in MagicSchool AI?", options: ["MCQ Quiz Generator", "Lesson Planner", "SQL database query compiler", "IEP (Individualized Education Program) generator"], answer: 2 },
         { question: "How does the 'Video Questions' tool work in MagicSchool?", options: ["It edits video frames", "It creates worksheets with questions based on a provided YouTube video URL", "It records student voices", "It plays background music"], answer: 1 },
         { question: "What does MagicSchool AI help teachers save?", options: ["Hours of administrative and lesson preparation work", "School budget funds", "Keyboard battery life", "Physical paper storage"], answer: 0 },
         { question: "Rubric generators in MagicSchool help with:", options: ["Calculating grade averages", "Creating consistent and structured grading criteria for assignments", "Drawing charts", "Hosting school websites"], answer: 1 }
      ]
   },
   "Heygen": {
      name: "Heygen",
      introText: "Heygen (labeled Hygen in some graphics) is an AI video generator that lets you create professional business or marketing videos with speaking AI avatars, voice translation, and high-fidelity lip sync in minutes.",
      courseIntros: {
         "AI for Marketing": "Create presenter-style marketing videos with AI avatars without a camera or studio. HeyGen lets you produce product demo videos, brand spokesperson content, and multi-language marketing campaigns at a fraction of traditional production cost — ready for YouTube, LinkedIn, or paid ad placements.",
         "AI for Sales": "Produce personalized video messages and product demo videos using AI avatars in HeyGen. Send a custom video to each prospect as part of your outreach cadence, or create a multilingual product demo that reaches global markets — without re-recording a single session."
      },
      lectures: [
         { title: "Heygen - AI Avatars & Video Creation", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Heygen/bff6578642ad4fe3bbfbcddbd558fc83.mp4", duration: "12 min" },
         { title: "Heygen - Voice Cloning & Audio Uploads", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Heygen/bef9d18ddfd54f869c797515229fbc67.mp4", duration: "14 min" },
         { title: "Heygen - Video Templates & Brand Kit", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Heygen/c32deeafe9e1439d91359f1c4fe89613.mp4", duration: "13 min" },
         { title: "Heygen - Translation & Final Rendering", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Heygen/23c931b5446b48cbb4a4cde2dae74925.mp4", duration: "15 min" }
      ],
      assignment: { questionText: "Use Heygen to generate a short avatar greeting video. Take a screenshot of the video editing interface and upload it here." },
      mcqTest: [
         { question: "What is Heygen primarily used for?", options: ["Creating videos with photorealistic AI avatars and voiceovers", "Hosting web applications", "Managing databases", "Synthesizing vocal music"], answer: 0 },
         { question: "What is an AI avatar in Heygen?", options: ["A cartoon drawing", "A photorealistic digital representation of a person that speaks from text", "A video filter", "A database query language"], answer: 1 },
         { question: "Heygen is best suited for:", options: ["Video editing", "Generating business, training, and marketing videos easily", "Compiling python code", "Financial audits"], answer: 1 },
         { question: "To generate a video in Heygen, you provide:", options: ["A script in text or audio form", "A video file of the camera setup", "An audio clip of music", "A spreadsheet of numbers"], answer: 0 },
         { question: "Heygen helps by:", options: ["Adding background music", "Creating high-quality presenter presenter videos without using a camera", "Translating documents to Spanish", "Encrypting files"], answer: 1 }
      ]
   },
   "Zapier": {
      name: "Zapier",
      introText: "Zapier is an industry-leading automation platform. It connects thousands of apps to automate repetitive manual tasks and workflows, triggered automatically by actions you define.",
      courseIntros: {
         "White Collar Executive AI": "Automate the administrative overhead that consumes executive time. Connect your calendar, email, CRM, and reporting tools so that routine tasks — meeting summaries to Slack, leads to CRM, reports to Drive — happen automatically the moment a trigger fires, freeing your focus for strategy.",
         "AI for Marketing": "Automate your entire marketing funnel. Connect lead forms to your CRM, trigger email sequences when a prospect downloads content, post scheduled social updates, and sync campaign performance data to dashboards — all running automatically while you focus on creative strategy.",
         "AI for Sales": "Automate your sales workflow — log Apollo leads directly to your CRM, trigger follow-up emails after demos, send Slack alerts on deal updates, and auto-populate pipeline reports. Zapier removes the CRM admin overhead so your team stays focused on selling and closing.",
         "AI for Business Workflow Automation": "Zapier is the core engine of this course. It connects all your business apps — email, CRM, spreadsheets, project management, forms, and more — to create automated workflows that eliminate repetitive manual tasks and keep your entire business operations running on autopilot.",
         "AI for Mini-App Making": "Connect your mini apps to the broader business ecosystem using Zapier. When a user submits a form in your app, Zapier can automatically send them an email, log the data to a Google Sheet, alert you on Slack, or trigger any downstream action — without writing backend API code.",
         "Earning-Focused AI": "Automate your own freelance operations and offer automation setup as a premium client service. Build client-specific Zaps that connect their tools, reduce manual work, and free up their team — a high-value, recurring service that earns retainer income as automations grow."
      },
      lectures: [
         { title: "Zapier - Dashboard & Setting up Zaps", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Zapier/32ae3a46dd0b4c3e8431dad0fd65c832.mp4", duration: "11 min" },
         { title: "Zapier - Understanding Triggers", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Zapier/10c3e971b3114060b361e18f329f7059.mp4", duration: "12 min" },
         { title: "Zapier - Configuring Actions & Fields", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Zapier/6df041b188234c0381a177155f7904dd.mp4", duration: "13 min" },
         { title: "Zapier - Testing & Activating Zaps", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Zapier/4be1552cb16d4a129e620a673bdc9b51.mp4", duration: "12 min" },
         { title: "Zapier - Multi-Step Zaps & Paths", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Zapier/5ae77ca63acf41c7a2db8da8c543fdd7.mp4", duration: "14 min" },
         { title: "Zapier - Formatter Tools & Formatting Text", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Zapier/9889a1edc1cf4037b5cf29534d2e24c3.mp4", duration: "13 min" },
         { title: "Zapier - Connecting Google Sheets & Gmail", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Zapier/99eb62c643ad4544b09711e07f44eebb.mp4", duration: "15 min" },
         { title: "Zapier - Delay & Schedule Triggers", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Zapier/1f3252297cb9474bb22726883ea8ac5e.mp4", duration: "14 min" },
         { title: "Zapier - Error Handling & Troubleshooting", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Zapier/41b29bfbe739434cb430b8fda50c574b.mp4", duration: "13 min" },
         { title: "Zapier - Advanced Webhooks & Summary", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Zapier/523247e36ba54d53bc302f4d4b8e76f7.mp4", duration: "15 min" }
      ],
      assignment: { questionText: "Set up a two-step Zap in Zapier (e.g. Gmail to Google Sheets), run a successful test, and upload a screenshot of your active Zap configuration." },
      mcqTest: [
         { question: "What is the primary function of Zapier?", options: ["To connect different apps and automate workflows", "To build databases", "To edit images", "To compile software"], answer: 0 },
         { question: "In Zapier, what is a 'Trigger'?", options: ["The event that starts a Zap", "An error message", "A payment gateway", "A web server reboot"], answer: 0 },
         { question: "In Zapier, what is an 'Action'?", options: ["The operation a Zap performs after it's triggered", "A customer support request", "A browser extension", "An export button"], answer: 0 },
         { question: "Which tool in Zapier helps you clean up or split incoming text?", options: ["Zapier Parser", "Zapier Formatter", "Zapier Webhook", "Zapier Router"], answer: 1 },
         { question: "A multi-step Zap allows you to:", options: ["Only run one action per trigger", "Trigger multiple actions from a single event, including filters and branches", "Only connect two apps", "Play video tutorials"], answer: 1 }
      ]
   },
   "Instantly": {
      name: "Instantly",
      introText: "Instantly is a powerful email outreach platform. It enables scalable cold email campaigns with automatic warm-ups, email sending, custom tracking, and unified inbox management.",
      courseIntros: {
         "AI for Sales": "Once you have your lead list from Apollo, Instantly automates the entire cold outreach process. Set up personalized email sequences, warm up your sending domains to stay out of spam, manage replies from all campaigns in one unified inbox, and track open and reply rates to continuously improve your booked meeting rate."
      },
      lectures: [
         { title: "Instantly - Platform & Domain Setup", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Instantly/953245122c4c474ab054a249d16acc3d.mp4", duration: "12 min" },
         { title: "Instantly - Email Warmup Basics", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Instantly/6a1ffa2529d14908b755df978aaefd3e.mp4", duration: "13 min" },
         { title: "Instantly - Creating Campaigns & Templates", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Instantly/5c0994508df14f8c8f627456e77f737b.mp4", duration: "12 min" },
         { title: "Instantly - Sequencing Emails & Delays", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Instantly/1793cccdbe1947a2afe5a11b7fbe995d.mp4", duration: "14 min" },
         { title: "Instantly - Unibox Management & Replies", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Instantly/01cf3a05b4ec4c289aec7686da299415.mp4", duration: "15 min" },
         { title: "Instantly - Tracking Campaign Analytics", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Instantly/1ce4c2fed0f84379a14d95cb2bb889ca.mp4", duration: "14 min" },
         { title: "Instantly - Deliverability Tips & Best Practices", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Instantly/413206dd12d842afb3c72e9d355c2c12.mp4", duration: "15 min" }
      ],
      assignment: { questionText: "Set up a draft email campaign in Instantly, add a sequence template, and upload a screenshot of your outreach dashboard." },
      mcqTest: [
         { question: "What is Instantly primarily used for?", options: ["Cold email outreach and email warmup automation", "Video rendering", "Hosting web applications", "Managing databases"], answer: 0 },
         { question: "What does 'Email Warmup' accomplish?", options: ["It heats up your computer processor", "It gradually increases email volume to build domain reputation and deliverability", "It translates emails to multiple languages", "It formats plain text files"], answer: 1 },
         { question: "What is the Instantly 'Unibox'?", options: ["A paid subscription folder", "A unified inbox to view and reply to messages from all campaigns in one place", "An email signature designer", "A file compression archive"], answer: 1 },
         { question: "How does Instantly help scale outreach?", options: ["By automatically drafting templates and managing multi-account sending", "By making phone calls for you", "By purchasing domain servers", "By printing envelope tags"], answer: 0 },
         { question: "To check deliverability metrics, Instantly provides:", options: ["Analytics dashboards showing Open, Click, and Reply rates", "Only a spell checker", "Only audio alarms", "Excel charts download"], answer: 0 }
      ]
   },
   "Apollo AI": {
      name: "Apollo AI",
      introText: "Apollo AI (Apollo.io) is a leading sales intelligence and lead generation platform. It provides access to a database of millions of professional contacts, along with tools to target, reach, and close leads.",
      courseIntros: {
         "AI for Sales": "Apollo AI is the foundation of your sales pipeline. Search a database of millions of verified B2B contacts, filter by title, industry, and company size, and build targeted prospect lists in minutes. Use it to find the right decision-makers and get their verified contact details — eliminating hours of manual LinkedIn research."
      },
      lectures: [
         { title: "Apollo AI - Search Database & Leads Targeting", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Apollo_AI/6d624deeeb0c42a8be723ba937fa74ca.mp4", duration: "12 min" },
         { title: "Apollo AI - Building Leads Lists", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Apollo_AI/0f520f8f3a32406bae8af5d32ad94c07.mp4", duration: "14 min" },
         { title: "Apollo AI - Sequence Builder & Emails", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Apollo_AI/6910083e1d594784a94d0912a0961e14.mp4", duration: "13 min" },
         { title: "Apollo AI - Dialing & Cold Calling Integration", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Apollo_AI/a45a9700614d4dcdbd1cd789159437a7.mp4", duration: "15 min" },
         { title: "Apollo AI - Chrome Extension for CRM integration", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Apollo_AI/8e1c74fdeeb7437aa4a252ecdcc751b4.mp4", duration: "14 min" },
         { title: "Apollo AI - Campaign Analysis & Analytics", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Apollo_AI/e9c1fbb07a514baba4c027594905a631.mp4", duration: "15 min" }
      ],
      assignment: { questionText: "Build a target prospect list of 10 executives using Apollo AI search filters. Export the search or screenshot the list and upload it." },
      mcqTest: [
         { question: "What is Apollo AI?", options: ["A sales intelligence and B2B contact database platform", "A music editor", "A website builder", "A data compressor"], answer: 0 },
         { question: "How does Apollo AI help sales teams?", options: ["By providing verified email and phone contact details of B2B prospects", "By hosting a secure backup database", "By coding API scripts", "By printing flyers"], answer: 0 },
         { question: "Apollo AI integrates with CRM systems to:", options: ["Export PDFs", "Sync leads and contacts directly into Salesforce, HubSpot, etc.", "Only copy paste contacts", "Encrypt files"], answer: 1 },
         { question: "What does the Sequence tool do in Apollo?", options: ["It defines database schemas", "It sends automated follow-up email campaigns to selected prospects", "It formats code blocks", "It calculates numbers"], answer: 1 },
         { question: "Which filters can you use in Apollo to search for contacts?", options: ["Title, Company Name, Industry, Location, and Employee Count", "Only Company Name", "Only Location", "Only Employee Count"], answer: 0 }
      ]
   },
   "Pomelli": {
      name: "Pomelli",
      introText: "Pomelli is a smart, focused productivity and task organizer. It uses the Pomodoro technique combined with task integrations (like Trello or Todoist) to keep white-collar professionals locked in and productive.",
      courseIntros: {
         "White Collar Executive AI": "Deep work is your most valuable executive asset. Pomelli structures your day using focused work sprints so high-priority strategic work gets completed without interruption — keeping you sharp and productive across back-to-back executive commitments and meetings.",
         "AI for Marketing": "Content marketing demands sustained, deep focus. Pomelli keeps your creative sessions structured with timed sprints, so campaign creation, content calendars, and copy reviews get completed without the constant distraction drain that breaks creative momentum.",
         "AI for Business Workflow Automation": "Automation design requires sustained concentration. Pomelli keeps your focus locked during the complex, detail-intensive work of mapping and building multi-step business automation workflows — protecting your best thinking hours from interruption and context-switching.",
         "Degree & MBA Graduate Productivity": "Deep, focused work is the graduate professional's greatest competitive advantage. Pomelli structures your daily work into focused sprints so your highest-leverage tasks — analysis, writing, and strategic thinking — get your best concentration rather than being scattered throughout the day."
      },
      lectures: [
         { title: "Pomelli - App Overview & Setup", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Pomelli/ba93636bb4744245a66d08de41f8f7d4.mp4", duration: "12 min" },
         { title: "Pomelli - Integrating Trello & Todoist", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Pomelli/c2e265bb28a14e34afe92151352e63da.mp4", duration: "14 min" },
         { title: "Pomelli - Mastering Focus & Analytics", videoUrl: "https://pub-0654df1c093a4227bbda6ccde6e92462.r2.dev/capoasis/Pomelli/54ef4dd1e9754cb392f79dc4b986d7e1.mp4", duration: "13 min" }
      ],
      assignment: { questionText: "Set up a Pomodoro work session for a project task in Pomelli. Upload a screenshot of your completed timer or session stats dashboard." },
      mcqTest: [
         { question: "What is Pomelli?", options: ["A Pomodoro focus timer and task integration organizer", "A music player", "A database server", "An operating system shell"], answer: 0 },
         { question: "Which technique does Pomelli utilize?", options: ["Kanban", "Pomodoro Technique (structured work/break cycles)", "Agile Sprinting", "Scrumming"], answer: 1 },
         { question: "Pomelli integrates directly with which task tools?", options: ["Trello, Todoist, and others", "Only Notepad", "Only local directories", "Only web browsers"], answer: 0 },
         { question: "The goal of using Pomelli is to:", options: ["Increase internet speed", "Improve concentration and track work session durations", "Manage database backups", "Write CSS code"], answer: 1 },
         { question: "How long is a standard Pomodoro work interval?", options: ["5 minutes", "25 minutes", "1 hour", "4 hours"], answer: 1 }
      ]
   }
};

const staticCourses = [
    {
        title: "AI Mastery: From Beginner to Professional",
        badge: "₹7999",
        image: "images/Thumbs/white_collor_thumb.png",
        rating: 5,
        ratingText: "(5.0)",
        lessons: 12,
        students: "15k+",
        description: "Learn 21 AI tools to work smarter, build faster, market better, and earn more.",
        enrollUrl: "https://lms.capoasis.com/checkout/7",
        tools: [
            "ChatGPT",
            "Claude AI",
            "Gemini",
            "Perplexity",
            "NotebookLM",
            "Gamma",
            "Canva",
            "Grammarly",
            "Napkin AI",
            "ElevenLabs",
            "Bolt",
            "Lovable",
            "Suno",
            "Teal AI",
            "Huntr AI",
            "MagicSchool AI",
            "Heygen",
            "Zapier"
        ]
    }
];

export const getStructuredCourse = (course, index) => {
    // Resolve string tool names into their full object definitions
    const resolvedTools = (course.tools || []).map(t => {
        let toolObj;
        if (typeof t === 'string') {
            toolObj = ALL_TOOLS[t] ? JSON.parse(JSON.stringify(ALL_TOOLS[t])) : { 
                name: t, 
                introText: `Welcome to ${t}! In this module, we will explore its main functions.`, 
                lectures: [], 
                assignment: { questionText: `Complete a task using ${t}.` }, 
                mcqTest: [] 
            };
        } else {
            toolObj = JSON.parse(JSON.stringify(t));
        }

        // Apply course-specific introText if available, otherwise keep the generic one
        if (toolObj.courseIntros && toolObj.courseIntros[course.title]) {
            toolObj.introText = toolObj.courseIntros[course.title];
        }

        // Attach course-specific introVideoUrl if available
        if (introVideos[toolObj.name] && introVideos[toolObj.name][course.title]) {
            toolObj.introVideoUrl = introVideos[toolObj.name][course.title];
        }

        // Format lecture titles:
        // 1st video as name "Introduction", rest as "[Tool Name] - Part 1", "[Tool Name] - Part 2", etc.
        if (toolObj.lectures) {
            toolObj.lectures = toolObj.lectures.map((lecture, lIdx) => ({
                ...lecture,
                title: lIdx === 0 ? "Introduction" : `${toolObj.name} - Part ${lIdx}`
            }));
        }

        return toolObj;
    });

    return {
        ...course,
        aboutText: course.aboutText || course.description || `Welcome to the ${course.title} package.`,
        tools: resolvedTools,
        masterAssignment: course.masterAssignment || (() => {
            const defaultPrompts = {
                "White Collar Executive AI": "Design a complete Executive AI workflow: Use ChatGPT/Claude to analyze a dense 10-page business document, generate a Napkin AI process flow diagram illustrating the operational structure, assemble a professional Gamma presentation summarizing the findings, and outline a Zapier integration that triggers automated summaries from Gmail intakes. Submit a screenshot showing your final presentation deck or workflow plan.",
                "AI for Marketing": "Develop a comprehensive Digital Product Launch Campaign: Generate copy assets in ChatGPT, design high-converting visual banners and templates in Canva, build an automated marketing slides proposal deck in Gamma, and set up a Suno campaign audio prompt script. Upload a screenshot of your Canva marketing graphics or campaign workflow map.",
                "AI for Sales": "Set up a complete B2B Lead Acquisition and Outreach Flow: Extract sales leads lists using Apollo AI, configure a personalized cold email drip campaign sequence inside Instantly, refine outreach scripts with Grammarly, and outline a Zapier workflow that updates your CRM. Submit a screenshot of your cold outreach sequence setup.",
                "AI for Business Workflow Automation": "Design a multi-stage Business Workflow Automation: Set up a Zapier trigger that processes incoming contact form intakes, passes the metadata to ChatGPT for categorization, appends details to a Google Sheets CRM, and triggers a personalized response via Gmail. Upload a screenshot of your active Zapier automation setup.",
                "Degree & MBA Graduate Productivity": "Prepare an Executive Strategy & Competitive Analysis Presentation: Perform real-time market search using Perplexity, compile research materials inside NotebookLM, sketch a core strategic flowchart in Napkin AI, and generate a polished 5-slide PDF deck in Gamma. Upload a screenshot of your final Perplexity citations or Gamma deck.",
                "Job & Career Planning": "Create your Personalized ATS-optimized Career Workbook: Optimize your resume for target positions using Teal AI, map out application tracking boards inside Huntr AI, generate custom cover letters in Claude AI, and draft answers to typical behavioral interview questions. Upload a screenshot of your Huntr application board or Teal resume analysis.",
                "AI for Mini-App Making": "Develop a Functional Mini-App Prototype: Wireframe your database logic in ChatGPT, build a working frontend prototype interface inside Bolt or Lovable, connect user interaction forms, and generate assets in Canva. Upload a screenshot of your working mini-app interface in Lovable/Bolt.",
                "Earning-Focused AI": "Build your Freelance Client Pitch and Proposal Deck: Create a high-converting client outreach script in ChatGPT, design a professional services portfolio layout in Canva, and assemble a 5-page proposal presentation in Gamma. Upload a screenshot of your portfolio proposal layout.",
                "AI for Teachers": "Build a Complete Interactive Course Study Pack: Design standard classroom lesson guides in MagicSchool AI, generate comprehensive homework worksheets in Canva, and set up an interactive study guide inside NotebookLM. Upload a screenshot of your MagicSchool lesson plan or worksheet."
            };
            return {
                questionText: defaultPrompts[course.title] || "Complete your final capstone project. Combine your skills and tools to build a comprehensive workflow. Take a detailed screenshot of your work and upload it here to graduate!"
            };
        })(),
        masterTest: course.masterTest || [
            { question: "What is the main objective of this course?", options: ["Saving time and automating tasks using AI tools", "Developing game applications", "Installing operating systems", "Creating hardware devices"], answer: 0 },
            { question: "Which feature is essential for AI-based workflows?", options: ["Input accuracy and prompt optimization", "High CPU clocks only", "Old database schemas", "Physical printing paper"], answer: 0 },
            { question: "How do you confirm tool completion in this syllabus?", options: ["By completing all tool lectures, assignments, and quizzes", "By waiting 30 days", "By paying extra fees", "By sending an email support request"], answer: 0 },
            { question: "What passing grade is needed on the Master Test to qualify for the course certificate?", options: ["50%", "60%", "75%", "90%"], answer: 1 },
            { question: "AI-assisted productivity saves approximately how many hours weekly?", options: ["None", "Up to 10+ hours", "Exactly 1 hour", "Less than 30 minutes"], answer: 1 },
            { question: "What is a custom 'GPT' or 'Gem' in conversational AI interfaces?", options: ["A paid API license key", "A customized version of the AI tailored with specific instructions and uploaded files", "A style library for CSS layouts", "A hardware graphics acceleration card"], answer: 1 },
            { question: "Which capability makes Claude AI particularly useful for analyzing long contracts or books?", options: ["High rendering speed for 3D models", "Its extremely large context window and safe, deep reasoning capabilities", "Its voice synthesizers", "Direct offline data syncs"], answer: 1 },
            { question: "In Zapier automation, what is the correct sequence of events?", options: ["A Trigger fires first, which then runs one or more Actions", "An Action runs first, which sets up a Trigger", "Tasks must be manually approved before anything fires", "Only schedule-based events can run"], answer: 0 },
            { question: "Why is Perplexity preferred for market research over basic search engines?", options: ["It does not show search results", "It provides conversational summaries backed by real-time URL citations", "It operates offline", "It downloads database backups directly"], answer: 1 },
            { question: "Which of the following is a primary rule of prompt engineering?", options: ["Write very short, single-word inputs", "Inject clear context, constraints, output structures, and examples", "Use complex code markup exclusively", "Avoid using punctuation"], answer: 1 },
            { question: "What is the primary benefit of Google's NotebookLM?", options: ["It searches the open web randomly", "It answers queries grounded strictly in your private uploaded sources (PDFs, Docs, Links)", "It compiles Python scripts", "It records podcasts from your voice"], answer: 1 },
            { question: "What does Canva's 'Magic Switch' feature do?", options: ["Resizes and translates designs automatically using AI", "Draws vector shapes", "Deletes background files", "Installs fonts"], answer: 0 },
            { question: "What is the core function of Napkin AI?", options: ["Writing code programs", "Converting plain text descriptions into visual flowcharts, mind maps, and diagrams", "Editing sound tracks", "Managing database schemas"], answer: 1 },
            { question: "How should you handle information generated by an LLM before using it professionally?", options: ["Publish it immediately without checking", "Cross-verify and fact-check key outputs to prevent hallucinations and errors", "Translate it to binary", "Discard it immediately"], answer: 1 },
            { question: "What does 'Multimodal AI' refer to?", options: ["AI that can run on multiple computers at once", "AI that natively processes and understands different media types (text, images, audio, video) together", "AI with multiple interface colors", "AI that requires offline database tables"], answer: 1 }
        ]
    };
};

// Auto-migrate local storage if outdated custom courses exist
try {
    const saved = localStorage.getItem('gyanschool_custom_courses');
    if (saved) {
        if (saved.includes("AI for Finance") || !saved.includes("Napkin AI") || saved.includes("7bba0eeef275421b92243b4084fe2a33_GAMMA.mp4")) {
            localStorage.removeItem('gyanschool_custom_courses');
            localStorage.removeItem('gyanschool_progress'); // reset progress as well to prevent step offset errors
        }
    }
} catch (e) {}

export const courses = (() => {
    try {
        const saved = localStorage.getItem('gyanschool_custom_courses');
        if (saved) return JSON.parse(saved);
    } catch (e) {}
    return staticCourses;
})();

export const getEnrichedCourses = () => {
    let list = staticCourses;
    try {
        const saved = localStorage.getItem('gyanschool_custom_courses');
        if (saved) {
            list = JSON.parse(saved);
        }
    } catch (e) {}
    return list.map((c, i) => getStructuredCourse(c, i));
};
