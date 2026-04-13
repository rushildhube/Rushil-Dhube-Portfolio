/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';

/**
 * HorizontalScrollSection
 *
 * Uses CSS `position: sticky` on an outer wrapper so the viewport pins while
 * the user scrolls through a wide horizontal track.  The wrapper's height is
 * calculated as `(panelCount × 100)vh` so native scroll naturally moves
 * through every panel — no JS scroll hijacking, no Lenis conflicts.
 *
 * A lightweight `scroll` listener on `window` maps the native scroll offset
 * to the active panel index and fires `onActiveChange`.
 */

interface HorizontalScrollSectionProps {
  id: string;
  panels: { id: string; node: React.ReactNode }[];
  onActiveChange?: (panelId: string) => void;
}

const HorizontalScrollSection: React.FC<HorizontalScrollSectionProps> = ({
  id,
  panels,
  onActiveChange,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const panelCount = panels.length;

  const computeActiveIndex = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const wrapperTop = rect.top + window.scrollY;
    // The sticky viewport height
    const viewportH = window.innerHeight;
    // How far the user has scrolled *into* the wrapper (0 = just entered, wrapperH - viewportH = end)
    const wrapperH = wrapper.scrollHeight; // total sticky height
    const scrollableDistance = wrapperH - viewportH;
    if (scrollableDistance <= 0) {
      setActiveIndex(0);
      return;
    }
    const scrolledIn = window.scrollY - wrapperTop;
    const progress = Math.max(0, Math.min(1, scrolledIn / scrollableDistance));
    const idx = Math.min(panelCount - 1, Math.floor(progress * panelCount));
    setActiveIndex(idx);
  }, [panelCount]);

  useEffect(() => {
    const onScroll = () => {
      computeActiveIndex();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    computeActiveIndex();
    return () => window.removeEventListener('scroll', onScroll);
  }, [computeActiveIndex]);

  useEffect(() => {
    if (onActiveChange && panels[activeIndex]) {
      onActiveChange(panels[activeIndex].id);
    }
  }, [activeIndex, panels, onActiveChange]);

  /** Navigate to a specific panel by id (called from nav clicks) */
  const scrollToPanel = useCallback(
    (panelId: string) => {
      const idx = panels.findIndex((p) => p.id === panelId);
      if (idx < 0) return;

      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const viewportH = window.innerHeight;
      const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
      const wrapperH = wrapper.scrollHeight;
      const scrollableDistance = wrapperH - viewportH;
      if (scrollableDistance <= 0) return;

      // Target: scroll to the point where this panel fills the sticky viewport
      const progress = idx / panelCount;
      const targetY = wrapperTop + progress * scrollableDistance;

      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(targetY, { duration: 1.2 });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    },
    [panels]
  );

  // Expose scrollToPanel globally so App.tsx nav can call it
  useEffect(() => {
    (window as any).__horizontalScroll = (window as any).__horizontalScroll || {};
    (window as any).__horizontalScroll[id] = scrollToPanel;
    return () => {
      delete (window as any).__horizontalScroll[id];
    };
  }, [id, scrollToPanel]);

  const trackWidth = `${panelCount * 100}vw`;

  return (
    <div ref={wrapperRef} style={{ height: `${panelCount * 100}vh` }} className="relative">
      <div className="sticky top-0 overflow-hidden" style={{ width: '100vw', height: '100vh' }}>
        <div ref={trackRef} className="flex h-full" style={{ width: trackWidth }}>
          {panels.map((panel) => (
            <div
              key={panel.id}
              id={`panel-${panel.id}`}
              className="flex-shrink-0 w-screen h-full overflow-y-auto"
              style={{ width: '100vw' }}
            >
              {panel.node}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollSection;
