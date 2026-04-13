/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, useSpring } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const cursorX = useSpring(0, { stiffness: 100, damping: 25, mass: 0.5 });
  const cursorY = useSpring(0, { stiffness: 100, damping: 25, mass: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        target.classList.contains('glass-panel')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden lg:block">
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 2.5 : 1,
          opacity: isHovering ? 0.8 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 200, mass: 0.2 }}
        className={`fixed top-0 left-0 flex items-center justify-center transform-gpu mix-blend-difference rounded-full ${isHovering ? 'w-[30px] h-[30px] bg-white/10 backdrop-blur-sm border border-val-red/30' : 'w-[24px] h-[24px]'}`}
      >
        <div
          className={`w-[3px] h-[3px] bg-val-red/80 rounded-full transition-all ${isHovering ? 'scale-0' : 'scale-100'}`}
        />

        <motion.div
          initial={false}
          animate={{ y: isHovering ? -15 : -5, opacity: isHovering ? 0 : 0.5 }}
          className="absolute top-0 left-[11px] w-[2px] h-[6px] bg-val-red"
        />
        <motion.div
          initial={false}
          animate={{ y: isHovering ? 15 : 5, opacity: isHovering ? 0 : 0.5 }}
          className="absolute bottom-0 left-[11px] w-[2px] h-[6px] bg-val-red"
        />
        <motion.div
          initial={false}
          animate={{ x: isHovering ? -15 : -5, opacity: isHovering ? 0 : 0.5 }}
          className="absolute left-0 top-[11px] h-[2px] w-[6px] bg-val-red"
        />
        <motion.div
          initial={false}
          animate={{ x: isHovering ? 15 : 5, opacity: isHovering ? 0 : 0.5 }}
          className="absolute right-0 top-[11px] h-[2px] w-[6px] bg-val-red"
        />
      </motion.div>
    </div>
  );
};
