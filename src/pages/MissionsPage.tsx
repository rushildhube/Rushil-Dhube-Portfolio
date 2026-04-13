/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Activity } from 'lucide-react';
import { ScrollReveal, MaskReveal, ParallaxImage } from '../components/animations';
import { EASE_EXPO } from '../lib/data';
import { PROJECTS } from '../lib/data';
import type { Project } from '../lib/types';

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
      {createPortal(
        <AnimatePresence>
          {isDeploying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[220] bg-val-dark/90 backdrop-blur-md flex flex-col items-center justify-center"
            >
              <div className="space-y-8 text-center">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    className="w-32 h-32 border-4 border-val-red/20 border-t-val-red rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity className="text-val-red animate-pulse" size={40} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-val-red font-display font-black text-2xl tracking-[0.5em] uppercase italic">
                    DEPLOYING_ASSETS
                  </h2>
                  <p className="text-val-light/40 font-mono text-xs uppercase tracking-widest">
                    Establishing secure uplink to mission data...
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-8 bg-val-red"></div>
              <h2 className="text-val-red text-sm font-black tracking-[0.4em] uppercase">
                ACTIVE_OPERATIONS
              </h2>
            </div>
            <h1 className="text-7xl font-display font-black tracking-tighter italic leading-none text-white whitespace-pre-wrap">
              ACTIVE_OPERATIONS
            </h1>
          </div>
          <div className="glass-panel px-8 py-4 flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-val-light/30 uppercase tracking-widest">
                Op_Count
              </span>
              <span className="text-3xl font-display font-black text-val-red">08</span>
            </div>
            <div className="w-px h-10 bg-val-border"></div>
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-val-light/30 uppercase tracking-widest">
                Success_Rate
              </span>
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
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
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
                      <div className="text-[8px] font-mono text-val-light/40 uppercase tracking-[0.3em]">
                        Operation_{project.id}
                      </div>
                      <h3 className="text-2xl font-display font-black tracking-tighter italic text-white leading-none">
                        {project.title}
                      </h3>
                    </div>
                    <div className="w-12 h-12 glass-panel flex items-center justify-center group-hover:bg-val-red group-hover:border-val-red transition-all duration-300">
                      <ChevronRight
                        size={24}
                        className="text-white group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="mt-4 flex items-center justify-between px-2">
                <div className="flex gap-2">
                  {project.tech.slice(0, 2).map((t, i) => (
                    <span key={i} className="text-[9px] font-mono text-val-light/30 uppercase">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="text-[9px] font-mono text-val-red/60 uppercase tracking-widest">
                  Secure_Link
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MissionsPage;
