/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Zap, Cpu, Eye, Activity, BarChart3, X } from 'lucide-react';
import { ScrollReveal } from '../components/animations';
import { EASE_EXPO } from '../lib/data';

const AgentsPage: React.FC = () => {
  const agents = [
    {
      id: 'core',
      title: 'CORE',
      spec: 'Backend & Systems Engineering',
      icon: Terminal,
      skills: [
        'FastAPI',
        'Django',
        'Flask',
        'PostgreSQL',
        'MongoDB',
        'OAuth2/JWT',
        'Docker',
        'Async APIs',
      ],
      metrics: 'Production-ready backend systems for AI workloads',
      desc: 'Architecting robust, mission-critical infrastructure and high-performance backend systems with a focus on code scalability and resilience.',
    },
    {
      id: 'forge',
      title: 'FORGE',
      spec: 'ML & Automation Pipelines',
      icon: Zap,
      skills: [
        'Autonomous Workflows',
        'Make.com',
        'Meta Graph API',
        'Google Gemini',
        'Google Veo',
        'STT/TTS + Telephony',
      ],
      metrics: '75% reduction in manual content creation time',
      desc: 'Engineering sophisticated automation architectures that leverage GenAI to streamline complex business operations.',
    },
    {
      id: 'neuro',
      title: 'NEURO',
      spec: 'NLP & RAG Engineering',
      icon: Cpu,
      skills: [
        'LLMs',
        'RAG Vector-DB Architectures',
        'Transformers',
        'Qdrant',
        'TruLens Evaluation',
        'Safety Guardrails',
      ],
      metrics: '90%+ accuracy in specialized retrieval systems',
      desc: 'Specialist in building neural conversational systems and high-precision evaluation matrices for AI safety.',
    },
    {
      id: 'vision',
      title: 'VISION',
      spec: 'Computer Vision & Deep Learning',
      icon: Eye,
      skills: [
        'Computer Vision (OpenCV)',
        'CNNs',
        'Vision Transformers (ViT)',
        'Medical Diagnostics',
        'Object Tracking',
      ],
      metrics: '92.4% accuracy in diagnostic vision models',
      desc: 'High-precision deep learning implementation for medical imaging and complex visual recognition challenges.',
    },
  ];

  const [expandedAgent, setExpandedAgent] = useState('core');
  const [detailedAgent, setDetailedAgent] = useState<(typeof agents)[0] | null>(null);
  const [mountingAgentId, setMountingAgentId] = useState<string | null>(null);
  const agentOpenTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => clearTimeout(agentOpenTimerRef.current);
  }, []);

  const handleAgentOpen = (agent: (typeof agents)[0]) => {
    clearTimeout(agentOpenTimerRef.current);
    setMountingAgentId(agent.id);
    agentOpenTimerRef.current = setTimeout(() => {
      setDetailedAgent(agent);
      setMountingAgentId(null);
    }, 650);
  };

  // Lock scroll when modal is open
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (detailedAgent) {
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
    } else {
      document.body.style.overflow = 'auto';
      if (lenis) lenis.start();
    }
    return () => {
      document.body.style.overflow = 'auto';
      if (lenis) lenis.start();
    };
  }, [detailedAgent]);

  return (
    <div className="min-h-screen py-8 px-6 md:px-12 lg:px-24 flex flex-col items-center">
      <div className="max-w-[1400px] w-full">
        <ScrollReveal direction="left">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-2 h-8 bg-val-red"></div>
            <h2 className="text-val-red text-sm font-black tracking-[0.4em] uppercase">
              OPERATIONAL_AGENTS
            </h2>
          </div>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row h-[300px] md:h-[500px] lg:h-[600px] w-full gap-4 lg:gap-6">
          {agents.map((agent) => {
            const isActive = expandedAgent === agent.id;
            return (
              <motion.div
                layoutId={`agent-panel-${agent.id}`}
                key={agent.id}
                onClick={() => handleAgentOpen(agent)}
                onMouseEnter={() => setExpandedAgent(agent.id)}
                initial={false}
                animate={{
                  flex: isActive
                    ? typeof window !== 'undefined' && window.innerWidth >= 1024
                      ? 6
                      : 4
                    : 1,
                }}
                transition={{ duration: 0.8, ease: EASE_EXPO }}
                className={`relative glass-panel overflow-hidden cursor-pointer group transition-colors duration-500 border
                  ${isActive ? 'border-val-red bg-val-red/5' : 'border-val-border hover:bg-val-red/10 bg-val-dark'}
                `}
              >
                {/* Background Glitch & Icon */}
                <div className="scanline"></div>
                <motion.div
                  animate={{
                    opacity: isActive ? 0.03 : 0.08,
                    scale: isActive ? 2 : 1,
                    x: isActive ? '30%' : '0%',
                    y: isActive ? '30%' : '0%',
                  }}
                  transition={{ duration: 1.5, ease: EASE_EXPO }}
                  className="absolute bottom-0 right-0 p-8 pointer-events-none origin-bottom-right"
                >
                  <agent.icon size={250} className="text-val-red" />
                </motion.div>

                <div className="flex flex-col h-full p-6 md:p-10 relative z-10 w-full overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center gap-6">
                    <div
                      className={`w-14 h-14 md:w-16 md:h-16 flex-shrink-0 flex items-center justify-center transition-all duration-500 border
                      ${isActive ? 'bg-val-red border-val-red text-white shadow-[0_0_20px_rgba(255,70,85,0.4)]' : 'glass-panel border-val-border text-val-red group-hover:border-val-red'}
                    `}
                    >
                      <agent.icon size={28} />
                    </div>
                    <motion.div
                      animate={{ opacity: isActive ? 1 : 0 }}
                      className="flex-col hidden lg:flex"
                    >
                      <span className="text-[10px] font-mono text-val-red tracking-[0.4em] uppercase">
                        Designation
                      </span>
                      <h3 className="text-4xl md:text-5xl font-display font-black tracking-tighter italic uppercase whitespace-nowrap">
                        {agent.title}
                      </h3>
                    </motion.div>
                  </div>

                  {/* Vertical Collapsed Title (Desktop) */}
                  <motion.div
                    initial={false}
                    animate={{ opacity: !isActive ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="hidden lg:flex absolute bottom-20 left-1/2 -translate-x-1/2 items-center flex-col-reverse justify-start origin-bottom"
                  >
                    <h3 className="-rotate-90 text-3xl font-display font-black italic tracking-widest text-val-light/30 group-hover:text-val-red transition-colors whitespace-nowrap min-w-max">
                      {agent.title}
                    </h3>
                  </motion.div>

                  {/* Horizontal Collapsed Title (Mobile) */}
                  <motion.div
                    initial={false}
                    animate={{ opacity: !isActive ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="lg:hidden mt-4"
                  >
                    <h3 className="text-2xl font-display font-black italic tracking-widest text-val-light/30 group-hover:text-val-red transition-colors">
                      {agent.title}
                    </h3>
                  </motion.div>

                  {/* Expanded Data Block. Absolute width stops jittering reflows on flex resize */}
                  <div className="flex-1 relative mt-10">
                    <motion.div
                      initial={false}
                      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                      transition={{ duration: 0.7, delay: isActive ? 0.2 : 0, ease: EASE_EXPO }}
                      className={`absolute bottom-0 left-0 flex flex-col justify-end w-[280px] sm:w-[450px] lg:w-[600px] ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
                    >
                      <div className="px-4 py-1 bg-val-red text-white text-[9px] md:text-[11px] font-black tracking-[0.3em] uppercase italic w-fit mb-6 flex items-center gap-4">
                        {agent.spec}
                        <span className="opacity-50 tracking-[0.5em] group-hover:opacity-100 transition-opacity">
                          /// CLICK TO MOUNT
                        </span>
                      </div>

                      <p className="text-val-light/80 text-lg md:text-2xl font-sans italic border-l-4 border-val-red pl-6 mb-8 lg:mb-12 h-20 md:h-24">
                        "{agent.desc}"
                      </p>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 border-b border-val-border pb-3">
                          <Terminal size={14} className="text-val-red" />
                          <span className="text-[10px] md:text-xs font-mono font-black text-val-light/50 tracking-[0.3em] uppercase">
                            Active_Arsenal
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 md:gap-3">
                          {agent.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="text-[9px] md:text-xs font-mono bg-val-dark/80 border border-val-border/50 px-3 py-2 text-val-light/70 whitespace-nowrap backdrop-blur-md"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {mountingAgentId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[225] bg-val-dark/90 backdrop-blur-md flex flex-col items-center justify-center"
            >
              <div className="space-y-8 text-center">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
                    className="w-28 h-28 border-4 border-val-red/20 border-t-val-red rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Cpu className="text-val-red animate-pulse" size={34} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-val-red font-display font-black text-2xl tracking-[0.45em] uppercase italic">
                    MOUNTING_AGENT
                  </h2>
                  <p className="text-val-light/40 font-mono text-xs uppercase tracking-widest">
                    Initializing operational profile...
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {createPortal(
        <AnimatePresence>
          {detailedAgent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              data-lenis-prevent
              className="fixed inset-0 z-[210] flex items-center justify-center p-6 md:p-12 lg:p-24 overflow-y-auto bg-val-dark/95 backdrop-blur-3xl"
              onClick={() => setDetailedAgent(null)}
            >
              <motion.div
                layoutId={`agent-panel-${detailedAgent.id}`}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-6xl glass-panel relative overflow-hidden flex flex-col border border-val-red shadow-[0_0_80px_rgba(255,70,85,0.2)] p-8 md:p-16 my-auto"
              >
                {/* Close Button */}
                <button
                  onClick={() => setDetailedAgent(null)}
                  className="absolute top-8 right-8 z-50 p-4 bg-val-dark/80 border border-val-red/30 text-val-red hover:bg-val-red hover:text-white transition-colors cursor-pointer"
                >
                  <X size={24} />
                </button>

                <div className="absolute top-0 right-0 p-8 font-mono text-[10px] text-val-light/10 tracking-[0.5em] flex-col items-end gap-2 pr-32 hidden md:flex">
                  <span>CLASSIFIED // EYES_ONLY</span>
                  <div className="flex gap-1">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-val-red/20"></div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start mb-16 relative z-10 pt-10">
                  <div className="relative group flex-shrink-0">
                    <div className="w-32 h-32 md:w-64 md:h-64 glass-panel flex items-center justify-center border-val-red/30 relative overflow-hidden">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="absolute inset-0 bg-val-red/10"
                      />
                      <detailedAgent.icon
                        size={80}
                        className="text-val-red relative z-10 drop-shadow-[0_0_15px_rgba(255,70,85,0.5)] md:w-24 md:h-24"
                      />
                      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-val-red"></div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-val-red"></div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 glass-panel flex items-center justify-center border-val-red/50 bg-val-dark">
                      <span className="text-xs font-mono font-black text-val-red">
                        0{agents.findIndex((a) => a.id === detailedAgent.id) + 1}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-val-red"></div>
                        <span className="text-[10px] font-mono text-val-red uppercase tracking-[0.4em]">
                          Agent_Designation
                        </span>
                      </div>
                      <h1 className="text-5xl md:text-8xl font-display font-black tracking-tighter italic leading-none text-white drop-shadow-lg uppercase">
                        {detailedAgent.title}
                      </h1>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <div className="px-4 py-1 bg-val-red text-white text-[10px] font-black tracking-[0.3em] uppercase italic">
                        {detailedAgent.spec.split(',')[0]}
                      </div>
                      <div className="px-4 py-1 border border-val-border text-val-light/40 text-[10px] font-mono tracking-[0.3em] uppercase">
                        Class: RADIANT
                      </div>
                    </div>

                    <p className="text-val-light/60 text-lg md:text-xl leading-relaxed max-w-2xl border-l-2 border-val-red/20 pl-6 md:pl-8 italic">
                      "{detailedAgent.desc}"
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-auto relative z-10">
                  <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-val-border pb-4">
                      <div className="flex items-center gap-4">
                        <Terminal size={16} className="text-val-red" />
                        <h3 className="text-val-light/40 text-[10px] font-black tracking-[0.4em] uppercase">
                          Technical_Arsenal
                        </h3>
                      </div>
                      <span className="text-[8px] font-mono text-val-red/40 hidden sm:block">
                        LOADOUT_SYNCED
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {detailedAgent.skills.map((skill, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center justify-between p-4 md:p-5 bg-val-dark/40 border border-val-border group hover:border-val-red/50 transition-all hover:translate-x-2"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-1 h-1 bg-val-red/40 group-hover:bg-val-red transition-colors"></div>
                            <span className="text-xs md:text-sm font-mono text-val-light/80 tracking-tight">
                              {skill}
                            </span>
                          </div>
                          <div className="w-8 h-px bg-val-border group-hover:w-16 group-hover:bg-val-red transition-all"></div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center justify-between border-b border-val-border pb-4">
                      <div className="flex items-center gap-4">
                        <Activity size={16} className="text-val-red" />
                        <h3 className="text-val-red text-[10px] font-black tracking-[0.4em] uppercase">
                          Performance_Analytics
                        </h3>
                      </div>
                      <span className="text-[8px] font-mono text-green-500/40 hidden sm:block">
                        OPTIMAL_STATE
                      </span>
                    </div>
                    <div className="glass-panel p-6 md:p-10 border-glow bg-val-red/5 relative group overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-val-red/5 rotate-45 translate-x-16 -translate-y-16"></div>
                      <div className="flex items-center gap-6 mb-8">
                        <div className="w-12 h-12 bg-val-red/10 border border-val-red/20 flex flex-shrink-0 items-center justify-center">
                          <BarChart3 className="text-val-red" size={24} />
                        </div>
                        <div>
                          <div className="text-[8px] font-mono text-val-light/30 uppercase tracking-widest mb-1">
                            Mission Success Metric
                          </div>
                          <div className="text-2xl md:text-3xl font-display font-black text-val-light tracking-tight italic">
                            {detailedAgent.metrics.split(',')[0]}
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
                            transition={{ duration: 1.5, delay: 0.5, ease: EASE_EXPO }}
                            className="h-full bg-val-red shadow-[0_0_10px_#ff4655]"
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
                              className="w-1 h-4 md:h-5 bg-val-red/30"
                            />
                          ))}
                        </div>
                        <div className="text-right">
                          <div className="text-[8px] font-mono text-val-light/20 uppercase tracking-[0.5em] mb-1">
                            Status
                          </div>
                          <div className="text-[9px] md:text-[10px] font-display font-black text-green-500 tracking-widest">
                            READY_FOR_DEPLOYMENT
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default AgentsPage;
