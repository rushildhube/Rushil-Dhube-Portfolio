/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, Terminal, Cpu, Info } from 'lucide-react';
import { ScrollReveal } from '../components/animations';

const DocsPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 pb-32 px-6 md:px-12 lg:px-24 flex flex-col items-center w-full">
      <div className="max-w-4xl w-full">
        <ScrollReveal direction="up">
          <div className="flex flex-col items-center gap-6 mb-20 text-center">
            <div className="flex items-center gap-4">
              <div className="w-2 h-8 bg-val-red"></div>
              <h2 className="text-val-red text-sm font-black tracking-[0.4em] uppercase">
                SYSTEM_DOCUMENTATION
              </h2>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter italic uppercase text-white">
              INTEL_BRIEFING
            </h1>
            <p className="text-val-light/50 font-mono text-sm uppercase tracking-[0.2em] max-w-2xl mt-4">
              Comprehensive database covering the operative, the architecture, and the command
              console.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-32">
          {/* SECTION: ABOUT ME */}
          <ScrollReveal direction="up">
            <div className="border border-val-border glass-panel p-8 relative group hover:border-val-red transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-40 transition-opacity">
                <User size={64} className="text-val-red" />
              </div>
              <h3 className="text-val-red font-display font-black text-xs tracking-[0.5em] uppercase mb-8">
                [ THE_OPERATIVE ]
              </h3>
              <h2 className="text-4xl font-display font-black uppercase tracking-tight italic text-white mb-6">
                About Rushil Dhube
              </h2>
              <div className="font-sans text-val-light/80 space-y-4 max-w-2xl leading-relaxed text-lg relative z-10">
                <p>
                  I am an AI & Machine Learning Engineer based in Pune, specializing in{' '}
                  <strong>Healthcare Diagnostics, Computer Vision, and Automation Pipelines</strong>
                  . Currently pursuing my B.E. at ISBM College of Engineering, I build
                  production-grade intelligence systems—translating complex neural architectures
                  into real-world impact.
                </p>
                <p>
                  My core directive is solving high-stakes problems: from classifying retinal and
                  dental diseases using state-of-the-art Vision Transformers to engineering
                  automated defense systems against deepfakes and malicious URLs.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* SECTION: TERMINAL */}
          <ScrollReveal direction="up">
            <div className="border border-val-border glass-panel p-8 relative group hover:border-val-red transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-40 transition-opacity">
                <Terminal size={64} className="text-val-red" />
              </div>
              <h3 className="text-val-red font-display font-black text-xs tracking-[0.5em] uppercase mb-8">
                [ COMMAND_CONSOLE ]
              </h3>
              <h2 className="text-4xl font-display font-black uppercase tracking-tight italic text-white mb-6">
                Terminal Usage
              </h2>
              <div className="font-sans text-val-light/80 space-y-6 max-w-3xl leading-relaxed text-lg relative z-10">
                <p>
                  The terminal overlay (toggled via the <code>`</code> backtick key or the
                  bottom-right icon) isn't just aesthetic—it's a fully functional directory
                  structure of this portfolio.
                </p>
                <div className="bg-val-gray/30 p-4 border-l-2 border-val-red/50 font-mono text-sm space-y-3 hidden sm:block">
                  <div className="flex gap-4">
                    <span className="text-val-red font-bold w-20">help</span>
                    <span className="text-val-light/70">
                      List all available commands and operations.
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-val-red font-bold w-20">cd</span>
                    <span className="text-val-light/70">
                      Navigate between sectors (e.g., cd missions, cd career).
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-val-red font-bold w-20">ls</span>
                    <span className="text-val-light/70">
                      List available nodes in the current sector.
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-val-red font-bold w-20">open</span>
                    <span className="text-val-light/70">
                      Execute a specific sector or project detail page.
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-val-red font-bold w-20">sudo</span>
                    <span className="text-val-light/70">
                      Attempt authorized deep system access.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* SECTION: WEBSITE ARCH */}
          <ScrollReveal direction="up">
            <div className="border border-val-border glass-panel p-8 relative group hover:border-val-red transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-40 transition-opacity">
                <Cpu size={64} className="text-val-red" />
              </div>
              <h3 className="text-val-red font-display font-black text-xs tracking-[0.5em] uppercase mb-8">
                [ SYSTEM_ARCH ]
              </h3>
              <h2 className="text-4xl font-display font-black uppercase tracking-tight italic text-white mb-6">
                Website Build
              </h2>
              <div className="font-sans text-val-light/80 space-y-4 max-w-2xl leading-relaxed text-lg relative z-10">
                <p>
                  This responsive dossier was engineered using <strong>React 19</strong> +{' '}
                  <strong>Vite</strong> + <strong>Tailwind CSS V4</strong>. Heavily inspired by
                  tactical interfaces and neo-cyberpunk aesthetics, it is built to feel fast, fluid,
                  and cinematic.
                </p>
                <p>
                  <strong>Motion & Physics:</strong> The continuous floating "zero-gravity"
                  aesthetic, 3D cursor trailing, and parallax depths are driven by{' '}
                  <strong>Framer Motion (v12)</strong>. Smooth scroll inertia is powered by{' '}
                  <strong>Lenis</strong>.
                </p>
                <p>
                  <strong>Simulation:</strong> The interactive skills node graph runs on{' '}
                  <strong>react-force-graph-2d</strong>.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* SECTION: FAQS */}
          <ScrollReveal direction="up">
            <div className="border border-val-border glass-panel p-8 relative group hover:border-val-red transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-40 transition-opacity">
                <Info size={64} className="text-val-red" />
              </div>
              <h3 className="text-val-red font-display font-black text-xs tracking-[0.5em] uppercase mb-8">
                [ INTEL_QUERIES ]
              </h3>
              <h2 className="text-4xl font-display font-black uppercase tracking-tight italic text-white mb-6">
                F.A.Q.
              </h2>
              <div className="font-sans text-val-light/80 space-y-8 max-w-2xl leading-relaxed text-lg relative z-10">
                <div className="space-y-2">
                  <h4 className="text-val-red font-display font-black tracking-widest text-xl">
                    01. ARE YOU AVAILABLE FOR HIRE?
                  </h4>
                  <p>
                    Yes. I am actively seeking full-time roles, internships, and freelance contracts
                    in AI, Machine Learning, and Backend Engineering.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-val-red font-display font-black tracking-widest text-xl">
                    02. WHY THE AGENT THEME?
                  </h4>
                  <p>
                    I build autonomous problem-solving AI "Agents". Designing my portfolio around
                    the concept of a tactical intelligence database felt like the truest reflection
                    of the systems I architect.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-val-red font-display font-black tracking-widest text-xl">
                    03. WHAT IS YOUR TECH STACK?
                  </h4>
                  <p>
                    Python dominates my backend & ML pipelines (PyTorch, TensorFlow, FastAPI,
                    Django). For agentic automation, I orchestrate via Make.com and Google
                    Gemini/Veo. I deploy using Docker, GCP, and Git workflows.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
