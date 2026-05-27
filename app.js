const icons = {
  activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 12h-4l-3 8L9 4l-3 8H2"/></svg>',
  bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 8V4H8"/><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M2 14h2m16 0h2M9 13h.01M15 13h.01M9 17h6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m20 6-11 11-5-5"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>',
  git: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.2 8.2 15.8 15.8M6 9v6"/></svg>',
  network: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><path d="m8.5 8.2 2.2 7.2m4.8-7.2-2.2 7.2M9 6h6"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m8 5 11 7-11 7Z"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12a9 9 0 0 1-15.4 6.4L3 16m0 0v5h5M3 12A9 9 0 0 1 18.4 5.6L21 8m0 0V3h-5"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
  terminal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m4 7 5 5-5 5"/><path d="M12 19h8"/></svg>',
};

let state = {};
let selectedTaskId = null;

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => Array.from(document.querySelectorAll(selector));

function api(path, options = {}) {
  const headers = options.body ? { "Content-Type": "application/json", ...(options.headers || {}) } : options.headers;
  return fetch(path, { ...options, headers }).then(async (response) => {
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `Request failed: ${response.status}`);
    return payload;
  });
}

function hydrateIcons() {
  qsa("[data-icon]").forEach((node) => {
    node.innerHTML = icons[node.dataset.icon] || icons.activity;
  });
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  qs("#toastStack").appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function switchView(view) {
  qsa(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === view));
  qsa(".view").forEach((panel) => panel.classList.toggle("active", panel.id === `view-${view}`));
}

function statusClass(status = "") {
  if (["done", "completed", "healthy", "online"].includes(status)) return "good";
  if (["failed", "blocked", "critical"].includes(status)) return "bad";
  if (["running", "investigating", "warning"].includes(status)) return "warn";
  return "neutral";
}

function formatTime(value) {
  if (!value) return "Not recorded";
  return new Date(value).toLocaleString();
}

function latestRepository() {
  return state.repositories?.[0] || null;
}

function latestImpact() {
  return state.impactAnalyses?.[0] || null;
}

function latestReview() {
  return state.reviewReports?.[0] || null;
}

function openTasks() {
  return (state.agentTasks || []).filter((task) => !["done", "failed"].includes(task.status));
}

function renderMetrics() {
  const repo = latestRepository();
  qs("#repoCount").textContent = state.repositories?.length || 0;
  qs("#riskScore").textContent = repo?.risk ?? state.analytics?.riskScore ?? 0;
  qs("#openTaskCount").textContent = openTasks().length;
  qs("#executionCount").textContent = state.executions?.length || 0;

  const actionTitle = qs("#nextActionTitle");
  const actionBody = qs("#nextActionBody");
  if (!repo) {
    actionTitle.textContent = "Scan the current workspace";
    actionBody.textContent = "Index the repository first. After that, Veltrix can trace impact, assign work, and produce a review brief.";
  } else if (!latestImpact()) {
    actionTitle.textContent = "Analyze the current changes";
    actionBody.textContent = `${repo.name} is indexed. Run impact analysis to see changed files, affected modules, and suggested verification.`;
  } else if (!latestReview()) {
    actionTitle.textContent = "Generate the review brief";
    actionBody.textContent = "Impact data is ready. Create a concise review brief with changed surface, blockers, and checks.";
  } else {
    actionTitle.textContent = "Workspace is ready for review";
    actionBody.textContent = "The latest scan, impact analysis, task records, and review brief are available in this console.";
  }
}

function renderActivity() {
  const events = state.events || [];
  qs("#activityList").innerHTML = events.length
    ? events
        .slice(0, 8)
        .map(
          (event) => `
            <article class="activity-item">
              <span class="pill ${statusClass(event.severity)}">${event.source || "Runtime"}</span>
              <div>
                <strong>${event.message}</strong>
                <small>${formatTime(event.timestamp)}</small>
              </div>
            </article>
          `,
        )
        .join("")
    : `<div class="empty">No runtime events yet. Start with a repository scan.</div>`;
}

function renderRepositories() {
  const repos = state.repositories || [];
  qs("#repositoryList").innerHTML = repos.length
    ? repos
        .map((repo) => {
          const files = repo.analysis?.files || repo.analysis?.indexedFiles?.length || 0;
          const edges = repo.analysis?.dependencyGraph?.dependencyEdges?.length || 0;
          return `
            <article class="repo-card">
              <div>
                <strong>${repo.name}</strong>
                <small>${repo.path}</small>
              </div>
              <dl>
                <div><dt>Files</dt><dd>${files}</dd></div>
                <div><dt>Edges</dt><dd>${edges}</dd></div>
                <div><dt>Risk</dt><dd>${repo.risk ?? 0}</dd></div>
              </dl>
            </article>
          `;
        })
        .join("")
    : `<div class="empty">No repository has been scanned yet.</div>`;
}

function renderImpact() {
  const impact = latestImpact();
  const summary = qs("#impactSummary");
  const details = qs("#impactDetails");
  if (!impact) {
    const empty = `<div class="empty">Run impact analysis after scanning a repository.</div>`;
    summary.innerHTML = empty;
    details.innerHTML = empty;
    return;
  }

  const changed = impact.changedFiles || [];
  const impacted = impact.impactedFiles || [];
  const checks = impact.verificationPlan || impact.testPlan || [];
  summary.innerHTML = `
    <strong>${impact.summary || "Impact analysis complete"}</strong>
    <div class="summary-grid">
      <span><b>${changed.length}</b> changed</span>
      <span><b>${impacted.length}</b> impacted</span>
      <span><b>${impact.riskScore ?? 0}</b> risk</span>
    </div>
  `;
  details.innerHTML = `
    <div class="detail-block">
      <h3>Changed files</h3>
      ${changed.length ? changed.slice(0, 8).map((file) => `<p>${file}</p>`).join("") : "<p>No Git changes detected; Veltrix used high-signal indexed files.</p>"}
    </div>
    <div class="detail-block">
      <h3>Impacted files</h3>
      ${impacted.length ? impacted.slice(0, 10).map((file) => `<p>${file}</p>`).join("") : "<p>No dependent files found.</p>"}
    </div>
    <div class="detail-block">
      <h3>Verification plan</h3>
      ${checks.length ? checks.map((check) => `<p>${check}</p>`).join("") : "<p>No verification steps generated yet.</p>"}
    </div>
  `;
}

function renderTasks() {
  const tasks = state.agentTasks || [];
  if (!selectedTaskId && tasks.length) selectedTaskId = tasks[0].id;

  qs("#taskList").innerHTML = tasks.length
    ? tasks
        .map(
          (task) => `
            <button class="task-row ${task.id === selectedTaskId ? "active" : ""}" data-task-id="${task.id}">
              <span class="pill ${statusClass(task.status)}">${task.status}</span>
              <strong>${task.title}</strong>
              <small>${task.agentName || "Agent"} · attempt ${task.attempts || 1}</small>
            </button>
          `,
        )
        .join("")
    : `<div class="empty">No tasks yet. Assign work from the overview or Tasks screen.</div>`;

  const task = tasks.find((item) => item.id === selectedTaskId);
  qs("#taskTitle").textContent = task?.title || "No task selected";
  qs("#taskDetail").innerHTML = task
    ? `
      <div class="task-meta">
        <span class="pill ${statusClass(task.status)}">${task.status}</span>
        <span>${task.agentName || "Agent"}</span>
        <span>${task.id}</span>
      </div>
      <p>${task.detail || "No task detail recorded."}</p>
      <h3>Permissions</h3>
      <div class="chip-row">${(task.permissions || []).map((item) => `<span>${item}</span>`).join("") || "<span>Default runtime policy</span>"}</div>
      <h3>Logs</h3>
      <div class="log-list">${(task.logs || []).slice(0, 6).map((log) => `<p>${formatTime(log.timestamp)} · ${log.message}</p>`).join("") || "<p>No logs yet.</p>"}</div>
      <h3>Tool runs</h3>
      <div class="log-list">${(task.toolRuns || []).slice(0, 6).map((run) => `<p>${run.tool || "tool"} · ${run.command || "command"} · ${run.status || "recorded"}</p>`).join("") || "<p>No tool runs recorded.</p>"}</div>
    `
    : `<div class="empty">Select a task to see its audit trail.</div>`;
}

function renderReview() {
  const report = latestReview();
  qs("#reviewBrief").innerHTML = report
    ? `
      <article class="brief-card">
        <strong>${report.title}</strong>
        <small>${formatTime(report.createdAt)}</small>
        ${(report.sections || [])
          .map(
            (section) => `
              <section>
                <h3>${section.title}</h3>
                ${(section.items || [section.body].filter(Boolean)).map((item) => `<p>${item}</p>`).join("")}
              </section>
            `,
          )
          .join("")}
      </article>
    `
    : `<div class="empty">Generate a review brief after impact analysis.</div>`;
}

function renderExecutions() {
  const executions = state.executions || [];
  qs("#executionList").innerHTML = executions.length
    ? executions
        .slice(0, 12)
        .map(
          (execution) => `
            <article class="execution-row">
              <span class="pill ${statusClass(execution.status)}">${execution.status || "recorded"}</span>
              <div>
                <strong>${execution.command || execution.tool || "Sandbox run"}</strong>
                <small>${execution.id} · ${execution.durationMs || 0}ms</small>
              </div>
            </article>
          `,
        )
        .join("")
    : `<div class="empty">No tool executions recorded yet.</div>`;
}

function renderRuntime() {
  const runtime = state.runtime || {};
  const services = runtime.services || [];
  qs("#runtimeName").textContent = runtime.service || runtime.product || "Veltrix runtime";
  qs("#runtimeMode").textContent = runtime.mode || "local-first";
  qs("#serviceList").innerHTML = services.length
    ? services
        .map(
          (service) => `
            <article class="service-row">
              <span class="pill ${statusClass(service.status)}">${service.status}</span>
              <div>
                <strong>${service.name}</strong>
                <small>${service.detail || "Local service"}</small>
              </div>
            </article>
          `,
        )
        .join("")
    : `<div class="empty">Runtime services will appear after bootstrap.</div>`;

  const settings = state.settings || {};
  qs("#defaultModel").value = settings.defaultModel || "qwen2.5-coder";
  qs("#retentionDays").value = settings.retentionDays || 90;
  qs("#sandboxNetwork").checked = Boolean(settings.sandboxNetwork);
  qs("#telemetry").checked = Boolean(settings.telemetry);
}

function renderAll() {
  renderMetrics();
  renderActivity();
  renderRepositories();
  renderImpact();
  renderTasks();
  renderReview();
  renderExecutions();
  renderRuntime();
}

async function refresh(message) {
  state = await api("/api/bootstrap");
  renderAll();
  if (message) showToast(message);
}

async function scanRepository() {
  const path = qs("#repoPath").value.trim();
  const payload = await api("/api/repositories/scan", {
    method: "POST",
    body: JSON.stringify(path ? { path } : {}),
  });
  state.repositories = payload.repositories;
  await refresh(`Scanned ${payload.repository.name}.`);
}

async function analyzeImpact() {
  const payload = await api("/api/repositories/impact", {
    method: "POST",
    body: JSON.stringify({ repoId: latestRepository()?.id }),
  });
  state.impactAnalyses = payload.impactAnalyses;
  state.memory = payload.memory || state.memory;
  await refresh("Impact analysis is ready.");
}

async function assignTasks() {
  await api("/api/agents/coordinate", {
    method: "POST",
    body: JSON.stringify({ goal: latestImpact()?.summary || "Prepare repository change for review" }),
  });
  await refresh("Agent tasks created.");
  switchView("tasks");
}

async function generateReview() {
  await api("/api/reviews/generate", {
    method: "POST",
    body: JSON.stringify({ impactId: latestImpact()?.id }),
  });
  await refresh("Review brief generated.");
  switchView("evidence");
}

async function runSandbox() {
  await api("/api/sandbox/run", {
    method: "POST",
    body: JSON.stringify({
      agentTaskId: selectedTaskId,
      command: "npm.cmd run check",
      tool: "sandbox.exec",
    }),
  });
  await refresh("Check recorded in the audit log.");
}

async function mutateTask(action) {
  if (!selectedTaskId) {
    showToast("Select a task first.");
    return;
  }
  await api(`/api/agents/tasks/${selectedTaskId}/${action}`, {
    method: "POST",
    body: action === "tool-run" ? JSON.stringify({ command: "npm.cmd run check", tool: "sandbox.exec" }) : undefined,
  });
  await refresh(`Task ${action.replace("-", " ")} complete.`);
}

async function runFullPass() {
  try {
    showToast("Running scan, impact, task assignment, and review.");
    if (!latestRepository()) await scanRepository();
    await analyzeImpact();
    await assignTasks();
    await generateReview();
  } catch (error) {
    showToast(error.message || "Full pass stopped.");
  }
}

async function searchMemory(query) {
  if (!query.trim()) return;
  const payload = await api(`/api/memory/search?q=${encodeURIComponent(query.trim())}`);
  state.events = [
    { source: "Memory", message: `${payload.results.length} result(s) for "${query.trim()}".`, severity: "info", timestamp: new Date().toISOString() },
    ...(state.events || []),
  ];
  renderActivity();
  switchView("overview");
}

function bindEvents() {
  qsa(".nav-item").forEach((item) => item.addEventListener("click", () => switchView(item.dataset.view)));
  qs("#themeToggle").addEventListener("click", () => document.body.classList.toggle("light"));
  qs("#scanRepo").addEventListener("click", () => scanRepository().catch((error) => showToast(error.message)));
  qs("#analyzeImpact").addEventListener("click", () => analyzeImpact().catch((error) => showToast(error.message)));
  qs("#assignTasks").addEventListener("click", () => assignTasks().catch((error) => showToast(error.message)));
  qs("#assignTasksHeader").addEventListener("click", () => assignTasks().catch((error) => showToast(error.message)));
  qs("#generateReview").addEventListener("click", () => generateReview().catch((error) => showToast(error.message)));
  qs("#generateReviewHeader").addEventListener("click", () => generateReview().catch((error) => showToast(error.message)));
  qs("#runFullPass").addEventListener("click", runFullPass);
  qs("#runSandbox").addEventListener("click", () => runSandbox().catch((error) => showToast(error.message)));
  qs("#advanceTask").addEventListener("click", () => mutateTask("advance").catch((error) => showToast(error.message)));
  qs("#runTaskTool").addEventListener("click", () => mutateTask("tool-run").catch((error) => showToast(error.message)));
  qs("#retryTask").addEventListener("click", () => mutateTask("retry").catch((error) => showToast(error.message)));
  qs("#taskList").addEventListener("click", (event) => {
    const row = event.target.closest("[data-task-id]");
    if (!row) return;
    selectedTaskId = row.dataset.taskId;
    renderTasks();
  });
  qs("#saveSettings").addEventListener("click", async () => {
    await api("/api/settings", {
      method: "PATCH",
      body: JSON.stringify({
        defaultModel: qs("#defaultModel").value,
        retentionDays: Number(qs("#retentionDays").value),
        sandboxNetwork: qs("#sandboxNetwork").checked,
        telemetry: qs("#telemetry").checked,
      }),
    });
    await refresh("Settings saved.");
  });
  qs("#globalSearch").addEventListener("keydown", (event) => {
    if (event.key === "Enter") searchMemory(event.target.value).catch((error) => showToast(error.message));
  });
}

function connectEvents() {
  if (!("EventSource" in window) || location.protocol === "file:") return;
  const stream = new EventSource("/api/events");
  stream.addEventListener("veltrix", (event) => {
    const payload = JSON.parse(event.data);
    state.events = [{ ...payload, timestamp: payload.timestamp || new Date().toISOString() }, ...(state.events || [])].slice(0, 25);
    renderActivity();
  });
  stream.addEventListener("error", () => stream.close());
}

async function init() {
  hydrateIcons();
  bindEvents();
  renderAll();
  try {
    await refresh();
    connectEvents();
  } catch (error) {
    showToast(error.message || "Runtime is not available.");
  }
}

init();
