const icons = {
  activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 12h-4l-3 8L9 4l-3 8H2"/></svg>',
  bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 8V4H8"/><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M2 14h2m16 0h2M9 13h.01M15 13h.01M9 17h6"/></svg>',
  network: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><path d="m8.5 8.2 2.2 7.2m4.8-7.2-2.2 7.2M9 6h6"/></svg>',
  workflow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="6" height="6" rx="1"/><rect x="15" y="4" width="6" height="6" rx="1"/><rect x="9" y="15" width="6" height="6" rx="1"/><path d="M9 7h6M6 10v2a3 3 0 0 0 3 3m9-5v2a3 3 0 0 1-3 3"/></svg>',
  memory: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="M8 4v16M16 4v16M4 8h16M4 16h16"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8Z"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m8 5 11 7-11 7Z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 5v14M16 5v14"/></svg>',
  git: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.2 8.2 15.8 15.8M6 9v6"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z"/><path d="M9 3v15M15 6v15"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12a9 9 0 0 1-15.4 6.4L3 16m0 0v5h5M3 12A9 9 0 0 1 18.4 5.6L21 8m0 0V3h-5"/></svg>',
  zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 2 3 14h8l-1 8 11-13h-8Z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m12 3 10 18H2Z"/><path d="M12 9v4m0 4h.01"/></svg>',
  cpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 1v3m6-3v3M9 20v3m6-3v3M20 9h3m-3 6h3M1 9h3m-3 6h3M10 10h4v4h-4Z"/></svg>',
  plug: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22v-5"/><path d="M9 8V2m6 6V2"/><path d="M6 8h12v3a6 6 0 0 1-12 0Z"/></svg>',
  terminal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m4 7 5 5-5 5"/><path d="M12 19h8"/></svg>',
};

const agents = [
  ["Planner", "Breaks goals into execution graphs, risk areas, and task dependencies.", 73, "Planning OAuth rollout"],
  ["Architecture", "Detects drift, coupling, boundaries, and scalability risks.", 62, "Inspecting gateway dependencies"],
  ["Backend", "Analyzes APIs, schemas, service contracts, and query paths.", 81, "Validating auth endpoints"],
  ["Frontend", "Reviews UI flows, rendering bottlenecks, accessibility, and state.", 44, "Mapping onboarding screens"],
  ["Security", "Scans auth, secrets, dependency risks, and unsafe patterns.", 67, "Checking token lifecycle"],
  ["DevOps", "Reviews CI/CD, containers, deployments, scaling, and rollback plans.", 58, "Reading pipeline history"],
  ["Testing", "Finds coverage gaps, creates test plans, and runs regression logic.", 49, "Generating integration suite"],
  ["Debugging", "Correlates stack traces, logs, deployments, and suspicious commits.", 52, "Watching error budgets"],
  ["Documentation", "Builds onboarding docs, ADRs, changelogs, and architecture notes.", 36, "Updating memory summaries"],
];

const feedMessages = [
  ["Architecture Agent", "Detected coupling between gateway middleware and billing entitlements.", "network"],
  ["Security Agent", "Flagged missing refresh-token rotation tests in auth service.", "shield"],
  ["Planner Agent", "Split OAuth rollout into 9 dependent tasks with 3 rollback gates.", "workflow"],
  ["Testing Agent", "Generated regression matrix for login, signup, and invite flows.", "activity"],
  ["DevOps Agent", "Matched latency spike to deployment window and queue saturation.", "zap"],
  ["Memory System", "Retrieved ADR-014 and three previous auth incidents.", "memory"],
];

const workflowSteps = [
  ["Repository scan", "Parsed 14,230 files and mapped service boundaries.", "done"],
  ["Semantic indexing", "Embedded APIs, functions, commits, and architecture docs.", "done"],
  ["Impact analysis", "Tracing auth changes across web, gateway, billing, and workers.", "running"],
  ["Risk scoring", "Waiting for security and test agents to finish validation.", "waiting"],
  ["Execution plan", "Generate subtasks, rollout gates, and owner-ready summary.", "waiting"],
];

const radar = [
  ["Coupling", 72],
  ["Complexity", 54],
  ["Coverage gap", 61],
  ["Secrets risk", 22],
  ["Deploy risk", 47],
];

const workflows = [
  ["PR Intelligence", "Analyzes code changes, maps affected services, runs tests, and creates reviewer context.", "Event: pull_request.opened", "96%"],
  ["Production Failure", "Ingests logs, traces deployments, correlates commits, and proposes root cause.", "Event: error_rate.spike", "91%"],
  ["Architecture Drift", "Checks dependency boundaries, circular imports, oversized modules, and risky coupling.", "Schedule: daily", "88%"],
  ["Release Readiness", "Validates test results, incidents, deployment health, and rollback confidence.", "Event: release.created", "94%"],
  ["Debt Prioritizer", "Ranks fragile abstractions, duplicated logic, hotspots, and refactor candidates.", "Schedule: weekly", "89%"],
  ["Memory Builder", "Turns incidents, PRs, docs, and engineering discussions into retrievable context.", "Event: repository.updated", "99%"],
];

const memories = [
  ["ADR-014: Redis session cache", "Redis was introduced to remove database pressure from auth session reads during onboarding campaigns.", ["Redis", "Auth", "ADR", "Latency"]],
  ["Incident INC-182", "Auth latency rose after deployment 2026.05.19. Rollback reduced P95 from 1.8s to 410ms.", ["Incident", "Deployment", "Rollback"]],
  ["PR #4831 OAuth groundwork", "Added provider abstraction but left refresh-token rotation coverage for a follow-up.", ["PR", "OAuth", "Testing"]],
  ["Architecture note", "Gateway owns request authentication; product services consume signed identity envelopes.", ["Gateway", "Boundaries", "Security"]],
];

const timeline = [
  ["09:42", "Deploy completed", "gateway@8f41d2 shipped OAuth provider adapter and middleware cache change."],
  ["09:48", "Latency threshold breached", "Auth P95 crossed 1.2s while Redis CPU rose to 84%."],
  ["09:51", "Veltrix investigation started", "Debugging Agent correlated the spike with session lookup fanout."],
  ["09:56", "Rollback candidate found", "Previous deployment is compatible with current schema and can roll back safely."],
];

const graphNodes = [
  { id: "Gateway", x: 0.5, y: 0.28, c: "#4fd6ff", risk: "Medium coupling", health: "Operational" },
  { id: "Auth", x: 0.27, y: 0.46, c: "#66e3a8", risk: "Coverage gap", health: "Degraded" },
  { id: "Billing", x: 0.72, y: 0.44, c: "#ffd166", risk: "High dependency", health: "Operational" },
  { id: "Web App", x: 0.18, y: 0.2, c: "#7aa2ff", risk: "Low", health: "Operational" },
  { id: "Workers", x: 0.78, y: 0.68, c: "#d97cff", risk: "Queue pressure", health: "Watching" },
  { id: "Event Bus", x: 0.48, y: 0.68, c: "#ff6b7a", risk: "Replay lag", health: "Operational" },
  { id: "Memory", x: 0.28, y: 0.78, c: "#4fd6ff", risk: "Low", health: "Indexing" },
];

const graphEdges = [
  ["Web App", "Gateway"],
  ["Gateway", "Auth"],
  ["Gateway", "Billing"],
  ["Gateway", "Event Bus"],
  ["Auth", "Memory"],
  ["Billing", "Workers"],
  ["Event Bus", "Workers"],
  ["Event Bus", "Memory"],
];

let selectedNode = graphNodes[0];
let graphMode = "services";
let feedIndex = 0;
const consoleLines = [
  ["00:00", "Runtime API", "Local backend booted and waiting for desktop shell."],
  ["00:01", "Vector DB", "Semantic repository memory initialized."],
  ["00:02", "Event Bus", "Server-sent event channel ready."],
];

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return Array.from(document.querySelectorAll(selector));
}

function hydrateIcons() {
  qsa("[data-icon]").forEach((el) => {
    const name = el.dataset.icon;
    el.innerHTML = icons[name] || icons.activity;
  });
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  qs("#toastStack").appendChild(toast);
  setTimeout(() => toast.remove(), 3600);
}

function writeConsole(source, message, severity = "info") {
  const time = new Date().toLocaleTimeString([], { hour12: false, minute: "2-digit", second: "2-digit" });
  consoleLines.unshift([time, source, message, severity]);
  if (consoleLines.length > 36) consoleLines.pop();
  const output = qs("#consoleOutput");
  if (!output) return;
  output.innerHTML = consoleLines
    .map(([stamp, src, text, level]) => `<div class="console-line ${level || ""}"><span>${stamp}</span><strong>${src}</strong><span>${text}</span></div>`)
    .join("");
}

function switchView(view) {
  qsa(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === view));
  qsa(".view").forEach((panel) => panel.classList.toggle("active", panel.id === `view-${view}`));
  if (view === "architecture") requestAnimationFrame(drawArchitecture);
}

function renderFeed() {
  const feed = qs("#activityFeed");
  feed.innerHTML = feedMessages
    .slice(feedIndex)
    .concat(feedMessages.slice(0, feedIndex))
    .map(([agent, message, icon], index) => `
      <article class="feed-item">
        <div class="feed-icon">${icons[icon]}</div>
        <div>
          <strong>${agent}</strong>
          <p>${message}</p>
        </div>
        <span class="feed-time">${index + 1}m</span>
      </article>
    `)
    .join("");
}

function rotateFeed() {
  feedIndex = (feedIndex + 1) % feedMessages.length;
  renderFeed();
}

function pushFeed(agent, message, icon = "activity") {
  feedMessages.unshift([agent, message, icon]);
  if (feedMessages.length > 9) feedMessages.pop();
  feedIndex = 0;
  renderFeed();
}

function renderWorkflowTrack() {
  qs("#workflowTrack").innerHTML = workflowSteps
    .map(([title, detail, status], index) => `
      <div class="workflow-step">
        <div class="step-index">${index + 1}</div>
        <div>
          <strong>${title}</strong>
          <p>${detail}</p>
        </div>
        <span class="status-chip ${status === "done" ? "" : status}">${status}</span>
      </div>
    `)
    .join("");
}

function renderRadarList() {
  qs("#radarList").innerHTML = radar
    .map(([name, value]) => `
      <div class="radar-row">
        <span>${name}</span>
        <div class="bar"><span style="width:${value}%"></span></div>
        <strong>${value}</strong>
      </div>
    `)
    .join("");
}

function renderAgents() {
  qs("#agentGrid").innerHTML = agents
    .map(([name, description, load, task]) => `
      <article class="agent-card">
        <div class="agent-top">
          <div class="agent-name">
            <div class="agent-icon">${icons.bot}</div>
            <div>
              <strong>${name} Agent</strong>
              <p>${task}</p>
            </div>
          </div>
          <span class="status-chip ${load > 70 ? "running" : ""}">${load}%</span>
        </div>
        <p>${description}</p>
        <div class="agent-load">
          <span>Current load</span>
          <div class="bar"><span style="width:${load}%"></span></div>
        </div>
      </article>
    `)
    .join("");
}

function renderWorkflows() {
  qs("#workflowGrid").innerHTML = workflows
    .map(([name, description, trigger, confidence]) => `
      <article class="workflow-card">
        <div class="workflow-top">
          <div class="agent-name">
            <div class="workflow-icon">${icons.workflow}</div>
            <strong>${name}</strong>
          </div>
          <span class="status-chip">${confidence}</span>
        </div>
        <p>${description}</p>
        <p><strong>${trigger}</strong></p>
      </article>
    `)
    .join("");
}

function renderMemory(filter = "") {
  const query = filter.trim().toLowerCase();
  const selected = memories.filter(([title, body, tags]) =>
    [title, body, tags.join(" ")].join(" ").toLowerCase().includes(query),
  );
  qs("#memoryResults").innerHTML = (selected.length ? selected : memories)
    .map(([title, body, tags]) => `
      <article class="memory-item">
        <strong>${title}</strong>
        <p>${body}</p>
        <div class="knowledge-map">${tags.map((tag) => `<span class="knowledge-node">${tag}</span>`).join("")}</div>
      </article>
    `)
    .join("");

  const nodes = [...new Set(memories.flatMap((item) => item[2]))];
  qs("#knowledgeMap").innerHTML = nodes.map((node) => `<span class="knowledge-node">${node}</span>`).join("");
}

function renderIncidents() {
  qs("#incidentTimeline").innerHTML = timeline
    .map(([time, title, detail]) => `
      <article class="timeline-item">
        <strong>${time} - ${title}</strong>
        <p>${detail}</p>
      </article>
    `)
    .join("");

  qs("#hypothesis").innerHTML = `
    <div class="hypothesis-score">
      <div class="score-ring"><span>78%</span></div>
      <div>
        <strong>Likely root cause</strong>
        <p>Gateway session cache fanout increased Redis pressure after the OAuth adapter deployment. Rollback is low risk because schema changes are backward compatible.</p>
      </div>
    </div>
    <p><strong>Recommended action:</strong> throttle session cache refresh, roll back gateway middleware, and run refresh-token regression tests before redeploying.</p>
  `;
}

async function loadRuntime() {
  try {
    const response = await fetch("/api/runtime");
    if (!response.ok) throw new Error("runtime unavailable");
    const runtime = await response.json();
    qs("#runtimeHost").textContent = `${runtime.host} / ${runtime.platform} / ${runtime.mode}`;
    qs("#serviceGrid").innerHTML = runtime.services
      .map((service) => `
        <article class="service-card">
          <div class="agent-top">
            <strong>${service.name}</strong>
            <span class="status-chip ${service.status === "warming" ? "running" : service.status === "restricted" ? "waiting" : ""}">${service.status}</span>
          </div>
          <p>Local service latency: ${service.latencyMs}ms. Managed by the embedded Veltrix runtime.</p>
          <div class="bar"><span style="width:${Math.min(100, 100 - service.latencyMs)}%"></span></div>
        </article>
      `)
      .join("");
    writeConsole("Runtime API", `Health snapshot loaded from ${runtime.host}.`);
  } catch {
    qs("#runtimeHost").textContent = "Static preview mode";
    qs("#serviceGrid").innerHTML = ["Runtime API", "Workflow Engine", "Agent Runtime", "Vector DB", "Sandbox", "Event Bus"]
      .map((name) => `<article class="service-card"><strong>${name}</strong><p>Preview status available after starting the local backend.</p><span class="status-chip waiting">preview</span></article>`)
      .join("");
    writeConsole("Runtime API", "Backend not reachable; running UI in static preview mode.", "warning");
  }
}

function setupCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { ctx, w: rect.width, h: rect.height };
}

function drawRadar() {
  const canvas = qs("#radarCanvas");
  if (!canvas) return;
  const { ctx, w, h } = setupCanvas(canvas);
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) * 0.38;
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(155,176,206,.24)";
  ctx.fillStyle = "rgba(79,214,255,.14)";
  for (let r = 0.25; r <= 1; r += 0.25) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius * r, 0, Math.PI * 2);
    ctx.stroke();
  }
  const points = radar.map(([, value], i) => {
    const angle = -Math.PI / 2 + (i / radar.length) * Math.PI * 2;
    return [cx + Math.cos(angle) * radius * (value / 100), cy + Math.sin(angle) * radius * (value / 100)];
  });
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#4fd6ff";
  ctx.lineWidth = 2;
  ctx.stroke();
  points.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#66e3a8";
    ctx.fill();
  });
}

function drawSignal(time = 0) {
  const canvas = qs("#signalCanvas");
  if (!canvas) return;
  const { ctx, w, h } = setupCanvas(canvas);
  ctx.clearRect(0, 0, w, h);
  const nodes = Array.from({ length: 18 }, (_, i) => {
    const row = Math.floor(i / 6);
    const col = i % 6;
    return {
      x: 36 + col * ((w - 72) / 5) + Math.sin(time / 700 + i) * 8,
      y: 44 + row * ((h - 88) / 2) + Math.cos(time / 900 + i) * 10,
    };
  });
  ctx.lineWidth = 1;
  nodes.forEach((a, i) => {
    nodes.slice(i + 1).forEach((b) => {
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 170) {
        ctx.strokeStyle = `rgba(79,214,255,${0.24 - distance / 900})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    });
  });
  nodes.forEach((node, i) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, i % 4 === 0 ? 8 : 5, 0, Math.PI * 2);
    ctx.fillStyle = i % 3 === 0 ? "#66e3a8" : i % 3 === 1 ? "#4fd6ff" : "#ffd166";
    ctx.fill();
    ctx.shadowBlur = 16;
    ctx.shadowColor = ctx.fillStyle;
    ctx.fill();
    ctx.shadowBlur = 0;
  });
  requestAnimationFrame(drawSignal);
}

function drawArchitecture() {
  const canvas = qs("#architectureCanvas");
  if (!canvas) return;
  const { ctx, w, h } = setupCanvas(canvas);
  ctx.clearRect(0, 0, w, h);
  const placed = graphNodes.map((node) => ({ ...node, px: node.x * w, py: node.y * h }));
  ctx.lineWidth = 2;
  graphEdges.forEach(([from, to]) => {
    const a = placed.find((node) => node.id === from);
    const b = placed.find((node) => node.id === to);
    ctx.strokeStyle = graphMode === "risk" ? "rgba(255,107,122,.42)" : "rgba(79,214,255,.32)";
    ctx.beginPath();
    ctx.moveTo(a.px, a.py);
    const midY = (a.py + b.py) / 2;
    ctx.bezierCurveTo(a.px, midY, b.px, midY, b.px, b.py);
    ctx.stroke();
  });
  placed.forEach((node) => {
    const isSelected = selectedNode.id === node.id;
    const radius = isSelected ? 34 : 28;
    ctx.beginPath();
    ctx.arc(node.px, node.py, radius + 8, 0, Math.PI * 2);
    ctx.fillStyle = `${node.c}22`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(node.px, node.py, radius, 0, Math.PI * 2);
    ctx.fillStyle = graphMode === "runtime" && node.health !== "Operational" ? "#ffd166" : node.c;
    ctx.fill();
    ctx.strokeStyle = isSelected ? "#ffffff" : "rgba(255,255,255,.45)";
    ctx.lineWidth = isSelected ? 3 : 1;
    ctx.stroke();
    ctx.fillStyle = "#081018";
    ctx.font = "800 11px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.id, node.px, node.py);
  });
}

function updateInspector(node) {
  selectedNode = node;
  qs("#nodeInspector").innerHTML = `
    <p class="eyebrow">Selected node</p>
    <h3>${node.id}</h3>
    <p>${node.id} participates in repository intelligence, workflow execution, event streaming, and memory retrieval.</p>
    <dl>
      <div><dt>Health</dt><dd>${node.health}</dd></div>
      <div><dt>Dependencies</dt><dd>${graphEdges.filter((edge) => edge.includes(node.id)).length}</dd></div>
      <div><dt>Risk</dt><dd>${node.risk}</dd></div>
    </dl>
  `;
  drawArchitecture();
}

function bindEvents() {
  qsa(".nav-item").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.view)));
  qsa("[data-view-jump]").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.viewJump)));
  qs("#themeToggle").addEventListener("click", () => {
    document.documentElement.classList.toggle("light");
    qs("#themeToggle [data-icon]").dataset.icon = document.documentElement.classList.contains("light") ? "moon" : "sun";
    hydrateIcons();
    drawRadar();
    drawArchitecture();
  });
  qs("#runWorkflow").addEventListener("click", async () => {
    showToast("Repository analysis workflow started. Agents are coordinating now.");
    try {
      const response = await fetch("/api/workflows/run", { method: "POST" });
      if (response.ok) {
        const payload = await response.json();
        qs("#riskScore").textContent = String(payload.state.architectureRisk);
      } else {
        qs("#riskScore").textContent = String(Math.max(18, Number(qs("#riskScore").textContent) - 3));
      }
    } catch {
      qs("#riskScore").textContent = String(Math.max(18, Number(qs("#riskScore").textContent) - 3));
    }
    rotateFeed();
  });
  qs("#connectRepo").addEventListener("click", () => showToast("Repository connector opened. GitHub, GitLab, and local repo modes are next."));
  qs("#deployAgents").addEventListener("click", () => showToast("Planner coordinated nine specialist agents into one execution graph."));
  qs("#newWorkflow").addEventListener("click", () => showToast("Workflow template created with triggers, retries, checkpoints, and audit events."));
  qs("#simulateIncident").addEventListener("click", () => {
    showToast("Incident simulation running. Debugging and DevOps agents are correlating signals.");
    switchView("incidents");
  });
  qs("#runSandbox").addEventListener("click", async () => {
    try {
      const response = await fetch("/api/sandbox/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: "npm test -- --changed" }),
      });
      const payload = await response.json();
      showToast(`Sandbox execution recorded: ${payload.execution.id}`);
      writeConsole("Sandbox", `${payload.execution.command} finished in ${payload.execution.durationMs}ms.`);
    } catch {
      showToast("Sandbox preview recorded locally. Start the runtime for real API execution.");
      writeConsole("Sandbox", "Preview execution captured without backend.", "warning");
    }
  });
  qs("#installPlugin").addEventListener("click", () => {
    showToast("Plugin SDK workspace created conceptually. Manifest and hooks are ready for the next build phase.");
    writeConsole("Plugin SDK", "Prepared custom agent plugin registration flow.");
  });
  qs("#memorySearch").addEventListener("input", (event) => renderMemory(event.target.value));
  qs("#globalSearch").addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target.value.trim()) {
      showToast(`Veltrix is retrieving context for: ${event.target.value.trim()}`);
      switchView("memory");
      qs("#memorySearch").value = event.target.value;
      renderMemory(event.target.value);
    }
  });
  qsa("[data-graph-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      qsa("[data-graph-mode]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      graphMode = button.dataset.graphMode;
      drawArchitecture();
    });
  });
  qs("#architectureCanvas").addEventListener("click", (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const hit = graphNodes.find((node) => Math.hypot(node.x * rect.width - x, node.y * rect.height - y) < 42);
    if (hit) updateInspector(hit);
  });
  window.addEventListener("resize", () => {
    drawRadar();
    drawArchitecture();
  });
}

function connectBackendEvents() {
  if (!("EventSource" in window) || location.protocol === "file:") return;
  const stream = new EventSource("/api/events");
  stream.addEventListener("veltrix", (event) => {
    const payload = JSON.parse(event.data);
    pushFeed(payload.source || "Veltrix Event Bus", payload.message, payload.severity === "warning" ? "alert" : "activity");
    writeConsole(payload.source || "Event Bus", payload.message, payload.severity);
  });
  stream.addEventListener("error", () => stream.close());
}

function init() {
  hydrateIcons();
  renderFeed();
  renderWorkflowTrack();
  renderRadarList();
  renderAgents();
  renderWorkflows();
  renderMemory();
  renderIncidents();
  writeConsole("Desktop Shell", "Veltrix command center mounted.");
  bindEvents();
  loadRuntime();
  connectBackendEvents();
  drawRadar();
  drawArchitecture();
  requestAnimationFrame(drawSignal);
  setInterval(rotateFeed, 5200);
}

init();
