/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';

// Components
import { CustomCursor } from './components/cursor';
import { SmoothScroll, HUDOverlay } from './components/layout';
import LandingPage from './components/LandingPage';
import LoadingScreen from './components/LoadingScreen';
import { Navbar, NavOverlay } from './components/navbar';
import TerminalOverlay from './components/TerminalOverlay';

// Pages
import HomePage from './pages/HomePage';
import AgentsPage from './pages/AgentsPage';
import MissionsPage from './pages/MissionsPage';
import MissionDetailPage from './pages/MissionDetailPage';
import SystemsCorePage from './pages/SystemsCorePage';
import CareerPage from './pages/CareerPage';
import DocsPage from './pages/DocsPage';
import ContactPage from './pages/ContactPage';

// Lib
import { trackEvent } from './utils/analytics';
import type { Page, AppState, Project } from './lib/types';

const EASE_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

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

  const executeNav = (p: Page) => {
    if (p === 'mission-detail') return;

    trackEvent('navigate_section', { page: p });

    if (selectedProject) setSelectedProject(null);

    const lenis = (window as any).lenis;

    setTimeout(() => {
      const el = document.getElementById(p);
      if (!el) return;
      const targetY = el.getBoundingClientRect().top + window.scrollY;
      if (lenis) {
        lenis.scrollTo(targetY, { duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);

    setCurrentPage(p);
  };

  // Track which section is currently in the viewport centre for nav highlighting
  useEffect(() => {
    if (appState !== 'ready' || selectedProject) return;
    const ids: Page[] = ['home', 'agents', 'missions', 'core', 'career', 'docs', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrentPage(entry.target.id as Page);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [appState, selectedProject]);

  const handleBackToMissions = () => {
    setSelectedProject(null);
    executeNav('missions');
  };

  useEffect(() => {
    if (appState !== 'ready') return;
    trackEvent('page_view', {
      section: selectedProject ? 'mission-detail' : currentPage,
      hasProjectDetail: Boolean(selectedProject),
    });
  }, [appState, currentPage, selectedProject]);

  return (
    <div
      className="min-h-screen bg-val-dark text-val-light selection:bg-val-red selection:text-white relative font-sans"
      style={{ overflowX: 'clip' }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100000] focus:left-4 focus:top-4 focus:bg-val-red focus:text-white focus:px-3 focus:py-2"
      >
        Skip to main content
      </a>
      <CustomCursor />
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
                setPage={executeNav}
              />

              <NavOverlay
                isOpen={isNavOpen}
                activePage={currentPage}
                setPage={executeNav}
                onClose={() => setIsNavOpen(false)}
              />

              <HUDOverlay />
              <TerminalOverlay setPage={executeNav} />

              <main id="main-content" className="relative z-10 w-full" tabIndex={-1}>
                <AnimatePresence mode="wait">
                  {selectedProject ? (
                    <motion.div
                      key="mission-detail"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_EXPO } }}
                      exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                      className="min-h-screen bg-val-dark z-[160] relative"
                    >
                      <MissionDetailPage project={selectedProject} onBack={handleBackToMissions} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="main-scroll"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 1 } }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col w-full"
                    >
                      <section id="home" className="bg-val-dark">
                        <HomePage setPage={executeNav} />
                      </section>
                      <section id="agents" className="bg-val-dark">
                        <AgentsPage />
                      </section>
                      <section id="missions" className="bg-val-dark">
                        <MissionsPage onSelectProject={handleSelectProject} />
                      </section>
                      <section id="core" className="bg-val-dark">
                        <SystemsCorePage />
                      </section>
                      <section id="career" className="bg-val-dark">
                        <CareerPage />
                      </section>
                      <section id="docs" className="bg-val-dark">
                        <DocsPage />
                      </section>
                      <section id="contact" className="bg-val-dark">
                        <ContactPage />
                      </section>
                    </motion.div>
                  )}
                </AnimatePresence>
              </main>

              {/* Global Background Grid */}
              <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `linear-gradient(var(--color-val-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-val-border) 1px, transparent 1px)`,
                    backgroundSize: '100px 100px',
                  }}
                ></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SmoothScroll>
    </div>
  );
}
