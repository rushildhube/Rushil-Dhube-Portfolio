/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { MaskReveal } from './animations';
import { EASE_EXPO } from '../lib/data';

const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, []); // onComplete intentionally omitted — timer must only fire once on mount

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
              <h2 className="text-val-red font-display font-black text-sm tracking-[0.4em] uppercase">
                INITIALIZING_CORE_SYSTEMS
              </h2>
              <h1 className="text-6xl font-display font-black tracking-tighter italic">
                RUSHIL // PORTFOLIO
              </h1>
            </div>
            <div className="text-val-light/20 font-mono text-[10px] uppercase tracking-[0.3em] text-right">
              EST_LOAD: 0.24s
              <br />
              VERSION: 4.0.1
            </div>
          </div>
        </MaskReveal>

        <div className="h-1 w-full bg-val-light/5 relative overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.2, ease: EASE_EXPO }}
            className="h-full bg-val-red shadow-[0_0_20px_#ff4655]"
          />
        </div>

        <div className="mt-12 grid grid-cols-4 gap-8">
          {['NEURO', 'VISION', 'FORGE', 'CORE'].map((agent, i) => (
            <motion.div
              key={agent}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="flex flex-col gap-2"
            >
              <div className="text-[8px] font-mono text-val-light/30 tracking-widest uppercase">
                Agent_{agent}
              </div>
              <div className="h-1 w-full bg-val-light/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                  className="h-full bg-val-light/40"
                />
              </div>
              <div className="text-[10px] font-display font-bold text-val-light/60">SYNCED</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 z-[-1] opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(var(--color-val-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-val-border) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        ></div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
