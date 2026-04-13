/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Project } from './types';

export const EASE_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'DENTAL DISEASE CLASSIFIER',
    agent: 'Vision',
    description:
      'Engineered production-grade web system classifying 6 dental conditions (Caries, Gingivitis, Ulcers, etc.).',
    problem: 'Dental diagnosis is time-consuming and prone to human oversight in busy clinics.',
    solution:
      'Implemented Vision Transformer (ViT-B/16) architecture with PyTorch, fine-tuned on 3,000+ dental images.',
    tech: ['ViT-B/16', 'PyTorch', 'FastAPI', 'MongoDB'],
    image: 'https://picsum.photos/seed/dental/800/600',
    github: 'https://github.com/rushildhube',
    live: '#',
    metrics: '92.28% overall accuracy, 0.99 F1-score for Mouth Ulcer',
    tools: ['FastAPI', 'MongoDB', 'SMTP', 'PDF Reports'],
  },
  {
    id: '2',
    title: 'SAFE SURF AI',
    agent: 'Forge',
    description: 'Real-time URL threat detection Chrome extension integrating VirusTotal API.',
    problem:
      'Phishing and malicious URLs are becoming increasingly sophisticated and hard to detect.',
    solution:
      'Developed a Django + FastAPI hybrid backend with Selenium-based automated testing and intelligent caching.',
    tech: ['Django', 'FastAPI', 'Selenium', 'VirusTotal API'],
    image: 'https://picsum.photos/seed/safesurf/800/600',
    github: 'https://github.com/rushildhube',
    live: '#',
    metrics: '95% malicious site detection accuracy',
    tools: ['Chrome Extension API', 'Redis', 'Caching'],
  },
  {
    id: '3',
    title: 'CONSUME WISE',
    agent: 'Neuro',
    description: 'AI-Powered Food Safety WhatsApp Bot for ingredient risk analysis.',
    problem: 'People struggle to understand complex food labels and hidden health risks.',
    solution:
      'Created a WhatsApp chatbot using Tesseract OCR and BERT-based NLP for ingredient analysis.',
    tech: ['Tesseract OCR', 'BERT', 'Twilio API', 'NLP'],
    image: 'https://picsum.photos/seed/food/800/600',
    github: 'https://github.com/rushildhube',
    live: '#',
    metrics: '>90% accuracy in detecting harmful substances',
    tools: ['Twilio', 'Python', 'OCR'],
  },
  {
    id: '4',
    title: 'NEUROMEDIX',
    agent: 'Vision',
    description: "ML system for early neurological disease prediction (Parkinson's, Alzheimer's).",
    problem:
      'Early detection of neurological diseases is critical for effective treatment but often difficult.',
    solution: 'Developed an ensemble model using Scikit-Learn with advanced feature engineering.',
    tech: ['Scikit-Learn', 'Random Forest', 'XGBoost', 'SVM'],
    image: 'https://picsum.photos/seed/neuro/800/600',
    github: 'https://github.com/rushildhube',
    live: '#',
    metrics: '88% prediction accuracy',
    tools: ['Python', 'Ensemble Methods', 'Feature Engineering'],
  },
  {
    id: '5',
    title: 'DEEPFAKE DETECTION',
    agent: 'Vision',
    description: 'Multimodal AI Security system for image, video, and audio deepfakes.',
    problem: 'Deepfakes are a growing threat to digital security and information integrity.',
    solution:
      'Created a comprehensive detection system using ResNet-50 CNNs and spectrogram-based audio classification.',
    tech: ['ResNet-50', 'CNNs', 'LSTM', 'Spectrogram'],
    image: 'https://picsum.photos/seed/deepfake/800/600',
    github: 'https://github.com/rushildhube',
    live: '#',
    metrics: '87% detection accuracy on DFDC dataset',
    tools: ['PyTorch', 'OpenCV', 'Deep Learning'],
  },
  {
    id: '7',
    title: 'EYE DISEASE CLASSIFIER',
    agent: 'Vision',
    description: 'Retinal diagnosis system developed for Edunet Foundation.',
    problem: 'Early detection of retinal diseases is critical but often inaccessible.',
    solution:
      'Developed a custom CNN model for retinal disease classification across 4 categories.',
    tech: ['TensorFlow', 'CNNs', 'Flask', 'Streamlit'],
    image: 'https://picsum.photos/seed/eye/800/600',
    github: 'https://github.com/rushildhube',
    live: '#',
    metrics: '92.4% accuracy on fundus images',
    tools: ['Image Preprocessing', 'Augmentation', 'Python'],
  },
  {
    id: '8',
    title: 'WELLBE REVIVE 360',
    agent: 'Neuro',
    description: 'End-to-end nutrition chatbot with safety-focused evaluation.',
    problem: 'Nutrition advice lacks safety guardrails for medical conditions.',
    solution: 'Built a RAG-powered chatbot with SSE streaming and TruLens evaluation.',
    tech: ['OpenAI API', 'RAG', 'Qdrant', 'FastAPI'],
    image: 'https://picsum.photos/seed/nutrition/800/600',
    github: 'https://github.com/rushildhube',
    live: '#',
    metrics: 'Safe, personalized diet recommendations',
    tools: ['TruLens', 'LangChain', 'PostgreSQL'],
  },
];

export const PROFILE_POSITIONING = {
  roleTarget: 'AI/ML Engineer (GenAI, Backend Systems, Production APIs)',
  worktype: 'Any - Full-time / Internship / Contract',
  availability: 'Currently Intern at Ethosh (Dec 2025–Present) — Open for better opportunity',
  iSolve:
    'I build end-to-end AI systems that ship: healthcare diagnostics, production APIs, RAG pipelines, and agentic automation workflows.',
  whyHireMe: [
    '✓ Shipped 8+ production projects with measurable outcomes (92%+ accuracy, API-first, deploy-ready)',
    '✓ Full stack: ML modeling (PyTorch/TensorFlow) → backend (FastAPI) → evaluation (TruLens) → deployment (Docker)',
    '✓ Proven execution: internship-to-engineer rapid learning; strong on healthcare AI, CV, NLP/RAG, automation',
  ],
};

export const LIVE_PROFILE = {
  role: 'AI & ML Engineer',
  focus: 'Healthcare AI, Computer Vision, NLP, and Automation Systems',
  summary:
    'AI & Machine Learning Engineer specializing in healthcare AI and computer vision with production deployment experience across diagnostics, security, and automation.',
  education: {
    degree: 'B.E. in Artificial Intelligence & Machine Learning',
    institution: 'ISBM College of Engineering, Pune',
    cgpa: '7.85/10',
    sgpa: '9.07/10',
    years: '2022-2026',
  },
  certifications: [
    'NPTEL Python for Data Science (Top 5%)',
    'Coursera: Supervised ML (Andrew Ng)',
    'C/C++ (95%)',
    'Linux (79.17%)',
    'Arduino (95%)',
  ],
};

export const LIVE_SIM_CLUSTERS = [
  {
    id: 'ML_DL_Engineering',
    group: 1,
    val: 44,
    skills: [
      'TensorFlow',
      'PyTorch',
      'Keras',
      'Scikit-Learn',
      'Hugging Face',
      'Feature Engineering',
      'Statistical Analysis',
    ],
  },
  {
    id: 'Computer_Vision_Healthcare',
    group: 2,
    val: 46,
    skills: [
      'OpenCV',
      'CNNs',
      'Vision Transformers (ViT)',
      'Medical Image Processing',
      'Image Segmentation',
      'Fundus Diagnosis',
    ],
  },
  {
    id: 'NLP_RAG_GenAI',
    group: 3,
    val: 42,
    skills: ['NLP', 'RAG', 'LLMs', 'Transformers', 'Qdrant', 'TruLens', 'SSE Streaming'],
  },
  {
    id: 'Backend_API_Systems',
    group: 4,
    val: 40,
    skills: [
      'FastAPI',
      'Django',
      'Flask',
      'REST APIs',
      'OAuth2/JWT',
      'MongoDB',
      'PostgreSQL',
      'SQLAlchemy (async)',
    ],
  },
  {
    id: 'Automation_Agent_Pipelines',
    group: 5,
    val: 38,
    skills: [
      'Make.com',
      'Meta Graph API',
      'Google Gemini',
      'Google Veo',
      'STT/TTS',
      'Telephony',
      'Workflow Orchestration',
    ],
  },
  {
    id: 'DevOps_Cloud_Tooling',
    group: 6,
    val: 34,
    skills: ['Docker', 'CI/CD', 'Git', 'GitHub', 'Jupyter', 'GCP', 'Linux', 'Windows'],
  },
];

export const LIVE_SIM_TREE = [
  {
    id: 'ML_DL_Engineering',
    group: 1,
    val: 44,
    branches: [
      {
        id: 'ML_Frameworks',
        group: 1,
        val: 24,
        nodes: ['TensorFlow', 'PyTorch', 'Keras', 'Scikit-Learn', 'Hugging Face Transformers'],
      },
      {
        id: 'ML_Modeling',
        group: 1,
        val: 22,
        nodes: [
          'Feature Engineering',
          'Statistical Analysis',
          'Sequence Models',
          'Ensemble Methods',
          'Model Evaluation',
        ],
      },
      {
        id: 'ML_DataScience',
        group: 1,
        val: 22,
        nodes: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Data Preprocessing'],
      },
    ],
    projects: ['NeuroMedix', 'Deepfake Detection System'],
  },
  {
    id: 'Computer_Vision_Healthcare',
    group: 2,
    val: 46,
    branches: [
      {
        id: 'Vision_Models',
        group: 2,
        val: 24,
        nodes: ['CNNs', 'Vision Transformers (ViT)', 'ResNet-50', 'Image Segmentation'],
      },
      {
        id: 'Vision_Medical',
        group: 2,
        val: 24,
        nodes: [
          'Medical Image Processing',
          'Retinal Disease Detection',
          'Dental Condition Classification',
          'Fundus Analysis',
        ],
      },
      {
        id: 'Vision_Tooling',
        group: 2,
        val: 20,
        nodes: ['OpenCV', 'Image Augmentation', 'Confusion Matrix', 'Hyperparameter Tuning'],
      },
    ],
    projects: ['Dental Disease Classification', 'Eye Disease Classifier'],
  },
  {
    id: 'NLP_RAG_GenAI',
    group: 3,
    val: 42,
    branches: [
      {
        id: 'NLP_Core',
        group: 3,
        val: 24,
        nodes: ['NLP', 'Transformers', 'LLMs', 'BERT', 'Prompt Engineering'],
      },
      {
        id: 'RAG_Stack',
        group: 3,
        val: 24,
        nodes: ['RAG Design', 'Qdrant', 'Embeddings', 'Chunking', 'Vector Retrieval'],
      },
      {
        id: 'AI_Safety',
        group: 3,
        val: 20,
        nodes: [
          'PII Masking',
          'Safety Guardrails',
          'Diet Constraint Checks',
          'TruLens Evaluation',
          'Empathy Metrics',
        ],
      },
    ],
    projects: ['WellBe Revive 360', 'ConsumeWise'],
  },
  {
    id: 'Backend_API_Systems',
    group: 4,
    val: 40,
    branches: [
      {
        id: 'Backend_Frameworks',
        group: 4,
        val: 24,
        nodes: ['FastAPI', 'Django', 'Flask', 'REST APIs', 'SSE Streaming'],
      },
      {
        id: 'Backend_Data',
        group: 4,
        val: 22,
        nodes: ['PostgreSQL', 'MongoDB', 'SQLAlchemy (async)', 'JSONB Models', 'Database Design'],
      },
      {
        id: 'Backend_Security',
        group: 4,
        val: 20,
        nodes: [
          'OAuth2/JWT',
          'Auth Flows',
          'API Hardening',
          'Input Validation',
          'Secure Integrations',
        ],
      },
    ],
    projects: ['Safe Surf AI', 'MediTrack'],
  },
  {
    id: 'Automation_Agent_Pipelines',
    group: 5,
    val: 38,
    branches: [
      {
        id: 'Automation_Orchestration',
        group: 5,
        val: 24,
        nodes: [
          'Make.com',
          'Workflow Orchestration',
          'Multi-step Automations',
          'Campaign Pipelines',
        ],
      },
      {
        id: 'Automation_GenAI',
        group: 5,
        val: 22,
        nodes: ['Google Gemini', 'Google Veo', 'Asset Generation', 'Creative Pipelines'],
      },
      {
        id: 'Automation_VoiceChat',
        group: 5,
        val: 20,
        nodes: ['STT', 'TTS', 'Speech-to-Speech', 'Telephony Integrations', 'Chat Agent Flows'],
      },
    ],
    projects: ['Meta Graph API Integrations'],
  },
  {
    id: 'DevOps_Cloud_Tooling',
    group: 6,
    val: 34,
    branches: [
      {
        id: 'DevOps_Practices',
        group: 6,
        val: 22,
        nodes: ['Docker', 'CI/CD', 'Testing', 'Documentation', 'Reproducible Environments'],
      },
      {
        id: 'Cloud_Platforms',
        group: 6,
        val: 22,
        nodes: ['Google Cloud Platform', 'Linux', 'Windows', 'Deployment Workflows'],
      },
      {
        id: 'Engineering_Tools',
        group: 6,
        val: 20,
        nodes: ['Git', 'GitHub', 'VS Code', 'Jupyter Notebook', 'Google Colab'],
      },
    ],
    projects: ['Production MVP Deployments', 'Internship Demo Deployments'],
  },
];
