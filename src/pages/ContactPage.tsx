/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Globe, Linkedin, Copy, Send } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { FiverrLogo } from '../components/icons';

const ContactPage: React.FC = () => {
  const EMAIL = 'rushildhube1305@gmail.com';
  const LINKEDIN_URL = 'https://www.linkedin.com/in/rushildhube';
  const FIVERR_URL = 'https://www.fiverr.com/rushildhube';
  const FORM_RATE_LIMIT_MS = 45_000;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '',
  });
  const [formFeedback, setFormFeedback] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [copiedHint, setCopiedHint] = useState('');
  const [formStartTs] = useState(() => Date.now());

  const copyToClipboard = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedHint(`${label} copied`);
      setTimeout(() => setCopiedHint(''), 1600);
      trackEvent('contact_copy', { label });
    } catch {
      setCopiedHint('Clipboard unavailable');
      setTimeout(() => setCopiedHint(''), 1600);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.website.trim()) {
      setFormStatus('error');
      setFormFeedback('Transmission blocked. Please retry via direct email channel.');
      trackEvent('contact_honeypot_block', {});
      return;
    }

    if (Date.now() - formStartTs < 1200) {
      setFormStatus('error');
      setFormFeedback('Too fast. Please review and submit again.');
      trackEvent('contact_fast_submit_block', {});
      return;
    }

    const lastSubmit = Number(window.localStorage.getItem('contact:last-submit') || '0');
    const now = Date.now();
    const remainingMs = FORM_RATE_LIMIT_MS - (now - lastSubmit);
    if (remainingMs > 0) {
      setFormStatus('error');
      setFormFeedback(`Rate limit active. Try again in ${Math.ceil(remainingMs / 1000)}s.`);
      trackEvent('contact_rate_limited', { secondsRemaining: Math.ceil(remainingMs / 1000) });
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormStatus('error');
      setFormFeedback('Please complete all required fields.');
      return;
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
    if (!emailValid) {
      setFormStatus('error');
      setFormFeedback('Please enter a valid email address.');
      return;
    }

    window.localStorage.setItem('contact:last-submit', String(now));
    trackEvent('contact_submit', { hasMessage: formData.message.length > 0 });

    const subject = encodeURIComponent(`Portfolio inquiry from ${formData.name.trim()}`);
    const body = encodeURIComponent(
      `Name: ${formData.name.trim()}\nEmail: ${formData.email.trim()}\n\nMessage:\n${formData.message.trim()}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;

    setFormStatus('success');
    setFormFeedback('Email client opened. If it did not open, use the copy buttons above.');
    setFormData({ name: '', email: '', message: '', website: '' });
  };

  return (
    <div className="min-h-screen pt-40 pb-20 px-6 md:px-12 lg:px-24 w-full flex items-center justify-center overflow-x-hidden">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        <div className="space-y-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-8 bg-val-red"></div>
              <h2 className="text-val-red text-sm font-black tracking-[0.4em] uppercase">
                INITIATE_COMMS
              </h2>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter italic leading-none break-words">
              CONTACT_AGENT
            </h1>
          </div>

          <p className="text-val-light/60 text-xl leading-relaxed max-w-lg">
            Ready to deploy advanced AI solutions or collaborate on next-gen systems? Establish a
            secure connection through the channels below.
          </p>

          <div className="space-y-10">
            <div className="flex items-start gap-8 group">
              <div className="w-16 h-16 glass-panel flex items-center justify-center group-hover:border-val-red transition-colors">
                <Mail className="text-val-red" size={28} />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-mono text-val-light/30 uppercase tracking-[0.4em] mb-2">
                  Direct Channel
                </div>
                <div className="text-2xl font-display font-black tracking-tight italic group-hover:text-val-red transition-colors">
                  {EMAIL}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={`mailto:${EMAIL}`}
                    className="px-3 py-1 border border-val-border text-[10px] font-mono uppercase tracking-[0.2em] hover:border-val-red transition-colors"
                  >
                    Open Email
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(EMAIL, 'email')}
                    className="px-3 py-1 border border-val-border text-[10px] font-mono uppercase tracking-[0.2em] hover:border-val-red transition-colors inline-flex items-center gap-2"
                    aria-label="Copy email address"
                  >
                    <Copy size={12} /> Copy Email
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-8 group">
              <div className="w-16 h-16 glass-panel flex items-center justify-center group-hover:border-val-red transition-colors">
                <Globe className="text-val-red" size={28} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-val-light/30 uppercase tracking-[0.4em] mb-2">
                  Base Location
                </div>
                <div className="text-2xl font-display font-black tracking-tight italic">
                  Pune, Maharashtra, India
                </div>
              </div>
            </div>
            <div className="flex items-start gap-8 group">
              <div className="w-16 h-16 glass-panel flex items-center justify-center group-hover:border-val-red transition-colors">
                <Linkedin className="text-val-red" size={28} />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-mono text-val-light/30 uppercase tracking-[0.4em] mb-2">
                  Profile Link
                </div>
                <div className="text-2xl font-display font-black tracking-tight italic break-all">
                  linkedin.com/in/rushildhube
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 border border-val-border text-[10px] font-mono uppercase tracking-[0.2em] hover:border-val-red transition-colors"
                    onClick={() => trackEvent('contact_open_profile', { channel: 'linkedin' })}
                  >
                    Open Profile
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(LINKEDIN_URL, 'profile_link')}
                    className="px-3 py-1 border border-val-border text-[10px] font-mono uppercase tracking-[0.2em] hover:border-val-red transition-colors inline-flex items-center gap-2"
                    aria-label="Copy profile link"
                  >
                    <Copy size={12} /> Copy Profile Link
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-8 group">
              <div className="w-16 h-16 glass-panel flex items-center justify-center group-hover:border-val-red transition-colors">
                <FiverrLogo className="text-val-red" size={32} />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-mono text-val-light/30 uppercase tracking-[0.4em] mb-2">
                  Freelance Marketplace
                </div>
                <div className="text-2xl font-display font-black tracking-tight italic break-all">
                  fiverr.com/rushildhube
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={FIVERR_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 border border-val-border text-[10px] font-mono uppercase tracking-[0.2em] hover:border-val-red transition-colors"
                    onClick={() => trackEvent('contact_open_profile', { channel: 'fiverr' })}
                  >
                    Open Fiverr
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(FIVERR_URL, 'fiverr_link')}
                    className="px-3 py-1 border border-val-border text-[10px] font-mono uppercase tracking-[0.2em] hover:border-val-red transition-colors inline-flex items-center gap-2"
                    aria-label="Copy Fiverr link"
                  >
                    <Copy size={12} /> Copy Fiverr Link
                  </button>
                </div>
              </div>
            </div>
            <div className="text-[11px] font-mono text-val-light/45" aria-live="polite">
              {copiedHint}
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 md:p-16 relative group">
          <div className="scanline"></div>
          <div className="absolute top-0 left-0 w-2 h-full bg-val-red"></div>

          <form className="space-y-8 md:space-y-10" onSubmit={handleFormSubmit}>
            <div className="space-y-4">
              <label
                htmlFor="agent-name"
                className="text-[10px] font-mono text-val-light/30 uppercase tracking-[0.5em]"
              >
                Agent Name
              </label>
              <input
                id="agent-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-val-dark/40 border-b-2 border-val-border p-6 text-2xl font-display font-black italic outline-none focus:border-val-red transition-colors placeholder:text-val-light/5"
                placeholder="IDENTIFY_YOURSELF..."
                autoComplete="name"
                required
              />
            </div>
            <div className="space-y-4">
              <label
                htmlFor="comm-email"
                className="text-[10px] font-mono text-val-light/30 uppercase tracking-[0.5em]"
              >
                Comm Channel
              </label>
              <input
                id="comm-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full bg-val-dark/40 border-b-2 border-val-border p-6 text-2xl font-display font-black italic outline-none focus:border-val-red transition-colors placeholder:text-val-light/5"
                placeholder="EMAIL_ADDRESS..."
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-4">
              <label
                htmlFor="payload-message"
                className="text-[10px] font-mono text-val-light/30 uppercase tracking-[0.5em]"
              >
                Message Payload
              </label>
              <textarea
                id="payload-message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                className="w-full bg-val-dark/40 border-b-2 border-val-border p-6 text-2xl font-display font-black italic outline-none focus:border-val-red transition-colors placeholder:text-val-light/5 resize-none"
                placeholder="TRANSMISSION_DATA..."
                required
              />
            </div>

            <div className="hidden" aria-hidden="true">
              <label htmlFor="website-field">Website</label>
              <input
                id="website-field"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website}
                onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
              />
            </div>

            <div className="text-[10px] font-mono text-val-light/45 uppercase tracking-[0.2em]">
              Anti-spam enabled: honeypot + client-side rate hint (1 transmission per 45s).
            </div>

            {formFeedback && (
              <div
                className={`text-[11px] font-mono ${formStatus === 'error' ? 'text-val-red' : 'text-green-400'}`}
                aria-live="polite"
              >
                {formFeedback}
              </div>
            )}

            <button
              type="submit"
              className="val-button val-button-primary w-full py-8 text-2xl group"
            >
              <span className="relative z-10 flex items-center justify-center gap-6 italic">
                SEND_TRANSMISSION
                <Send
                  size={28}
                  className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform"
                />
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
