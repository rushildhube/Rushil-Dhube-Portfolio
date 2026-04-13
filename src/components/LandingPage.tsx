/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FiverrLogo } from './icons';

const LandingPage: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [showMatchFound, setShowMatchFound] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const startTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => clearTimeout(startTimerRef.current);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (showMatchFound && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (showMatchFound && countdown === 0) {
      onEnter();
    }
    return () => clearTimeout(timer);
  }, [showMatchFound, countdown, onEnter]);

  const handleStart = () => {
    setIsInitializing(true);

    const audio = new Audio('/match-found.mp3');
    audio.play().catch(() => {});

    clearTimeout(startTimerRef.current);
    startTimerRef.current = setTimeout(() => setShowMatchFound(true), 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-val-dark flex flex-col items-center justify-start md:justify-center px-4 py-6 md:px-8 md:py-10 lg:px-12 lg:py-12 overflow-y-auto overflow-x-hidden"
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(var(--color-val-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-val-border) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
          }}
        ></div>
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-6 md:gap-8 lg:gap-10 relative z-10">
        <div className="w-full flex justify-between items-start mb-4 md:mb-8 lg:mb-10">
          <div className="space-y-4">
            <span className="text-val-red font-mono text-xs tracking-[0.6em] uppercase block">
              Clearance_Level
            </span>
            <div className="flex items-center gap-4">
              <div className="w-4 h-8 bg-val-red"></div>
              <span className="text-[clamp(1.5rem,4.8vw,2.25rem)] font-display font-black italic tracking-tighter uppercase">
                RADIANT
              </span>
            </div>
          </div>
          <div className="text-right space-y-4">
            <span className="text-val-light/20 font-mono text-[10px] tracking-[0.4em] uppercase block">
              Location_ID
            </span>
            <span className="text-[clamp(1rem,3.4vw,1.5rem)] font-display font-black italic tracking-tighter uppercase opacity-40">
              PUNE_NODE_01
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 md:gap-5">
          <h2 className="text-val-red font-display font-black text-[clamp(0.55rem,1.2vw,0.875rem)] tracking-[0.55em] md:tracking-[1em] uppercase animate-pulse text-center">
            PERSONNEL_IDENTIFIED
          </h2>
          <h1 className="text-[clamp(2rem,9vw,7rem)] font-display font-black tracking-tighter italic uppercase text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] leading-[0.9] text-center">
            RUSHIL <span className="text-val-red">//</span> DHUBE
          </h1>
          <div className="h-px w-full max-w-[min(70vw,26rem)] bg-gradient-to-r from-transparent via-val-red to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full max-w-5xl mt-3 md:mt-6">
          <div className="glass-panel p-5 md:p-6 lg:p-7 text-left space-y-3 border-val-red border-l-4 group hover:bg-val-red/[0.03] transition-colors">
            <span className="text-[10px] font-mono text-val-red/60 uppercase tracking-widest block">
              Primary_Specialization
            </span>
            <span className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-display font-black italic tracking-tight uppercase group-hover:text-val-red transition-colors leading-tight">
              BACKEND & ML ARCHITECT
            </span>
          </div>
          <div className="glass-panel p-5 md:p-6 lg:p-7 text-left space-y-3 border-val-red/20 group hover:border-val-red/50 transition-colors">
            <span className="text-[10px] font-mono text-val-red/60 uppercase tracking-widest block">
              Core_Modules
            </span>
            <span className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-display font-black italic tracking-tight uppercase group-hover:text-val-red transition-colors leading-tight">
              AUTOMATION // NEURAL NETS
            </span>
          </div>
          <div className="glass-panel p-5 md:p-6 lg:p-7 text-left space-y-3 border-val-red/20 group hover:border-val-red/50 transition-colors">
            <span className="text-[10px] font-mono text-val-red/60 uppercase tracking-widest block">
              Uplink_Signal
            </span>
            <span className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-display font-black italic tracking-tight uppercase group-hover:text-val-red transition-colors text-green-500 leading-tight">
              OPTIMAL_LINK
            </span>
          </div>
        </div>

        <div className="mt-4 md:mt-8 group relative">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-val-red/20 rounded-full blur-3xl pointer-events-none"
          />
          <button
            onClick={handleStart}
            disabled={isInitializing}
            className="val-button val-button-primary text-[clamp(1rem,2.8vw,2rem)] py-5 md:py-7 px-7 md:px-12 lg:px-16 relative z-10 font-display italic tracking-[0.12em] md:tracking-[0.2em]"
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
            className="fixed inset-0 z-[250] flex flex-col items-center justify-center bg-black/60 px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-8"
            >
              <h2 className="text-white font-display font-black text-[clamp(2rem,11vw,5.5rem)] tracking-[0.18em] uppercase drop-shadow-[0_0_50px_rgba(255,70,85,0.5)] text-center leading-none">
                MATCH FOUND
              </h2>

              <div className="flex flex-col items-center gap-4">
                <div className="text-val-red font-mono text-xs tracking-[1em] uppercase">
                  Deploying_Asset_In
                </div>
                <motion.div
                  key={countdown}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-white text-[clamp(3rem,16vw,5rem)] font-display font-black italic"
                >
                  {countdown}
                </motion.div>
                <div className="w-[min(80vw,16rem)] h-1 bg-val-red/20 relative overflow-hidden">
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 3, ease: 'linear' }}
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

export default LandingPage;
