/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { ArrowRight, Github, Linkedin, Mail, X } from 'lucide-react';
import { FiverrLogo } from './icons';
import type { Page } from '../lib/types';

const NavItem: React.FC<{
  label: string;
  meaning: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, meaning, active, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [displayText, setDisplayText] = useState(label);
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';

  const scramble = () => {
    setIsHovered(true);
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) =>
        prev
          .split('')
          .map((char, index) => {
            if (index < iteration) return label[index];
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      if (iteration >= label.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={scramble}
      onMouseLeave={() => {
        setIsHovered(false);
        setDisplayText(label);
      }}
      className="w-full flex items-center justify-between group py-6 border-b border-val-border/30 relative overflow-hidden"
    >
      <div className="flex items-center gap-8 relative z-10 w-full">
        <span className="text-val-red font-mono text-sm opacity-40 group-hover:opacity-100 transition-opacity tracking-widest min-w-[100px] text-left">
          {active ? '// ACTIVE' : '// SELECT'}
        </span>

        <div className="flex flex-col items-start relative overflow-hidden h-20 md:h-32 lg:h-44 justify-center flex-1">
          <motion.h2
            animate={isHovered ? { y: -120, opacity: 0 } : { y: 0, opacity: 1 }}
            className={`text-2xl md:text-5xl lg:text-[clamp(3.5rem,8vw,8rem)] font-display font-black tracking-tighter italic uppercase whitespace-nowrap lg:pr-12 min-w-max ${active ? 'text-val-red' : 'text-val-light group-hover:text-val-red'}`}
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
          <span className="text-[10px] font-mono text-val-red tracking-[0.4em] uppercase">
            Deploy_Sector
          </span>
          <ArrowRight size={32} className="text-val-red" />
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-val-red/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
    </motion.button>
  );
};

export const Navbar: React.FC<{
  onToggle: () => void;
  isOpen: boolean;
  setPage: (p: Page) => void;
}> = ({ onToggle, isOpen, setPage }) => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest < 50) {
      setHidden(false);
    } else if (latest > lastY) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setLastY(latest);
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' },
      }}
      animate={hidden && !isOpen ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed top-0 left-0 w-full z-[120] h-20 flex items-center justify-between px-6 md:px-12 pointer-events-none"
    >
      <div className="flex items-center gap-4">
        <div
          className="cursor-pointer group pointer-events-auto"
          onClick={() => {
            setPage('home');
            if (isOpen) onToggle();
          }}
        >
          <div className="w-10 h-10 bg-val-red flex items-center justify-center rotate-45 transition-transform group-hover:rotate-[135deg]">
            <svg
              viewBox="0 0 100 100"
              className="w-6 h-6 -rotate-45 text-val-dark"
              fill="currentColor"
            >
              <path d="M0 100 L40 0 L100 0 L100 20 L50 20 L20 100 Z" />
              <path d="M100 100 L80 100 L60 60 L80 60 Z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-2xl tracking-tighter leading-none text-white">
              RUSHIL_DHUBE
            </span>
            <span className="text-[10px] font-mono text-val-red tracking-[0.3em] uppercase opacity-60">
              Radiant // Agent
            </span>
          </div>
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

export const NavOverlay: React.FC<{
  isOpen: boolean;
  activePage: Page;
  setPage: (p: Page) => void;
  onClose: () => void;
}> = ({ isOpen, activePage, setPage, onClose }) => {
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
            <span className="text-val-red font-mono text-xs tracking-[0.5em] uppercase">
              Navigation_Interface
            </span>
          </div>

          <div className="flex flex-col w-full">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                label={item.label}
                meaning={item.meaning}
                active={
                  activePage === item.id ||
                  (activePage === 'mission-detail' && item.id === 'missions')
                }
                onClick={() => {
                  setPage(item.id);
                  onClose();
                }}
              />
            ))}
          </div>

          <div className="mt-auto pb-12 flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="flex gap-12">
              <a href="https://github.com/rushildhube" target="_blank" className="group">
                <div className="text-[8px] font-mono text-val-light/20 uppercase tracking-widest mb-2 group-hover:text-val-red transition-colors underline-slide pb-1">
                  GitHub
                </div>
                <Github
                  size={24}
                  className="text-val-light/40 group-hover:text-white transition-colors"
                />
              </a>
              <a href="https://linkedin.com/in/rushildhube" target="_blank" className="group">
                <div className="text-[8px] font-mono text-val-light/20 uppercase tracking-widest mb-2 group-hover:text-val-red transition-colors underline-slide pb-1">
                  LinkedIn
                </div>
                <Linkedin
                  size={24}
                  className="text-val-light/40 group-hover:text-white transition-colors"
                />
              </a>
              <a href="https://www.fiverr.com/rushildhube" target="_blank" className="group">
                <div className="text-[8px] font-mono text-val-light/20 uppercase tracking-widest mb-2 group-hover:text-val-red transition-colors underline-slide pb-1">
                  MARKETPLACE
                </div>
                <FiverrLogo
                  className="text-val-light/40 group-hover:text-white transition-colors"
                  size={32}
                />
              </a>
              <a href="mailto:rushildhube1305@gmail.com" className="group">
                <div className="text-[8px] font-mono text-val-light/20 uppercase tracking-widest mb-2 group-hover:text-val-red transition-colors underline-slide pb-1">
                  SECURE_MAIL
                </div>
                <Mail
                  size={24}
                  className="text-val-light/40 group-hover:text-white transition-colors"
                />
              </a>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-mono text-val-light/20 uppercase tracking-[0.4em] mb-2">
                Current_Session
              </div>
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
