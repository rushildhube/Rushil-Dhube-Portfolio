/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion, useInView } from 'motion/react';
import { Search } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { PROJECTS } from '../lib/data';

const ForceGraph2D = React.lazy(() => import('react-force-graph-2d'));

const SystemsCorePage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const isContainerInView = useInView(containerRef, { amount: 0.3 });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoverNode, setHoverNode] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [showProjects, setShowProjects] = useState(true);
  const [isSimulationFrozen, setIsSimulationFrozen] = useState(false);
  const [nodeQuery, setNodeQuery] = useState('');
  const [nodeQueryFeedback, setNodeQueryFeedback] = useState('');
  const [highlightNodeIds, setHighlightNodeIds] = useState<Set<string>>(new Set());
  const [highlightLinkKeys, setHighlightLinkKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const syncSize = () => {
      if (!containerRef.current) return;
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    };

    syncSize();
    window.addEventListener('resize', syncSize);

    const observer = new ResizeObserver(() => syncSize());
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', syncSize);
      observer.disconnect();
    };
  }, []);

  const simulationData = useMemo(() => {
    const nodes: any[] = [
      { id: 'RUSHIL_AI_CORE', label: 'RUSHIL CORE', group: 0, val: 58, tier: 'root' },
    ];
    const links: any[] = [];
    const skillProjectMap: Record<string, string[]> = {};

    const makeLinkKey = (sourceId: string, targetId: string) => `${sourceId}=>${targetId}`;
    const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

    const aliases: Record<string, string[]> = {
      'Vision Transformers (ViT)': ['vit-b/16', 'vit'],
      LLMs: ['llm', 'openai api'],
      'REST APIs': ['fastapi', 'django', 'flask'],
      'STT/TTS': ['stt/tts', 'stt', 'tts', 'telephony'],
      GCP: ['google cloud platform', 'gcp'],
    };

    const addNodeIfMissing = (node: any) => {
      if (!nodes.some((n) => n.id === node.id)) nodes.push(node);
    };

    const addLink = (source: string, target: string) => {
      if (!links.some((l) => l.source === source && l.target === target)) {
        links.push({ source, target, key: makeLinkKey(source, target) });
      }
    };

    const coreBranches = [
      {
        id: 'ML_DL_Core',
        label: 'ML / DL Core',
        group: 1,
        skills: ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'Keras', 'Feature Engineering'],
      },
      {
        id: 'Vision_Healthcare',
        label: 'Vision Healthcare',
        group: 2,
        skills: [
          'Vision Transformers (ViT)',
          'CNNs',
          'OpenCV',
          'Medical Image Processing',
          'Image Segmentation',
        ],
      },
      {
        id: 'NLP_RAG',
        label: 'NLP / RAG',
        group: 3,
        skills: ['LLMs', 'RAG', 'BERT', 'Qdrant', 'TruLens'],
      },
      {
        id: 'Backend_APIs',
        label: 'Backend APIs',
        group: 4,
        skills: ['FastAPI', 'Django', 'Flask', 'REST APIs', 'OAuth2/JWT'],
      },
      {
        id: 'Automation_Agents',
        label: 'Automation Agents',
        group: 5,
        skills: ['Make.com', 'Meta Graph API', 'Google Gemini', 'Google Veo', 'STT/TTS'],
      },
      {
        id: 'Infra_DevOps',
        label: 'Infra DevOps',
        group: 6,
        skills: ['Docker', 'MongoDB', 'PostgreSQL', 'GCP', 'Git'],
      },
    ];

    coreBranches.forEach((branch) => {
      addNodeIfMissing({
        id: branch.id,
        label: branch.label,
        group: branch.group,
        val: 34,
        tier: 'branch',
      });
      addLink('RUSHIL_AI_CORE', branch.id);

      branch.skills.forEach((skill) => {
        addNodeIfMissing({ id: skill, label: skill, group: branch.group, val: 15, tier: 'skill' });
        addLink(branch.id, skill);

        const skillTokens = [normalize(skill), ...(aliases[skill] || []).map(normalize)];
        const matchedProjects = PROJECTS.filter((project) => {
          const projectTokens = project.tech.concat(project.tools).map(normalize);
          return skillTokens.some((token) =>
            projectTokens.some(
              (projectToken) => projectToken.includes(token) || token.includes(projectToken)
            )
          );
        });

        skillProjectMap[skill] = matchedProjects.map((project) => project.title);

        if (showProjects) {
          matchedProjects.forEach((project) => {
            const projectId = `PROJECT_${project.id}`;
            addNodeIfMissing({
              id: projectId,
              label: project.title,
              group: 7,
              val: 13,
              tier: 'project',
            });
            addLink(skill, projectId);
          });
        }
      });
    });

    const adjacency = new Map<string, Set<string>>();
    links.forEach((link) => {
      const sourceId = String(link.source);
      const targetId = String(link.target);
      if (!adjacency.has(sourceId)) adjacency.set(sourceId, new Set());
      if (!adjacency.has(targetId)) adjacency.set(targetId, new Set());
      adjacency.get(sourceId)!.add(targetId);
      adjacency.get(targetId)!.add(sourceId);
    });

    return {
      graphData: { nodes, links },
      adjacency,
      skillProjectMap,
    };
  }, [showProjects]);

  useEffect(() => {
    if (!graphRef.current) return;
    graphRef.current.d3Force('charge')?.strength(-220);
    graphRef.current.d3Force('link')?.distance((link: any) => {
      const sourceTier = (link.source as any)?.tier || '';
      if (sourceTier === 'root') return 140;
      if (sourceTier === 'branch') return 100;
      return 70;
    });
    graphRef.current.d3ReheatSimulation();
  }, [simulationData.graphData]);

  useEffect(() => {
    if (!graphRef.current || !isContainerInView) return;
    graphRef.current.d3ReheatSimulation?.();
    graphRef.current.zoomToFit?.(prefersReducedMotion ? 0 : 450, 70);
  }, [isContainerInView, dimensions.width, dimensions.height, prefersReducedMotion]);

  useEffect(() => {
    if (!graphRef.current) return;
    if (isSimulationFrozen) {
      graphRef.current.pauseAnimation?.();
    } else {
      graphRef.current.resumeAnimation?.();
      graphRef.current.d3ReheatSimulation?.();
    }
  }, [isSimulationFrozen]);

  const getNodeId = (node: any) => (typeof node === 'object' ? node.id : node);
  const makeLinkKey = (sourceId: string, targetId: string) => `${sourceId}=>${targetId}`;

  const clearHighlights = () => {
    setHighlightNodeIds(new Set());
    setHighlightLinkKeys(new Set());
  };

  const focusByNodeQuery = () => {
    const query = nodeQuery.trim().toLowerCase();
    if (!query) {
      setNodeQueryFeedback('Enter a node name to focus.');
      return;
    }

    const match = simulationData.graphData.nodes.find((node: any) => {
      const id = String(node.id || '').toLowerCase();
      const label = String(node.label || '').toLowerCase();
      return id.includes(query) || label.includes(query);
    });

    if (!match) {
      setNodeQueryFeedback('No matching node found.');
      trackEvent('simulation_focus_search', { found: false, queryLength: query.length });
      return;
    }

    setNodeQueryFeedback(`Focused: ${formatNodeLabel(match.label || match.id)}`);
    setSelectedNode(match);
    focusNodeNeighborhood(match);
    if (graphRef.current && typeof match.x === 'number' && typeof match.y === 'number') {
      const travelDuration = prefersReducedMotion ? 0 : 700;
      graphRef.current.centerAt(match.x, match.y, travelDuration);
      graphRef.current.zoom(match.tier === 'root' ? 2 : 2.6, travelDuration);
    }
    trackEvent('simulation_focus_search', {
      found: true,
      queryLength: query.length,
      tier: match.tier || 'unknown',
    });
  };

  const focusNodeNeighborhood = (node: any) => {
    if (!node) {
      clearHighlights();
      return;
    }

    const sourceId = node.id;
    const neighbors = simulationData.adjacency.get(sourceId) || new Set<string>();
    const nextNodes = new Set<string>([sourceId, ...neighbors]);
    const nextLinks = new Set<string>();

    simulationData.graphData.links.forEach((link: any) => {
      const a = String(getNodeId(link.source));
      const b = String(getNodeId(link.target));
      if (a === sourceId || b === sourceId) nextLinks.add(makeLinkKey(a, b));
    });

    setHighlightNodeIds(nextNodes);
    setHighlightLinkKeys(nextLinks);
  };

  const getNodeColor = (group: number) => {
    if (group === 0) return '#ff4655';
    if (group === 1) return '#00e5ff';
    if (group === 2) return '#4dd0e1';
    if (group === 3) return '#7c4dff';
    if (group === 4) return '#ffc107';
    if (group === 5) return '#66bb6a';
    if (group === 6) return '#ff8a65';
    if (group === 7) return '#f8fafc';
    return '#f8fafc';
  };

  const withAlpha = (hexColor: string, alpha: number) => {
    const hex = hexColor.replace('#', '');
    const fullHex =
      hex.length === 3
        ? hex
            .split('')
            .map((c) => c + c)
            .join('')
        : hex;
    const r = parseInt(fullHex.substring(0, 2), 16);
    const g = parseInt(fullHex.substring(2, 4), 16);
    const b = parseInt(fullHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const formatNodeLabel = (label: string) =>
    label
      .replace(/^PROJECT_[A-Za-z0-9()_\-]+_/, '')
      .replace(/_/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const compactNodeLabel = (rawLabel: string) => {
    const map: Record<string, string> = {
      'Vision Transformers (ViT)': 'ViT',
      'Hugging Face Transformers': 'HF Xformers',
      'SQLAlchemy (async)': 'SQLA async',
      'Google Cloud Platform': 'GCP',
      'Medical Image Processing': 'Medical Imaging',
      'Meta Graph API': 'Meta API',
      'Feature Engineering': 'Feature Eng',
    };

    if (map[rawLabel]) return map[rawLabel];
    if (rawLabel.length <= 18) return rawLabel;

    const words = rawLabel.split(' ');
    if (words.length >= 3) return `${words[0]} ${words[1]}`;
    return `${rawLabel.slice(0, 16)}..`;
  };

  const splitLabelLines = (label: string, maxCharsPerLine: number, maxLines = 2) => {
    const words = label.split(' ');
    const lines: string[] = [];
    let current = '';

    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (next.length <= maxCharsPerLine) {
        current = next;
      } else {
        if (current) lines.push(current);
        current = word;
      }
      if (lines.length >= maxLines) break;
    }

    if (lines.length < maxLines && current) lines.push(current);
    return lines.slice(0, maxLines);
  };

  return (
    <div className="min-h-screen pt-32 pb-12 px-6 md:px-12 lg:px-24 w-full flex flex-col items-center">
      <div className="max-w-7xl mx-auto mb-16 relative z-10 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-[2px] bg-val-red/40"></div>
            <h2 className="text-val-red text-sm font-black tracking-[0.4em] uppercase">
              TECHNICAL_ARSENAL
            </h2>
            <div className="w-8 h-[2px] bg-val-red/40"></div>
          </div>
          <h1 className="text-7xl font-display font-black tracking-tighter italic leading-none text-white drop-shadow-lg">
            NEURAL_LOADOUT
          </h1>
          <p className="text-val-light/40 font-mono text-xs uppercase tracking-[0.3em] max-w-xl">
            Fully interactive circular simulation. Click nodes to focus paths, drag to rewire space,
            scroll to zoom. Skills can reveal direct project associations in real time.
          </p>
        </div>
      </div>

      <div
        ref={containerRef}
        data-lenis-prevent
        onWheelCapture={(e) => e.stopPropagation()}
        onTouchMoveCapture={(e) => e.stopPropagation()}
        className="w-full max-w-7xl h-[60vh] md:h-[700px] glass-panel border border-val-border relative overflow-hidden group touch-none"
      >
        <div className="absolute top-0 right-0 p-8 font-mono text-[10px] text-val-light/20 tracking-[0.5em] flex flex-col items-end gap-2 z-10 pointer-events-none">
          <span>LIVE_SIMULATION</span>
          <div className="flex gap-1 group-hover:animate-pulse">
            <div className="w-2 h-2 rounded-full bg-val-red"></div>
          </div>
        </div>

        {dimensions.width > 0 && (
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center text-[11px] font-mono tracking-[0.2em] uppercase text-val-light/50">
                Loading simulation engine...
              </div>
            }
          >
            <ForceGraph2D
              ref={graphRef}
              width={dimensions.width}
              height={dimensions.height}
              graphData={simulationData.graphData}
              dagMode="radialout"
              dagLevelDistance={125}
              nodeRelSize={1}
              nodeColor={(node: any) => {
                const base = getNodeColor(node.group);
                const hasFocus = highlightNodeIds.size > 0;
                return hasFocus && !highlightNodeIds.has(node.id) ? withAlpha(base, 0.2) : base;
              }}
              linkColor={(link: any) => {
                const a = String(getNodeId(link.source));
                const b = String(getNodeId(link.target));
                const key = makeLinkKey(a, b);
                const hasFocus = highlightLinkKeys.size > 0;
                return hasFocus && !highlightLinkKeys.has(key)
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(255,255,255,0.38)';
              }}
              nodeLabel="id"
              onNodeHover={(node: any) => {
                setHoverNode(node || null);
                if (!selectedNode) focusNodeNeighborhood(node || null);
              }}
              onNodeClick={(node: any) => {
                setSelectedNode(node);
                focusNodeNeighborhood(node);
                trackEvent('simulation_node_click', {
                  tier: node?.tier || 'unknown',
                  node: String(node?.id || 'unknown'),
                });
                if (
                  graphRef.current &&
                  typeof node?.x === 'number' &&
                  typeof node?.y === 'number'
                ) {
                  const travelDuration = prefersReducedMotion ? 0 : 700;
                  graphRef.current.centerAt(node.x, node.y, travelDuration);
                  graphRef.current.zoom(node.tier === 'root' ? 2 : 2.7, travelDuration);
                }
              }}
              onBackgroundClick={() => {
                setSelectedNode(null);
                setHoverNode(null);
                clearHighlights();
              }}
              d3VelocityDecay={prefersReducedMotion ? 0.5 : 0.42}
              d3AlphaDecay={prefersReducedMotion ? 0.08 : 0.05}
              linkWidth={(link: any) => {
                const a = String(getNodeId(link.source));
                const b = String(getNodeId(link.target));
                const key = makeLinkKey(a, b);
                return highlightLinkKeys.has(key) ? 2.6 : 1.2;
              }}
              nodeCanvasObject={(node: any, ctx, globalScale) => {
                const label = compactNodeLabel(formatNodeLabel(node.label || node.id));
                const isHovered = hoverNode?.id === node.id || selectedNode?.id === node.id;
                const isDimmed = highlightNodeIds.size > 0 && !highlightNodeIds.has(node.id);
                const radius =
                  node.tier === 'root'
                    ? 24
                    : node.tier === 'branch'
                      ? 16
                      : node.tier === 'project'
                        ? 10
                        : 12;

                const color = getNodeColor(node.group);

                ctx.beginPath();
                ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
                ctx.fillStyle = isDimmed ? withAlpha(color, 0.2) : color;

                if (isHovered) {
                  ctx.shadowColor = '#ffffff';
                  ctx.shadowBlur = 15;
                } else if (node.group < 4) {
                  ctx.shadowColor = color;
                  ctx.shadowBlur = 8;
                } else {
                  ctx.shadowBlur = 0;
                }
                ctx.fill();

                ctx.strokeStyle = 'rgba(15, 25, 35, 0.75)';
                ctx.lineWidth = isHovered ? 2 : 1;
                ctx.stroke();

                const maxChars = Math.max(7, Math.floor(radius * 0.95));
                const lines = splitLabelLines(
                  label,
                  maxChars,
                  node.tier === 'root' || node.tier === 'branch' ? 2 : 1
                );
                const fontSize = node.tier === 'root' ? 9 : node.tier === 'branch' ? 8 : 7;
                const lineHeight = fontSize + 1;
                const totalHeight = lines.length * lineHeight;

                ctx.shadowBlur = 0;
                ctx.font = `600 ${fontSize}px Inter, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = isDimmed
                  ? 'rgba(15, 25, 35, 0.35)'
                  : isHovered
                    ? '#ffffff'
                    : '#0f1923';

                lines.forEach((line, index) => {
                  const yOffset = -totalHeight / 2 + lineHeight / 2 + index * lineHeight;
                  ctx.fillText(line, node.x, node.y + yOffset);
                });

                node.__bckgDimensions = [radius * 2, radius * 2];
              }}
              cooldownTicks={prefersReducedMotion ? 50 : 90}
              enableNodeDrag={true}
              enablePanInteraction={true}
              enableZoomInteraction={true}
              nodePointerAreaPaint={(node: any, color, ctx) => {
                ctx.fillStyle = color;
                const radius =
                  node.tier === 'root'
                    ? 24
                    : node.tier === 'branch'
                      ? 16
                      : node.tier === 'project'
                        ? 10
                        : 12;
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius + 5, 0, 2 * Math.PI, false);
                ctx.fill();
              }}
            />
          </Suspense>
        )}

        {(hoverNode || selectedNode) && (
          <div className="absolute top-4 left-4 z-20 w-[320px] glass-panel border border-val-red/30 p-4">
            <div className="text-[10px] font-mono text-val-red uppercase tracking-[0.35em] mb-3">
              INTERACTIVE_NODE_PANEL
            </div>
            <div className="text-sm font-display font-black text-white italic mb-1">
              {formatNodeLabel((selectedNode || hoverNode).label || (selectedNode || hoverNode).id)}
            </div>
            <div className="text-[10px] font-mono text-val-light/40 uppercase tracking-[0.25em] mb-3">
              Tier: {(selectedNode || hoverNode).tier}
            </div>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {(selectedNode || hoverNode).tier === 'skill' &&
              (simulationData.skillProjectMap[(selectedNode || hoverNode).id] || []).length > 0 ? (
                simulationData.skillProjectMap[(selectedNode || hoverNode).id].map(
                  (projectName) => (
                    <div
                      key={projectName}
                      className="text-[11px] font-mono text-val-light/80 border-l-2 border-val-red/40 pl-2"
                    >
                      {projectName}
                    </div>
                  )
                )
              ) : (
                <div className="text-[11px] font-mono text-val-light/50">
                  Select a skill node to view associated projects.
                </div>
              )}
            </div>
          </div>
        )}

        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <div className="glass-panel border border-val-border px-3 py-2 w-[260px]">
            <label
              htmlFor="node-search"
              className="text-[9px] font-mono text-val-light/60 uppercase tracking-[0.2em] block mb-1"
            >
              Find Node
            </label>
            <div className="flex gap-2">
              <input
                id="node-search"
                value={nodeQuery}
                onChange={(e) => {
                  setNodeQuery(e.target.value);
                  if (nodeQueryFeedback) setNodeQueryFeedback('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    focusByNodeQuery();
                  }
                }}
                className="flex-1 bg-val-dark/70 border border-val-border px-2 py-1 text-[10px] font-mono text-val-light outline-none focus:border-val-red"
                placeholder="e.g. FastAPI"
                aria-label="Search and focus a simulation node"
              />
              <button
                onClick={focusByNodeQuery}
                className="px-2 py-1 border border-val-border hover:border-val-red text-[10px] font-mono uppercase tracking-[0.1em]"
                aria-label="Focus matching node"
              >
                <Search size={12} className="text-val-light/70" />
              </button>
            </div>
            {nodeQueryFeedback && (
              <div className="text-[9px] font-mono text-val-light/60 mt-2" aria-live="polite">
                {nodeQueryFeedback}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setShowProjects((prev) => !prev);
              setSelectedNode(null);
              setHoverNode(null);
              clearHighlights();
              trackEvent('simulation_toggle_projects', { visible: !showProjects });
            }}
            className="px-3 py-2 text-[10px] font-mono tracking-[0.2em] uppercase glass-panel border border-val-border hover:border-val-red transition-colors"
          >
            {showProjects ? 'HIDE_PROJECT_NODES' : 'SHOW_PROJECT_NODES'}
          </button>
          <button
            onClick={() => {
              const next = !isSimulationFrozen;
              setIsSimulationFrozen(next);
              trackEvent('simulation_toggle_freeze', { frozen: next });
            }}
            className="px-3 py-2 text-[10px] font-mono tracking-[0.2em] uppercase glass-panel border border-val-border hover:border-val-red transition-colors"
          >
            {isSimulationFrozen ? 'RESUME_SIMULATION' : 'FREEZE_SIMULATION'}
          </button>
          <button
            onClick={() => {
              if (!graphRef.current) return;
              graphRef.current.zoomToFit(prefersReducedMotion ? 0 : 700, 70);
              setSelectedNode(null);
              setHoverNode(null);
              setNodeQueryFeedback('');
              clearHighlights();
              trackEvent('simulation_reset_view', {});
            }}
            className="px-3 py-2 text-[10px] font-mono tracking-[0.2em] uppercase glass-panel border border-val-border hover:border-val-red transition-colors"
          >
            RESET_VIEW
          </button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
          <div className="inline-flex flex-wrap gap-2 bg-val-dark/80 border border-val-border px-3 py-2">
            <span className="text-[10px] font-mono text-val-light/70 uppercase tracking-widest">
              Legend:
            </span>
            <span className="text-[10px] font-mono text-[#ff4655] uppercase">Core</span>
            <span className="text-[10px] font-mono text-[#00e5ff] uppercase">ML/DL</span>
            <span className="text-[10px] font-mono text-[#4dd0e1] uppercase">Vision</span>
            <span className="text-[10px] font-mono text-[#7c4dff] uppercase">NLP/RAG</span>
            <span className="text-[10px] font-mono text-[#ffc107] uppercase">Backend</span>
            <span className="text-[10px] font-mono text-[#66bb6a] uppercase">Automation</span>
            <span className="text-[10px] font-mono text-[#ff8a65] uppercase">DevOps</span>
            <span className="text-[10px] font-mono text-[#f8fafc] uppercase">Projects</span>
            <span className="text-[10px] font-mono text-val-light/70 uppercase">
              Click to focus paths
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemsCorePage;
