/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValueEvent, useInView } from 'motion/react';
import Lenis from 'lenis';
import ForceGraph2D from 'react-force-graph-2d';
import { 
  Github, 
  Linkedin, 
  FileText, 
  Code2, 
  User, 
  Layers, 
  BarChart3, 
  Send,
  Mail,
  ExternalLink,
  ChevronRight,
  Monitor,
  Database,
  Palette,
  Eye,
  Zap,
  Cpu,
  ShieldCheck,
  Globe,
  Terminal,
  Activity,
  Target,
  Lock,
  Unlock,
  Info,
  ShoppingBag,
  Briefcase,
  ArrowRight
} from 'lucide-react';

// --- Custom Icons ---
const FiverrLogo = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 512 512" 
    fill="currentColor"
    className={className}
  >
    <path d="M112.5 264.9C102.3 264.9 94 273.2 94 283.5 94 293.7 102.3 302 112.5 302C122.7 302 131 293.7 131 283.5 131 273.2 122.7 264.9 112.5 264.9ZM169.5 241h-26v-19c0-9.8 4.2-12.7 12.8-12.7 6.1 0 12.1 2.8 17.5 7.8l17.7-27.4c-9.5-9.3-24.1-15.7-41.2-15.7-36.8 0-48.8 20.8-48.8 49.3V241H81v25.2h19.5v72.5h33.8v-72.5h38.2L169.5 241zM286 211.5l14-37.5c-9.5-9.3-24.1-15.7-41.2-15.7-36.8 0-48.8 20.8-48.8 49.3V241H189v25.2h20.5v72.5h33.8v-72.5h38.2l-3-25.2h-35.2v-19c0-9.8 4.2-12.7 12.8-12.7 6.1 0 12.1 2.8 17.5 7.8L286 211.5zM431 241h-78.5c2 21.3 15.5 28.5 31.5 28.5 7.5 0 14.8-1.5 21-4.5l8.5 24.8c-10.5 6-22 9.2-36 9.2-39.2 0-58.8-21.5-58.8-54.8 0-35.2 24.2-56.5 56.5-56.5s53.2 21.8 53.2 56 0 0 0 0 2.5 7.2 2.5 7.2L431 241zM380.5 198.5c-11.8 0-21.8 6.5-26.5 20h53.5C407.5 205 396.5 198.5 380.5 198.5zM461.5 241h-26.5l3 25.2h23.5L461.5 241zM512 241l-14-37.5C488.5 194.2 473.9 187.8 456.8 187.8c-36.8 0-48.8 20.8-48.8 49.3V241h-20.5v25.2h20.5v72.5h33.8v-72.5H480L512 241z" />
  </svg>
);

// --- Types ---
type Page = 'home' | 'agents' | 'missions' | 'core' | 'docs' | 'career' | 'contact' | 'mission-detail';
type AppState = 'standby' | 'loading' | 'ready';

interface Project {
  id: string;
  title: string;
  agent: string;
  description: string;
  problem: string;
  solution: string;
  tech: string[];
  image: string;
  github: string;
  live: string;
  metrics: string;
  tools: string[];
}

// --- Mock Data ---
const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'DENTAL DISEASE CLASSIFIER',
    agent: 'Vision',
    description: 'Engineered production-grade web system classifying 6 dental conditions (Caries, Gingivitis, Ulcers, etc.).',
    problem: 'Dental diagnosis is time-consuming and prone to human oversight in busy clinics.',
    solution: 'Implemented Vision Transformer (ViT-B/16) architecture with PyTorch, fine-tuned on 3,000+ dental images.',
    tech: ['ViT-B/16', 'PyTorch', 'FastAPI', 'MongoDB'],
    image: 'https://picsum.photos/seed/dental/800/600',
    github: 'https://github.com/rushildhube',
    live: '#',
    metrics: '92.28% overall accuracy, 0.99 F1-score for Mouth Ulcer',
    tools: ['FastAPI', 'MongoDB', 'SMTP', 'PDF Reports']
  },
  {
    id: '2',
    title: 'SAFE SURF AI',
    agent: 'Forge',
    description: 'Real-time URL threat detection Chrome extension integrating VirusTotal API.',
    problem: 'Phishing and malicious URLs are becoming increasingly sophisticated and hard to detect.',
    solution: 'Developed a Django + FastAPI hybrid backend with Selenium-based automated testing and intelligent caching.',
    tech: ['Django', 'FastAPI', 'Selenium', 'VirusTotal API'],
    image: 'https://picsum.photos/seed/safesurf/800/600',
    github: 'https://github.com/rushildhube',
    live: '#',
    metrics: '95% malicious site detection accuracy',
    tools: ['Chrome Extension API', 'Redis', 'Caching']
  },
  {
    id: '3',
    title: 'CONSUME WISE',
    agent: 'Neuro',
    description: 'AI-Powered Food Safety WhatsApp Bot for ingredient risk analysis.',
    problem: 'People struggle to understand complex food labels and hidden health risks.',
    solution: 'Created a WhatsApp chatbot using Tesseract OCR and BERT-based NLP for ingredient analysis.',
    tech: ['Tesseract OCR', 'BERT', 'Twilio API', 'NLP'],
    image: 'https://picsum.photos/seed/food/800/600',
    github: 'https://github.com/rushildhube',
    live: '#',
    metrics: '>90% accuracy in detecting harmful substances',
    tools: ['Twilio', 'Python', 'OCR']
  },
  {
    id: '4',
    title: 'NEUROMEDIX',
    agent: 'Vision',
    description: 'ML system for early neurological disease prediction (Parkinson\'s, Alzheimer\'s).',
    problem: 'Early detection of neurological diseases is critical for effective treatment but often difficult.',
    solution: 'Developed an ensemble model using Scikit-Learn with advanced feature engineering.',
    tech: ['Scikit-Learn', 'Random Forest', 'XGBoost', 'SVM'],
    image: 'https://picsum.photos/seed/neuro/800/600',
    github: 'https://github.com/rushildhube',
    live: '#',
    metrics: '88% prediction accuracy',
    tools: ['Python', 'Ensemble Methods', 'Feature Engineering']
  },
  {
    id: '5',
    title: 'DEEPFAKE DETECTION',
    agent: 'Vision',
    description: 'Multimodal AI Security system for image, video, and audio deepfakes.',
    problem: 'Deepfakes are a growing threat to digital security and information integrity.',
    solution: 'Created a comprehensive detection system using ResNet-50 CNNs and spectrogram-based audio classification.',
    tech: ['ResNet-50', 'CNNs', 'LSTM', 'Spectrogram'],
    image: 'https://picsum.photos/seed/deepfake/800/600',
    github: 'https://github.com/rushildhube',
    live: '#',
    metrics: '87% detection accuracy on DFDC dataset',
    tools: ['PyTorch', 'OpenCV', 'Deep Learning']
  },
  {
    id: '6',
    title: 'SNIPER THINK',
    agent: 'Forge',
    description: 'End-to-end social media automation and conversational pipelines.',
    problem: 'Managing multiple social media accounts and content creation is unscalable manually.',
    solution: 'Architected workflows using Make.com and Meta Graph API, integrating Gemini and Veo 3.1.',
    tech: ['Make.com', 'Meta Graph API', 'Google Gemini', 'Google Veo'],
    image: 'https://picsum.photos/seed/sniper/800/600',
    github: 'https://github.com/rushildhube',
    live: '#',
    metrics: '75% reduction in manual content creation time',
    tools: ['STT/TTS', 'Telephony', 'Automation']
  },
  {
    id: '7',
    title: 'EYE DISEASE CLASSIFIER',
    agent: 'Vision',
    description: 'Retinal diagnosis system developed for Edunet Foundation.',
    problem: 'Early detection of retinal diseases is critical but often inaccessible.',
    solution: 'Developed a custom CNN model for retinal disease classification across 4 categories.',
    tech: ['TensorFlow', 'CNNs', 'Flask', 'Streamlit'],
    image: 'https://picsum.photos/seed/eye/800/600',
    github: 'https://github.com/rushildhube',
    live: '#',
    metrics: '92.4% accuracy on fundus images',
    tools: ['Image Preprocessing', 'Augmentation', 'Python']
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
    tools: ['TruLens', 'LangChain', 'PostgreSQL']
  }
];

// --- Animation Components ---

const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

const CustomCursor: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden lg:block">
      {/* Target Crosshair */}
      <motion.div
        animate={{
          x: mousePos.x - 12,
          y: mousePos.y - 12,
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{ type: 'spring', damping: 40, stiffness: 600, mass: 0.2 }}
        className="w-[24px] h-[24px] fixed top-0 left-0 flex items-center justify-center transform-gpu mix-blend-difference"
      >
        <div className="w-[3px] h-[3px] bg-val-red/80 rounded-full" />
        
        {/* Top Reticle Line */}
        <motion.div 
          initial={false}
          animate={{ y: isHovering ? -8 : -5, opacity: isHovering ? 1 : 0.5 }}
          className="absolute top-0 left-[11px] w-[2px] h-[6px] bg-val-red"
        />
        {/* Bottom Reticle Line */}
        <motion.div 
          initial={false}
          animate={{ y: isHovering ? 8 : 5, opacity: isHovering ? 1 : 0.5 }}
          className="absolute bottom-0 left-[11px] w-[2px] h-[6px] bg-val-red"
        />
        {/* Left Reticle Line */}
        <motion.div 
          initial={false}
          animate={{ x: isHovering ? -8 : -5, opacity: isHovering ? 1 : 0.5 }}
          className="absolute left-0 top-[11px] h-[2px] w-[6px] bg-val-red"
        />
        {/* Right Reticle Line */}
        <motion.div 
          initial={false}
          animate={{ x: isHovering ? 8 : 5, opacity: isHovering ? 1 : 0.5 }}
          className="absolute right-0 top-[11px] h-[2px] w-[6px] bg-val-red"
        />
      </motion.div>
    </div>
  );
};

const Magnetic: React.FC<{ children: React.ReactNode, strength?: number }> = ({ children, strength = 0.5 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const x = (clientX - centerX) * strength;
    const y = (clientY - centerY) * strength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', damping: 15, stiffness: 150, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

const StaggeredText: React.FC<{ text: string, className?: string, delay?: number, by?: 'word' | 'char' }> = ({ text, className = "", delay = 0, by = 'word' }) => {
  const items = by === 'word' ? text.split(" ") : text.split("");
  
  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {items.map((item, i) => (
        <span key={i} className={`inline-block overflow-hidden ${by === 'word' ? 'mr-[0.25em]' : ''}`}>
          <motion.span
            initial={{ y: "100%", opacity: 0, rotateX: 45 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: delay + (i * (by === 'word' ? 0.1 : 0.03)),
              ease: [0.22, 1, 0.36, 1]
            }}
            className="inline-block origin-bottom"
          >
            {item === " " ? "\u00A0" : item}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

const ScrollReveal: React.FC<{ children: React.ReactNode, direction?: 'up' | 'down' | 'left' | 'right' }> = ({ children, direction = 'up' }) => {
  const variants = {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
      y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

const ParallaxImage: React.FC<{ src: string, alt: string, strength?: number, className?: string }> = ({ src, alt, strength = 50, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale: 1.2 }}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

const TextReveal: React.FC<{ text: string, className?: string }> = ({ text, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.25"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.1, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  return (
    <motion.div ref={ref} style={{ opacity, scale }} className={className}>
      {text}
    </motion.div>
  );
};

const MaskReveal: React.FC<{ children: React.ReactNode, delay?: number, direction?: 'up' | 'down' | 'left' | 'right', className?: string }> = ({ children, delay = 0, direction = 'up', className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const variants = {
    hidden: { clipPath: direction === 'up' ? "inset(100% 0 0 0)" : direction === 'down' ? "inset(0 0 100% 0)" : direction === 'left' ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" },
    visible: { clipPath: "inset(0 0 0 0)" }
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- Components ---

const Navbar: React.FC<{ onToggle: () => void, isOpen: boolean, setPage: (p: Page) => void }> = ({ onToggle, isOpen, setPage }) => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest < 50) {
      setHidden(false);
    } else if (latest > lastY) {
      setHidden(true); // scrolling down
    } else {
      setHidden(false); // scrolling up
    }
    setLastY(latest);
  });

  return (
    <motion.nav 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" }
      }}
      animate={hidden && !isOpen ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 w-full z-[120] h-20 flex items-center justify-between px-6 md:px-12 pointer-events-none"
    >
      <div className="flex items-center gap-4 cursor-pointer group pointer-events-auto" onClick={() => { setPage('home'); if(isOpen) onToggle(); }}>
        <div className="w-10 h-10 bg-val-red flex items-center justify-center rotate-45 transition-transform group-hover:rotate-[135deg]">
          <svg viewBox="0 0 100 100" className="w-6 h-6 -rotate-45 text-val-dark" fill="currentColor">
            <path d="M0 100 L40 0 L100 0 L100 20 L50 20 L20 100 Z" />
            <path d="M100 100 L80 100 L60 60 L80 60 Z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-display font-black text-2xl tracking-tighter leading-none text-white">RUSHIL_DHUBE</span>
          <span className="text-[10px] font-mono text-val-red tracking-[0.3em] uppercase opacity-60">Radiant // Agent</span>
        </div>
      </div>
      
      <button 
        onClick={onToggle}
        className="w-16 h-16 glass-panel border-val-red/30 flex flex-col items-center justify-center gap-1.5 pointer-events-auto group relative overflow-hidden"
      >
        <motion.div 
          animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
          className="w-8 h-0.5 bg-val-red"
        />
        <motion.div 
          animate={isOpen ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
          className="w-8 h-0.5 bg-val-red"
        />
        <motion.div 
          animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
          className="w-8 h-0.5 bg-val-red"
        />
        <div className="absolute inset-0 bg-val-red/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
      </button>
    </motion.nav>
  );
};

const NavItem: React.FC<{ label: string, meaning: string, active: boolean, onClick: () => void }> = ({ label, meaning, active, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [displayText, setDisplayText] = useState(label);
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  
  const scramble = () => {
    setIsHovered(true);
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => 
        prev.split("").map((char, index) => {
          if (index < iteration) return label[index];
          return characters[Math.floor(Math.random() * characters.length)];
        }).join("")
      );
      
      if (iteration >= label.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={scramble}
      onMouseLeave={() => { setIsHovered(false); setDisplayText(label); }}
      className="w-full flex items-center justify-between group py-6 border-b border-val-border/30 relative overflow-hidden"
    >
      <div className="flex items-center gap-8 relative z-10 w-full">
        <span className="text-val-red font-mono text-sm opacity-40 group-hover:opacity-100 transition-opacity tracking-widest min-w-[100px] text-left">
          {active ? '// ACTIVE' : '// SELECT'}
        </span>
        
        <div className="flex flex-col items-start relative overflow-hidden h-20 md:h-32 lg:h-44 justify-center flex-1">
          <motion.h2 
            animate={isHovered ? { y: -120, opacity: 0 } : { y: 0, opacity: 1 }}
            className={`text-2xl md:text-5xl lg:text-[clamp(3.5rem,8vw,8rem)] font-display font-black tracking-tighter italic uppercase transition-all duration-300 whitespace-nowrap lg:pr-12 min-w-max ${active ? 'text-val-red' : 'text-val-light group-hover:text-val-red'}`}
          >
            {displayText}
          </motion.h2>
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={isHovered ? { y: 0, opacity: 1 } : { y: 120, opacity: 0 }}
            className="absolute inset-0 flex items-center"
          >
            <span className="text-lg md:text-3xl lg:text-[clamp(2.5rem,5vw,5rem)] font-display font-black tracking-[0.2em] italic uppercase text-val-red/80 whitespace-nowrap lg:pr-12 min-w-max">
              {meaning}
            </span>
          </motion.div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 relative z-10">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          whileHover={{ x: 0, opacity: 1 }}
          className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <span className="text-[10px] font-mono text-val-red tracking-[0.4em] uppercase">Deploy_Sector</span>
          <ArrowRight size={32} className="text-val-red" />
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-val-red/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
    </motion.button>
  );
};



const TerminalOverlay: React.FC<{ setPage: (p: Page) => void }> = ({ setPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<{ type: 'command' | 'output', text: string }[]>([
    { type: 'output', text: 'RUSHIL_OS v4.0.1 (x86_64)' },
    { type: 'output', text: 'Type "help" for a list of commands.' }
  ]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle on backtick
      if (e.key === '`') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isOpen, history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    const newHistory = [...history, { type: 'command', text: cmd } as const];
    
    switch(cmd.toLowerCase()) {
      case 'help':
        newHistory.push(
          { type: 'output', text: 'Available commands:' },
          { type: 'output', text: '  whoami      - Print agent bio' },
          { type: 'output', text: '  ls          - List available sectors' },
          { type: 'output', text: '  vision      - Initialize vision sector' },
          { type: 'output', text: '  skills      - Load tech arsenal' },
          { type: 'output', text: '  projects    - Open mission logs' },
          { type: 'output', text: '  experience  - View service history' },
          { type: 'output', text: '  clear       - Clear terminal' },
          { type: 'output', text: '  exit        - Terminate connection' }
        );
        break;
      case 'whoami':
        newHistory.push({ type: 'output', text: 'Rushil Dhube: AI/ML Engineer architecting intelligent systems bridging complex data and real-world impact.' });
        break;
      case 'ls':
        newHistory.push({ type: 'output', text: 'Sectors: home, agents, core, missions, career, docs, contact' });
        newHistory.push({ type: 'output', text: 'Files: dossier.pdf, architecture.sys, kernel.bin' });
        break;
      case 'agents':
      case 'vision':
        setPage('agents');
        newHistory.push({ type: 'output', text: 'SECURE_UPLINK: Redirecting to AGENT_INTEL...' });
        break;
      case 'core':
      case 'skills':
        setPage('core');
        newHistory.push({ type: 'output', text: 'SECURE_UPLINK: Redirecting to TECHNICAL_ARSENAL...' });
        break;
      case 'missions':
      case 'projects':
        setPage('missions');
        newHistory.push({ type: 'output', text: 'SECURE_UPLINK: Redirecting to ACTIVE_OPERATIONS...' });
        break;
      case 'career':
      case 'experience':
        setPage('career');
        newHistory.push({ type: 'output', text: 'SECURE_UPLINK: Redirecting to SERVICE_HISTORY...' });
        break;
      case 'docs':
      case 'intel':
        setPage('docs');
        newHistory.push({ type: 'output', text: 'SECURE_UPLINK: Redirecting to INTEL_BRIEFING...' });
        break;
      case 'contact':
        setPage('contact');
        newHistory.push({ type: 'output', text: 'SECURE_UPLINK: Redirecting to COMMS_CENTER...' });
        break;
      case 'home':
        setPage('home');
        newHistory.push({ type: 'output', text: 'SECURE_UPLINK: Returning to BASE_HUB...' });
        break;
      case 'cat dossier.pdf':
      case 'cat files':
        newHistory.push({ type: 'output', text: 'Access denied: File is classified. Initiate [DOWNLOAD_DOSSIER] via GUI for access.'});
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'exit':
        setIsOpen(false);
        setInput('');
        return;
      default:
        newHistory.push({ type: 'output', text: `command not found: ${cmd}. Type 'help' for available commands.` });
    }

    setHistory(newHistory);
    setInput('');
  };

  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <>
      {/* Floating launch button — only show when closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: 1 }}
            className="fixed bottom-6 right-6 z-[200]"
          >
            <button
              onClick={() => { setIsOpen(true); setIsMinimized(false); }}
              className="glass-panel px-4 py-3 flex items-center gap-3 group border-val-red/30 hover:border-val-red transition-all shadow-[0_0_20px_rgba(255,70,85,0.2)] bg-val-dark/90 backdrop-blur-md"
            >
              <Terminal size={16} className="text-val-red group-hover:animate-pulse" />
              <span className="text-[10px] font-mono text-val-light/80 uppercase tracking-[0.2em] group-hover:text-white transition-colors">INIT_TERMINAL</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimised taskbar pill */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200]"
          >
            <button
              onClick={() => setIsMinimized(false)}
              className="glass-panel px-6 py-2 flex items-center gap-3 border-val-red/40 hover:border-val-red transition-all bg-val-dark/90 backdrop-blur-md"
            >
              <Terminal size={14} className="text-val-red" />
              <span className="text-[10px] font-mono text-val-light/80 uppercase tracking-[0.2em]">SECURE_TERMINAL_UPLINK</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup Window */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`fixed z-[99999] font-mono text-sm shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_40px_rgba(255,70,85,0.1)] ${
              isMaximized
                ? 'inset-0'
                : 'bottom-16 left-1/2 -translate-x-1/2 w-[90vw] max-w-3xl h-[480px]'
            } flex flex-col border border-val-red/30 bg-[#0d1117] overflow-hidden`}
            style={isMaximized ? {} : { borderRadius: '4px' }}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Title Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-val-border/60 flex-shrink-0 select-none">
              {/* Window Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); setIsMinimized(false); setIsMaximized(false); }}
                  className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff3b30] transition-colors flex items-center justify-center group"
                  title="Close"
                >
                  <span className="hidden group-hover:block text-[8px] text-black font-bold leading-none">✕</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
                  className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#ffcc00] transition-colors flex items-center justify-center group"
                  title="Minimize"
                >
                  <span className="hidden group-hover:block text-[8px] text-black font-bold leading-none">−</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsMaximized(m => !m); }}
                  className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#32d74b] transition-colors flex items-center justify-center group"
                  title="Maximize"
                >
                  <span className="hidden group-hover:block text-[8px] text-black font-bold leading-none">{isMaximized ? '⊡' : '⊞'}</span>
                </button>
              </div>

              {/* Title */}
              <span className="text-val-light/40 text-[11px] tracking-[0.25em] uppercase absolute left-1/2 -translate-x-1/2">SECURE_TERMINAL_UPLINK</span>

              {/* Right actions */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-val-red animate-pulse" />
                <span className="text-[9px] font-mono text-val-light/30 uppercase tracking-widest">LIVE</span>
              </div>
            </div>

            {/* Terminal body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-2 bg-[#0d1117]">
              {history.map((h, i) => (
                <div key={i} className={`flex gap-3 ${h.type === 'command' ? 'text-white' : 'text-val-light/70'}`}>
                  {h.type === 'command' && <span className="text-val-red min-w-fit text-xs">root@rushil:~$</span>}
                  <span className={`text-xs ${ h.type === 'command' ? 'text-white font-semibold' : 'text-green-400 pl-6'}`}>{h.text}</span>
                </div>
              ))}
              <form onSubmit={handleCommand} className="flex gap-3 items-center">
                <span className="text-val-red min-w-fit text-xs">root@rushil:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent outline-none border-none text-white font-semibold text-xs caret-val-red"
                  autoFocus
                  autoComplete="off"
                  spellCheck={false}
                />
              </form>
              <div ref={endRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const NavOverlay: React.FC<{ isOpen: boolean, activePage: Page, setPage: (p: Page) => void, onClose: () => void }> = ({ isOpen, activePage, setPage, onClose }) => {
  const navItems: { id: Page; label: string; meaning: string }[] = [
    { id: 'home', label: 'Home', meaning: 'Base Hub' },
    { id: 'agents', label: 'Agents', meaning: 'Vision' },
    { id: 'core', label: 'Systems Core', meaning: 'Skills' },
    { id: 'missions', label: 'Missions', meaning: 'Projects' },
    { id: 'career', label: 'Career', meaning: 'Experience' },
    { id: 'docs', label: 'Documentation', meaning: 'Intelligence' },
    { id: 'contact', label: 'Contact', meaning: 'Comms' },
  ];

  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add('lenis-stopped');
    } else {
      document.documentElement.classList.remove('lenis-stopped');
    }
    return () => document.documentElement.classList.remove('lenis-stopped');
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[110] bg-val-dark/95 backdrop-blur-xl flex flex-col pt-32 px-6 md:px-24 overflow-y-auto overflow-x-hidden"
          data-lenis-prevent
        >
          <div className="absolute top-0 right-0 w-1/3 h-full bg-val-red/5 skew-x-[-15deg] translate-x-1/2 pointer-events-none"></div>
          
          <div className="flex flex-col gap-2 mb-12">
            <div className="w-12 h-1 bg-val-red"></div>
            <span className="text-val-red font-mono text-xs tracking-[0.5em] uppercase">Navigation_Interface</span>
          </div>

          <div className="flex flex-col w-full">
            {navItems.map((item) => (
              <NavItem 
                key={item.id}
                label={item.label}
                meaning={item.meaning}
                active={activePage === item.id || (activePage === 'mission-detail' && item.id === 'missions')}
                onClick={() => { setPage(item.id); onClose(); }}
              />
            ))}
          </div>

          <div className="mt-auto pb-12 flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="flex gap-12">
              <a href="https://github.com/rushildhube" target="_blank" className="group">
                <div className="text-[8px] font-mono text-val-light/20 uppercase tracking-widest mb-2 group-hover:text-val-red transition-colors underline-slide pb-1">GitHub</div>
                <Github size={24} className="text-val-light/40 group-hover:text-white transition-colors" />
              </a>
              <a href="https://linkedin.com/in/rushildhube" target="_blank" className="group">
                <div className="text-[8px] font-mono text-val-light/20 uppercase tracking-widest mb-2 group-hover:text-val-red transition-colors underline-slide pb-1">LinkedIn</div>
                <Linkedin size={24} className="text-val-light/40 group-hover:text-white transition-colors" />
              </a>
              <a href="https://www.fiverr.com/rushildhube" target="_blank" className="group">
                <div className="text-[8px] font-mono text-val-light/20 uppercase tracking-widest mb-2 group-hover:text-val-red transition-colors underline-slide pb-1">MARKETPLACE</div>
                <FiverrLogo className="text-val-light/40 group-hover:text-white transition-colors" size={32} />
              </a>
              <a href="mailto:rushildhube1305@gmail.com" className="group">
                <div className="text-[8px] font-mono text-val-light/20 uppercase tracking-widest mb-2 group-hover:text-val-red transition-colors underline-slide pb-1">SECURE_MAIL</div>
                <Mail size={24} className="text-val-light/40 group-hover:text-white transition-colors" />
              </a>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-mono text-val-light/20 uppercase tracking-[0.4em] mb-2">Current_Session</div>
              <div className="text-2xl font-display font-black text-val-red italic uppercase tracking-tighter">
                Rushil_Dhube // 2026
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-val-dark flex flex-col items-center justify-center p-12"
    >
      <div className="w-full max-w-3xl">
        <MaskReveal direction="up" delay={0.2}>
          <div className="flex justify-between items-end mb-6">
            <div className="space-y-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 40 }}
                className="h-1 bg-val-red"
              />
              <h2 className="text-val-red font-display font-black text-sm tracking-[0.4em] uppercase">INITIALIZING_CORE_SYSTEMS</h2>
              <h1 className="text-6xl font-display font-black tracking-tighter italic">RUSHIL // PORTFOLIO</h1>
            </div>
            <div className="text-val-light/20 font-mono text-[10px] uppercase tracking-[0.3em] text-right">
              EST_LOAD: 0.24s<br />
              VERSION: 4.0.1
            </div>
          </div>
        </MaskReveal>
        
        <div className="h-1 w-full bg-val-light/5 relative overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
            className="h-full bg-val-red shadow-[0_0_20px_#ff4655]"
          />
        </div>

        <div className="mt-12 grid grid-cols-4 gap-8">
          {['NEURO', 'VISION', 'FORGE', 'CORE'].map((agent, i) => (
            <motion.div 
              key={agent}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + (i * 0.1) }}
              className="flex flex-col gap-2"
            >
              <div className="text-[8px] font-mono text-val-light/30 tracking-widest uppercase">Agent_{agent}</div>
              <div className="h-1 w-full bg-val-light/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1 + (i * 0.1), duration: 0.5 }}
                  className="h-full bg-val-light/40"
                />
              </div>
              <div className="text-[10px] font-display font-bold text-val-light/60">SYNCED</div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="absolute inset-0 z-[-1] opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `linear-gradient(var(--color-val-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-val-border) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}></div>
      </div>
    </motion.div>
  );
};

const HUDOverlay = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Subtle Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_2px] pointer-events-none opacity-20"></div>
      
      {/* Corner Brackets - Minimal */}
      <div className="absolute top-24 left-12 w-8 h-8 border-t border-l border-val-red/10"></div>
      <div className="absolute top-24 right-12 w-8 h-8 border-t border-r border-val-red/10"></div>
      <div className="absolute bottom-12 left-12 w-8 h-8 border-b border-l border-val-red/10"></div>
      <div className="absolute bottom-12 right-12 w-8 h-8 border-b border-r border-val-red/10"></div>

      {/* Minimal Status Indicator */}
      <div className="absolute bottom-12 left-20 flex items-center gap-3">
        <div className="w-1 h-1 bg-val-red animate-pulse"></div>
        <div className="font-mono text-[8px] text-val-light/20 uppercase tracking-[0.4em]">
          UPLINK_SECURE // AGENT_RUSHIL
        </div>
      </div>

      <div className="absolute bottom-12 right-20 text-right font-mono text-[8px] text-val-light/5 uppercase tracking-[0.5em]">
        [ V4.0 ]
      </div>
    </div>
  );
};



const LandingPage: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [showMatchFound, setShowMatchFound] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    let timer: any;
    if (showMatchFound && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (showMatchFound && countdown === 0) {
      onEnter();
    }
    return () => clearTimeout(timer);
  }, [showMatchFound, countdown, onEnter]);

  const handleStart = () => {
    setIsInitializing(true);
    
    // Play tactical sound immediately on user interaction
    const audio = new Audio('/match-found.mp3');
    audio.play().catch(() => {});
    
    // Show MATCH FOUND animation overlay
    setTimeout(() => setShowMatchFound(true), 100);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-val-dark flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `linear-gradient(var(--color-val-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-val-border) 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-12 relative z-10">
        <div className="w-full flex justify-between items-start mb-12">
          <div className="space-y-4">
            <span className="text-val-red font-mono text-xs tracking-[0.6em] uppercase block">Clearance_Level</span>
            <div className="flex items-center gap-4">
              <div className="w-4 h-8 bg-val-red"></div>
              <span className="text-4xl font-display font-black italic tracking-tighter uppercase">RADIANT</span>
            </div>
          </div>
          <div className="text-right space-y-4">
            <span className="text-val-light/20 font-mono text-[10px] tracking-[0.4em] uppercase block">Location_ID</span>
            <span className="text-2xl font-display font-black italic tracking-tighter uppercase opacity-40">PUNE_NODE_01</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <h2 className="text-val-red font-display font-black text-sm tracking-[1em] uppercase animate-pulse">PERSONNEL_IDENTIFIED</h2>
          <h1 className="text-6xl md:text-9xl font-display font-black tracking-tighter italic uppercase text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            RUSHIL <span className="text-val-red">//</span> DHUBE
          </h1>
          <div className="h-px w-full max-w-md bg-gradient-to-r from-transparent via-val-red to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl mt-12">
          <div className="glass-panel p-8 text-left space-y-4 border-val-red border-l-4 group hover:bg-val-red/[0.03] transition-colors">
            <span className="text-[10px] font-mono text-val-red/60 uppercase tracking-widest block">Primary_Specialization</span>
            <span className="text-2xl font-display font-black italic tracking-tight uppercase group-hover:text-val-red transition-colors">BACKEND & ML ARCHITECT</span>
          </div>
          <div className="glass-panel p-8 text-left space-y-4 border-val-red/20 group hover:border-val-red/50 transition-colors">
            <span className="text-[10px] font-mono text-val-red/60 uppercase tracking-widest block">Core_Modules</span>
            <span className="text-2xl font-display font-black italic tracking-tight uppercase group-hover:text-val-red transition-colors">AUTOMATION // NEURAL NETS</span>
          </div>
          <div className="glass-panel p-8 text-left space-y-4 border-val-red/20 group hover:border-val-red/50 transition-colors">
            <span className="text-[10px] font-mono text-val-red/60 uppercase tracking-widest block">Uplink_Signal</span>
            <span className="text-2xl font-display font-black italic tracking-tight uppercase group-hover:text-val-red transition-colors text-green-500">OPTIMAL_LINK</span>
          </div>
        </div>

        <div className="mt-16 group relative">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-val-red/20 rounded-full blur-3xl pointer-events-none"
          />
          <button 
            onClick={handleStart}
            disabled={isInitializing}
            className="val-button val-button-primary text-4xl py-10 px-20 relative z-10 font-display italic tracking-[0.2em]"
          >
            {isInitializing ? 'INITIALIZING...' : 'INITIALIZE_EXPERIENCE'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showMatchFound && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-[250] flex flex-col items-center justify-center bg-black/60"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-8"
            >
              <h2 className="text-white font-display font-black text-6xl md:text-9xl tracking-[0.2em] uppercase drop-shadow-[0_0_50px_rgba(255,70,85,0.5)] whitespace-nowrap">
                MATCH FOUND
              </h2>
              
              <div className="flex flex-col items-center gap-4">
                <div className="text-val-red font-mono text-xs tracking-[1em] uppercase">Deploying_Asset_In</div>
                <motion.div 
                  key={countdown}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-white text-8xl font-display font-black italic"
                >
                  {countdown}
                </motion.div>
                <div className="w-64 h-1 bg-val-red/20 relative overflow-hidden">
                  <motion.div 
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 3, ease: "linear" }}
                    className="absolute top-0 left-0 h-full bg-val-red"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="scanline"></div>
    </motion.div>
  );
};

const GlitchText: React.FC<{ children: string, className?: string }> = ({ children, className }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <motion.span 
        animate={{ x: [0, -3, 3, -1, 0], opacity: [0, 0.7, 0.3, 0.7, 0] }}
        transition={{ repeat: Infinity, duration: 0.15, repeatDelay: 4 }}
        className="absolute top-0 left-0 z-0 text-val-red translate-x-1"
      >
        {children}
      </motion.span>
      <motion.span 
        animate={{ x: [0, 3, -3, 1, 0], opacity: [0, 0.7, 0.3, 0.7, 0] }}
        transition={{ repeat: Infinity, duration: 0.15, repeatDelay: 4.1 }}
        className="absolute top-0 left-0 z-0 text-val-cyan -translate-x-1"
      >
        {children}
      </motion.span>
    </div>
  );
};

const HomePage: React.FC<{ setPage: (p: Page) => void }> = ({ setPage }) => {
  return (
    <div className="min-h-screen flex flex-col xl:flex-row items-center justify-center gap-12 lg:gap-20 px-6 md:px-12 lg:px-24 mx-auto max-w-7xl pt-32 pb-12 w-full">
      {/* Left: Profile Card */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="z-10 w-full max-w-2xl"
      >
        <div className="glass-panel p-12 group">
          <div className="scanline"></div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-val-red/5 rotate-45 translate-x-24 -translate-y-24 group-hover:bg-val-red/10 transition-colors"></div>
          
          <div className="flex items-center gap-6 mb-10">
            <div className="w-24 h-24 border-2 border-val-red p-1.5 relative">
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-val-red"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-val-red"></div>
              <div className="w-full h-full bg-val-gray flex items-center justify-center text-val-red">
                <User size={48} />
              </div>
            </div>
            <div>
              <div className="text-xs font-mono text-val-red uppercase tracking-[0.4em] mb-1">AGENT_PROFILE // RUSHIL</div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-val-red text-white text-[10px] font-black uppercase tracking-widest">Radiant</span>
                <span className="text-val-light/40 text-[10px] font-mono uppercase tracking-widest">ID: 1305-907</span>
              </div>
            </div>
          </div>

          <h1 className="text-8xl md:text-[8.5rem] font-display font-black leading-[0.85] mb-6 tracking-tighter">
            <GlitchText className="block">RUSHIL</GlitchText>
            <StaggeredText text="DHUBE" delay={0.5} by="char" className="block" />
          </h1>
          
          <div className="flex items-center w-full gap-4 mb-8">
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.8 }} className="h-px flex-1 bg-val-border origin-left" />
            <StaggeredText 
              text="BACKEND & ML ARCHITECT" 
              className="text-lg md:text-2xl font-display font-black text-val-red tracking-[0.2em] italic whitespace-nowrap"
              delay={0.8}
            />
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.8 }} className="h-px flex-1 bg-val-border origin-right" />
          </div>

          <div className="text-val-light/60 text-lg leading-relaxed mb-10 max-w-lg">
            <TextReveal 
              text="Architecting intelligent systems that bridge the gap between complex data and real-world impact. From medical diagnostics to large-scale automation, I build the future of AI."
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <Magnetic strength={0.2}>
              <a href="/Master_CV.pdf" download="Master_CV.pdf" className="val-button val-button-primary flex-1 flex items-center justify-center gap-3 group px-8 w-full">
                <FileText size={20} className="group-hover:scale-110 transition-transform" />
                DOWNLOAD_DOSSIER
              </a>
            </Magnetic>
            <div className="flex gap-4">
              <Magnetic strength={0.3}>
                <a href="https://github.com/rushildhube" target="_blank" className="w-14 h-14 glass-panel flex items-center justify-center hover:text-val-red hover:border-val-red transition-all group/icon">
                  <Github size={24} className="group-hover/icon:scale-110 transition-transform" />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-val-red text-[8px] font-mono text-white opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap">GITHUB_REPO</div>
                </a>
              </Magnetic>
              <Magnetic strength={0.3}>
                <a href="https://linkedin.com/in/rushildhube" target="_blank" className="w-14 h-14 glass-panel flex items-center justify-center hover:text-val-red hover:border-val-red transition-all group/icon">
                  <Linkedin size={24} className="group-hover/icon:scale-110 transition-transform" />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-val-red text-[8px] font-mono text-white opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap">LINKEDIN_INTEL</div>
                </a>
              </Magnetic>
              <Magnetic strength={0.3}>
                <a href="https://www.fiverr.com/rushildhube" target="_blank" className="w-14 h-14 glass-panel flex items-center justify-center hover:text-val-red hover:border-val-red transition-all group/icon">
                  <FiverrLogo size={24} className="group-hover/icon:scale-110 transition-transform" />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-val-red text-[8px] font-mono text-white opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap">FIVERR_MARKET</div>
                </a>
              </Magnetic>
              <Magnetic strength={0.3}>
                <a href="mailto:rushildhube1305@gmail.com" className="w-14 h-14 glass-panel flex items-center justify-center hover:text-val-red hover:border-val-red transition-all group/icon">
                  <Mail size={24} className="group-hover/icon:scale-110 transition-transform" />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-val-red text-[8px] font-mono text-white opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap">SECURE_MAIL</div>
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Center: Mission CTA */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="z-10 flex flex-col items-center gap-12"
      >
        <div className="relative group">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute inset-0 bg-val-red blur-3xl rounded-full"
          />
          <Magnetic strength={0.15}>
            <button 
              onClick={() => setPage('missions')}
              className="val-button val-button-primary text-3xl py-10 px-20 group relative z-10"
            >
              <span className="relative z-10 flex items-center gap-6 italic">
                LOCK_IN
                <Target className="group-hover:rotate-90 transition-transform duration-500" size={32} />
              </span>
            </button>
          </Magnetic>
        </div>

        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="text-[10px] font-mono text-val-light/30 uppercase tracking-[0.5em]">Select Mission Operation</div>
          <div className="flex gap-3">
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ 
                  scaleY: [1, 2, 1],
                  opacity: [0.2, 1, 0.2]
                }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                className={`w-1.5 h-6 ${i === 2 ? 'bg-val-red' : 'bg-val-light/20'}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const AgentsPage: React.FC = () => {
  const agents = [
    { 
      id: 'core', 
      title: 'CORE', 
      spec: 'Backend & Systems Engineering',
      icon: Terminal,
      skills: ['FastAPI', 'Python Coding', 'Django', 'PostgreSQL', 'Docker', 'Asynchronous Systems', 'Cloud Architectures (GCP)'],
      metrics: 'Scalable MVP deployments & production-ready backends',
      desc: 'Architecting robust, mission-critical infrastructure and high-performance backend systems with a focus on code scalability and resilience.'
    },
    { 
      id: 'forge', 
      title: 'FORGE', 
      spec: 'ML & Automation Pipelines',
      icon: Zap,
      skills: ['Autonous Workflows', 'Make.com', 'Meta Graph API', 'LLM Integration', 'Dynamic STT/TTSPipelines'],
      metrics: '75% reduction in manual content creation time',
      desc: 'Engineering sophisticated automation architectures that leverage GenAI to streamline complex business operations.'
    },
    { 
      id: 'neuro', 
      title: 'NEURO', 
      spec: 'NLP & RAG Engineering',
      icon: Cpu,
      skills: ['Large Language Models (LLMs)', 'RAG Vector-DB Architectures', 'Sequence Models', 'Transformers', 'SafeAI Implementation'],
      metrics: '90%+ accuracy in specialized retrieval systems',
      desc: 'Specialist in building neural conversational systems and high-precision evaluation matrices for AI safety.'
    },
    { 
      id: 'vision', 
      title: 'VISION', 
      spec: 'Computer Vision & Deep Learning',
      icon: Eye,
      skills: ['Computer Vision (OpenCV)', 'CNNs', 'Vision Transformers (ViT)', 'Medical Image Diagnostics', 'Object Tracking'],
      metrics: '92.4% accuracy in diagnostic vision models',
      desc: 'High-precision deep learning implementation for medical imaging and complex visual recognition challenges.'
    }
  ];

  const [selectedAgent, setSelectedAgent] = useState(agents[0]);

  return (
    <div className="min-h-screen pt-32 pb-12 px-6 md:px-12 lg:px-24 flex flex-col items-center">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Agent Selection Rail */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-32 h-fit">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-2 h-8 bg-val-red"></div>
            <h2 className="text-val-red text-sm font-black tracking-[0.4em] uppercase">SELECT_AGENT</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {agents.map((agent) => (
              <ScrollReveal key={agent.id} direction="right">
                <button
                  onClick={() => setSelectedAgent(agent)}
                  className={`group relative flex items-center gap-6 p-8 border transition-all duration-500 overflow-hidden w-full ${
                    selectedAgent.id === agent.id 
                      ? 'bg-val-red border-val-red text-white' 
                      : 'bg-val-gray/20 border-val-border text-val-light/40 hover:border-val-red/50 hover:bg-val-gray/40'
                  }`}
                >
                  <div className={`w-12 h-12 flex items-center justify-center transition-transform duration-500 ${selectedAgent.id === agent.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                    <agent.icon size={32} />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-display font-black text-3xl tracking-tighter italic leading-none mb-1">{agent.title}</span>
                    <span className={`text-[8px] font-mono tracking-widest uppercase ${selectedAgent.id === agent.id ? 'text-white/60' : 'text-val-light/20'}`}>
                      {agent.spec.split(',')[0]}
                    </span>
                  </div>
                  {selectedAgent.id === agent.id && (
                    <motion.div layoutId="agent-active-bar" className="absolute right-0 top-0 bottom-0 w-1.5 bg-white" />
                  )}
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Agent Dossier */}
        <div className="lg:col-span-8 glass-panel p-16 relative overflow-hidden flex flex-col min-h-[700px]">
          <div className="scanline"></div>
          <div className="absolute top-0 right-0 p-8 font-mono text-[10px] text-val-light/10 tracking-[0.5em] flex flex-col items-end gap-2">
            <span>CLASSIFIED // EYES_ONLY</span>
            <div className="flex gap-1">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-val-red/20"></div>
              ))}
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedAgent.id} 
              initial={{ opacity: 0, x: 40, filter: 'blur(10px)' }} 
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} 
              exit={{ opacity: 0, x: -40, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-full flex flex-col"
            >
              <div className="flex flex-col lg:flex-row gap-16 items-start mb-16">
                <div className="relative group">
                  <div className="w-64 h-64 glass-panel flex items-center justify-center border-val-red/30 relative overflow-hidden">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.1, 0.2, 0.1]
                      }}
                      transition={{ repeat: Infinity, duration: 4 }}
                      className="absolute inset-0 bg-val-red/10"
                    />
                    <selectedAgent.icon size={96} className="text-val-red relative z-10 drop-shadow-[0_0_15px_rgba(255,70,85,0.5)]" />
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-val-red"></div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-val-red"></div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 glass-panel flex items-center justify-center border-val-red/50 bg-val-dark">
                    <span className="text-xs font-mono font-black text-val-red">0{agents.findIndex(a => a.id === selectedAgent.id) + 1}</span>
                  </div>
                </div>
                
                <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-val-red"></div>
                      <span className="text-[10px] font-mono text-val-red uppercase tracking-[0.4em]">Agent_Designation</span>
                    </div>
                    <h1 className="text-8xl font-display font-black tracking-tighter italic leading-none text-white drop-shadow-lg">
                      {selectedAgent.title}
                    </h1>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="px-4 py-1 bg-val-red text-white text-[10px] font-black tracking-[0.3em] uppercase italic">
                      {selectedAgent.spec.split(',')[0]}
                    </div>
                    <div className="px-4 py-1 border border-val-border text-val-light/40 text-[10px] font-mono tracking-[0.3em] uppercase">
                      Class: RADIANT
                    </div>
                  </div>
                  
                  <p className="text-val-light/60 text-xl leading-relaxed max-w-2xl border-l-2 border-val-red/20 pl-8 italic">
                    "{selectedAgent.desc}"
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-auto">
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-val-border pb-4">
                    <div className="flex items-center gap-4">
                      <Terminal size={16} className="text-val-red" />
                      <h3 className="text-val-light/40 text-[10px] font-black tracking-[0.4em] uppercase">Technical_Arsenal</h3>
                    </div>
                    <span className="text-[8px] font-mono text-val-red/40">LOADOUT_SYNCED</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedAgent.skills.map((skill, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between p-5 bg-val-dark/40 border border-val-border group hover:border-val-red/50 transition-all hover:translate-x-2"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-1 h-1 bg-val-red/40"></div>
                          <span className="text-sm font-mono text-val-light/80 tracking-tight">{skill}</span>
                        </div>
                        <div className="w-8 h-px bg-val-border group-hover:w-12 group-hover:bg-val-red transition-all"></div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-val-border pb-4">
                    <div className="flex items-center gap-4">
                      <Activity size={16} className="text-val-red" />
                      <h3 className="text-val-red text-[10px] font-black tracking-[0.4em] uppercase">Performance_Analytics</h3>
                    </div>
                    <span className="text-[8px] font-mono text-green-500/40">OPTIMAL_STATE</span>
                  </div>
                  <div className="glass-panel p-10 border-glow bg-val-red/5 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-val-red/5 rotate-45 translate-x-16 -translate-y-16"></div>
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-12 h-12 bg-val-red/10 border border-val-red/20 flex items-center justify-center">
                        <BarChart3 className="text-val-red" size={24} />
                      </div>
                      <div>
                        <div className="text-[8px] font-mono text-val-light/30 uppercase tracking-widest mb-1">Mission Success Metric</div>
                        <div className="text-3xl font-display font-black text-val-light tracking-tight italic">
                          {selectedAgent.metrics.split(',')[0]}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-mono text-val-light/40 uppercase tracking-widest">
                        <span>System Stability</span>
                        <span>98.4%</span>
                      </div>
                      <div className="h-1.5 w-full bg-val-light/5 relative overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '98.4%' }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          className="h-full bg-val-red"
                        />
                      </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-val-border flex justify-between items-center">
                      <div className="flex gap-1.5">
                        {[...Array(12)].map((_, i) => (
                          <motion.div 
                            key={i}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
                            className="w-1 h-5 bg-val-red/30"
                          />
                        ))}
                      </div>
                      <div className="text-right">
                        <div className="text-[8px] font-mono text-val-light/20 uppercase tracking-[0.5em] mb-1">Status</div>
                        <div className="text-[10px] font-display font-black text-green-500 tracking-widest">READY_FOR_DEPLOYMENT</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const DocsPage: React.FC = () => {
  const categories = [
    { title: 'SYSTEM_ARCH', items: ['Neural Loadout', 'Core Backend', 'Uplink Protocols'], icon: Cpu },
    { title: 'OPERATIONAL', items: ['Vision Diagnostics', 'NLP Matrix', 'Forge Pipelines'], icon: Zap },
    { title: 'SECURITY', items: ['Auth_v4.0', 'Radiant Clearance', 'Secure Comms'], icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen pt-32 pb-12 px-6 md:px-12 lg:px-24 flex flex-col items-center">
      <div className="max-w-7xl w-full">
        <div className="flex flex-col items-center gap-6 mb-20 text-center">
          <div className="flex items-center gap-4">
            <div className="w-2 h-8 bg-val-red"></div>
            <h2 className="text-val-red text-sm font-black tracking-[0.4em] uppercase">SYSTEM_DOCUMENTATION // INTEL</h2>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter italic uppercase">INTEL_BRIEFING</h1>
          <p className="text-val-light/40 font-mono text-xs uppercase tracking-[0.3em] max-w-xl">
            Direct access to the tactical blueprints and technical specifications of the Rushil OS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {categories.map((cat, idx) => (
            <div key={idx} className="glass-panel p-12 relative group hover:border-val-red transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-40 transition-opacity">
                <cat.icon size={64} className="text-val-red" />
              </div>
              <div className="flex flex-col gap-8 relative z-10">
                <h3 className="text-val-red font-display font-black text-xs tracking-[0.5em] uppercase">[{cat.title}]</h3>
                <div className="space-y-6">
                  {cat.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group/item cursor-pointer">
                      <div className="w-1.5 h-1.5 bg-val-red/40 group-hover/item:bg-val-red transition-colors"></div>
                      <span className="text-xl font-display font-black italic tracking-tight uppercase group-hover/item:translate-x-2 transition-transform">{item}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-4 text-[10px] font-mono text-val-light/30 uppercase tracking-[0.4em] hover:text-val-red transition-colors text-left uppercase">
                  Request_Access_Uplink {" >> "}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



const MissionsPage: React.FC<{ onSelectProject: (p: Project) => void }> = ({ onSelectProject }) => {
  const [isDeploying, setIsDeploying] = useState<string | null>(null);

  const handleProjectSelect = (project: Project) => {
    setIsDeploying(project.id);
    setTimeout(() => {
      onSelectProject(project);
      setIsDeploying(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-32 pb-12 px-6 md:px-12 lg:px-24 relative w-full">
      <AnimatePresence>
        {isDeploying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-val-dark/90 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <div className="space-y-8 text-center">
              <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-32 h-32 border-4 border-val-red/20 border-t-val-red rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity className="text-val-red animate-pulse" size={40} />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-val-red font-display font-black text-2xl tracking-[0.5em] uppercase italic">DEPLOYING_ASSETS</h2>
                <p className="text-val-light/40 font-mono text-xs uppercase tracking-widest">Establishing secure uplink to mission data...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-8 bg-val-red"></div>
              <h2 className="text-val-red text-sm font-black tracking-[0.4em] uppercase">MISSION_LOGS</h2>
            </div>
            <h1 className="text-7xl font-display font-black tracking-tighter italic leading-none text-white whitespace-pre-wrap">ACTIVE_OPERATIONS</h1>
          </div>
          <div className="glass-panel px-8 py-4 flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-val-light/30 uppercase tracking-widest">Op_Count</span>
              <span className="text-3xl font-display font-black text-val-red">08</span>
            </div>
            <div className="w-px h-10 bg-val-border"></div>
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-val-light/30 uppercase tracking-widest">Success_Rate</span>
              <span className="text-3xl font-display font-black text-val-light">100%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-12">
          {PROJECTS.map((project) => (
            <motion.div 
              key={project.id} 
              whileHover={{ y: -12 }} 
              onClick={() => handleProjectSelect(project)} 
              className="group cursor-pointer relative"
            >
              <div className="relative aspect-[16/10] overflow-hidden border border-val-border group-hover:border-val-red transition-all duration-500">
                <MaskReveal direction="left" delay={0.1} className="w-full h-full">
                  <ParallaxImage 
                    src={project.image} 
                    alt={project.title} 
                    strength={20}
                    className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                  />
                </MaskReveal>
                <div className="absolute inset-0 bg-val-dark/70 group-hover:bg-val-dark/20 transition-all duration-500 pointer-events-none"></div>
                
                {/* Scanning Line */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.div 
                    animate={{ y: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-full h-1 bg-val-red/50 shadow-[0_0_20px_#ff4655]"
                  />
                </div>

                <div className="absolute top-4 left-4">
                  <div className="px-3 py-1 bg-val-dark/80 border border-val-border text-[8px] font-mono text-val-red uppercase tracking-widest">
                    AGENT_{project.agent.toUpperCase()}
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <div className="text-[8px] font-mono text-val-light/40 uppercase tracking-[0.3em]">Operation_{project.id}</div>
                      <h3 className="text-2xl font-display font-black tracking-tighter italic text-white leading-none">{project.title}</h3>
                    </div>
                    <div className="w-12 h-12 glass-panel flex items-center justify-center group-hover:bg-val-red group-hover:border-val-red transition-all duration-300">
                      <ChevronRight size={24} className="text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Card Footer Info */}
              <div className="mt-4 flex items-center justify-between px-2">
                <div className="flex gap-2">
                  {project.tech.slice(0, 2).map((t, i) => (
                    <span key={i} className="text-[9px] font-mono text-val-light/30 uppercase">{t}</span>
                  ))}
                </div>
                <span className="text-[9px] font-mono text-val-red/60 uppercase tracking-widest">Secure_Link</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MissionDetailPage: React.FC<{ project: Project, onBack: () => void }> = ({ project, onBack }) => {
  return (
    <div className="min-h-screen pt-32 pb-12 px-6 md:px-12 lg:px-24 w-full">
      <div className="max-w-7xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-4 text-val-light/30 hover:text-val-red transition-all mb-12 group">
          <div className="w-10 h-10 glass-panel flex items-center justify-center group-hover:border-val-red">
            <ChevronRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={20} />
          </div>
          <span className="text-xs font-display font-black uppercase tracking-[0.4em]">Abort Mission // Return</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Intelligence Assets */}
          <div className="lg:col-span-8 space-y-12">
            <div className="relative aspect-video border border-val-border overflow-hidden group">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-val-dark via-transparent to-transparent opacity-80"></div>
              
              <div className="absolute top-6 left-6 flex items-center gap-4">
                <div className="w-3 h-3 bg-val-red animate-ping"></div>
                <span className="text-[10px] font-mono text-white uppercase tracking-[0.3em] drop-shadow-lg">Live_Asset_Feed</span>
              </div>

              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-val-red uppercase tracking-widest">Mission_Objective</div>
                  <h1 className="text-5xl font-display font-black tracking-tighter italic text-white leading-none">{project.title}</h1>
                </div>
                <div className="flex gap-4">
                  <a href={project.github} target="_blank" className="w-14 h-14 glass-panel flex items-center justify-center hover:bg-val-red hover:border-val-red transition-all">
                    <Github size={24} />
                  </a>
                  <a href={project.live} target="_blank" className="w-14 h-14 glass-panel flex items-center justify-center hover:bg-val-red hover:border-val-red transition-all">
                    <ExternalLink size={24} />
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="glass-panel p-10 relative group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-val-red"></div>
                <div className="flex items-center gap-4 mb-6">
                  <Target className="text-val-red" size={20} />
                  <h3 className="text-val-red text-xs font-black tracking-[0.3em] uppercase">The Challenge</h3>
                </div>
                <p className="text-val-light/70 text-lg leading-relaxed">{project.problem}</p>
              </div>
              <div className="glass-panel p-10 relative group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
                <div className="flex items-center gap-4 mb-6">
                  <ShieldCheck className="text-green-500" size={20} />
                  <h3 className="text-green-500 text-xs font-black tracking-[0.3em] uppercase">The Solution</h3>
                </div>
                <p className="text-val-light/70 text-lg leading-relaxed">{project.solution}</p>
              </div>
            </div>
          </div>

          {/* Right: Tactical Data */}
          <div className="lg:col-span-4 space-y-10">
            <div className="glass-panel p-10 border-r-4 border-r-val-red bg-val-red/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-val-red/10 border border-val-red/20 flex items-center justify-center">
                  <Activity className="text-val-red" size={20} />
                </div>
                <h3 className="text-val-red text-xs font-black tracking-[0.4em] uppercase">Mission Metrics</h3>
              </div>
              <div className="text-3xl font-display font-black text-val-light tracking-tight italic leading-tight mb-8">
                {project.metrics}
              </div>
              
              <div className="space-y-8 pt-8 border-t border-val-border">
                <div>
                  <div className="text-[10px] font-mono text-val-light/30 uppercase tracking-widest mb-3">Assigned Agent</div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-val-red flex items-center justify-center">
                      <Cpu size={16} />
                    </div>
                    <span className="text-xl font-display font-black tracking-tighter italic">{project.agent}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-[10px] font-mono text-val-light/30 uppercase tracking-widest mb-4">Technical Stack</div>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t, i) => (
                      <span key={i} className="px-3 py-1 bg-val-red/10 border border-val-red/20 text-val-red text-[10px] font-mono font-bold uppercase">{t}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-val-light/30 uppercase tracking-widest mb-4">Tactical Tools</div>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((t, i) => (
                      <span key={i} className="px-3 py-1 bg-val-light/5 border border-val-border text-val-light/50 text-[10px] font-mono uppercase">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-8 flex items-center gap-6 group hover:border-val-red transition-colors cursor-help">
              <Info className="text-val-red" size={24} />
              <div>
                <div className="text-[8px] font-mono text-val-light/30 uppercase tracking-widest">Status</div>
                <div className="text-sm font-display font-black tracking-widest uppercase">Mission_Complete</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CareerPage: React.FC = () => {
  const stats = [
    { label: 'Diagnostic Accuracy', value: '92.4%', sub: 'Vision AI Systems' },
    { label: 'System Efficiency', value: '75%', sub: 'Automation Gain' },
    { label: 'Python Mastery', value: 'Top 5%', sub: 'NPTEL Certified' },
    { label: 'Core Logic', value: '95%', sub: 'C/C++ Proficiency' }
  ];

  return (
    <div className="min-h-screen pt-32 pb-12 px-6 md:px-12 lg:px-24 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-2 h-8 bg-val-red"></div>
          <h2 className="text-val-red text-sm font-black tracking-[0.4em] uppercase">SERVICE_HISTORY // COMBAT_LOGS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, idx) => (
            <ScrollReveal key={idx} direction="up">
              <div className="glass-panel p-8 border-b-2 border-val-red group hover:bg-val-red/5 transition-colors">
                <div className="text-[10px] font-mono text-val-light/30 uppercase tracking-[0.3em] mb-2">{stat.label}</div>
                <div className="text-4xl font-display font-black text-val-red tracking-tighter italic">{stat.value}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Experience & Education */}
          <div className="lg:col-span-7 space-y-20">
            {/* Professional Experience */}
            <div className="space-y-12">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 glass-panel flex items-center justify-center border-val-red/30">
                  <Briefcase className="text-val-red" size={24} />
                </div>
                <h3 className="text-2xl font-display font-black tracking-tighter italic uppercase">Mission_History // Experience</h3>
              </div>
              
              <div className="space-y-10 relative before:absolute before:left-0 before:top-0 before:w-px before:h-full before:bg-val-border">
                {[
                  { role: 'GENAI AUTOMATION LEAD', company: 'Fiverr (Freelance)', year: '2023 - PRESENT', desc: 'Deploying high-impact automation pipelines and custom GenAI agents for global clients. Optimized workflow efficiency by 75% for 20+ projects.', status: 'ACTIVE' },
                  { role: 'SYSTEMS ARCHITECT (INTERN)', company: 'Tech Forge Labs', year: 'JAN 2024 - JUNE 2024', desc: 'Engineered robust backend systems using FastAPI and monitored neural loadouts for medical classification models.', status: 'COMPLETED' }
                ].map((exp, idx) => (
                  <ScrollReveal key={idx} direction="left">
                    <div className="pl-10 relative group">
                      <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 bg-val-red rotate-45 group-hover:scale-150 transition-transform"></div>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="text-[10px] font-mono text-val-red tracking-widest">{exp.year}</div>
                        <div className={`text-[8px] font-mono px-2 py-0.5 border ${exp.status === 'ACTIVE' ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-val-light/20 text-val-light/40'} uppercase tracking-widest`}>
                          {exp.status}
                        </div>
                      </div>
                      <h4 className="text-2xl font-display font-black tracking-tighter italic mb-1 uppercase group-hover:text-val-red transition-colors">{exp.role}</h4>
                      <div className="text-sm font-bold text-val-light/60 mb-3">{exp.company}</div>
                      <p className="text-sm text-val-light/40 max-w-lg leading-relaxed">{exp.desc}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* Education History */}
            <div className="space-y-12">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 glass-panel flex items-center justify-center border-val-red/30">
                  <Layers className="text-val-red" size={24} />
                </div>
                <h3 className="text-2xl font-display font-black tracking-tighter italic uppercase">Service_Record // Education</h3>
              </div>
              
              <div className="space-y-10 relative before:absolute before:left-0 before:top-0 before:w-px before:h-full before:bg-val-border">
                {[
                  { degree: 'B.E. IN AI & ML', institution: 'ISBM College of Engineering', year: '2022 - 2026', desc: 'Specializing in deep learning, computer vision, and scalable AI architectures.', status: 'ACTIVE' },
                  { degree: 'HSC (SCIENCE)', institution: 'Vidyaniketan College', year: '2020 - 2021', desc: 'Focused on advanced mathematics and physics.', status: 'COMPLETED' },
                  { degree: 'CBSE (10TH)', institution: 'VPM\'s B.R. Tol School', year: '2018 - 2019', desc: 'Foundational studies with distinction.', status: 'COMPLETED' }
                ].map((edu, idx) => (
                  <ScrollReveal key={idx} direction="left">
                    <div className="pl-10 relative group">
                      <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 bg-val-red rotate-45 group-hover:scale-150 transition-transform"></div>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="text-[10px] font-mono text-val-red tracking-widest">{edu.year}</div>
                        <div className={`text-[8px] font-mono px-2 py-0.5 border ${edu.status === 'ACTIVE' ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-val-light/20 text-val-light/40'} uppercase tracking-widest`}>
                          {edu.status}
                        </div>
                      </div>
                      <h4 className="text-2xl font-display font-black tracking-tighter italic mb-1 uppercase group-hover:text-val-red transition-colors">{edu.degree}</h4>
                      <div className="text-sm font-bold text-val-light/60 mb-3">{edu.institution}</div>
                      <p className="text-sm text-val-light/40 max-w-lg leading-relaxed">{edu.desc}</p>
                      
                      <div className="mt-4 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-[8px] font-mono text-val-light/20 uppercase">Clearance_Lvl_0{3-idx}</div>
                        <div className="text-[8px] font-mono text-val-light/20 uppercase">Sector_0{idx+1}</div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>

          {/* Loadout & Skills */}
          <div className="lg:col-span-5 space-y-16">
            <div className="space-y-12">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 glass-panel flex items-center justify-center border-val-red/30">
                  <Zap className="text-val-red" size={24} />
                </div>
                <h3 className="text-2xl font-display font-black tracking-tighter italic uppercase">Technical_Loadout</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { label: 'Languages', items: ['Python', 'Java', 'C/C++', 'SQL', 'JavaScript'] },
                  { label: 'Frameworks', items: ['FastAPI', 'Flask', 'Django', 'TensorFlow', 'PyTorch', 'Scikit-Learn'] },
                  { label: 'Infrastructure', items: ['Docker', 'PostgreSQL', 'MongoDB', 'Redis', 'GCP', 'Git'] },
                  { label: 'AI Tools', items: ['Make.com', 'Meta Graph API', 'Google Gemini', 'Google Veo', 'TruLens'] }
                ].map((group, idx) => (
                  <div key={idx} className="glass-panel p-6 group hover:border-val-red/50 transition-colors">
                    <div className="text-[10px] font-mono text-val-light/30 uppercase tracking-[0.4em] mb-4">{group.label}</div>
                    <div className="flex flex-wrap gap-3">
                      {group.items.map((item, i) => (
                        <span key={i} className="px-3 py-1 bg-val-red/5 border border-val-red/10 text-val-red text-[10px] font-mono font-bold uppercase">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SystemsCorePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoverNode, setHoverNode] = useState<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    }
  }, []);

  const graphData = useMemo(() => {
    const nodes: any[] = [{ id: 'RUSHIL_AI_CORE', group: 0, val: 50 }];
    const links: any[] = [];
    
    // Create categories with boosted importance for ML, Backend, and Automation
    const categories = [
      { id: 'Deep_Learning', group: 1, val: 45 },
      { id: 'Systems_Backend', group: 2, val: 45 },
      { id: 'Automation', group: 3, val: 45 },
      { id: 'Data_Prep_Misc', group: 4, val: 25 }
    ];
    
    nodes.push(...categories);
    categories.forEach(c => {
      links.push({ source: 'RUSHIL_AI_CORE', target: c.id });
    });

    const addedSkills = new Set();
    
    PROJECTS.forEach(p => {
      p.tech.concat(p.tools).forEach(tech => {
        if (!addedSkills.has(tech)) {
          addedSkills.add(tech);
          
          let targetGroup = 4;
          let parent = 'Data_Science';
          
          if (['FastAPI', 'Django', 'MongoDB', 'PostgreSQL', 'Docker', 'Redis', 'Flask', 'GCP'].includes(tech)) {
            targetGroup = 2; parent = 'Systems_Backend';
          } else if (['Make.com', 'Twilio API', 'Twilio', 'SMTP', 'Chrome Extension API', 'Google Gemini', 'Google Veo'].includes(tech)) {
            targetGroup = 3; parent = 'Automation';
          } else if (['PyTorch', 'TensorFlow', 'CNNs', 'ResNet-50', 'ViT-B/16', 'LSTM', 'Spectrogram'].includes(tech)) {
            targetGroup = 1; parent = 'Deep_Learning';
          }

          nodes.push({ id: tech, group: targetGroup, val: 15 });
          links.push({ source: parent, target: tech });
        }
      });
    });

    return { nodes, links };
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-12 px-6 md:px-12 lg:px-24 w-full flex flex-col items-center">
      <div className="max-w-7xl mx-auto mb-16 relative z-10 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-[2px] bg-val-red/40"></div>
            <h2 className="text-val-red text-sm font-black tracking-[0.4em] uppercase">TECHNICAL_ARSENAL</h2>
            <div className="w-8 h-[2px] bg-val-red/40"></div>
          </div>
          <h1 className="text-7xl font-display font-black tracking-tighter italic leading-none text-white drop-shadow-lg">
            NEURAL_LOADOUT
          </h1>
          <p className="text-val-light/40 font-mono text-xs uppercase tracking-[0.3em] max-w-xl">
            Interactive topological map of system-wide skills and technical specializations.
            Drag core modules to analyze neural links.
          </p>
        </div>
      </div>

      <div ref={containerRef} className="w-full max-w-7xl h-[60vh] md:h-[700px] glass-panel border border-val-border relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 font-mono text-[10px] text-val-light/20 tracking-[0.5em] flex flex-col items-end gap-2 z-10 pointer-events-none">
          <span>LIVE_SIMULATION</span>
          <div className="flex gap-1 group-hover:animate-pulse">
            <div className="w-2 h-2 rounded-full bg-val-red"></div>
          </div>
        </div>
        
        {dimensions.width > 0 && (
          <ForceGraph2D
            width={dimensions.width}
            height={dimensions.height}
            graphData={graphData}
            nodeRelSize={1}
            nodeColor={(node: any) => node.group === 0 ? '#ff4655' : node.group === 1 ? '#00e5ff' : node.group === 2 ? '#ffc107' : node.group === 3 ? '#b388ff' : '#00e676'}
            linkColor={() => 'rgba(255, 255, 255, 0.1)'}
            nodeLabel="id"
            onNodeHover={setHoverNode}
            nodeCanvasObject={(node: any, ctx, globalScale) => {
              const label = node.id;
              const isHovered = hoverNode === node;
              const isImportant = node.group < 4; // RUSHIL_AI_CORE or Major Category
              const radius = node.val / 3.5;

              const color = node.group === 0 ? '#ff4655' : node.group === 1 ? '#00e5ff' : node.group === 2 ? '#ffc107' : node.group === 3 ? '#b388ff' : '#00e676';

              // Draw Node Circle
              ctx.beginPath();
              ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
              ctx.fillStyle = color;
              
              if (isHovered) {
                ctx.shadowColor = '#ffffff';
                ctx.shadowBlur = 15;
              } else if (isImportant) {
                ctx.shadowColor = color;
                ctx.shadowBlur = 8;
              } else {
                ctx.shadowBlur = 0;
              }
              ctx.fill();

              // Draw Label only if hovered or if it's an important category 
              // (which prevents screen clutter)
              if (isHovered || isImportant) {
                const fontSize = isImportant ? 10 : 8;
                ctx.font = `${fontSize}px Inter, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.shadowBlur = 0; // Don't blur the text
                
                // Text shadow/background for legibility
                ctx.fillStyle = 'rgba(15, 25, 35, 0.8)';
                const textWidth = ctx.measureText(label).width;
                ctx.fillRect(node.x - textWidth / 2 - 2, node.y + radius + 2, textWidth + 4, fontSize + 4);

                ctx.fillStyle = isHovered ? '#ffffff' : color;
                ctx.fillText(label, node.x, node.y + radius + 4);
              }
              
              // Required for hover hit detection
              node.__bckgDimensions = [radius*2, radius*2];
            }}
            nodePointerAreaPaint={(node: any, color, ctx) => {
              ctx.fillStyle = color;
              const radius = node.val / 3.5;
              ctx.beginPath();
              ctx.arc(node.x, node.y, radius + 4, 0, 2 * Math.PI, false); // generous hover radius
              ctx.fill();
            }}
          />
        )}
      </div>
    </div>
  );
};



const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-40 pb-20 px-6 md:px-12 lg:px-24 w-full flex items-center justify-center overflow-x-hidden">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        <div className="space-y-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-8 bg-val-red"></div>
              <h2 className="text-val-red text-sm font-black tracking-[0.4em] uppercase">INITIATE_COMMS</h2>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter italic leading-none break-words">CONTACT_AGENT</h1>
          </div>

          <p className="text-val-light/60 text-xl leading-relaxed max-w-lg">
            Ready to deploy advanced AI solutions or collaborate on next-gen systems? Establish a secure connection through the channels below.
          </p>

          <div className="space-y-10">
            <a href="mailto:rushildhube1305@gmail.com" className="flex items-start gap-8 group">
              <div className="w-16 h-16 glass-panel flex items-center justify-center group-hover:border-val-red transition-colors">
                <Mail className="text-val-red" size={28} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-val-light/30 uppercase tracking-[0.4em] mb-2">Direct Channel</div>
                <div className="text-2xl font-display font-black tracking-tight italic group-hover:text-val-red transition-colors">rushildhube1305@gmail.com</div>
              </div>
            </a>
            <div className="flex items-start gap-8 group">
              <div className="w-16 h-16 glass-panel flex items-center justify-center group-hover:border-val-red transition-colors">
                <Globe className="text-val-red" size={28} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-val-light/30 uppercase tracking-[0.4em] mb-2">Base Location</div>
                <div className="text-2xl font-display font-black tracking-tight italic">Pune, Maharashtra, India</div>
              </div>
            </div>
            <a href="https://www.fiverr.com/rushildhube" target="_blank" className="flex items-start gap-8 group cursor-pointer">
              <div className="w-16 h-16 glass-panel flex items-center justify-center group-hover:border-val-red transition-colors">
                <FiverrLogo className="text-val-red" size={32} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-val-light/30 uppercase tracking-[0.4em] mb-2">Freelance Marketplace</div>
                <div className="text-2xl font-display font-black tracking-tight italic hover:text-val-red transition-colors">fiverr.com/rushildhube</div>
              </div>
            </a>
          </div>
        </div>

        <div className="glass-panel p-8 md:p-16 relative group">
          <div className="scanline"></div>
          <div className="absolute top-0 left-0 w-2 h-full bg-val-red"></div>
          
          <form className="space-y-8 md:space-y-10" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              <label className="text-[10px] font-mono text-val-light/30 uppercase tracking-[0.5em]">Agent Name</label>
              <input 
                type="text" 
                className="w-full bg-val-dark/40 border-b-2 border-val-border p-6 text-2xl font-display font-black italic outline-none focus:border-val-red transition-colors placeholder:text-val-light/5"
                placeholder="IDENTIFY_YOURSELF..."
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-mono text-val-light/30 uppercase tracking-[0.5em]">Comm Channel</label>
              <input 
                type="email" 
                className="w-full bg-val-dark/40 border-b-2 border-val-border p-6 text-2xl font-display font-black italic outline-none focus:border-val-red transition-colors placeholder:text-val-light/5"
                placeholder="EMAIL_ADDRESS..."
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-mono text-val-light/30 uppercase tracking-[0.5em]">Message Payload</label>
              <textarea 
                rows={4}
                className="w-full bg-val-dark/40 border-b-2 border-val-border p-6 text-2xl font-display font-black italic outline-none focus:border-val-red transition-colors placeholder:text-val-light/5 resize-none"
                placeholder="TRANSMISSION_DATA..."
              />
            </div>
            
            <button className="val-button val-button-primary w-full py-8 text-2xl group">
              <span className="relative z-10 flex items-center justify-center gap-6 italic">
                SEND_TRANSMISSION
                <Send size={28} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [appState, setAppState] = useState<AppState>('standby');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentPage('mission-detail');
  };

  const handleBackToMissions = () => {
    setCurrentPage('missions');
    setSelectedProject(null);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-val-dark text-val-light selection:bg-val-red selection:text-white relative font-sans overflow-x-hidden">
      <CustomCursor />
      <TerminalOverlay />
      <SmoothScroll>
        <AnimatePresence mode="wait">
          {appState === 'standby' && (
            <LandingPage key="landing" onEnter={() => setAppState('ready')} />
          )}

          {appState === 'ready' && (
            <motion.div 
              key="ready-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <Navbar 
                isOpen={isNavOpen} 
                onToggle={() => setIsNavOpen(!isNavOpen)} 
                setPage={setCurrentPage}
              />
              
              <NavOverlay 
                isOpen={isNavOpen} 
                activePage={currentPage} 
                setPage={setCurrentPage} 
                onClose={() => setIsNavOpen(false)}
              />

              <HUDOverlay />
              <TerminalOverlay setPage={setCurrentPage} />
              
              <main className="relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage + (selectedProject?.id || '')}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="min-h-screen"
                  >
                    {currentPage === 'home' && <HomePage setPage={setCurrentPage} />}
                    {currentPage === 'agents' && <AgentsPage />}
                    {currentPage === 'missions' && <MissionsPage onSelectProject={handleSelectProject} />}
                    {currentPage === 'mission-detail' && selectedProject && (
                      <MissionDetailPage project={selectedProject} onBack={handleBackToMissions} />
                    )}
                    {currentPage === 'core' && <SystemsCorePage />}
                    {currentPage === 'docs' && <DocsPage />}
                    {currentPage === 'career' && <CareerPage />}
                    {currentPage === 'contact' && <ContactPage />}
                  </motion.div>
                </AnimatePresence>
              </main>

              {/* Global Background Grid */}
              <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
                <div className="absolute inset-0" style={{ 
                  backgroundImage: `linear-gradient(var(--color-val-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-val-border) 1px, transparent 1px)`,
                  backgroundSize: '100px 100px'
                }}></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SmoothScroll>
    </div>
  );
}
