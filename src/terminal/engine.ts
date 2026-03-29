import { FAQ_ITEMS, FAQ_PROMPTS, RULE_BASED_QA, SECTORS, TERMINAL_BANNER, TERMINAL_FILES } from './knowledgeBase';

type Page = 'home' | 'agents' | 'missions' | 'core' | 'docs' | 'career' | 'contact' | 'mission-detail';

export type TerminalLine = { type: 'output'; text: string };

export type TerminalAction =
  | { type: 'navigate'; page: Page; message: string[] }
  | { type: 'clear' }
  | { type: 'exit' }
  | { type: 'none' };

export type TerminalResult = {
  lines: TerminalLine[];
  action: TerminalAction;
};

const aliasToPage: Record<string, Page> = {
  home: 'home',
  agents: 'agents',
  vision: 'agents',
  core: 'core',
  skills: 'core',
  missions: 'missions',
  projects: 'missions',
  career: 'career',
  experience: 'career',
  docs: 'docs',
  intel: 'docs',
  contact: 'contact'
};

const oneLine = (text: string): TerminalLine => ({ type: 'output', text });

const navigate = (page: Page, message: string[]): TerminalResult => ({
  lines: [],
  action: { type: 'navigate', page, message }
});

const notFound = (cmd: string): TerminalResult => ({
  lines: [oneLine(`command not found: ${cmd}. Type 'help' for commands or 'faq' for guided prompts.`)],
  action: { type: 'none' }
});

const getFile = (name: string) => TERMINAL_FILES.find((f) => f.name.toLowerCase() === name.toLowerCase());

const normalizeFileToken = (value: string) => value.toLowerCase().replace(/\.md$/i, '').trim();

const levenshtein = (a: string, b: string) => {
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[a.length][b.length];
};

const resolveFileTarget = (target: string) => {
  const raw = target.trim();
  const normalized = normalizeFileToken(raw);
  const candidates = TERMINAL_FILES.map((f) => ({
    file: f,
    token: normalizeFileToken(f.name),
  }));

  const exact = candidates.find((c) => c.token === normalized);
  if (exact) return { file: exact.file, suggestion: null as string | null };

  const startsWith = candidates.find((c) => c.token.startsWith(normalized) || normalized.startsWith(c.token));
  if (startsWith) return { file: startsWith.file, suggestion: startsWith.file.name };

  const ranked = candidates
    .map((c) => ({ ...c, score: levenshtein(normalized, c.token) }))
    .sort((a, b) => a.score - b.score);

  const best = ranked[0];
  if (best && best.score <= 3) return { file: best.file, suggestion: best.file.name };

  return { file: null, suggestion: ranked[0]?.file.name ?? null };
};

const getNaturalAnswer = (query: string): string[] | null => {
  for (const item of RULE_BASED_QA) {
    if (item.patterns.some((re) => re.test(query))) return item.answer;
  }
  return null;
};

const looksLikeNaturalLanguage = (input: string) => {
  const q = input.trim();
  if (!q) return false;
  if (q.split(/\s+/).length < 2) return false;
  return /\?|\b(what|how|where|which|who|why|tell me|can you|do you|are you|show me|explain)\b/i.test(q);
};

const formatTree = () => {
  return TERMINAL_FILES.map((file, index) => {
    const isLast = index === TERMINAL_FILES.length - 1;
    const prefix = isLast ? '└──' : '├──';
    return `${prefix} ${file.name}`;
  });
};

export const getTerminalBootHistory = (): TerminalLine[] => TERMINAL_BANNER.map(oneLine);

export const getTerminalCompletions = (rawInput: string): string[] => {
  const input = rawInput.trimStart();
  const lower = input.toLowerCase();

  const baseCommands = [
    'help', 'help nav', 'help cat', 'help faq', 'help cmd',
    'ls', 'tree', 'pwd', 'faq',
    'open', 'cd',
    'whoami', 'skills', 'projects', 'experience', 'education', 'certs', 'achievements', 'stack', 'internships',
    'cat', 'clear', 'exit', 'ask '
  ];

  if (lower === 'cat' || lower === 'cat ') {
    return TERMINAL_FILES.map((file) => `cat ${file.name}`);
  }

  if (lower.startsWith('cat ')) {
    const token = input.slice(4).trim().toLowerCase();
    return TERMINAL_FILES
      .map((file) => file.name)
      .filter((name) => name.toLowerCase().startsWith(token))
      .map((name) => `cat ${name}`);
  }

  if (lower === 'open' || lower === 'open ' || lower === 'cd' || lower === 'cd ') {
    return SECTORS.map((sector) => `open ${sector}`);
  }

  if (lower.startsWith('open ') || lower.startsWith('cd ')) {
    const mode = lower.startsWith('cd ') ? 'cd' : 'open';
    const token = input.replace(/^open\s+|^cd\s+/i, '').trim().toLowerCase();
    return SECTORS
      .filter((sector) => sector.startsWith(token))
      .map((sector) => `${mode} ${sector}`);
  }

  if (!input) return baseCommands;

  return baseCommands.filter((cmd) => cmd.startsWith(lower));
};

export const executeTerminalInput = (rawInput: string): TerminalResult => {
  const input = rawInput.trim();
  const cmd = input.toLowerCase();

  if (!input) return { lines: [], action: { type: 'none' } };

  if (cmd === 'clear') return { lines: [], action: { type: 'clear' } };
  if (cmd === 'exit') return { lines: [], action: { type: 'exit' } };

  if (cmd === 'help') {
    return {
      lines: [
        oneLine('Help Index:'),
        oneLine('  help nav   - Navigation and page switching'),
        oneLine('  help cat   - File-based knowledge mode'),
        oneLine('  help faq   - Interview-oriented prompts'),
        oneLine('  help cmd   - Full command matrix'),
        oneLine('Quick Start:'),
        oneLine('  1) faq  2) ask a question directly  3) cat skills.md / projects.md'),
        oneLine('Tip: You can ask directly, e.g. "what are your core skills?"')
      ],
      action: { type: 'none' }
    };
  }

  if (cmd === 'help nav') {
    return {
      lines: [
        oneLine('Navigation Commands:'),
        oneLine('  open <sector> / cd <sector> -> move to app sections'),
        oneLine(`  valid sectors: ${SECTORS.join(', ')}`),
        oneLine('  shortcuts: home, agents, core, missions, career, docs, contact'),
        oneLine('Use case: fast switching during portfolio walkthrough.')
      ],
      action: { type: 'none' }
    };
  }

  if (cmd === 'help cat') {
    return {
      lines: [
        oneLine('cat Mode (Knowledge Files):'),
        oneLine('  cat <filename> prints structured profile data in terminal.'),
        oneLine('  examples: cat whoami.md | cat skills.md | cat projects.md'),
        oneLine('  typo support: cat whoamai -> suggestion/resolution provided'),
        oneLine('Use case: recruiter-friendly, structured readouts instead of short answers.')
      ],
      action: { type: 'none' }
    };
  }

  if (cmd === 'help faq') {
    return {
      lines: [
        oneLine('FAQ Mode:'),
        oneLine('  run faq for curated prompts with use-cases.'),
        oneLine('  then ask naturally or use: ask <question>'),
        oneLine('Use case: quick interview simulation and screening flow.')
      ],
      action: { type: 'none' }
    };
  }

  if (cmd === 'help cmd') {
    const commandsFile = getFile('commands.md');
    return {
      lines: [
        oneLine('Command Matrix:'),
        ...(commandsFile?.content ?? []).map(oneLine)
      ],
      action: { type: 'none' }
    };
  }

  if (cmd === 'ls') {
    const fileNames = TERMINAL_FILES.map((f) => f.name).join(', ');
    return {
      lines: [
        oneLine(`Sectors: ${SECTORS.join(', ')}`),
        oneLine(`Files: ${fileNames}`),
        oneLine('Use `cat <file>` to open a knowledge file.')
      ],
      action: { type: 'none' }
    };
  }

  if (cmd === 'tree') {
    return {
      lines: [
        oneLine('rushil-terminal/'),
        ...formatTree().map(oneLine)
      ],
      action: { type: 'none' }
    };
  }

  if (cmd === 'pwd') {
    return {
      lines: [oneLine('/secure/rushil-terminal')],
      action: { type: 'none' }
    };
  }

  if (cmd === 'faq') {
    return {
      lines: [
        oneLine('FAQ Prompts With Use Cases:'),
        ...FAQ_ITEMS.flatMap((item, index) => [
          oneLine(`${index + 1}. ${item.question}`),
          oneLine(`   Use case: ${item.useCase}`),
          oneLine(`   Try: ${item.prompt}`),
        ]),
        oneLine('Short list:'),
        ...FAQ_PROMPTS.map((prompt) => oneLine(`  - ${prompt}`))
      ],
      action: { type: 'none' }
    };
  }

  if (cmd.startsWith('cat ')) {
    const target = input.slice(4).trim();
    const resolved = resolveFileTarget(target);
    const file = resolved.file;
    if (!file) {
      return {
        lines: [
          oneLine(`cat: ${target}: no such file.`),
          ...(resolved.suggestion ? [oneLine(`Did you mean: cat ${resolved.suggestion}`)] : []),
          oneLine('Use ls to list available files.')
        ],
        action: { type: 'none' }
      };
    }

    return {
      lines: [
        oneLine(`# ${file.name}`),
        ...(resolved.suggestion && normalizeFileToken(target) !== normalizeFileToken(file.name)
          ? [oneLine(`// resolved from '${target}' -> '${file.name}'`)]
          : []),
        oneLine(`// ${file.description}`),
        ...file.content.map((line) => oneLine(line))
      ],
      action: { type: 'none' }
    };
  }

  if (cmd.startsWith('open ') || cmd.startsWith('cd ')) {
    const target = input.replace(/^open\s+|^cd\s+/i, '').trim().toLowerCase();

    if (cmd.startsWith('cd ') && ['..', '.', '/', '~', ''].includes(target)) {
      return {
        lines: [
          oneLine('Already at root: /secure/rushil-terminal'),
          oneLine('Tip: use cd <sector> to navigate app sections.')
        ],
        action: { type: 'none' }
      };
    }

    const page = aliasToPage[target];
    if (!page) {
      return {
        lines: [
          oneLine(`Unknown sector: ${target}`),
          oneLine(`Valid sectors: ${SECTORS.join(', ')}`)
        ],
        action: { type: 'none' }
      };
    }
    return navigate(page, [`SECURE_UPLINK: Redirecting to ${page.toUpperCase()}...`]);
  }

  if (cmd === 'cd' || cmd === 'cd ~' || cmd === 'cd /') {
    return {
      lines: [
        oneLine('Current path: /secure/rushil-terminal'),
        oneLine('Use cd <sector> to switch page context.')
      ],
      action: { type: 'none' }
    };
  }

  if (aliasToPage[cmd]) {
    const page = aliasToPage[cmd];
    return navigate(page, [`SECURE_UPLINK: Redirecting to ${page.toUpperCase()}...`]);
  }

  if (['whoami', 'skills', 'projects', 'experience', 'education', 'certs', 'achievements', 'stack', 'internships'].includes(cmd)) {
    const aliasFile: Record<string, string> = {
      whoami: 'whoami.md',
      skills: 'skills.md',
      stack: 'skills.md',
      projects: 'projects.md',
      experience: 'experience.md',
      internships: 'experience.md',
      education: 'education.md',
      certs: 'certifications.md',
      achievements: 'achievements.md'
    };

    const file = getFile(aliasFile[cmd]);
    return {
      lines: [
        oneLine(`Loaded ${file?.name ?? 'profile data'}:`),
        ...(file?.content ?? ['No data available.']).map((line) => oneLine(line))
      ],
      action: { type: 'none' }
    };
  }

  if (cmd.startsWith('ask ')) {
    const query = input.slice(4).trim();
    if (!query) {
      return {
        lines: [oneLine('Usage: ask <question>. Example: ask what is your best project?')],
        action: { type: 'none' }
      };
    }

    const answer = getNaturalAnswer(query);
    if (answer) {
      return {
        lines: answer.map(oneLine),
        action: { type: 'none' }
      };
    }

    return {
      lines: [
        oneLine('No exact rule match found.'),
        oneLine('Try: faq, cat whoami.md, cat skills.md, cat projects.md')
      ],
      action: { type: 'none' }
    };
  }

  /* Recruiter-focused shortcuts */
  if (cmd === 'recruiter-quickstart' || cmd === 'recruiter' || cmd === 'help recruiter') {
    return {
      lines: [
        oneLine('RECRUITER QUICKSTART (60-second scan):'),
        oneLine(''),
        oneLine('Role: Artificial Intelligence Engineer (GenAI Backend Systems)'),
        oneLine('Current: Active @ Ethosh (Dec 2025-Present)'),
        oneLine('Available: Open for better opportunities'),
        oneLine('WorkType: Any (remote, hybrid, on-site)'),
        oneLine(''),
        oneLine('I SOLVE: Production AI pipelines | Healthcare diagnosis systems | Automation at scale'),
        oneLine(''),
        oneLine('WHY HIRE:'),
        oneLine('  1) Full lifecycle AI delivery: research → architecture → deployment → evaluation'),
        oneLine('  2) 4+ internships + 8+ flagship projects with 90%+ accuracy metrics'),
        oneLine('  3) Tech breadth: PyTorch/TensorFlow/FastAPI/Make.com/Qdrant/Docker'),
        oneLine(''),
        oneLine('Quick Commands:'),
        oneLine('  show top-projects    - top 3 flagship systems'),
        oneLine('  why-hire-me           - expanded hiring reasoning'),
        oneLine('  impact                - project outcomes & metrics'),
        oneLine('  download-resume       - full CV (GUI button also available)')
      ],
      action: { type: 'none' }
    };
  }

  if (cmd === 'show top-projects' || cmd === 'top-projects' || cmd === 'flagship') {
    return {
      lines: [
        oneLine('TOP 3 FLAGSHIP SYSTEMS:'),
        oneLine(''),
        oneLine('1. Dental Disease Classification (92.28% accuracy)'),
        oneLine('   • Vision Transformer (ViT) architecture'),
        oneLine('   • FastAPI serving | Deployed production model'),
        oneLine('   • Impact: Clinical-grade diagnostic system'),
        oneLine(''),
        oneLine('2. Eye Disease Classifier - Fundus Diagnosis (92.4% accuracy)'),
        oneLine('   • CNN on fundus dataset | Flask + Streamlit app'),
        oneLine('   • Deployed end-to-end webapp'),
        oneLine('   • Impact: Real-world diagnostic tool'),
        oneLine(''),
        oneLine('3. WellBe Revive 360 - RAG Nutrition Assistant'),
        oneLine('   • OpenAI + Qdrant retrieval + TruLels evaluation'),
        oneLine('   • Safety guardrails: diet constraints, PII masking'),
        oneLine('   • Impact: Production RAG system shipped in 3 months (intern)')
      ],
      action: { type: 'none' }
    };
  }

  if (cmd === 'why-hire-me' || cmd === 'why hire') {
    return {
      lines: [
        oneLine('WHY HIRE RUSHIL:'),
        oneLine(''),
        oneLine('1. FULL-LIFECYCLE AI EXECUTION'),
        oneLine('   From research (92%+ accuracy models) → backend systems (FastAPI) → deployment (Docker + CI/CD)'),
        oneLine('   Not just notebook experiments; ships production systems.'),
        oneLine(''),
        oneLine('2. HEALTHCARE AI DOMAIN EXPERTISE'),
        oneLine('   4+ medical imaging projects: CNNs, ViTs, digital fundus diagnosis.'),
        oneLine('   Safety-minded: guardrails, evaluation, edge case handling.'),
        oneLine(''),
        oneLine('3. MODERN AI STACK BREADTH'),
        oneLine('   PyTorch/TensorFlow, FastAPI/Flask, RAG + Qdrant, LLMs + Gemini/OpenAI,'),
        oneLine('   Automation with Make.com + Meta Graph API, Docker + GCP.'),
        oneLine(''),
        oneLine('4. PROVEN STARTUP AGILITY'),
        oneLine('   3-month internship at WellBe building prod RAG system solo.'),
        oneLine('   SniperThink: orchestrated 75% reduction in manual workflows = revenue impact.')
      ],
      action: { type: 'none' }
    };
  }

  if (cmd === 'impact' || cmd === 'metrics' || cmd === 'outcomes') {
    return {
      lines: [
        oneLine('PROJECT IMPACT & METRICS:'),
        oneLine(''),
        oneLine('Healthcare AI:'),
        oneLine('  • Dental classifier: 92.28% accuracy (real patient data)'),
        oneLine('  • Retinal disease classifier: 92.4% accuracy (fundus standard)'),
        oneLine('  • Scale: 1000+ images preprocessed & validated'),
        oneLine(''),
        oneLine('Automation & GenAI:'),
        oneLine('  • 75% reduction in manual content creation (SniperThink)'),
        oneLine('  • 10,000+ workflows deployed (Make.com + Meta Graph API)'),
        oneLine('  • Cross-functional delivery: research → backend → eval'),
        oneLine(''),
        oneLine('RAG & LLMs:'),
        oneLine('  • 90%+ safety validation on nutrition assistant (TruLens)'),
        oneLine('  • Production streaming (SSE) + guardrails shipped in 3 months'),
        oneLine('  • Qdrant retrieval with prompt engineering'),
        oneLine(''),
        oneLine('Educational Impact:'),
        oneLine('  • State hackathon winner + intra-college winner'),
        oneLine('  • NPTEL Python Top 5% performer'),
        oneLine('  • CGPA 7.85 → rising to 9.07 SGPA')
      ],
      action: { type: 'none' }
    };
  }

  if (cmd === 'download-resume' || cmd === 'download resume' || cmd === 'get resume') {
    return {
      lines: [
        oneLine('Resume Download:'),
        oneLine('Use the GUI "Download Dossier" button on the home page.'),
        oneLine('For terminal summary, run:'),
        oneLine('  cat whoami.md      - professional snapshot'),
        oneLine('  cat skills.md      - full tech stack'),
        oneLine('  cat experience.md  - roles timeline'),
        oneLine('  cat projects.md    - flagship systems'),
        oneLine('  cat education.md   - degree + certifications')
      ],
      action: { type: 'none' }
    };
  }

  if (looksLikeNaturalLanguage(input)) {
    const answer = getNaturalAnswer(input);
    if (answer) {
      return {
        lines: answer.map(oneLine),
        action: { type: 'none' }
      };
    }

    return {
      lines: [
        oneLine('I could not map that to a known rule yet.'),
        oneLine('Try: "what are your core skills?", "where did you intern?", or run `recruiter` for 60-sec overview.')
      ],
      action: { type: 'none' }
    };
  }

  return notFound(input);
};
