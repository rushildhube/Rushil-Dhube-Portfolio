/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  ChevronRight,
  Github,
  ExternalLink,
  Target,
  ShieldCheck,
  Activity,
  Cpu,
  Info,
} from 'lucide-react';
import type { Project } from '../lib/types';

const MissionDetailPage: React.FC<{ project: Project; onBack: () => void }> = ({
  project,
  onBack,
}) => {
  return (
    <div className="min-h-screen pt-32 pb-12 px-6 md:px-12 lg:px-24 w-full">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-4 text-val-light/30 hover:text-val-red transition-all mb-12 group"
        >
          <div className="w-10 h-10 glass-panel flex items-center justify-center group-hover:border-val-red">
            <ChevronRight
              className="rotate-180 group-hover:-translate-x-1 transition-transform"
              size={20}
            />
          </div>
          <span className="text-xs font-display font-black uppercase tracking-[0.4em]">
            Abort Mission // Return
          </span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Intelligence Assets */}
          <div className="lg:col-span-8 space-y-12">
            <div className="relative aspect-video border border-val-border overflow-hidden group">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-val-dark via-transparent to-transparent opacity-80"></div>

              <div className="absolute top-6 left-6 flex items-center gap-4">
                <div className="w-3 h-3 bg-val-red animate-ping"></div>
                <span className="text-[10px] font-mono text-white uppercase tracking-[0.3em] drop-shadow-lg">
                  Live_Asset_Feed
                </span>
              </div>

              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-val-red uppercase tracking-widest">
                    Mission_Objective
                  </div>
                  <h1 className="text-5xl font-display font-black tracking-tighter italic text-white leading-none">
                    {project.title}
                  </h1>
                </div>
                <div className="flex gap-4">
                  <a
                    href={project.github}
                    target="_blank"
                    className="w-14 h-14 glass-panel flex items-center justify-center hover:bg-val-red hover:border-val-red transition-all"
                  >
                    <Github size={24} />
                  </a>
                  <a
                    href={project.live}
                    target="_blank"
                    className="w-14 h-14 glass-panel flex items-center justify-center hover:bg-val-red hover:border-val-red transition-all"
                  >
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
                  <h3 className="text-val-red text-xs font-black tracking-[0.3em] uppercase">
                    The Challenge
                  </h3>
                </div>
                <p className="text-val-light/70 text-lg leading-relaxed">{project.problem}</p>
              </div>
              <div className="glass-panel p-10 relative group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
                <div className="flex items-center gap-4 mb-6">
                  <ShieldCheck className="text-green-500" size={20} />
                  <h3 className="text-green-500 text-xs font-black tracking-[0.3em] uppercase">
                    The Solution
                  </h3>
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
                <h3 className="text-val-red text-xs font-black tracking-[0.4em] uppercase">
                  Mission Metrics
                </h3>
              </div>
              <div className="text-3xl font-display font-black text-val-light tracking-tight italic leading-tight mb-8">
                {project.metrics}
              </div>

              <div className="space-y-8 pt-8 border-t border-val-border">
                <div>
                  <div className="text-[10px] font-mono text-val-light/30 uppercase tracking-widest mb-3">
                    Assigned Agent
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-val-red flex items-center justify-center">
                      <Cpu size={16} />
                    </div>
                    <span className="text-xl font-display font-black tracking-tighter italic">
                      {project.agent}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-val-light/30 uppercase tracking-widest mb-4">
                    Technical Stack
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-val-red/10 border border-val-red/20 text-val-red text-[10px] font-mono font-bold uppercase"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-val-light/30 uppercase tracking-widest mb-4">
                    Tactical Tools
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((t, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-val-light/5 border border-val-border text-val-light/50 text-[10px] font-mono uppercase"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-8 flex items-center gap-6 group hover:border-val-red transition-colors cursor-help">
              <Info className="text-val-red" size={24} />
              <div>
                <div className="text-[8px] font-mono text-val-light/30 uppercase tracking-widest">
                  Status
                </div>
                <div className="text-sm font-display font-black tracking-widest uppercase">
                  Mission_Complete
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionDetailPage;
