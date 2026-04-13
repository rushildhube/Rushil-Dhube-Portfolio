/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Page =
  | 'home'
  | 'agents'
  | 'missions'
  | 'core'
  | 'docs'
  | 'career'
  | 'contact'
  | 'mission-detail';

export type AppState = 'standby' | 'loading' | 'ready';

export interface Project {
  id: string;
  title: string;
  agent: string;
  description: string;
  problem: string;
  solution: string;
  tech: string[];
  image: string;
  github: string;
  live: string;
  metrics: string;
  tools: string[];
}
