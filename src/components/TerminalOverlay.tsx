/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { Terminal, X } from 'lucide-react';
import {
  executeTerminalInput,
  getTerminalBootHistory,
  getTerminalCompletions,
} from '../terminal/engine';
import { trackEvent } from '../utils/analytics';
import type { Page } from '../lib/types';

const TerminalOverlay: React.FC<{ setPage: (p: Page) => void }> = ({ setPage }) => {
  const MAX_COMMAND_HISTORY = 100;
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const dragControls = useDragControls();
  const [history, setHistory] = useState<{ type: 'command' | 'output'; text: string }[]>(
    getTerminalBootHistory().map((line) => ({ type: 'output', text: line.text }))
  );
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyCursor, setHistoryCursor] = useState(-1);
  const [completionBase, setCompletionBase] = useState('');
  const [completionCandidates, setCompletionCandidates] = useState<string[]>([]);
  const [completionIndex, setCompletionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const resetTerminalSession = (lastCommand?: string) => {
    const base = getTerminalBootHistory().map(
      (line) => ({ type: 'output', text: line.text }) as const
    );
    if (lastCommand) {
      base.push({ type: 'output', text: `Last command: ${lastCommand}` });
    }
    setHistory(base);
    setInput('');
    setHistoryCursor(-1);
    setCompletionBase('');
    setCompletionCandidates([]);
    setCompletionIndex(-1);
    setIsMinimized(false);
    setIsMaximized(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isOpen, history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    trackEvent('terminal_command', { command: cmd.split(' ')[0]?.toLowerCase() || 'unknown' });
    const newHistory = [...history, { type: 'command', text: cmd } as const];
    setCommandHistory((prev) => [...prev, cmd].slice(-MAX_COMMAND_HISTORY));
    setHistoryCursor(-1);
    setCompletionBase('');
    setCompletionCandidates([]);
    setCompletionIndex(-1);

    const result = executeTerminalInput(cmd);

    if (result.action.type === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    if (result.action.type === 'exit') {
      setIsOpen(false);
      resetTerminalSession(cmd);
      return;
    }

    if (result.action.type === 'navigate') {
      setPage(result.action.page);
      result.action.message.forEach((message) => {
        newHistory.push({ type: 'output', text: message });
      });
    }

    result.lines.forEach((line) => {
      newHistory.push({ type: line.type, text: line.text });
    });

    setHistory(newHistory);
    setInput('');
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const shouldRecompute = completionBase !== input || completionCandidates.length === 0;
      const candidates = shouldRecompute ? getTerminalCompletions(input) : completionCandidates;
      if (candidates.length === 0) return;
      let nextIndex = 0;
      if (!shouldRecompute) {
        nextIndex = e.shiftKey
          ? completionIndex <= 0
            ? candidates.length - 1
            : completionIndex - 1
          : (completionIndex + 1) % candidates.length;
      }
      setCompletionBase(input);
      setCompletionCandidates(candidates);
      setCompletionIndex(nextIndex);
      setInput(candidates[nextIndex]);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      setHistoryCursor((prev) => {
        const next = prev === -1 ? commandHistory.length - 1 : Math.max(0, prev - 1);
        setInput(commandHistory[next] ?? '');
        return next;
      });
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      setHistoryCursor((prev) => {
        if (prev === -1) return -1;
        const next = prev + 1;
        if (next >= commandHistory.length) {
          setInput('');
          return -1;
        }
        setInput(commandHistory[next] ?? '');
        return next;
      });
      return;
    }

    if (completionCandidates.length > 0) {
      setCompletionBase('');
      setCompletionCandidates([]);
      setCompletionIndex(-1);
    }
  };

  const handleWindowDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isMaximized) return;
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    dragControls.start(e);
  };

  const isSectionHeaderLine = (text: string) =>
    /:$/.test(text) ||
    /^(Help Index|Navigation Commands|FAQ Mode|FAQ Prompts With Use Cases|Command Matrix|Available commands|Quick Start)/i.test(
      text
    );

  const isHintLine = (text: string) => /^Tip:|^Use case:|^Hint:/i.test(text);
  const isBulletLine = (text: string) => /^\s*-\s|^\s*\d+\.\s/.test(text);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: 1 }}
            className="fixed bottom-6 right-6 z-[200]"
          >
            <button
              onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
                trackEvent('terminal_open', { source: 'floating_button' });
              }}
              className="glass-panel px-4 py-3 flex items-center gap-3 group border-val-red/30 hover:border-val-red transition-all shadow-[0_0_20px_rgba(255,70,85,0.2)] bg-val-dark/90 backdrop-blur-md"
              aria-label="Open secure terminal"
            >
              <Terminal size={16} className="text-val-red group-hover:animate-pulse" />
              <span className="text-[10px] font-mono text-val-light/80 uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                INIT_TERMINAL
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200]"
          >
            <button
              onClick={() => {
                setIsMinimized(false);
                trackEvent('terminal_restore', {});
              }}
              className="glass-panel px-6 py-2 flex items-center gap-3 border-val-red/40 hover:border-val-red transition-all bg-val-dark/90 backdrop-blur-md"
              aria-label="Restore secure terminal"
            >
              <Terminal size={14} className="text-val-red" />
              <span className="text-[10px] font-mono text-val-light/80 uppercase tracking-[0.2em]">
                SECURE_TERMINAL_UPLINK
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`fixed z-[99999] font-mono text-sm shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_40px_rgba(255,70,85,0.1)] ${
              isMaximized
                ? 'inset-0'
                : 'top-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-3xl h-[480px]'
            } flex flex-col border border-val-red/30 bg-[#0d1117] overflow-hidden`}
            style={isMaximized ? {} : { borderRadius: '4px' }}
            drag={!isMaximized}
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            dragElastic={0.08}
            onClick={() => inputRef.current?.focus()}
          >
            <div
              onPointerDown={handleWindowDragStart}
              className={`flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-val-border/60 flex-shrink-0 select-none ${isMaximized ? '' : 'cursor-move'}`}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const last = commandHistory[commandHistory.length - 1];
                    setIsOpen(false);
                    resetTerminalSession(last);
                    trackEvent('terminal_close', { lastCommand: last || 'none' });
                  }}
                  className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff3b30] transition-colors flex items-center justify-center group"
                  title="Close"
                  aria-label="Close terminal"
                >
                  <span className="hidden group-hover:block text-[8px] text-black font-bold leading-none">
                    ✕
                  </span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized(true);
                    trackEvent('terminal_minimize', {});
                  }}
                  className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#ffcc00] transition-colors flex items-center justify-center group"
                  title="Minimize"
                  aria-label="Minimize terminal"
                >
                  <span className="hidden group-hover:block text-[8px] text-black font-bold leading-none">
                    −
                  </span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMaximized((m) => !m);
                    trackEvent('terminal_toggle_maximize', { next: !isMaximized });
                  }}
                  className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#32d74b] transition-colors flex items-center justify-center group"
                  title="Maximize"
                  aria-label={isMaximized ? 'Restore terminal size' : 'Maximize terminal'}
                >
                  <span className="hidden group-hover:block text-[8px] text-black font-bold leading-none">
                    {isMaximized ? '⊡' : '⊞'}
                  </span>
                </button>
              </div>

              <span className="text-val-light/40 text-[11px] tracking-[0.25em] uppercase absolute left-1/2 -translate-x-1/2">
                SECURE_TERMINAL_UPLINK
              </span>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-val-red animate-pulse" />
                <span className="text-[9px] font-mono text-val-light/30 uppercase tracking-widest">
                  LIVE
                </span>
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto p-5 space-y-2 bg-[#0d1117]"
              onWheelCapture={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between border border-val-border/40 bg-[#0f141b] px-3 py-2">
                <div className="text-[10px] font-mono text-val-light/40 uppercase tracking-[0.22em]">
                  Path: /secure/rushil-terminal
                </div>
                <div className="text-[10px] font-mono text-val-light/40 uppercase tracking-[0.22em]">
                  Rolling memory active
                </div>
              </div>

              {history.map((h, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${h.type === 'command' ? 'text-white border-l-2 border-val-red/60 pl-2' : 'text-val-light/70'}`}
                >
                  {h.type === 'command' && (
                    <span className="text-val-red min-w-fit text-xs">root@rushil:~$</span>
                  )}
                  <span
                    className={`text-xs ${
                      h.type === 'command'
                        ? 'text-white font-semibold'
                        : isSectionHeaderLine(h.text)
                          ? 'text-cyan-300 font-semibold pl-2 uppercase tracking-[0.18em]'
                          : isHintLine(h.text)
                            ? 'text-yellow-300/90 pl-4 italic'
                            : isBulletLine(h.text)
                              ? 'text-green-300 pl-5'
                              : 'text-green-400 pl-4'
                    }`}
                  >
                    {h.text}
                  </span>
                </div>
              ))}
              <form onSubmit={handleCommand} className="flex gap-3 items-center">
                <span className="text-val-red min-w-fit text-xs">root@rushil:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setCompletionBase('');
                    setCompletionCandidates([]);
                    setCompletionIndex(-1);
                  }}
                  onKeyDown={handleInputKeyDown}
                  className="flex-1 bg-transparent outline-none border-none text-white font-semibold text-xs caret-val-red"
                  autoFocus
                  autoComplete="off"
                  spellCheck={false}
                />
              </form>

              {completionCandidates.length > 0 && (
                <div className="mt-2 border border-val-border/40 bg-[#0f141b] px-3 py-2">
                  <div className="text-[10px] font-mono text-val-light/40 uppercase tracking-[0.2em] mb-1">
                    Tab Suggestions ({completionCandidates.length}) - Tab/Shift+Tab to cycle
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {completionCandidates.slice(0, 6).map((item, idx) => (
                      <span
                        key={`${item}-${idx}`}
                        className={`text-[10px] font-mono px-2 py-1 border ${
                          idx === completionIndex
                            ? 'border-val-red text-val-red bg-val-red/10'
                            : 'border-val-border/50 text-val-light/60'
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TerminalOverlay;
