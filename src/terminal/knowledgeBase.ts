export type QAPair = {
  id: string;
  patterns: RegExp[];
  answer: string[];
};

export type TerminalFile = {
  name: string;
  description: string;
  content: string[];
};

export type FaqItem = {
  question: string;
  useCase: string;
  prompt: string;
};

export const TERMINAL_BANNER: string[] = [
  'RUSHIL_OS v5.2.0 (x86_64)',
  'Rule-based assistant online. Type "help" or "faq".'
];

export const SECTORS = ['home', 'agents', 'core', 'missions', 'career', 'docs', 'contact'] as const;

export const TERMINAL_FILES: TerminalFile[] = [
  {
    name: 'quickstart.md',
    description: 'How to use this terminal quickly',
    content: [
      '1) Run help -> understand command categories.',
      '2) Run faq -> discover high-value questions.',
      '3) Run cat commands.md -> view full command matrix.',
      '4) Run cat cat-guide.md -> learn file-style exploration.',
      '5) Ask directly: what are your core skills?'
    ]
  },
  {
    name: 'whoami.md',
    description: 'Professional snapshot',
    content: [
      'Rushil Dhube',
      'AI & ML Engineer focused on healthcare AI, computer vision, NLP/RAG, and automation systems.',
      'Current focus: production-ready intelligent systems with measurable outcomes.'
    ]
  },
  {
    name: 'skills.md',
    description: 'Core tech stack',
    content: [
      'Languages: Python, Java, C/C++, SQL, JavaScript',
      'ML/DL: TensorFlow, PyTorch, Keras, Scikit-Learn, Transformers',
      'Backend: FastAPI, Flask, Django, REST APIs, OAuth2/JWT',
      'Data/DB: PostgreSQL, MongoDB, Qdrant, SQLAlchemy',
      'Automation: Make.com, Meta Graph API, Gemini, Veo, STT/TTS',
      'DevOps: Docker, Git/GitHub, CI/CD, Linux, GCP'
    ]
  },
  {
    name: 'projects.md',
    description: 'Flagship project index',
    content: [
      '1) Dental Disease Classification - ViT + FastAPI (92.28%)',
      '2) Eye Disease Classifier - CNN + Flask/Streamlit (92.4%)',
      '3) Safe Surf AI - URL threat detection extension',
      '4) Deepfake Detection System - image/video/audio',
      '5) WellBe Revive 360 - RAG nutrition assistant',
      '6) ConsumeWise - OCR + NLP ingredient risk bot',
      '7) NeuroMedix - neurological disease prediction',
      '8) SniperThink Stack - social automation + agent pipelines'
    ]
  },
  {
    name: 'experience.md',
    description: 'Experience timeline',
    content: [
      'Ethosh - Artificial Intelligence Engineer (Dec 2025 - Present)',
      'SniperThink - AI Engineer (Sep 2025 - Dec 2025)',
      'WellBe Revive 360 - AI Intern (Sep 2025 - Nov 2025)',
      'Edunet Foundation - AI Intern (Feb 2025 - Apr 2025)'
    ]
  },
  {
    name: 'education.md',
    description: 'Education records',
    content: [
      'B.E. AI & ML (ISBM / SPPU) 2022-2026 | CGPA 7.85 | Current SGPA 9.07',
      'HSC Science (Vidyaniketan College) 79.33%',
      'CBSE 10th (VPM\'s B.R. Tol School) 73.83%'
    ]
  },
  {
    name: 'certifications.md',
    description: 'Certifications and rankings',
    content: [
      'NPTEL Python for Data Science - Top 5% performer',
      'Coursera Supervised Machine Learning (Andrew Ng)',
      'C/C++ Certification - 95%',
      'Linux Training - 79.17%',
      'Arduino Training - 95%'
    ]
  },
  {
    name: 'achievements.md',
    description: 'Awards and recognition',
    content: [
      '1st Place - State-Level Hackathon (Ajeenkya D.Y. Patil SOT)',
      '1st Place - Intra-College Hackathon (ISBM COE)',
      '1st Place - Project Exhibition',
      'Winner - Debate Competition',
      'Participant - Aavishkar 2025 Zonal Research Competition'
    ]
  },
  {
    name: 'contact.md',
    description: 'Contact endpoints',
    content: [
      'Email: rushildhube1305@gmail.com',
      'LinkedIn: linkedin.com/in/rushildhube',
      'GitHub: github.com/rushildhube',
      'Location: Pune, Maharashtra, India'
    ]
  },
  {
    name: 'cat-guide.md',
    description: 'How cat works in this terminal',
    content: [
      'cat reads internal knowledge files and prints them in terminal output.',
      'Use it when you want structured, persistent info instead of short chat replies.',
      'Examples:',
      '  cat whoami.md',
      '  cat skills.md',
      '  cat projects.md',
      '  cat experience.md',
      'Typo-tolerant: cat whoamai -> auto-resolve suggestion to whoami.md.'
    ]
  },
  {
    name: 'commands.md',
    description: 'Terminal command list',
    content: [
      '[Navigation] open <sector>, cd <sector>, home, agents, core, missions, career, docs, contact',
      '[Discovery] help, help nav, help cat, help faq, ls, tree, pwd, faq',
      '[Profile Shortcuts] whoami, skills, projects, experience, education, certs, achievements, stack, internships',
      '[Knowledge Files] cat <filename> (e.g. cat skills.md, cat projects.md)',
      '[Chat Mode] ask <question> OR ask directly in natural language',
      '[Session] clear, exit'
    ]
  }
];

export const RULE_BASED_QA: QAPair[] = [
  {
    id: 'core-skills',
    patterns: [/core skills?/i, /main skills?/i, /key skills?/i, /what are your skills?/i],
    answer: [
      'Core skills: PyTorch/TensorFlow, CNNs/ViT, FastAPI/Flask/Django, RAG + Qdrant, automation with Make.com + Meta Graph API, Docker + CI/CD.'
    ]
  },
  {
    id: 'focus',
    patterns: [/what.*focus/i, /speciali[sz]e/i, /domain/i],
    answer: ['Primary focus: healthcare AI, computer vision, NLP/RAG systems, and automation engineering.']
  },
  {
    id: 'best-project',
    patterns: [/best project/i, /top project/i, /flagship/i],
    answer: ['Flagship systems include Dental Disease Classification (92.28%) and Eye Disease Classifier (92.4%).']
  },
  {
    id: 'internships',
    patterns: [/internship/i, /where.*intern/i, /worked as intern/i],
    answer: ['Internships: Edunet Foundation, WellBe Revive 360, plus AI Engineer role at SniperThink before current position.']
  },
  {
    id: 'current-role',
    patterns: [/current role/i, /currently working/i, /where are you working/i],
    answer: ['Current role: Artificial Intelligence Engineer at Ethosh (Dec 2025 - Present).']
  },
  {
    id: 'education',
    patterns: [/education/i, /degree/i, /college/i, /sgpa|cgpa/i],
    answer: ['B.E. in AI & ML (2022-2026), CGPA 7.85, current SGPA 9.07.']
  },
  {
    id: 'certs',
    patterns: [/certification/i, /certs/i, /nptel/i, /coursera/i],
    answer: ['NPTEL Top 5%, Coursera Supervised ML, C/C++, Linux, and Arduino certifications.']
  },
  {
    id: 'automation',
    patterns: [/automation/i, /make\.com/i, /meta graph/i, /pipeline/i],
    answer: ['Automation stack: Make.com + Meta Graph API + Gemini/Veo with voice/chat pipeline integrations.']
  },
  {
    id: 'rag',
    patterns: [/rag/i, /vector/i, /qdrant/i, /retrieval/i],
    answer: ['RAG systems include ingestion, chunking, embeddings, Qdrant retrieval, and TruLens-based evaluation.']
  },
  {
    id: 'vision',
    patterns: [/vision/i, /cnn/i, /vit/i, /medical imaging/i],
    answer: ['Vision capabilities: CNNs + ViT for medical imaging diagnostics with high validation accuracy.']
  },
  {
    id: 'backend',
    patterns: [/backend/i, /api/i, /fastapi|flask|django/i],
    answer: ['Backend stack: FastAPI, Flask, Django, async patterns, OAuth2/JWT, PostgreSQL/MongoDB.']
  },
  {
    id: 'healthcare-ai',
    patterns: [/healthcare/i, /medical/i, /diagnos/i, /retinal|dental/i],
    answer: ['Healthcare AI highlights: Dental Disease Classification (92.28%) and Eye Disease Classifier (92.4%).']
  },
  {
    id: 'security-projects',
    patterns: [/security/i, /phishing/i, /malicious url/i, /deepfake/i],
    answer: ['Security projects include Safe Surf AI (URL threat detection) and Deepfake Detection System (image/video/audio).']
  },
  {
    id: 'project-list',
    patterns: [/all projects/i, /project list/i, /what projects/i],
    answer: ['Use `cat projects.md` for the complete project list with short summaries.']
  },
  {
    id: 'resume-cv',
    patterns: [/resume/i, /cv/i, /dossier/i],
    answer: ['Use the GUI download action for the full CV. For terminal summary, run `cat whoami.md`, `cat skills.md`, and `cat experience.md`.']
  },
  {
    id: 'hackathons',
    patterns: [/hackathon/i, /competition/i, /aavishkar/i],
    answer: ['Achievements include state-level hackathon winner, intra-college hackathon winner, and Aavishkar 2025 participation.']
  },
  {
    id: 'leadership',
    patterns: [/leadership/i, /club/i, /workshop/i, /mentorship/i],
    answer: ['Leadership: Core member of AIML Club with event/workshop organization and peer mentorship involvement.']
  },
  {
    id: 'deployment',
    patterns: [/deployment/i, /production/i, /docker/i, /ci\/cd/i],
    answer: ['Deployment approach: API-first services with Dockerized workflows, reproducible local setup, and production-minded architecture.']
  },
  {
    id: 'languages',
    patterns: [/programming languages/i, /languages do you know/i, /python|java|c\+\+|javascript|sql/i],
    answer: ['Programming languages: Python, Java, C/C++, SQL, JavaScript.']
  },
  {
    id: 'availability-location',
    patterns: [/location/i, /where are you based/i, /based in/i, /pune/i],
    answer: ['Based in Pune, Maharashtra, India. Open to AI/ML opportunities and collaborations.']
  },
  {
    id: 'social-links',
    patterns: [/github/i, /linkedin/i, /portfolio/i],
    answer: ['GitHub: github.com/rushildhube | LinkedIn: linkedin.com/in/rushildhube']
  },
  {
    id: 'contact',
    patterns: [/contact/i, /email/i, /reach/i, /linkedin/i],
    answer: ['Use: rushildhube1305@gmail.com | linkedin.com/in/rushildhube | github.com/rushildhube']
  },
  {
    id: 'goal',
    patterns: [/goal/i, /career vision/i, /future/i],
    answer: ['Career vision: own full lifecycle of intelligent systems from research and architecture to deployment and evaluation.']
  },
  {
    id: 'achievements',
    patterns: [/achievement/i, /award/i, /hackathon/i],
    answer: ['Multiple wins including state-level and intra-college hackathons, plus project exhibition recognition.']
  },
  {
    id: 'tools',
    patterns: [/tool(s)?/i, /stack/i, /tech/i],
    answer: ['Tooling spans Docker, Git/GitHub, CI/CD, Qdrant, TruLens, OpenAI API, Gemini, and Veo.']
  },
  {
    id: 'availability',
    patterns: [/available/i, /open to/i, /opportunit/i],
    answer: ['Open to AI/ML roles requiring strong execution, systems thinking, and production readiness.']
  },
  {
    id: 'default-help',
    patterns: [/help/i, /what can you do/i, /commands/i],
    answer: ['Use help, faq, or cat commands.md for capabilities. For natural language, use ask <question>.']
  }
];

export const FAQ_PROMPTS: string[] = [
  'what are your core skills?',
  'what is your best project?',
  'where did you intern?',
  'what is your education background?',
  'do you work on rag systems?',
  'what backend stack do you use?',
  'what certifications do you have?',
  'show me healthcare ai projects',
  'are you working currently?',
  'how can I contact you?'
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What are your core skills?',
    useCase: 'Quick technical screening for stack breadth and depth.',
    prompt: 'what are your core skills?'
  },
  {
    question: 'Which project best represents your work?',
    useCase: 'Identify flagship projects with measurable outcomes.',
    prompt: 'what is your best project?'
  },
  {
    question: 'What healthcare AI work have you built?',
    useCase: 'Assess medical imaging and diagnosis-focused experience.',
    prompt: 'show me healthcare ai projects'
  },
  {
    question: 'Where did you intern and what did you do?',
    useCase: 'Review real-world internship execution and scope.',
    prompt: 'where did you intern?'
  },
  {
    question: 'Do you have production backend experience?',
    useCase: 'Validate API, auth, database, and deployment readiness.',
    prompt: 'what backend stack do you use?'
  },
  {
    question: 'Do you build RAG and LLM systems?',
    useCase: 'Check capability in modern NLP and retrieval workflows.',
    prompt: 'do you work on rag systems?'
  },
  {
    question: 'What certifications and achievements support your profile?',
    useCase: 'Quickly verify certifications and competitive results.',
    prompt: 'what certifications do you have?'
  },
  {
    question: 'Are you currently available for opportunities?',
    useCase: 'Understand current status and openness to roles.',
    prompt: 'are you working currently?'
  },
  {
    question: 'How can we contact you?',
    useCase: 'Get direct communication links in one step.',
    prompt: 'how can I contact you?'
  }
];
