/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useCallback } from 'react';

/**
 * HorizontalScrollSection
 *
 * Wrapper = panelCount × 100vh. Sticky viewport pins 100vh to screen.
 * Panels have overflow-y: auto so content scrolls locally. When a panel
 * reaches its scroll boundary, wheel events bubble to the window, driving
 * the translateX advance to the next panel.
 *
 * Wheel flow per panel:
 *   - scrolling down + at bottom  → bubble to window → horizontal advance
 *   - scrolling up + at top       → bubble to window → horizontal retreat
 *   - otherwise                   → consume → local scroll inside panel
 */

interface HorizontalScrollSectionProps {
  id: string;
  panels: { id: string; node: React.ReactNode }[];
  onActiveChange?: (panelId: string) => void;
  className?: string;
}

const HorizontalScrollSection: React.FC<HorizontalScrollSectionProps> = ({
  id,
  panels,
  onActiveChange,
  className = '',
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const panelCount = panels.length;
  const onActiveChangeRef = useRef(onActiveChange);
  const PANEL_SCROLL_BUDGET = 100; // vh per panel

  useEffect(() => {
    onActiveChangeRef.current = onActiveChange;
  }, [onActiveChange]);

  const applyScrollTransform = useCallback(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
    const viewportH = window.innerHeight;
    const wrapperH = wrapper.scrollHeight;
    const scrollableDistance = wrapperH - viewportH;

    if (scrollableDistance <= 0) {
      track.style.transform = 'translateX(0)';
      onActiveChangeRef.current?.(panels[0]?.id);
      return;
    }

    const scrolledIn = window.scrollY - wrapperTop;
    const progress = Math.max(0, Math.min(1, scrolledIn / scrollableDistance));

    const translateX = -(progress * (panelCount - 1) * 100);
    track.style.transform = `translateX(${translateX}vw)`;

    const idx = Math.min(panelCount - 1, Math.floor(progress * panelCount));
    if (panels[idx]) {
      onActiveChangeRef.current?.(panels[idx].id);
    }
  }, [panelCount, panels]);

  useEffect(() => {
    const onScroll = () => {
      applyScrollTransform();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    applyScrollTransform();
    return () => window.removeEventListener('scroll', onScroll);
  }, [applyScrollTransform]);

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

      const progress = idx / (panelCount - 1);
      const targetY = wrapperTop + progress * scrollableDistance;

      // Reset internal panel scroll
      panels.forEach((p) => {
        const el = panelRefs.current.get(p.id);
        if (el) el.scrollTop = 0;
      });

      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(targetY, { duration: 1.2 });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    },
    [panels, panelCount]
  );

  useEffect(() => {
    (window as any).__horizontalScroll = (window as any).__horizontalScroll || {};
    (window as any).__horizontalScroll[id] = scrollToPanel;
    return () => {
      delete (window as any).__horizontalScroll[id];
    };
  }, [id, scrollToPanel]);

  const handlePanelWheel = useCallback((panelId: string, e: React.WheelEvent) => {
    const el = panelRefs.current.get(panelId);
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const atTop = scrollTop <= 1;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

    const scrollingDown = e.deltaY > 0;
    const scrollingUp = e.deltaY < 0;

    // At boundary → let event bubble to window (drives horizontal)
    if ((scrollingDown && atBottom) || (scrollingUp && atTop)) {
      return; // don't preventDefault — let it bubble
    }

    // Not at boundary → consume for local scroll
    e.stopPropagation();
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{ height: `${panelCount * PANEL_SCROLL_BUDGET}vh` }}
      className={`relative ${className}`}
    >
      {/* Sticky viewport — pins to screen */}
      <div className="sticky top-0 overflow-hidden" style={{ width: '100vw', height: '100vh' }}>
        {/* Wide track — slides left via translateX */}
        <div
          ref={trackRef}
          className="flex h-full will-change-transform"
          style={{ width: `${panelCount * 100}vw` }}
        >
          {panels.map((panel) => (
            <div
              key={panel.id}
              id={`section-${panel.id}`}
              ref={(el) => {
                if (el) panelRefs.current.set(panel.id, el);
                else panelRefs.current.delete(panel.id);
              }}
              className="flex-shrink-0"
              style={{
                width: '100vw',
                height: '100vh',
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
              onWheel={handlePanelWheel.bind(null, panel.id)}
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
