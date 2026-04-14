/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { User, Github, Linkedin, Mail, FileText, Target } from 'lucide-react';
import { Magnetic, StaggeredText, TextReveal } from '../components/animations';
import { FiverrLogo } from '../components/icons';
import { PROFILE_POSITIONING } from '../lib/data';
import type { Page } from '../lib/types';

const HomePage: React.FC<{ setPage: (p: Page) => void }> = ({ setPage }) => {
  return (
    <div className="min-h-screen flex flex-col xl:flex-row items-center justify-start xl:justify-center gap-12 lg:gap-20 px-6 md:px-12 lg:px-24 mx-auto max-w-7xl pt-32 pb-12 w-full">
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
              <div className="text-xs font-mono text-val-red uppercase tracking-[0.4em] mb-1">
                AGENT_PROFILE // RUSHIL
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-val-red text-white text-[10px] font-black uppercase tracking-widest">
                  Radiant
                </span>
                <span className="text-val-light/40 text-[10px] font-mono uppercase tracking-widest">
                  ID: 1305-907
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-[clamp(3rem,12vw,8.5rem)] font-display font-black leading-[0.85] mb-6 tracking-tighter">
            <StaggeredText text="RUSHIL" delay={0.2} by="char" className="block" />
            <StaggeredText text="DHUBE" delay={0.55} by="char" className="block" />
          </h1>

          <div className="flex items-center w-full gap-4 mb-8">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-px flex-1 bg-val-border origin-left"
            />
            <StaggeredText
              text="AI & ML ENGINEER"
              className="text-lg md:text-2xl font-display font-black text-val-red tracking-[0.2em] italic whitespace-nowrap"
              delay={0.8}
            />
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-px flex-1 bg-val-border origin-right"
            />
          </div>

          <div className="mb-6 space-y-2 text-[13px] font-mono text-val-light/70 uppercase tracking-[0.3em]">
            <div className="text-val-red font-semibold">{PROFILE_POSITIONING.roleTarget}</div>
            <div className="text-val-light/60">{PROFILE_POSITIONING.availability}</div>
            <div className="text-val-light/60">Worktype: {PROFILE_POSITIONING.worktype}</div>
          </div>

          <div className="text-val-light/80 text-lg leading-relaxed mb-10 max-w-lg">
            <TextReveal text={PROFILE_POSITIONING.iSolve} />
          </div>

          <div className="mb-12 space-y-2 border-l-2 border-val-red pl-4">
            {PROFILE_POSITIONING.whyHireMe.map((point, idx) => (
              <div key={idx} className="text-sm font-mono text-val-light/80 leading-snug">
                {point}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <Magnetic strength={0.2}>
              <a
                href="/Master_CV.pdf"
                download="Master_CV.pdf"
                className="val-button val-button-primary flex-1 flex items-center justify-center gap-3 group px-8 w-full"
              >
                <FileText size={20} className="group-hover:scale-110 transition-transform" />
                DOWNLOAD_DOSSIER
              </a>
            </Magnetic>
            <div className="flex gap-4">
              <Magnetic strength={0.3}>
                <a
                  href="https://github.com/rushildhube"
                  target="_blank"
                  className="w-14 h-14 glass-panel flex items-center justify-center hover:text-val-red hover:border-val-red transition-all group/icon"
                >
                  <Github size={24} className="group-hover/icon:scale-110 transition-transform" />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-val-red text-[8px] font-mono text-white opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap">
                    GITHUB_REPO
                  </div>
                </a>
              </Magnetic>
              <Magnetic strength={0.3}>
                <a
                  href="https://linkedin.com/in/rushildhube"
                  target="_blank"
                  className="w-14 h-14 glass-panel flex items-center justify-center hover:text-val-red hover:border-val-red transition-all group/icon"
                >
                  <Linkedin size={24} className="group-hover/icon:scale-110 transition-transform" />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-val-red text-[8px] font-mono text-white opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap">
                    LINKEDIN_INTEL
                  </div>
                </a>
              </Magnetic>
              <Magnetic strength={0.3}>
                <a
                  href="https://www.fiverr.com/rushildhube"
                  target="_blank"
                  className="w-14 h-14 glass-panel flex items-center justify-center hover:text-val-red hover:border-val-red transition-all group/icon"
                >
                  <FiverrLogo
                    size={24}
                    className="group-hover/icon:scale-110 transition-transform"
                  />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-val-red text-[8px] font-mono text-white opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap">
                    FIVERR_MARKET
                  </div>
                </a>
              </Magnetic>
              <Magnetic strength={0.3}>
                <a
                  href="mailto:rushildhube1305@gmail.com"
                  className="w-14 h-14 glass-panel flex items-center justify-center hover:text-val-red hover:border-val-red transition-all group/icon"
                >
                  <Mail size={24} className="group-hover/icon:scale-110 transition-transform" />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-val-red text-[8px] font-mono text-white opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap">
                    SECURE_MAIL
                  </div>
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </motion.div>

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
                <Target
                  className="group-hover:rotate-90 transition-transform duration-500"
                  size={32}
                />
              </span>
            </button>
          </Magnetic>
        </div>

        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="text-[10px] font-mono text-val-light/30 uppercase tracking-[0.5em]">
            Select Mission Operation
          </div>
          <div className="flex gap-3">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scaleY: [1, 2, 1],
                  opacity: [0.2, 1, 0.2],
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

export default HomePage;
