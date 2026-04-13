/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Layers, Zap } from 'lucide-react';
import { ScrollReveal } from '../components/animations';
import { LIVE_PROFILE } from '../lib/data';

const CareerPage: React.FC = () => {
  const stats = [
    { label: 'Dental Classifier', value: '92.28%', sub: 'Healthcare AI' },
    { label: 'Retinal Classifier', value: '92.4%', sub: 'Medical Vision' },
    { label: 'Automation Gain', value: '75%', sub: 'GenAI Workflows' },
    { label: 'Current SGPA', value: '9.07', sub: 'B.E. AI & ML' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-12 px-6 md:px-12 lg:px-24 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-2 h-8 bg-val-red"></div>
          <h2 className="text-val-red text-sm font-black tracking-[0.4em] uppercase">
            SERVICE_HISTORY // COMBAT_LOGS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, idx) => (
            <ScrollReveal key={idx} direction="up">
              <div className="glass-panel p-8 border-b-2 border-val-red group hover:bg-val-red/5 transition-colors">
                <div className="text-[10px] font-mono text-val-light/60 uppercase tracking-[0.3em] mb-2">
                  {stat.label}
                </div>
                <div className="text-4xl font-display font-black text-val-red tracking-tighter italic">
                  {stat.value}
                </div>
                <div className="mt-2 text-[11px] font-mono text-val-light/50 uppercase tracking-[0.25em]">
                  {stat.sub}
                </div>
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
                <h3 className="text-2xl font-display font-black tracking-tighter italic uppercase">
                  Mission_History // Experience
                </h3>
              </div>

              <div className="space-y-10 relative before:absolute before:left-0 before:top-0 before:w-px before:h-full before:bg-val-border">
                {[
                  {
                    role: 'ARTIFICIAL INTELLIGENCE ENGINEER',
                    company: 'Ethosh',
                    year: 'DEC 2025 - PRESENT',
                    bullets: [
                      'Architected production-grade AI pipelines (FastAPI + TensorFlow).',
                      'Cross-functional delivery: research -> backend -> evaluation.',
                      'Tech: Docker, PostgreSQL, CI/CD for AI workloads.',
                    ],
                    status: 'ACTIVE',
                  },
                  {
                    role: 'AI ENGINEER',
                    company: 'SniperThink',
                    year: 'SEP 2025 - DEC 2025',
                    bullets: [
                      'Led 75% reduction in manual content creation via GenAI automation (Make.com + Google Gemini).',
                      'Orchestrated Meta Graph API workflows for multi-channel campaign deployment.',
                      'Integrated: Veo, STT/TTS telephony, conversational LLM pipelines (10K+ workflows shipped).',
                    ],
                    status: 'COMPLETED',
                  },
                  {
                    role: 'AI INTERN',
                    company: 'WellBe Revive 360',
                    year: 'SEP 2025 - NOV 2025',
                    bullets: [
                      'Engineered production RAG system: OpenAI + Qdrant + TruLens, 90%+ safety validation.',
                      'Delivered SSE streaming, safety guardrails (diet constraints, PII masking).',
                      'Tech stack: FastAPI, PostgreSQL, embeddings, retrieval evaluation.',
                    ],
                    status: 'COMPLETED',
                  },
                  {
                    role: 'AI INTERN',
                    company: 'Edunet Foundation',
                    year: 'FEB 2025 - APR 2025',
                    bullets: [
                      'Built custom CNN retinal classifier: 92.4% accuracy on fundus dataset.',
                      'Deployed diagnostic Flask + Streamlit app (solo execution, peer review).',
                      'Tech: TensorFlow, image preprocessing, confusion matrix analysis, hyperparameter tuning.',
                    ],
                    status: 'COMPLETED',
                  },
                ].map((exp, idx) => (
                  <ScrollReveal key={idx} direction="left">
                    <div className="pl-10 relative group">
                      <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 bg-val-red rotate-45 group-hover:scale-150 transition-transform"></div>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="text-[10px] font-mono text-val-red tracking-widest">
                          {exp.year}
                        </div>
                        <div
                          className={`text-[8px] font-mono px-2 py-0.5 border ${exp.status === 'ACTIVE' ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-val-light/20 text-val-light/40'} uppercase tracking-widest`}
                        >
                          {exp.status}
                        </div>
                      </div>
                      <h4 className="text-2xl font-display font-black tracking-tighter italic mb-1 uppercase group-hover:text-val-red transition-colors">
                        {exp.role}
                      </h4>
                      <div className="text-sm font-bold text-val-light/60 mb-3">{exp.company}</div>
                      <ul className="text-sm text-val-light/40 max-w-lg space-y-1.5 list-disc list-inside leading-relaxed">
                        {exp.bullets?.map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
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
                <h3 className="text-2xl font-display font-black tracking-tighter italic uppercase">
                  Service_Record // Education
                </h3>
              </div>

              <div className="space-y-10 relative before:absolute before:left-0 before:top-0 before:w-px before:h-full before:bg-val-border">
                {[
                  {
                    degree: 'B.E. IN AI & ML',
                    institution: 'ISBM College of Engineering (SPPU)',
                    year: '2022 - 2026',
                    desc: `CGPA: ${LIVE_PROFILE.education.cgpa} | Current SGPA (TE): ${LIVE_PROFILE.education.sgpa}. Focused on deep learning, vision, NLP, and deployment systems.`,
                    status: 'ACTIVE',
                  },
                  {
                    degree: 'HSC (SCIENCE)',
                    institution: 'Vidyaniketan College, Mumbai',
                    year: '2021',
                    desc: 'Higher Secondary Certificate: 79.33%.',
                    status: 'COMPLETED',
                  },
                  {
                    degree: 'CBSE (10TH)',
                    institution: "VPM's B.R. Tol School, Mumbai",
                    year: '2019',
                    desc: 'CBSE Score: 73.83%.',
                    status: 'COMPLETED',
                  },
                ].map((edu, idx) => (
                  <ScrollReveal key={idx} direction="left">
                    <div className="pl-10 relative group">
                      <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 bg-val-red rotate-45 group-hover:scale-150 transition-transform"></div>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="text-[10px] font-mono text-val-red tracking-widest">
                          {edu.year}
                        </div>
                        <div
                          className={`text-[8px] font-mono px-2 py-0.5 border ${edu.status === 'ACTIVE' ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-val-light/20 text-val-light/40'} uppercase tracking-widest`}
                        >
                          {edu.status}
                        </div>
                      </div>
                      <h4 className="text-2xl font-display font-black tracking-tighter italic mb-1 uppercase group-hover:text-val-red transition-colors">
                        {edu.degree}
                      </h4>
                      <div className="text-sm font-bold text-val-light/60 mb-3">
                        {edu.institution}
                      </div>
                      <p className="text-sm text-val-light/40 max-w-lg leading-relaxed">
                        {edu.desc}
                      </p>

                      <div className="mt-4 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-[8px] font-mono text-val-light/20 uppercase">
                          Clearance_Lvl_0{3 - idx}
                        </div>
                        <div className="text-[8px] font-mono text-val-light/20 uppercase">
                          Sector_0{idx + 1}
                        </div>
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
                <h3 className="text-2xl font-display font-black tracking-tighter italic uppercase">
                  Technical_Loadout
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {[
                  {
                    domain: 'ML / AI',
                    expert: ['TensorFlow', 'PyTorch', 'RAG', 'LLMs', 'FastAPI'],
                    strong: [
                      'Keras',
                      'Scikit-Learn',
                      'NLP',
                      'Feature Engineering',
                      'Model Evaluation',
                    ],
                    familiar: ['JAX', 'MLflow', 'Qdrant', 'Vector Databases'],
                  },
                  {
                    domain: 'Backend / APIs',
                    expert: ['FastAPI', 'REST APIs', 'PostgreSQL', 'OAuth2/JWT'],
                    strong: ['Flask', 'Django', 'MongoDB', 'SQLAlchemy', 'Async Python'],
                    familiar: ['GraphQL', 'gRPC', 'Microservices'],
                  },
                  {
                    domain: 'Automation / Agents',
                    expert: [
                      'Make.com',
                      'Google Gemini',
                      'Meta Graph API',
                      'Workflow Orchestration',
                    ],
                    strong: ['Google Veo', 'STT/TTS', 'Telephony APIs', 'Agent Design'],
                    familiar: ['Tool Orchestration', 'Multi-Agent Systems'],
                  },
                  {
                    domain: 'DevOps / Infrastructure',
                    expert: ['Docker', 'Git', 'CI/CD', 'Linux'],
                    strong: ['GCP', 'GitHub Actions', 'Deployment', 'Monitoring'],
                    familiar: ['Kubernetes', 'Terraform', 'AWS'],
                  },
                ].map((domain, idx) => (
                  <div key={idx} className="glass-panel p-6 space-y-4">
                    <div className="text-sm font-mono text-val-red uppercase font-bold tracking-[0.3em]">
                      {domain.domain}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-[8px] font-mono text-val-light/40 uppercase mb-2">
                          EXPERT
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {domain.expert.map((item, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-val-red/20 border border-val-red/50 text-val-red text-[9px] font-mono font-bold uppercase"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[8px] font-mono text-val-light/40 uppercase mb-2">
                          STRONG
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {domain.strong.map((item, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-val-red/10 border border-val-red/20 text-val-light/70 text-[9px] font-mono font-bold uppercase"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[8px] font-mono text-val-light/40 uppercase mb-2">
                          FAMILIAR
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {domain.familiar.map((item, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-val-light/5 border border-val-light/10 text-val-light/50 text-[9px] font-mono font-bold uppercase"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
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

export default CareerPage;
