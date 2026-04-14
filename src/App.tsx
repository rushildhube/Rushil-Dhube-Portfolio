/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';

// Components
import { CustomCursor } from './components/cursor';
import { SmoothScroll, HUDOverlay } from './components/layout';
import LandingPage from './components/LandingPage';
import HorizontalScrollSection from './components/HorizontalScrollSection';
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
import { motion } from 'motion/react';

const HORIZONTAL_IDS = ['agents', 'missions', 'core', 'career'];
const EASE_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function App() {
  const [appState, setAppState] = useState<AppState>('standby');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const selectedProjectRef = useRef(selectedProject);

  // Keep ref in sync for scroll observer
  useEffect(() => {
    selectedProjectRef.current = selectedProject;
  }, [selectedProject]);

  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project);
    setCurrentPage('mission-detail');
  }, []);

  /** Build a MissionsPage that actually selects projects */
  const missionsPageNode = useMemo(
    () => <MissionsPage onSelectProject={handleSelectProject} />,
    [handleSelectProject]
  );

  const horizontalPanels = useMemo(
    () => [
      { id: 'agents', node: <AgentsPage /> },
      { id: 'missions', node: missionsPageNode },
      { id: 'core', node: <SystemsCorePage /> },
      { id: 'career', node: <CareerPage /> },
    ],
    [missionsPageNode]
  );

  const executeNav = (p: Page) => {
    if (p === 'mission-detail') return;

    trackEvent('navigate_section', { page: p });

    if (selectedProject) setSelectedProject(null);

    const lenis = (window as any).lenis;
    const isHorizontal = HORIZONTAL_IDS.includes(p);

    if (isHorizontal) {
      // Navigate to the horizontal block, then to the specific panel
      // Use rAF retry to ensure HorizontalScrollSection's effect has registered
      const tryNav = () => {
        const hs = (window as any).__horizontalScroll?.['horizontal-block'];
        if (hs) {
          hs(p);
        } else {
          requestAnimationFrame(tryNav);
        }
      };
      tryNav();
    } else {
      // Normal vertical section
      const el = document.getElementById(`section-${p}`) || document.getElementById(p);
      if (el) {
        const targetY = el.getBoundingClientRect().top + window.scrollY;
        if (lenis) {
          lenis.scrollTo(targetY, { duration: 1.2 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }

    setCurrentPage(p);
  };

  // Track which section is currently in the viewport
  useEffect(() => {
    if (appState !== 'ready') return;
    if (selectedProjectRef.current) return;

    const verticalIds: Page[] = ['home', 'docs', 'contact'];

    // IntersectionObserver for vertical sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentPage(entry.target.id.replace('section-', '') as Page);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    verticalIds.forEach((id) => {
      const el = document.getElementById(`section-${id}`) || document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [appState]);

  // Horizontal active change handler
  const handleHorizontalActiveChange = (panelId: string) => {
    setCurrentPage(panelId as Page);
  };

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
                      {/* Vertical: Home */}
                      <section id="section-home" className="bg-val-dark">
                        <HomePage setPage={executeNav} />
                      </section>

                      {/* Horizontal Block: Agents → Missions → Core → Career */}
                      <div id="horizontal-block" className="bg-val-dark">
                        <HorizontalScrollSection
                          id="horizontal-block"
                          panels={horizontalPanels}
                          onActiveChange={handleHorizontalActiveChange}
                        />
                      </div>

                      {/* Vertical: Docs */}
                      <section id="section-docs" className="bg-val-dark">
                        <DocsPage />
                      </section>

                      {/* Vertical: Contact */}
                      <section id="section-contact" className="bg-val-dark">
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
