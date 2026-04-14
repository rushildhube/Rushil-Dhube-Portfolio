/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { EASE_EXPO } from '../lib/data';

export const ScrollReveal: React.FC<{
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
}> = ({ children, direction = 'up' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const variants = {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -30 : direction === 'right' ? 30 : 0,
      y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
      scale: 0.95,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 1.2,
        ease: EASE_EXPO,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
    >
      <motion.div
        animate={
          isInView
            ? {
                y: [0, -8, 0],
                rotate: [0, 0.5, 0],
              }
            : {}
        }
        transition={{
          duration: 6 + Math.random() * 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: Math.random() * 2,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export const MaskReveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}> = ({ children, delay = 0, direction = 'up', className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const variants = {
    hidden: {
      clipPath:
        direction === 'up'
          ? 'inset(100% 0 0 0)'
          : direction === 'down'
            ? 'inset(0 0 100% 0)'
            : direction === 'left'
              ? 'inset(0 100% 0 0)'
              : 'inset(0 0 0 100%)',
    },
    visible: { clipPath: 'inset(0 0 0 0)' },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ duration: 1.5, delay, ease: EASE_EXPO }}
      className={className}
    >
      <motion.div
        animate={
          isInView
            ? {
                y: [0, -5, 0],
              }
            : {}
        }
        transition={{
          duration: 5 + Math.random() * 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export const StaggeredText: React.FC<{
  text: string;
  className?: string;
  delay?: number;
  by?: 'word' | 'char';
}> = ({ text, className = '', delay = 0, by = 'word' }) => {
  const items = by === 'word' ? text.split(' ') : text.split('');

  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {items.map((item, i) => (
        <span
          key={i}
          className={`inline-block overflow-hidden ${by === 'word' ? 'mr-[0.25em]' : ''}`}
        >
          <motion.span
            initial={{ y: '150%', opacity: 0, rotateX: 60, filter: 'blur(8px)' }}
            animate={{ y: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 1.2,
              delay: delay + i * (by === 'word' ? 0.08 : 0.06),
              ease: EASE_EXPO,
            }}
            className="inline-block origin-bottom"
          >
            {item === ' ' ? '\u00A0' : item}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

export const TextReveal: React.FC<{ text: string; className?: string }> = ({
  text,
  className = '',
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: 30, filter: 'blur(8px)' }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.2, delay: 0.5, ease: EASE_EXPO }}
      className={className}
    >
      {text}
    </motion.div>
  );
};

export const ParallaxImage: React.FC<{
  src: string;
  alt: string;
  strength?: number;
  className?: string;
}> = ({ src, alt, strength = 100, className = '' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);
  const scaleScroll = useTransform(scrollYProgress, [0, 0.5, 1], [1.3, 1.05, 1.3]);
  const blur = useTransform(scrollYProgress, [0, 0.5, 1], ['blur(4px)', 'blur(0px)', 'blur(4px)']);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y, filter: blur, scale: scaleScroll }} className="w-full h-full">
        <motion.img
          src={src}
          alt={alt}
          className="w-full h-full object-cover origin-center"
          referrerPolicy="no-referrer"
          whileHover={{
            scale: 1.1,
            rotate: 1,
            transition: { duration: 1, ease: EASE_EXPO },
          }}
        />
      </motion.div>
    </div>
  );
};

export const GlitchText: React.FC<{ children: string; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <motion.span
        animate={{ x: [0, -3, 3, -1, 0], opacity: [0, 0.7, 0.3, 0.7, 0] }}
        transition={{ repeat: Infinity, duration: 0.15, repeatDelay: 4 }}
        className="absolute top-0 left-0 z-0 text-val-red translate-x-1"
      >
        {children}
      </motion.span>
      <motion.span
        animate={{ x: [0, 3, -3, 1, 0], opacity: [0, 0.7, 0.3, 0.7, 0] }}
        transition={{ repeat: Infinity, duration: 0.15, repeatDelay: 4.1 }}
        className="absolute top-0 left-0 z-0 text-val-cyan -translate-x-1"
      >
        {children}
      </motion.span>
    </div>
  );
};

export const Magnetic: React.FC<{ children: React.ReactNode; strength?: number }> = ({
  children,
  strength = 0.5,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const x = (clientX - centerX) * strength;
    const y = (clientY - centerY) * strength;

    const rotateX = ((clientY - centerY) / (height / 2)) * -15 * strength;
    const rotateY = ((clientX - centerX) / (width / 2)) * 15 * strength;

    setPosition({ x, y, rotateX, rotateY, scale: 1.05 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: position.x,
        y: position.y,
        rotateX: position.rotateX,
        rotateY: position.rotateY,
        scale: position.scale,
        z: position.scale > 1 ? 50 : 0,
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 150, mass: 0.1 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
};
