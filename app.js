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
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>',
  rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4.5 16.5c-1 1-1.5 2.5-1.5 4.5 2 0 3.5-.5 4.5-1.5"/><path d="M9 15 6 12a14 14 0 0 1 12-9 14 14 0 0 1-9 12Z"/><path d="M15 9h.01M9 15l-1 4 4-1"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16v-5M12 16V8M16 16v-9"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.4.6.98 1 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m20 6-11 11-5-5"/></svg>',
};

let feedMessages = [];
let workflowSteps = [];
let radar = [];
let graphNodes = [];
let graphEdges = [];
let selectedNode = null;
let selectedWorkflowRunId = null;
let graphMode = "services";
let feedIndex = 0;
let appState = {};
const consoleLines = [
  ["00:00", "Runtime API", "Local backend booted and waiting for desktop shell."],
  ["00:01", "Memory Index", "Local repository memory waiting for indexed files."],
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
  if (!feedMessages.length) {
    feed.innerHTML = `
      <article class="feed-item empty-state">
        <div class="feed-icon">${icons.activity}</div>
        <div>
          <strong>No runtime events yet</strong>
          <p>Start a scan, workflow, sandbox run, or connect the event stream to populate execution history.</p>
        </div>
      </article>
    `;
    return;
  }
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
  if (!feedMessages.length) return;
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
  if (!workflowSteps.length) {
    qs("#workflowTrack").innerHTML = `
      <div class="workflow-step empty-state">
        <div class="step-index">0</div>
        <div>
          <strong>No workflow run selected</strong>
          <p>Run repository intelligence to create live checkpoints from the backend workflow engine.</p>
        </div>
        <span class="status-chip waiting">idle</span>
      </div>
    `;
    return;
  }
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

function renderWorkflowRuns() {
  const runs = appState.workflowRuns || [];
  if (!selectedWorkflowRunId && runs.length) selectedWorkflowRunId = runs[0].id;
  const list = qs("#workflowRunList");
  if (list) {
    list.innerHTML = runs.length
      ? runs
          .map((run) => `
            <button class="workflow-run-item ${run.id === selectedWorkflowRunId ? "active" : ""}" data-run-id="${run.id}">
              <span>
                <strong>${run.name}</strong>
                <small>${new Date(run.startedAt).toLocaleString()}</small>
              </span>
              <span class="status-chip ${run.status === "running" ? "running" : ""}">${run.progress}%</span>
            </button>
          `)
          .join("")
      : `<article class="workflow-run-item empty-state"><strong>No workflow runs yet</strong><p>Run analysis to create persistent checkpoint history.</p></article>`;
  }

  const selectedRun = runs.find((run) => run.id === selectedWorkflowRunId) || runs[0];
  renderWorkflowDetail(selectedRun);
  workflowSteps = selectedRun
    ? selectedRun.checkpoints.map((checkpoint) => [checkpoint.name, checkpoint.output || `${selectedRun.name} checkpoint.`, checkpoint.status === "queued" ? "waiting" : checkpoint.status])
    : workflowSteps;
  renderWorkflowTrack();
}

function renderWorkflowDetail(run) {
  const title = qs("#workflowDetailTitle");
  const detail = qs("#workflowDetail");
  if (!title || !detail) return;
  if (!run) {
    title.textContent = "No run selected";
    detail.innerHTML = `<article class="workflow-detail-empty empty-state"><strong>No execution selected</strong><p>Start a workflow run to inspect checkpoints, timing, and event history.</p></article>`;
    return;
  }
  const assignedTasks = (appState.agentTasks || []).filter((task) => task.workflowRunId === run.id);
  title.textContent = run.name;
  detail.innerHTML = `
    <div class="workflow-progress-card">
      <div>
        <strong>${run.status}</strong>
        <p>${run.id}</p>
      </div>
      <span>${run.progress}%</span>
      <div class="bar"><span style="width:${run.progress}%"></span></div>
    </div>
    <div class="workflow-checkpoints">
      ${run.checkpoints
        .map((checkpoint, index) => `
          <article class="workflow-checkpoint">
            <span class="step-index">${index + 1}</span>
            <div>
              <strong>${checkpoint.name}</strong>
              <p>${checkpoint.output || "Waiting for execution."}</p>
              <small>${checkpoint.startedAt ? new Date(checkpoint.startedAt).toLocaleTimeString() : "not started"}${checkpoint.finishedAt ? ` -> ${new Date(checkpoint.finishedAt).toLocaleTimeString()}` : ""}</small>
            </div>
            <span class="status-chip ${checkpoint.status === "running" ? "running" : checkpoint.status === "queued" ? "waiting" : ""}">${checkpoint.status}</span>
          </article>
        `)
        .join("")}
    </div>
    <div class="workflow-events">
      <strong>Assigned agents</strong>
      ${assignedTasks.length
        ? assignedTasks
            .map((task) => `<p><span>${task.agentName}</span> ${task.title} · ${task.status}</p>`)
            .join("")
        : "<p>No agent task records attached to this run.</p>"}
    </div>
    <div class="workflow-events">
      <strong>Run events</strong>
      ${(run.events || [])
        .slice(0, 5)
        .map((event) => `<p><span>${new Date(event.timestamp).toLocaleTimeString()}</span> ${event.message}</p>`)
        .join("")}
    </div>
  `;
}

function renderRadarList() {
  if (!radar.length) {
    qs("#radarList").innerHTML = `<div class="radar-row empty-state"><span>No measured risk signals yet</span></div>`;
    return;
  }
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
  qs("#agentGrid").innerHTML = `<article class="agent-card empty-state"><strong>No agents registered</strong><p>The runtime has not returned any agent definitions.</p></article>`;
  const taskList = qs("#agentTaskList");
  if (taskList) {
    taskList.innerHTML = `<article class="agent-task-item empty-state"><strong>No agent tasks available</strong><p>Connect the local runtime to inspect execution records.</p></article>`;
  }
}

function renderWorkflows() {
  qs("#workflowGrid").innerHTML = `<article class="workflow-card empty-state"><strong>No workflows registered</strong><p>The runtime has not returned any workflow definitions.</p></article>`;
}

function renderMemory(filter = "") {
  const query = filter.trim().toLowerCase();
  const source = (appState.memory || []).map((item) => [item.title, item.body, item.tags || []]);
  const selected = source.filter(([title, body, tags]) => [title, body, tags.join(" ")].join(" ").toLowerCase().includes(query));
  if (!source.length) {
    qs("#memoryResults").innerHTML = `<article class="memory-item empty-state"><strong>No memory objects indexed</strong><p>Scan a repository to create searchable code maps and architecture memory.</p></article>`;
    qs("#knowledgeMap").innerHTML = `<span class="knowledge-node">Awaiting repository scan</span>`;
    return;
  }
  qs("#memoryResults").innerHTML = selected.length
    ? selected
    .map(([title, body, tags]) => `
      <article class="memory-item">
        <strong>${title}</strong>
        <p>${body}</p>
        <div class="knowledge-map">${tags.map((tag) => `<span class="knowledge-node">${tag}</span>`).join("")}</div>
      </article>
    `)
    .join("")
    : `<article class="memory-item empty-state"><strong>No local match</strong><p>Try a file name, language, function, class, import, or architecture tag from the indexed repository.</p></article>`;

  const nodes = [...new Set(source.flatMap((item) => item[2]))];
  qs("#knowledgeMap").innerHTML = nodes.map((node) => `<span class="knowledge-node">${node}</span>`).join("");
}

async function searchMemory(query) {
  if (!query.trim()) {
    renderMemory("");
    return;
  }
  try {
    const response = await fetch(`/api/memory/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("search failed");
    const payload = await response.json();
    appState.memorySearchResults = payload.results;
    qs("#memoryResults").innerHTML = payload.results.length
      ? payload.results
          .map((item) => `
            <article class="memory-item">
              <strong>${item.title}</strong>
              <p>${item.body}</p>
              <div class="knowledge-map">${item.tags.map((tag) => `<span class="knowledge-node">${tag}</span>`).join("")}</div>
            </article>
          `)
          .join("")
      : `<article class="memory-item"><strong>No indexed result</strong><p>Scan a repository or search for a file, import, function, class, language, or tag.</p></article>`;
    writeConsole("Memory Search", `Returned ${payload.results.length} results for "${query}".`);
  } catch {
    renderMemory(query);
    writeConsole("Memory Search", "Runtime search unavailable; filtered local memory only.", "warning");
  }
}

function renderIncidents() {
  const incidents = appState.incidents || [];
  const incidentItems = incidents.map((incident) => [
    new Date(incident.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    incident.title,
    `${incident.service} / ${incident.status} / ${incident.summary}`,
  ]);
  qs("#incidentTimeline").innerHTML = incidentItems
    .length
    ? incidentItems
    .map(([time, title, detail]) => `
      <article class="timeline-item">
        <strong>${time} - ${title}</strong>
        <p>${detail}</p>
      </article>
    `)
    .join("")
    : `<article class="timeline-item empty-state"><strong>No incidents connected</strong><p>Connect logs, deployments, or create a local simulation to start an investigation timeline.</p></article>`;

  const latest = incidents[0];
  qs("#hypothesis").innerHTML = latest
    ? `
      <div class="hypothesis-score">
        <div class="score-ring"><span>${latest.confidence || 0}%</span></div>
        <div>
          <strong>${latest.title}</strong>
          <p>${latest.summary}</p>
        </div>
      </div>
      <p><strong>Current action:</strong> collect logs, deployment markers, traces, and ownership context for ${latest.service}.</p>
    `
    : `
      <div class="hypothesis-score empty-state">
        <div class="score-ring"><span>0%</span></div>
        <div>
          <strong>No root-cause hypothesis</strong>
          <p>Veltrix needs an incident source or local simulation before it can correlate evidence.</p>
        </div>
      </div>
    `;
}

function renderRepositories() {
  const repos = appState.repositories || [];
  const latest = repos[0];
  const dependencyGraph = latest?.analysis?.dependencyGraph || { dependencyEdges: [], externalPackages: [], modules: [] };
  qs("#repositoryGrid").innerHTML = repos.length
    ? repos
    .map((repo) => `
      <article class="repository-card">
        <div class="agent-top">
          <strong>${repo.name}</strong>
          <span class="status-chip ${repo.health === "Degraded" ? "running" : ""}">${repo.health}</span>
        </div>
        <p>${repo.type} repository using ${repo.language}. ${repo.services} service signals detected.</p>
        <div class="repository-meta">
          <span>risk ${repo.risk}</span>
          <span>${repo.services} services</span>
          <span>${repo.analysis?.dependencyGraph?.dependencyEdges?.length || 0} edges</span>
          <span>${new Date(repo.indexedAt).toLocaleDateString()}</span>
        </div>
      </article>
    `)
    .join("")
    : `<article class="repository-card empty-state"><strong>No repository indexed</strong><p>Scan the local workspace to populate language, service, file, and architecture signals.</p></article>`;

  qs("#analysisPanel").innerHTML = latest
    ? `
      <div>
        <strong>${latest.name}</strong>
        <p>${latest.analysis ? `Indexed ${latest.analysis.files} files across ${Object.keys(latest.analysis.languages).length} languages.` : "Repository is connected and ready for deeper analysis."}</p>
        <div class="repository-meta">
          ${(latest.analysis?.frameworks || [latest.language]).map((item) => `<span>${item}</span>`).join("")}
          <span>${dependencyGraph.dependencyEdges.length} local imports</span>
          <span>${dependencyGraph.externalPackages.length} external packages</span>
        </div>
      </div>
      <div>
        <strong>Top modules</strong>
        <p>${dependencyGraph.modules.slice(0, 6).map((module) => `${module.label} (${module.inbound}/${module.outbound})`).join(", ") || "No module dependency signals available yet."}</p>
      </div>
      <div>
        <strong>External packages</strong>
        <p>${dependencyGraph.externalPackages.slice(0, 8).map((pkg) => `${pkg.name} x${pkg.count}`).join(", ") || "No external package imports detected."}</p>
      </div>
    `
    : "<div><strong>No repository indexed</strong><p>Scan a local workspace to build the first architecture map.</p></div>";
}

function renderDeployments() {
  const deployments = appState.deployments || [];
  qs("#deploymentGrid").innerHTML = deployments.length
    ? deployments
    .map((deployment) => `
      <article class="deployment-card">
        <div class="agent-top">
          <strong>${deployment.service}</strong>
          <span class="status-chip ${deployment.status === "watching" ? "running" : ""}">${deployment.status}</span>
        </div>
        <p>Version ${deployment.version} deployed ${new Date(deployment.deployedAt).toLocaleString()}.</p>
        <div class="deployment-meta">
          <span>P95 ${deployment.latencyP95}ms</span>
          <span>Error ${deployment.errorRate}%</span>
          <span>rollback ready</span>
        </div>
      </article>
    `)
    .join("")
    : `<article class="deployment-card empty-state"><strong>No deployment source connected</strong><p>Connect CI/CD, Kubernetes, or deployment logs before Veltrix reports rollout intelligence.</p></article>`;
}

function renderAnalytics() {
  const analytics = appState.analytics || {};
  const metrics = [
    ["Deployment frequency", analytics.deploymentFrequency || "No deployment integration connected"],
    ["Change failure rate", analytics.changeFailureRate || "No incident/deployment baseline"],
    ["MTTR", analytics.meanTimeToRecovery || "Connect incident source"],
    ["Workflow P95", analytics.workflowLatencyP95 || "No executions yet"],
  ];
  qs("#analyticsScoreboard").innerHTML = metrics
    .map(([label, value]) => `<article class="score-card"><p>${label}</p><strong>${value}</strong></article>`)
    .join("");
  const riskRows = [...(analytics.technicalDebt || []), ...(analytics.hotspots || [])];
  qs("#riskTable").innerHTML = riskRows.length
    ? riskRows
    .map((item) => `
      <div class="risk-row">
        <div class="agent-top">
          <strong>${item.area || item.module}</strong>
          <span class="status-chip ${item.score || item.risk > 60 ? "running" : ""}">${item.score || item.risk}</span>
        </div>
        <p>${item.trend ? `Trend: ${item.trend}` : "Module requires architecture review and ownership clarity."}</p>
      </div>
    `)
    .join("")
    : `<div class="risk-row empty-state"><strong>No analytics baseline</strong><p>Scan a repository to calculate local engineering signals.</p></div>`;
}

function renderPlugins() {
  const plugins = appState.plugins || [];
  qs("#pluginGrid").innerHTML = plugins
    .map((plugin) => `
      <article class="plugin-card">
        <div class="agent-top">
          <strong>${plugin.name}</strong>
          <span class="status-chip ${plugin.status === "warming" ? "running" : plugin.status === "available" ? "waiting" : ""}">${plugin.status}</span>
        </div>
        <p>${plugin.category} plugin with hooks: ${plugin.hooks.join(", ")}.</p>
      </article>
    `)
    .join("");
}

function renderSettings() {
  const settings = appState.settings || {};
  if (qs("#defaultModel")) qs("#defaultModel").value = settings.defaultModel || "qwen2.5-coder";
  if (qs("#retentionDays")) qs("#retentionDays").value = settings.retentionDays || 90;
  if (qs("#sandboxNetwork")) qs("#sandboxNetwork").checked = Boolean(settings.sandboxNetwork);
  if (qs("#telemetry")) qs("#telemetry").checked = Boolean(settings.telemetry);
}

function deriveFeedFromState(payload) {
  feedMessages = (payload.events || []).slice(0, 9).map((event) => [
    event.source || "Veltrix Event Bus",
    event.message || "Runtime event recorded.",
    event.severity === "warning" ? "alert" : "activity",
  ]);
  feedIndex = 0;
}

function deriveWorkflowTrack(payload) {
  const run = (payload.workflowRuns || [])[0];
  workflowSteps = run
    ? run.checkpoints.map((checkpoint) => [checkpoint.name, checkpoint.output || `${run.name} checkpoint.`, checkpoint.status === "queued" ? "waiting" : checkpoint.status])
    : [];
}

function deriveRadar(payload) {
  const analytics = payload.analytics || {};
  const repo = (payload.repositories || [])[0];
  const debtSignals = (analytics.technicalDebt || []).slice(0, 4).map((item) => [item.area, Math.min(100, Number(item.score) || 0)]);
  const hotspot = (analytics.hotspots || [])[0];
  radar = [
    ["Architecture risk", payload.runtime?.metrics?.architectureRisk || 0],
    ["Indexed files", Math.min(100, Math.round((repo?.analysis?.files || 0) / 20))],
    ...debtSignals,
    ...(hotspot ? [["Highest hotspot", Math.min(100, hotspot.risk || 0)]] : []),
  ].slice(0, 6);
}

function deriveArchitecture(payload) {
  const architecture = payload.architecture || {};
  const rawNodes = architecture.nodes || [];
  const rawEdges = architecture.edges || [];
  const palette = ["#4fd6ff", "#66e3a8", "#ffd166", "#7aa2ff", "#d97cff", "#ff6b7a"];
  graphNodes = rawNodes.map((node, index) => {
    const angle = -Math.PI / 2 + (index / Math.max(1, rawNodes.length)) * Math.PI * 2;
    const ring = rawNodes.length > 5 && index % 2 ? 0.33 : 0.24;
    return {
      ...node,
      x: 0.5 + Math.cos(angle) * ring,
      y: 0.5 + Math.sin(angle) * ring,
      c: palette[index % palette.length],
    };
  });
  graphEdges = rawEdges;
  selectedNode = graphNodes[0] || null;
  if (selectedNode) updateInspector(selectedNode);
  else {
    qs("#nodeInspector").innerHTML = `<p class="eyebrow">Architecture graph</p><h3>No nodes indexed</h3><p>Scan a repository to build the first service and runtime graph.</p>`;
  }
}

function applyBootstrap(payload) {
  appState = payload;
  if (qs("#repoPath") && !qs("#repoPath").value && payload.repositories?.[0]?.path) {
    qs("#repoPath").value = payload.repositories[0].path;
  }
  deriveFeedFromState(payload);
  deriveWorkflowTrack(payload);
  deriveRadar(payload);
  deriveArchitecture(payload);
  if (payload.runtime?.metrics) {
    const metrics = payload.runtime.metrics;
    qs("#riskScore").textContent = String(metrics.architectureRisk);
    qsa(".metric-card strong")[1].textContent = `${metrics.workflowSuccess}%`;
    qsa(".metric-card strong")[2].textContent = String(metrics.openInvestigations);
    qsa(".metric-card strong")[3].textContent = `${(metrics.memoryObjects / 1000).toFixed(1)}k`;
    qs(".repo-count").textContent = String(metrics.repositories);
  }
  renderRepositories();
  renderAgentsFromState();
  renderAgentTasks();
  renderWorkflowsFromState();
  renderWorkflowRuns();
  renderIncidents();
  renderDeployments();
  renderAnalytics();
  renderPlugins();
  renderSettings();
  renderMemory();
  renderFeed();
  renderWorkflowTrack();
  renderRadarList();
  drawRadar();
  drawArchitecture();
}

function renderAgentsFromState() {
  if (!appState.agents?.length) return renderAgents();
  qs("#agentGrid").innerHTML = appState.agents
    .map((agent) => `
      <article class="agent-card">
        <div class="agent-top">
          <div class="agent-name">
            <div class="agent-icon">${icons.bot}</div>
            <div>
              <strong>${agent.name} Agent</strong>
              <p>${agent.activeTask}</p>
            </div>
          </div>
          <span class="status-chip ${agent.load > 70 ? "running" : ""}">${agent.load}%</span>
        </div>
        <p>${agent.permission}. Completed tasks: ${agent.taskCounts?.done ?? agent.memoryObjects}. Status: ${agent.status}.</p>
        <div class="agent-load"><span>Current load</span><div class="bar"><span style="width:${agent.load}%"></span></div></div>
        <div class="agent-mini-tasks">
          ${(agent.recentTasks || [])
            .slice(0, 3)
            .map((task) => `<span>${task.title}</span>`)
            .join("") || "<span>No assigned tasks yet</span>"}
        </div>
      </article>
    `)
    .join("");
}

function renderAgentTasks() {
  const list = qs("#agentTaskList");
  if (!list) return;
  const tasks = appState.agentTasks || [];
  list.innerHTML = tasks.length
    ? tasks
        .slice(0, 14)
        .map((task) => `
          <article class="agent-task-item">
            <div>
              <strong>${task.title}</strong>
              <p>${task.detail || "Waiting for runtime output."}</p>
              <small>${task.agentName} Agent · ${task.source} · ${new Date(task.createdAt).toLocaleString()}</small>
            </div>
            <span class="status-chip ${task.status === "running" ? "running" : task.status === "queued" ? "waiting" : ""}">${task.status}</span>
          </article>
        `)
        .join("")
    : `<article class="agent-task-item empty-state"><strong>No agent tasks yet</strong><p>Start a workflow or coordinate agents to create persisted execution records.</p></article>`;
}

function renderWorkflowsFromState() {
  if (!appState.workflows?.length) return renderWorkflows();
  qs("#workflowGrid").innerHTML = appState.workflows
    .map((workflow) => `
      <article class="workflow-card" data-workflow-id="${workflow.id}">
        <div class="workflow-top">
          <div class="agent-name">
            <div class="workflow-icon">${icons.workflow}</div>
            <strong>${workflow.name}</strong>
          </div>
          <span class="status-chip ${workflow.status === "paused" ? "waiting" : ""}">${workflow.successRate}%</span>
        </div>
        <p>Trigger: ${workflow.trigger}. Runs: ${workflow.runs}. Status: ${workflow.status}.</p>
        <p><strong>${workflow.checkpoints.join(" -> ")}</strong></p>
      </article>
    `)
    .join("");
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
    qs("#runtimeHost").textContent = "Runtime unavailable";
    qs("#serviceGrid").innerHTML = ["Runtime API", "Workflow Engine", "Agent Runtime", "Memory Index", "Sandbox", "Event Bus"]
      .map((name) => `<article class="service-card"><strong>${name}</strong><p>Status requires the local backend.</p><span class="status-chip waiting">offline</span></article>`)
      .join("");
    writeConsole("Runtime API", "Backend not reachable; product state is unavailable.", "warning");
  }
}

async function loadBootstrap() {
  try {
    const response = await fetch("/api/bootstrap");
    if (!response.ok) throw new Error("bootstrap unavailable");
    const payload = await response.json();
    applyBootstrap(payload);
    writeConsole("Runtime API", "Loaded complete Veltrix product state.");
  } catch {
    writeConsole("Runtime API", "Bootstrap unavailable; product state requires the local runtime.", "warning");
    appState = {};
    feedMessages = [];
    workflowSteps = [];
    radar = [];
    graphNodes = [];
    graphEdges = [];
    renderRepositories();
    renderAgents();
    renderWorkflows();
    renderIncidents();
    renderDeployments();
    renderAnalytics();
    renderPlugins();
    renderMemory();
    renderFeed();
    renderWorkflowTrack();
    renderRadarList();
    drawRadar();
    drawArchitecture();
  }
}

async function refreshProductState(reason = "State refreshed") {
  const response = await fetch("/api/bootstrap");
  if (!response.ok) throw new Error("bootstrap unavailable");
  const payload = await response.json();
  applyBootstrap(payload);
  writeConsole("Runtime API", reason);
  return payload;
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
  if (!radar.length) {
    ctx.fillStyle = "rgba(155,176,206,.7)";
    ctx.font = "700 13px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("No measured signals", cx, cy);
    return;
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
  if (!graphNodes.length) {
    ctx.fillStyle = "rgba(155,176,206,.78)";
    ctx.font = "800 15px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("No architecture graph indexed", w / 2, h / 2);
    return;
  }
  const placed = graphNodes.map((node) => ({ ...node, px: node.x * w, py: node.y * h }));
  ctx.lineWidth = 2;
  graphEdges.forEach(([from, to]) => {
    const a = placed.find((node) => node.id === from);
    const b = placed.find((node) => node.id === to);
    if (!a || !b) return;
    ctx.strokeStyle = graphMode === "risk" ? "rgba(255,107,122,.42)" : "rgba(79,214,255,.32)";
    ctx.beginPath();
    ctx.moveTo(a.px, a.py);
    const midY = (a.py + b.py) / 2;
    ctx.bezierCurveTo(a.px, midY, b.px, midY, b.px, b.py);
    ctx.stroke();
  });
  placed.forEach((node) => {
    const isSelected = selectedNode?.id === node.id;
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
    const label = node.label || node.id;
    const shortLabel = label.length > 18 ? `${label.slice(0, 15)}...` : label;
    ctx.fillText(shortLabel, node.px, node.py);
  });
}

function updateInspector(node) {
  selectedNode = node;
  const definitions = (node.definitions || []).slice(0, 6);
  const imports = (node.imports || []).slice(0, 6);
  qs("#nodeInspector").innerHTML = `
    <p class="eyebrow">Selected node</p>
    <h3>${node.label || node.id}</h3>
    <p>${node.id}</p>
    <dl>
      <div><dt>Health</dt><dd>${node.health}</dd></div>
      <div><dt>Inbound</dt><dd>${node.inbound ?? graphEdges.filter((edge) => edge[1] === node.id).length}</dd></div>
      <div><dt>Outbound</dt><dd>${node.outbound ?? graphEdges.filter((edge) => edge[0] === node.id).length}</dd></div>
      <div><dt>Risk</dt><dd>${node.risk ?? "unknown"}</dd></div>
    </dl>
    <div class="inspector-list">
      <strong>Definitions</strong>
      <p>${definitions.join(", ") || "No definitions extracted."}</p>
    </div>
    <div class="inspector-list">
      <strong>Imports</strong>
      <p>${imports.join(", ") || "No imports extracted."}</p>
    </div>
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
        selectedWorkflowRunId = payload.run.id;
        await refreshProductState("Workflow state synchronized after run.");
      } else {
        qs("#riskScore").textContent = String(Math.max(18, Number(qs("#riskScore").textContent) - 3));
      }
    } catch {
      qs("#riskScore").textContent = String(Math.max(18, Number(qs("#riskScore").textContent) - 3));
    }
    rotateFeed();
  });
  qs("#connectRepo").addEventListener("click", () => switchView("repositories"));
  qs("#scanRepo").addEventListener("click", async () => {
    const requestedPath = qs("#repoPath")?.value.trim();
    showToast(requestedPath ? "Scanning selected repository and resolving imports." : "Scanning local workspace and resolving imports.");
    try {
      const response = await fetch("/api/repositories/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestedPath ? { path: requestedPath } : {}),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Repository scan failed" }));
        throw new Error(error.error || "Repository scan failed");
      }
      const payload = await response.json();
      appState.repositories = payload.repositories;
      renderRepositories();
      writeConsole("Repository Indexer", `Indexed ${payload.repository.name}: ${payload.repository.analysis.files} files, ${payload.repository.analysis.dependencyGraph.dependencyEdges.length} dependency edges.`);
      await refreshProductState("Repository index synchronized.");
    } catch (error) {
      writeConsole("Repository Indexer", error.message || "Repository scan failed. Check that the path exists and is a directory.", "warning");
    }
  });
  qs("#deployAgents").addEventListener("click", async () => {
    showToast("Planner is coordinating specialist agents.");
    try {
      const response = await fetch("/api/agents/coordinate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: "Analyze the indexed repository and propose the next engineering plan" }),
      });
      const payload = await response.json();
      writeConsole("Planner Agent", `Created ${payload.plan.length} agent tasks for ${payload.goal}.`);
      await refreshProductState("Agent task queue synchronized.");
    } catch {
      writeConsole("Planner Agent", "Agent coordination requires the local runtime API.", "warning");
    }
  });
  qs("#newWorkflow").addEventListener("click", () => showToast("Select a workflow definition card to create a persistent run."));
  qs("#simulateIncident").addEventListener("click", async () => {
    showToast("Incident simulation running. Debugging and DevOps agents are correlating signals.");
    try {
      const response = await fetch("/api/incidents/simulate", { method: "POST" });
      const payload = await response.json();
      appState.incidents = payload.incidents;
      renderIncidents();
      writeConsole("Incident Center", `Created incident ${payload.incident.id}.`, "warning");
    } catch {
      writeConsole("Incident Center", "Incident simulation requires the local runtime API.", "warning");
    }
    switchView("incidents");
  });
  qs("#analyzeDeployments").addEventListener("click", () => {
    showToast("No deployment source is connected yet.");
    writeConsole("Deployment Intelligence", "Connect CI/CD, Kubernetes, or deployment logs before rollout analysis can run.", "warning");
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
      showToast("Sandbox requires the local runtime API.");
      writeConsole("Sandbox", "No execution was recorded because the backend is unavailable.", "warning");
    }
  });
  qs("#installPlugin").addEventListener("click", () => {
    showToast("Plugin install requires a manifest endpoint.");
    writeConsole("Plugin SDK", "Plugin registry is visible; install persistence is not connected yet.", "warning");
  });
  qs("#saveSettings").addEventListener("click", async () => {
    const settings = {
      defaultModel: qs("#defaultModel").value,
      retentionDays: Number(qs("#retentionDays").value),
      sandboxNetwork: qs("#sandboxNetwork").checked,
      telemetry: qs("#telemetry").checked,
    };
    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const payload = await response.json();
      appState.settings = payload.settings;
      showToast("Runtime settings saved.");
      writeConsole("Settings", "Runtime settings persisted to local storage.");
    } catch {
      showToast("Settings require the local runtime API.");
      writeConsole("Settings", "No settings were persisted because the backend is unavailable.", "warning");
    }
  });
  let searchTimer;
  qs("#memorySearch").addEventListener("input", (event) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => searchMemory(event.target.value), 180);
  });
  qs("#globalSearch").addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target.value.trim()) {
      showToast(`Veltrix is retrieving context for: ${event.target.value.trim()}`);
      switchView("memory");
      qs("#memorySearch").value = event.target.value;
      searchMemory(event.target.value);
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
  qs("#workflowGrid")?.addEventListener("click", async (event) => {
    const card = event.target.closest("[data-workflow-id]");
    if (!card) return;
    showToast("Starting selected workflow run.");
    try {
      const response = await fetch("/api/workflows/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowId: card.dataset.workflowId }),
      });
      if (!response.ok) throw new Error("Workflow run failed");
      const payload = await response.json();
      selectedWorkflowRunId = payload.run.id;
      await refreshProductState("Workflow run history synchronized.");
    } catch (error) {
      writeConsole("Workflow Engine", error.message || "Workflow run failed.", "warning");
    }
  });
  qs("#workflowRunList")?.addEventListener("click", (event) => {
    const item = event.target.closest("[data-run-id]");
    if (!item) return;
    selectedWorkflowRunId = item.dataset.runId;
    renderWorkflowRuns();
  });
  qs("#advanceWorkflow")?.addEventListener("click", async () => {
    if (!selectedWorkflowRunId) {
      showToast("No workflow run selected.");
      return;
    }
    try {
      const response = await fetch(`/api/workflows/runs/${selectedWorkflowRunId}/advance`, { method: "POST" });
      if (!response.ok) throw new Error("Advance failed");
      const payload = await response.json();
      selectedWorkflowRunId = payload.run.id;
      await refreshProductState("Workflow checkpoint advanced.");
    } catch (error) {
      writeConsole("Workflow Engine", error.message || "Could not advance workflow run.", "warning");
    }
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
  loadBootstrap();
  loadRuntime();
  connectBackendEvents();
  drawRadar();
  drawArchitecture();
  requestAnimationFrame(drawSignal);
  setInterval(rotateFeed, 5200);
}

init();
