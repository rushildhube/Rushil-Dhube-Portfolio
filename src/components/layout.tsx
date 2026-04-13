/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import Lenis from 'lenis';

export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      infinite: false,
    });

    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      (window as any).lenis = null;
    };
  }, []);

  return <>{children}</>;
};

export const HUDOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_2px] pointer-events-none opacity-20"></div>

      <div className="absolute top-24 left-12 w-8 h-8 border-t border-l border-val-red/10"></div>
      <div className="absolute top-24 right-12 w-8 h-8 border-t border-r border-val-red/10"></div>
      <div className="absolute bottom-12 left-12 w-8 h-8 border-b border-l border-val-red/10"></div>
      <div className="absolute bottom-12 right-12 w-8 h-8 border-b border-r border-val-red/10"></div>

      <div className="absolute bottom-12 left-20 flex items-center gap-3">
        <div className="w-1 h-1 bg-val-red animate-pulse"></div>
        <div className="font-mono text-[8px] text-val-light/20 uppercase tracking-[0.4em]">
          UPLINK_SECURE // AGENT_RUSHIL
        </div>
      </div>

      <div className="absolute bottom-12 right-20 text-right font-mono text-[8px] text-val-light/5 uppercase tracking-[0.5em]">
        [ V4.0 ]
      </div>
    </div>
  );
};
