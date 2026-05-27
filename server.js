const http = require("node:http");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const crypto = require("node:crypto");
const { execFile } = require("node:child_process");

const root = __dirname;
const dataDir = path.join(root, ".veltrix");
const dbPath = path.join(dataDir, "runtime-db.json");
const port = Number(process.env.PORT || 4173);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const ignoredDirs = new Set([".git", "node_modules", ".next", "dist", "build", "target", ".veltrix"]);
const languageByExt = {
  ".js": "JavaScript",
  ".jsx": "React",
  ".ts": "TypeScript",
  ".tsx": "React TypeScript",
  ".rs": "Rust",
  ".py": "Python",
  ".go": "Go",
  ".java": "Java",
  ".cs": "C#",
  ".html": "HTML",
  ".css": "CSS",
  ".json": "JSON",
  ".md": "Markdown",
};
const ignoredFiles = new Set(["server.out.log", "server.err.log"]);
const readableExts = new Set([".js", ".jsx", ".ts", ".tsx", ".rs", ".py", ".go", ".java", ".cs", ".html", ".css", ".json", ".md"]);
const sourceExts = new Set([".js", ".jsx", ".ts", ".tsx", ".rs", ".py", ".go", ".java", ".cs"]);
const resolvableExts = [".js", ".jsx", ".ts", ".tsx", ".json", ".css", ".html", ".rs", ".py", ".go", ".java", ".cs"];

async function safeReadText(filePath, maxBytes = 500000) {
  try {
    const stat = await fsp.stat(filePath);
    if (stat.size > maxBytes) return "";
    return await fsp.readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

function extractCodeSignals(relativePath, content) {
  const imports = [];
  const definitions = [];
  const lower = relativePath.toLowerCase();

  for (const match of content.matchAll(/(?:import\s+.*?\s+from\s+["']([^"']+)["']|require\(["']([^"']+)["']\))/g)) {
    imports.push(match[1] || match[2]);
  }
  for (const match of content.matchAll(/\b(?:function|class)\s+([A-Za-z0-9_]+)/g)) {
    definitions.push(match[1]);
  }
  for (const match of content.matchAll(/\b(?:const|let|var)\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s*)?\(/g)) {
    definitions.push(match[1]);
  }

  const tags = [];
  if (lower.includes("server") || content.includes("createServer")) tags.push("backend");
  if (lower.includes("tauri") || lower.endsWith(".rs")) tags.push("desktop");
  if (lower.endsWith(".css") || lower.endsWith(".html")) tags.push("frontend");
  if (content.includes("fetch(") || content.includes("EventSource")) tags.push("runtime-client");
  if (content.includes("docker") || lower.includes("docker")) tags.push("infrastructure");
  if (content.includes("/api/")) tags.push("api");

  return {
    imports: [...new Set(imports)].slice(0, 40),
    definitions: [...new Set(definitions)].slice(0, 60),
    tags: [...new Set(tags)],
  };
}

function toIndexPath(filePath) {
  return filePath.split(path.sep).join("/");
}

function displayModule(filePath) {
  const normalized = toIndexPath(filePath);
  const parts = normalized.split("/");
  return parts.length > 2 ? `${parts[0]}/.../${parts.at(-1)}` : normalized;
}

function resolveLocalImport(fromPath, specifier, filePathSet) {
  if (!specifier || !specifier.startsWith(".")) return null;
  const fromDir = path.posix.dirname(toIndexPath(fromPath));
  const base = path.posix.normalize(path.posix.join(fromDir, specifier));
  const candidates = [base, ...resolvableExts.map((ext) => `${base}${ext}`), ...resolvableExts.map((ext) => `${base}/index${ext}`)];
  return candidates.find((candidate) => filePathSet.has(candidate)) || null;
}

function buildDependencyModel(fileIndex) {
  const filePathSet = new Set(fileIndex.map((file) => toIndexPath(file.path)));
  const dependencyEdges = [];
  const externalPackages = new Map();

  for (const file of fileIndex) {
    const from = toIndexPath(file.path);
    for (const specifier of file.imports) {
      const localTarget = resolveLocalImport(from, specifier, filePathSet);
      if (localTarget) {
        dependencyEdges.push({ from, to: localTarget, specifier, kind: "local" });
      } else if (!specifier.startsWith(".")) {
        const packageName = specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];
        externalPackages.set(packageName, (externalPackages.get(packageName) || 0) + 1);
      }
    }
  }

  const degree = new Map();
  for (const edge of dependencyEdges) {
    degree.set(edge.from, (degree.get(edge.from) || 0) + 1);
    degree.set(edge.to, (degree.get(edge.to) || 0) + 1);
  }

  const modules = fileIndex
    .filter((file) => sourceExts.has(path.extname(file.path).toLowerCase()) || file.imports.length || file.definitions.length || file.tags.length)
    .map((file) => {
      const normalizedPath = toIndexPath(file.path);
      const inbound = dependencyEdges.filter((edge) => edge.to === normalizedPath).length;
      const outbound = dependencyEdges.filter((edge) => edge.from === normalizedPath).length;
      return {
        path: normalizedPath,
        label: displayModule(normalizedPath),
        language: file.language,
        tags: file.tags,
        definitions: file.definitions.slice(0, 12),
        imports: file.imports.slice(0, 12),
        inbound,
        outbound,
        risk: Math.min(99, inbound * 10 + outbound * 8 + file.definitions.length * 2 + file.tags.length * 6),
      };
    })
    .sort((a, b) => b.risk + b.inbound + b.outbound - (a.risk + a.inbound + a.outbound));

  return {
    dependencyEdges,
    modules,
    externalPackages: [...externalPackages.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 30),
  };
}

function buildArchitectureFromIndex(repo) {
  const dependencyGraph = repo.analysis.dependencyGraph || { modules: [], dependencyEdges: [], externalPackages: [] };
  const selectedModules = dependencyGraph.modules.slice(0, 14);
  const selectedPaths = new Set(selectedModules.map((module) => module.path));
  const nodes = selectedModules.map((module) => ({
    id: module.path,
    label: module.label,
    kind: module.tags[0] || module.language,
    health: "indexed",
    risk: module.risk,
    language: module.language,
    inbound: module.inbound,
    outbound: module.outbound,
    definitions: module.definitions,
    imports: module.imports,
  }));
  const edges = dependencyGraph.dependencyEdges
    .filter((edge) => selectedPaths.has(edge.from) && selectedPaths.has(edge.to))
    .slice(0, 32)
    .map((edge) => [edge.from, edge.to]);

  for (const externalPackage of dependencyGraph.externalPackages.slice(0, 5)) {
    const packageId = `package:${externalPackage.name}`;
    nodes.push({
      id: packageId,
      label: externalPackage.name,
      kind: "external",
      health: "referenced",
      risk: Math.min(80, externalPackage.count * 8),
      inbound: externalPackage.count,
      outbound: 0,
      definitions: [],
      imports: [],
    });
    for (const module of selectedModules.filter((item) => item.imports.some((specifier) => specifier === externalPackage.name || specifier.startsWith(`${externalPackage.name}/`))).slice(0, 4)) {
      edges.push([module.path, packageId]);
    }
  }

  if (!nodes.length) {
    nodes.push({ id: repo.name, label: repo.name, kind: "repository", health: "indexed", risk: repo.risk, inbound: 0, outbound: 0, definitions: [], imports: [] });
  }

  db.architecture = { repoId: repo.id, repoPath: repo.path, nodes, edges, generatedAt: now() };
}

function now() {
  return new Date().toISOString();
}

function id(prefix) {
  return `${prefix}_${crypto.randomBytes(5).toString("hex")}`;
}

function createDefaultDb() {
  return {
    meta: {
      product: "Veltrix Control Plane",
      version: "0.1.0",
      mode: "local-first",
      createdAt: now(),
      runtimeStartedAt: now(),
      schemaVersion: 2,
    },
    settings: {
      localModels: ["qwen2.5-coder", "deepseek-coder", "nomic-embed-text"],
      defaultModel: "qwen2.5-coder",
      sandboxNetwork: false,
      telemetry: false,
      retentionDays: 90,
    },
    repositories: [],
    agents: [
      { id: "agent_planner", name: "Planner", status: "idle", load: 0, permission: "Plan + delegate", memoryObjects: 0, activeTask: "Waiting for a real engineering goal" },
      { id: "agent_architecture", name: "Architecture", status: "idle", load: 0, permission: "Read architecture graph", memoryObjects: 0, activeTask: "Waiting for repository analysis" },
      { id: "agent_backend", name: "Backend", status: "idle", load: 0, permission: "Patch services", memoryObjects: 0, activeTask: "Waiting for backend task" },
      { id: "agent_frontend", name: "Frontend", status: "idle", load: 0, permission: "Patch UI", memoryObjects: 0, activeTask: "Waiting for frontend task" },
      { id: "agent_security", name: "Security", status: "idle", load: 0, permission: "Read security metadata", memoryObjects: 0, activeTask: "Waiting for security scan" },
      { id: "agent_devops", name: "DevOps", status: "idle", load: 0, permission: "Read CI/CD + Docker", memoryObjects: 0, activeTask: "Waiting for deployment integration" },
      { id: "agent_testing", name: "Testing", status: "idle", load: 0, permission: "Run sandbox tests", memoryObjects: 0, activeTask: "Waiting for test run" },
      { id: "agent_debugging", name: "Debugging", status: "idle", load: 0, permission: "Read logs", memoryObjects: 0, activeTask: "Waiting for logs or incident source" },
      { id: "agent_docs", name: "Documentation", status: "idle", load: 0, permission: "Write docs", memoryObjects: 0, activeTask: "Waiting for documentation task" },
    ],
    workflows: [
      { id: "wf_repo_index", name: "Repository Intelligence", trigger: "repository.scan", status: "active", successRate: 100, checkpoints: ["walk", "classify", "graph", "memory", "report"], runs: 0 },
      { id: "wf_architecture", name: "Architecture Analysis", trigger: "repository.indexed", status: "active", successRate: 100, checkpoints: ["modules", "dependencies", "boundaries", "risk"], runs: 0 },
      { id: "wf_memory", name: "Memory Builder", trigger: "file.indexed", status: "active", successRate: 100, checkpoints: ["extract", "summarize", "tag", "persist"], runs: 0 },
    ],
    incidents: [],
    deployments: [],
    memory: [],
    plugins: [
      { id: "plugin_github", name: "GitHub Intelligence", status: "enabled", category: "SCM", hooks: ["pull_request.opened", "commit.pushed"] },
      { id: "plugin_docker", name: "Docker Runtime", status: "enabled", category: "Runtime", hooks: ["sandbox.run", "compose.changed"] },
      { id: "plugin_ollama", name: "Ollama Models", status: "not configured", category: "AI", hooks: ["model.detected", "embedding.requested"] },
      { id: "plugin_k8s", name: "Kubernetes Deployments", status: "not configured", category: "Deployments", hooks: ["rollout.started", "pod.crashed"] },
      { id: "plugin_slack", name: "Slack War Room", status: "not configured", category: "Collaboration", hooks: ["incident.created", "summary.ready"] },
      { id: "plugin_sdk", name: "Custom Agent SDK", status: "enabled", category: "Extensibility", hooks: ["agent.registered", "tool.invoked"] },
    ],
    architecture: { nodes: [], edges: [] },
    impactAnalyses: [],
    reviewReports: [],
    workflowRuns: [],
    agentTasks: [],
    executions: [],
    events: [],
  };
}

let db = createDefaultDb();

function normalizeDb() {
  const fresh = createDefaultDb();
  db.meta = { ...(db.meta || {}), product: fresh.meta.product, runtimeStartedAt: now(), schemaVersion: 2 };
  db.settings = { ...fresh.settings, ...(db.settings || {}) };
  db.agents = fresh.agents;
  db.workflows = fresh.workflows;
  db.repositories = (Array.isArray(db.repositories) ? db.repositories : []).filter((repo) => repo.path && !String(repo.path).startsWith("sample://"));
  db.incidents = (Array.isArray(db.incidents) ? db.incidents : []).filter((incident) => !String(incident.id || "").startsWith("inc_auth_") && !String(incident.id || "").startsWith("inc_queue_") && !String(incident.id || "").startsWith("inc_memory_"));
  db.deployments = (Array.isArray(db.deployments) ? db.deployments : []).filter((deployment) => deployment.source === "real");
  db.memory = (Array.isArray(db.memory) ? db.memory : []).filter((item) => item.source === "repository-index" || item.source === "user");
  db.plugins = Array.isArray(db.plugins) && db.plugins.length ? db.plugins : fresh.plugins;
  db.plugins = db.plugins.map((plugin) => {
    if (["plugin_k8s", "plugin_slack", "plugin_ollama"].includes(plugin.id)) return { ...plugin, status: "not configured" };
    return plugin;
  });
  db.architecture = db.architecture && Array.isArray(db.architecture.nodes) ? db.architecture : fresh.architecture;
  db.impactAnalyses = Array.isArray(db.impactAnalyses) ? db.impactAnalyses : [];
  db.reviewReports = Array.isArray(db.reviewReports) ? db.reviewReports : [];
  db.workflowRuns = Array.isArray(db.workflowRuns) ? db.workflowRuns : [];
  db.agentTasks = Array.isArray(db.agentTasks) ? db.agentTasks.map(normalizeAgentTask) : [];
  db.executions = Array.isArray(db.executions) ? db.executions : [];
  db.events = Array.isArray(db.events) ? db.events : [];
}

async function ensureDb() {
  await fsp.mkdir(dataDir, { recursive: true });
  try {
    db = JSON.parse(await fsp.readFile(dbPath, "utf8"));
    normalizeDb();
  } catch {
    db = createDefaultDb();
  }
  await saveDb();
}

async function saveDb() {
  await fsp.mkdir(dataDir, { recursive: true });
  await fsp.writeFile(dbPath, JSON.stringify(db, null, 2));
}

function recordEvent(source, message, severity = "info", data = {}) {
  const event = { id: id("evt"), source, message, severity, data, timestamp: now() };
  db.events.unshift(event);
  db.events = db.events.slice(0, 250);
  return event;
}

function agentForCheckpoint(checkpointName) {
  const name = String(checkpointName || "").toLowerCase();
  if (["walk", "classify", "extract", "summarize", "tag", "persist", "memory"].some((token) => name.includes(token))) return "agent_docs";
  if (["graph", "modules", "dependencies", "boundaries", "risk"].some((token) => name.includes(token))) return "agent_architecture";
  if (["report"].some((token) => name.includes(token))) return "agent_planner";
  return "agent_backend";
}

function agentTaskSummary(task) {
  const agent = db.agents.find((item) => item.id === task.agentId);
  return {
    ...task,
    agentName: agent ? agent.name : "Unknown",
  };
}

function defaultTaskPermissions(agentId) {
  const agent = db.agents.find((item) => item.id === agentId);
  const base = ["read:index", "read:memory", "write:events"];
  if (!agent) return base;
  if (["agent_backend", "agent_frontend", "agent_docs"].includes(agent.id)) return [...base, "write:workspace"];
  if (agent.id === "agent_testing") return [...base, "run:sandbox"];
  if (agent.id === "agent_devops") return [...base, "read:runtime", "run:sandbox"];
  if (agent.id === "agent_security") return [...base, "read:dependencies", "read:secrets-metadata"];
  return [...base, "plan:workflow"];
}

function normalizeAgentTask(task) {
  task.attempts = Number.isFinite(task.attempts) ? task.attempts : 1;
  task.maxAttempts = Number.isFinite(task.maxAttempts) ? task.maxAttempts : 3;
  task.permissions = Array.isArray(task.permissions) ? task.permissions : defaultTaskPermissions(task.agentId);
  task.toolRuns = Array.isArray(task.toolRuns) ? task.toolRuns : [];
  task.logs = Array.isArray(task.logs) && task.logs.length
    ? task.logs
    : [{ id: id("agt_log"), timestamp: task.createdAt || now(), level: "info", message: `Task accepted from ${task.source || "runtime"}.` }];
  task.events = Array.isArray(task.events) ? task.events : [];
  return task;
}

function createAgentTask({ agentId, workflowRunId = null, checkpointId = null, title, detail, status = "queued", source = "workflow" }) {
  const timestamp = now();
  const task = {
    id: id("agt_task"),
    agentId,
    workflowRunId,
    checkpointId,
    title,
    detail,
    status,
    source,
    attempts: 1,
    maxAttempts: 3,
    permissions: defaultTaskPermissions(agentId),
    toolRuns: [],
    logs: [
      {
        id: id("agt_log"),
        timestamp,
        level: "info",
        message: `Task accepted from ${source}.`,
      },
    ],
    createdAt: timestamp,
    startedAt: status === "running" || status === "done" ? timestamp : null,
    finishedAt: status === "done" ? timestamp : null,
    events: [
      {
        id: id("agt_evt"),
        timestamp,
        message: `Task ${status}: ${title}`,
      },
    ],
  };
  db.agentTasks.unshift(task);
  db.agentTasks = db.agentTasks.slice(0, 300);
  return task;
}

function transitionAgentTask(task, status, message) {
  const previousStatus = task.status;
  task.status = status;
  if (status === "running" && !task.startedAt) task.startedAt = now();
  if (["done", "failed", "blocked"].includes(status)) task.finishedAt = now();
  const log = {
    id: id("agt_log"),
    timestamp: now(),
    level: status === "failed" || status === "blocked" ? "warning" : "info",
    message: message || `Task moved from ${previousStatus} to ${status}.`,
  };
  task.logs.unshift(log);
  task.events.unshift({ id: id("agt_evt"), timestamp: log.timestamp, message: log.message });
  return task;
}

function createToolExecution({ task = null, command = "npm test -- --changed", tool = "sandbox.exec" }) {
  const execution = {
    id: id("exec"),
    agentTaskId: task?.id || null,
    agentId: task?.agentId || null,
    tool,
    command,
    isolation: db.settings.sandboxNetwork ? "container-policy:networked" : "container-policy:restricted",
    status: "recorded",
    replayable: true,
    durationMs: 980 + Math.floor(Math.random() * 900),
    startedAt: now(),
    finishedAt: now(),
    permissionDecision: task ? (task.permissions.includes("run:sandbox") || task.permissions.includes("write:workspace") ? "allowed" : "read-only allowed") : "allowed",
  };
  db.executions.unshift(execution);
  db.executions = db.executions.slice(0, 200);
  if (task) {
    task.toolRuns.unshift(execution);
    task.logs.unshift({
      id: id("agt_log"),
      timestamp: now(),
      level: "info",
      message: `Tool ${tool} recorded execution ${execution.id}.`,
    });
  }
  recordEvent("Sandbox", `Recorded execution: ${execution.command}`, "info", execution);
  return execution;
}

function syncAgentTaskFromCheckpoint(run, checkpoint) {
  const task = db.agentTasks.find((item) => item.workflowRunId === run.id && item.checkpointId === checkpoint.id);
  if (!task) return null;
  const previousStatus = task.status;
  task.status = checkpoint.status === "queued" ? "queued" : checkpoint.status;
  task.startedAt = checkpoint.startedAt || task.startedAt;
  task.finishedAt = checkpoint.finishedAt || task.finishedAt;
  task.detail = checkpoint.output || task.detail;
  if (previousStatus !== task.status) {
    task.events.unshift({
      id: id("agt_evt"),
      timestamp: now(),
      message: `Status changed from ${previousStatus} to ${task.status}.`,
    });
  }
  return task;
}

function syncAgentRuntimeState() {
  db.agentTasks = (db.agentTasks || []).map(normalizeAgentTask).slice(0, 300);
  db.agents = db.agents.map((agent) => {
    const tasks = db.agentTasks.filter((task) => task.agentId === agent.id);
    const active = tasks.find((task) => task.status === "running") || tasks.find((task) => task.status === "queued");
    const running = tasks.filter((task) => task.status === "running").length;
    const queued = tasks.filter((task) => task.status === "queued").length;
    const done = tasks.filter((task) => task.status === "done").length;
    return {
      ...agent,
      status: running ? "running" : queued ? "queued" : "idle",
      load: Math.min(100, running * 48 + queued * 18),
      memoryObjects: done,
      activeTask: active ? active.title : agent.activeTask.replace(/^Executing .+$/, "Waiting for assigned work"),
      taskCounts: { running, queued, done, total: tasks.length },
      recentTasks: tasks.slice(0, 5).map(agentTaskSummary),
    };
  });
}

function materializeWorkflowRun(run) {
  if (!run) return run;
  const elapsedMs = Date.now() - Date.parse(run.startedAt);
  const checkpointMs = 1800;
  let completed = 0;
  run.checkpoints = run.checkpoints.map((checkpoint, index) => {
    const checkpointStartedAt = new Date(Date.parse(run.startedAt) + index * checkpointMs).toISOString();
    const checkpointFinishedAt = new Date(Date.parse(run.startedAt) + (index + 1) * checkpointMs).toISOString();
    let status = checkpoint.status || "queued";
    if (checkpoint.status === "done") {
      completed += 1;
      return {
        ...checkpoint,
        output:
          checkpoint.output && checkpoint.output.startsWith("Completed")
            ? checkpoint.output
            : `Completed ${checkpoint.name}.`,
      };
    }
    if (elapsedMs >= (index + 1) * checkpointMs || run.checkpoints.slice(0, index).every((item) => item.status === "done") && checkpoint.status === "running" && checkpoint.finishedAt) {
      status = "done";
      completed += 1;
    } else if (elapsedMs >= index * checkpointMs) {
      status = "running";
    } else if (checkpoint.status === "running") {
      status = "running";
    } else {
      status = "queued";
    }
    return {
      ...checkpoint,
      status,
      startedAt: status === "queued" ? null : checkpointStartedAt,
      finishedAt: status === "done" ? checkpointFinishedAt : null,
      output:
        status === "done"
          ? checkpoint.output && checkpoint.output.startsWith("Completed")
            ? checkpoint.output
            : `Completed ${checkpoint.name}.`
          : status === "running"
            ? checkpoint.output || `Started ${checkpoint.name}.`
            : checkpoint.output,
    };
  });
  for (const checkpoint of run.checkpoints) {
    syncAgentTaskFromCheckpoint(run, checkpoint);
  }
  run.progress = run.checkpoints.length ? Math.round((completed / run.checkpoints.length) * 100) : 0;
  run.status = completed === run.checkpoints.length ? "completed" : "running";
  run.finishedAt = run.status === "completed" ? run.checkpoints.at(-1)?.finishedAt || now() : null;
  run.durationMs = run.finishedAt ? Date.parse(run.finishedAt) - Date.parse(run.startedAt) : elapsedMs;
  return run;
}

function syncWorkflowRuns() {
  db.workflowRuns = (db.workflowRuns || []).map(materializeWorkflowRun);
  const runCounts = new Map();
  for (const run of db.workflowRuns) {
    runCounts.set(run.workflowId, (runCounts.get(run.workflowId) || 0) + 1);
  }
  db.workflows = db.workflows.map((workflow) => ({ ...workflow, runs: runCounts.get(workflow.id) || workflow.runs || 0 }));
  syncAgentRuntimeState();
}

function createWorkflowRun(workflow, input = {}) {
  const startedAt = now();
  const run = {
    id: id("wf_run"),
    workflowId: workflow.id,
    name: workflow.name,
    trigger: workflow.trigger,
    status: "running",
    progress: 0,
    input,
    startedAt,
    finishedAt: null,
    durationMs: 0,
    checkpoints: workflow.checkpoints.map((checkpoint, index) => ({
      id: id("chk"),
      name: checkpoint,
      status: index === 0 ? "running" : "queued",
      startedAt: index === 0 ? startedAt : null,
      finishedAt: null,
      output: index === 0 ? `Started ${checkpoint} checkpoint.` : null,
    })),
    events: [
      {
        id: id("wf_evt"),
        timestamp: startedAt,
        message: `Workflow run created for ${workflow.name}.`,
        severity: "info",
      },
    ],
  };
  db.workflowRuns.unshift(run);
  db.workflowRuns = db.workflowRuns.slice(0, 80);
  workflow.status = "running";
  workflow.runs = db.workflowRuns.filter((item) => item.workflowId === workflow.id).length;
  for (const checkpoint of run.checkpoints) {
    const agentId = agentForCheckpoint(checkpoint.name);
    createAgentTask({
      agentId,
      workflowRunId: run.id,
      checkpointId: checkpoint.id,
      title: `${workflow.name}: ${checkpoint.name}`,
      detail: checkpoint.output || `Waiting to execute ${checkpoint.name}.`,
      status: checkpoint.status,
      source: "workflow",
    });
  }
  syncAgentRuntimeState();
  return materializeWorkflowRun(run);
}

function sendJson(res, payload, status = 200) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function execFileSafe(command, args, options = {}) {
  return new Promise((resolve) => {
    execFile(command, args, { timeout: 5000, windowsHide: true, ...options }, (error, stdout) => {
      if (error) {
        resolve("");
        return;
      }
      resolve(stdout.toString());
    });
  });
}

async function detectChangedFiles(repoPath) {
  const status = await execFileSafe("git", ["status", "--porcelain"], { cwd: repoPath });
  return status
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) => line.slice(3).trim().replace(/^"|"$/g, ""))
    .map((file) => file.split(" -> ").pop())
    .filter((file) => !ignoredFiles.has(path.basename(file)))
    .filter(Boolean);
}

function traceImpactedFiles(seedFiles, dependencyGraph) {
  const edges = dependencyGraph?.dependencyEdges || [];
  const normalizedSeeds = new Set(seedFiles.map(toIndexPath));
  const impacted = new Set(normalizedSeeds);
  let changed = true;
  while (changed && impacted.size < 120) {
    changed = false;
    for (const edge of edges) {
      if (impacted.has(edge.to) && !impacted.has(edge.from)) {
        impacted.add(edge.from);
        changed = true;
      }
      if (impacted.has(edge.from) && !impacted.has(edge.to)) {
        impacted.add(edge.to);
        changed = true;
      }
    }
  }
  return [...impacted];
}

function moduleRisk(file, dependencyGraph) {
  const module = (dependencyGraph?.modules || []).find((item) => item.path === file);
  if (!module) return 18;
  return Math.min(99, module.risk + module.inbound * 4 + module.outbound * 3);
}

async function createImpactAnalysis({ repoId, files = [], query = "" } = {}) {
  const repo = db.repositories.find((item) => item.id === repoId) || db.repositories[0];
  if (!repo) {
    const error = new Error("No repository indexed for impact analysis");
    error.status = 400;
    throw error;
  }
  const indexedFiles = repo.analysis?.indexedFiles || [];
  const dependencyGraph = repo.analysis?.dependencyGraph || { dependencyEdges: [], modules: [] };
  let changedFiles = files.map(toIndexPath).filter(Boolean);
  if (!changedFiles.length) {
    changedFiles = (await detectChangedFiles(repo.path)).map(toIndexPath);
  }
  if (query && !changedFiles.length) {
    const needle = query.toLowerCase();
    changedFiles = indexedFiles
      .filter((file) => `${file.path} ${file.language} ${file.imports.join(" ")} ${file.definitions.join(" ")} ${file.tags.join(" ")} ${file.searchText || ""}`.toLowerCase().includes(needle))
      .map((file) => toIndexPath(file.path))
      .slice(0, 12);
  }
  if (!changedFiles.length) {
    changedFiles = (dependencyGraph.modules || []).slice(0, 5).map((module) => module.path);
  }
  const impactedFiles = traceImpactedFiles(changedFiles, dependencyGraph);
  const impactedModules = impactedFiles
    .map((file) => ({
      file,
      risk: moduleRisk(file, dependencyGraph),
      reason: changedFiles.includes(file) ? "changed file" : "dependency neighbor",
      tags: indexedFiles.find((item) => toIndexPath(item.path) === file)?.tags || [],
    }))
    .sort((a, b) => b.risk - a.risk)
    .slice(0, 40);
  const maxRisk = impactedModules.reduce((max, item) => Math.max(max, item.risk), 0);
  const recommendedAgents = [
    "Planner",
    impactedModules.some((item) => item.tags.includes("frontend")) ? "Frontend" : null,
    impactedModules.some((item) => item.tags.includes("backend") || item.file.includes("server")) ? "Backend" : null,
    "Architecture",
    maxRisk > 60 ? "Security" : null,
    "Testing",
  ].filter(Boolean);
  const testPlan = [
    "npm.cmd run check",
    impactedModules.some((item) => item.tags.includes("frontend")) ? "Run UI smoke coverage for touched views" : null,
    impactedModules.some((item) => item.tags.includes("backend")) ? "Exercise affected API endpoints with persisted runtime state" : null,
    maxRisk > 70 ? "Run dependency and permission review before merge" : null,
  ].filter(Boolean);
  const analysis = {
    id: id("impact"),
    repoId: repo.id,
    repoName: repo.name,
    repoPath: repo.path,
    query,
    changedFiles,
    impactedFiles,
    impactedModules,
    recommendedAgents,
    testPlan,
    riskScore: Math.min(99, Math.round(maxRisk || changedFiles.length * 8)),
    summary: `${changedFiles.length} changed seed files affect ${impactedFiles.length} indexed files through local dependency and module signals.`,
    createdAt: now(),
  };
  db.impactAnalyses.unshift(analysis);
  db.impactAnalyses = db.impactAnalyses.slice(0, 80);
  db.memory.unshift({
    id: id("mem"),
    title: `Impact analysis: ${repo.name}`,
    body: analysis.summary,
    tags: ["Impact", repo.language, ...recommendedAgents],
    score: 0.86,
    source: "repository-index",
    createdAt: now(),
  });
  recordEvent("Repository Intelligence", `Impact analysis created for ${repo.name}: ${analysis.summary}`, "info", { analysisId: analysis.id });
  await saveDb();
  return analysis;
}

async function createReviewReport({ impactId } = {}) {
  const impact = db.impactAnalyses.find((item) => item.id === impactId) || db.impactAnalyses[0] || (await createImpactAnalysis({}));
  const blockers = impact.riskScore > 75 ? ["High dependency risk requires explicit reviewer sign-off."] : [];
  const report = {
    id: id("review"),
    impactId: impact.id,
    repoId: impact.repoId,
    title: `Engineering review brief for ${impact.repoName}`,
    status: blockers.length ? "needs-review" : "ready",
    riskScore: impact.riskScore,
    summary: impact.summary,
    sections: [
      { title: "Changed surface", body: impact.changedFiles.slice(0, 12).join(", ") || "No changed files detected; using highest-signal modules." },
      { title: "Impacted modules", body: impact.impactedModules.slice(0, 10).map((item) => `${item.file} (${item.risk})`).join(", ") },
      { title: "Recommended agents", body: impact.recommendedAgents.join(", ") },
      { title: "Verification plan", body: impact.testPlan.join("; ") },
      { title: "Merge blockers", body: blockers.join(" ") || "No automatic blockers from current local signals." },
    ],
    createdAt: now(),
  };
  db.reviewReports.unshift(report);
  db.reviewReports = db.reviewReports.slice(0, 80);
  recordEvent("Review Agent", `Generated review brief: ${report.title}`, blockers.length ? "warning" : "info", { reportId: report.id });
  await saveDb();
  return report;
}

function runtimeSnapshot() {
  syncWorkflowRuns();
  const uptimeSeconds = Math.floor((Date.now() - Date.parse(db.meta.runtimeStartedAt)) / 1000);
  const memoryObjects = db.memory.length;
  const openInvestigations = db.incidents.filter((incident) => incident.status !== "resolved").length;
  const architectureRisk = db.architecture.nodes.length
    ? Math.round(db.architecture.nodes.reduce((sum, node) => sum + node.risk, 0) / db.architecture.nodes.length)
    : 0;
  const completedWorkflowRuns = db.workflowRuns.filter((run) => run.status === "completed").length;

  return {
    mode: db.meta.mode,
    desktop: "Tauri-ready shell",
    host: os.hostname(),
    platform: os.platform(),
    uptimeSeconds,
    metrics: {
      repositories: db.repositories.length,
      architectureRisk,
      workflowSuccess: db.workflowRuns.length ? Math.round((completedWorkflowRuns / db.workflowRuns.length) * 100) : 0,
      openInvestigations,
      memoryObjects,
      deployments: db.deployments.length,
      plugins: db.plugins.length,
    },
    services: [
      { name: "Runtime API", status: "online", latencyMs: 18 },
      { name: "Workflow Engine", status: "online", latencyMs: 24 },
      { name: "Agent Runtime", status: "online", latencyMs: 31 },
      { name: "Local Memory Index", status: db.memory.length ? "indexed" : "empty", latencyMs: 47 },
      { name: "Sandbox", status: db.settings.sandboxNetwork ? "networked" : "restricted", latencyMs: 39 },
      { name: "Event Bus", status: "streaming", latencyMs: 12 },
      { name: "Repository Indexer", status: "ready", latencyMs: 27 },
      { name: "Plugin Host", status: "online", latencyMs: 21 },
    ],
  };
}

async function scanRepository(targetPath = root) {
  const absoluteTarget = path.resolve(targetPath);
  let targetStat;
  try {
    targetStat = await fsp.stat(absoluteTarget);
  } catch {
    const error = new Error(`Repository path does not exist: ${absoluteTarget}`);
    error.status = 400;
    throw error;
  }
  if (!targetStat.isDirectory()) {
    const error = new Error(`Repository path must be a directory: ${absoluteTarget}`);
    error.status = 400;
    throw error;
  }
  const files = [];
  const fileIndex = [];
  const languageCounts = {};
  const frameworkSignals = new Set();
  const serviceSignals = new Set();
  const filesByTag = {};

  async function walk(dir, depth = 0) {
    if (depth > 7 || files.length > 1500) return;
    let entries = [];
    try {
      entries = await fsp.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (ignoredDirs.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (["api", "server", "src", "app", "pages", "routes", "workers", "services"].includes(entry.name.toLowerCase())) {
          serviceSignals.add(entry.name);
        }
        await walk(fullPath, depth + 1);
      } else {
        if (ignoredFiles.has(entry.name)) continue;
        const ext = path.extname(entry.name).toLowerCase();
        if (!ext) continue;
        const language = languageByExt[ext] || "Other";
        languageCounts[language] = (languageCounts[language] || 0) + 1;
        const relativePath = path.relative(absoluteTarget, fullPath);
        files.push(relativePath);
        let signals = { imports: [], definitions: [], tags: [] };
        let content = "";
        if (readableExts.has(ext)) {
          content = await safeReadText(fullPath);
          signals = extractCodeSignals(relativePath, content);
          for (const tag of signals.tags) {
            filesByTag[tag] = (filesByTag[tag] || 0) + 1;
          }
        }
        fileIndex.push({
          path: relativePath,
          language,
          imports: signals.imports,
          definitions: signals.definitions,
          tags: signals.tags,
          searchText: content.replace(/\s+/g, " ").slice(0, 100000),
        });

        if (entry.name === "package.json") frameworkSignals.add("Node.js");
        if (entry.name === "next.config.js" || entry.name === "next.config.mjs") frameworkSignals.add("Next.js");
        if (entry.name === "Cargo.toml") frameworkSignals.add("Rust");
        if (entry.name === "docker-compose.yml" || entry.name === "Dockerfile") frameworkSignals.add("Docker");
        if (entry.name === "requirements.txt" || entry.name === "pyproject.toml") frameworkSignals.add("Python");
      }
    }
  }

  await walk(absoluteTarget);
  const dependencyGraph = buildDependencyModel(fileIndex);
  const primaryLanguage =
    Object.entries(languageCounts)
      .filter(([language]) => language !== "Other")
      .sort((a, b) => b[1] - a[1])[0]?.[0] ||
    Object.entries(languageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "Unknown";
  const repo = {
    id: id("repo"),
    name: path.basename(absoluteTarget),
    path: absoluteTarget,
    type: frameworkSignals.has("Next.js") ? "web app" : frameworkSignals.has("Rust") ? "desktop/runtime" : "local repository",
    services: Math.max(1, serviceSignals.size || frameworkSignals.size),
    language: primaryLanguage,
    health: "Indexed",
    risk: Math.min(82, 18 + Math.floor(files.length / 30) + Math.max(0, Object.keys(languageCounts).length - 4) * 4),
    indexedAt: now(),
    analysis: {
      files: files.length,
      languages: languageCounts,
      frameworks: [...frameworkSignals],
      serviceSignals: [...serviceSignals],
      filesByTag,
      indexedFiles: fileIndex,
      dependencyGraph,
      sampleFiles: files.slice(0, 18),
    },
  };

  db.repositories = [repo, ...db.repositories.filter((item) => item.path !== repo.path)].slice(0, 12);
  const repoWorkflow = db.workflows.find((workflow) => workflow.id === "wf_repo_index");
  if (repoWorkflow) repoWorkflow.runs += 1;
  buildArchitectureFromIndex(repo);
  db.memory.unshift({
    id: id("mem"),
    title: `Repository analysis: ${repo.name}`,
    body: `Indexed ${repo.analysis.files} files. Primary language: ${repo.language}. Frameworks: ${repo.analysis.frameworks.join(", ") || "none detected"}.`,
    tags: ["Repository", repo.language, "Architecture"],
    score: 0.9,
    source: "repository-index",
    createdAt: now(),
  });
  for (const indexedFile of fileIndex.filter((file) => file.definitions.length || file.imports.length).slice(0, 20)) {
    db.memory.unshift({
      id: id("mem"),
      title: `Code map: ${indexedFile.path}`,
      body: `Definitions: ${indexedFile.definitions.slice(0, 8).join(", ") || "none"}. Imports: ${indexedFile.imports.slice(0, 8).join(", ") || "none"}.`,
      tags: ["Code", indexedFile.language, ...indexedFile.tags],
      score: 0.75,
      source: "repository-index",
      createdAt: now(),
    });
  }
  db.memory = db.memory.slice(0, 200);
  recordEvent(
    "Repository Indexer",
    `Indexed ${repo.name}: ${repo.analysis.files} files, ${dependencyGraph.dependencyEdges.length} local dependency edges.`,
    "info",
    {
      files: repo.analysis.files,
      languages: repo.analysis.languages,
      dependencies: dependencyGraph.dependencyEdges.length,
      externalPackages: dependencyGraph.externalPackages.slice(0, 8),
    },
  );
  await saveDb();
  return repo;
}

function analyticsSnapshot() {
  const latestRepo = db.repositories[0];
  const indexedFiles = latestRepo?.analysis?.indexedFiles || [];
  const languageEntries = Object.entries(latestRepo?.analysis?.languages || {}).sort((a, b) => b[1] - a[1]);
  const hotspots = indexedFiles
    .map((file) => ({
      module: file.path,
      risk: Math.min(
        99,
        file.imports.length * 6 +
          file.definitions.length * 3 +
          file.tags.length * 8 +
          (latestRepo?.analysis?.dependencyGraph?.dependencyEdges || []).filter((edge) => edge.from === file.path || edge.to === file.path).length * 4,
      ),
    }))
    .filter((item) => item.risk > 0)
    .sort((a, b) => b.risk - a.risk)
    .slice(0, 8);
  const technicalDebt = [
    { area: "Files indexed", score: latestRepo?.analysis?.files || 0, trend: "measured" },
    { area: "Languages detected", score: languageEntries.length, trend: "measured" },
    { area: "Tagged architecture files", score: Object.values(latestRepo?.analysis?.filesByTag || {}).reduce((sum, count) => sum + count, 0), trend: "measured" },
    { area: "Local dependency edges", score: latestRepo?.analysis?.dependencyGraph?.dependencyEdges.length || 0, trend: "measured" },
    { area: "External packages referenced", score: latestRepo?.analysis?.dependencyGraph?.externalPackages.length || 0, trend: "measured" },
    { area: "Import-heavy modules", score: hotspots.filter((item) => item.risk > 50).length, trend: "measured" },
  ];

  return {
    deploymentFrequency: db.deployments.length ? `${db.deployments.length} recorded` : "No deployment integration connected",
    changeFailureRate: db.incidents.length ? `${Math.round((db.incidents.length / Math.max(1, db.deployments.length)) * 100)}% observed` : "No incident/deployment baseline",
    meanTimeToRecovery: "Connect incident source",
    workflowLatencyP95: db.workflowRuns.length ? `${Math.max(...db.workflowRuns.map((item) => item.durationMs || 0))}ms max recorded` : "No workflow runs yet",
    languageMix: languageEntries,
    technicalDebt,
    hotspots,
  };
}

function serveStatic(req, res) {
  const requestPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  const safePath = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = path.normalize(path.join(root, safePath));

  if (!filePath.startsWith(root)) {
    sendJson(res, { error: "Forbidden" }, 403);
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendJson(res, { error: "Not found" }, 404);
      return;
    }

    res.writeHead(200, {
      "Content-Type": mime[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  });
}

function streamEvents(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  let heartbeat = 0;
  const timer = setInterval(async () => {
    const event = recordEvent(
      "Event Bus",
      `Runtime heartbeat ${heartbeat + 1}: ${db.repositories.length} repos, ${db.memory.length} memory objects, ${db.executions.length} executions.`,
      "info",
      runtimeSnapshot().metrics,
    );
    await saveDb();
    res.write("event: veltrix\n");
    res.write(`data: ${JSON.stringify(event)}\n\n`);
    heartbeat += 1;
  }, 2200);

  req.on("close", () => clearInterval(timer));
}

async function routeApi(req, res, url) {
  if (url.pathname === "/api/health") {
    sendJson(res, { ok: true, service: db.meta.product, state: runtimeSnapshot().metrics });
    return true;
  }

  if (url.pathname === "/api/bootstrap") {
    syncWorkflowRuns();
    sendJson(res, {
      runtime: runtimeSnapshot(),
      repositories: db.repositories,
      agents: db.agents,
      agentTasks: db.agentTasks.slice(0, 80).map(agentTaskSummary),
      workflows: db.workflows,
      workflowRuns: db.workflowRuns.slice(0, 30),
      incidents: db.incidents,
      deployments: db.deployments,
      memory: db.memory,
      plugins: db.plugins,
      architecture: db.architecture,
      impactAnalyses: db.impactAnalyses.slice(0, 30),
      reviewReports: db.reviewReports.slice(0, 30),
      analytics: analyticsSnapshot(),
      settings: db.settings,
      events: db.events.slice(0, 25),
      executions: db.executions.slice(0, 40),
    });
    return true;
  }

  if (url.pathname === "/api/runtime") {
    sendJson(res, runtimeSnapshot());
    return true;
  }

  if (url.pathname === "/api/repositories") {
    sendJson(res, { repositories: db.repositories });
    return true;
  }

  if (url.pathname === "/api/repositories/scan" && req.method === "POST") {
    const body = await readBody(req);
    const repo = await scanRepository(body.path || root);
    sendJson(res, { ok: true, repository: repo, repositories: db.repositories });
    return true;
  }

  if (url.pathname === "/api/agents") {
    syncAgentRuntimeState();
    sendJson(res, { agents: db.agents, tasks: db.agentTasks.slice(0, 80).map(agentTaskSummary) });
    return true;
  }

  if (url.pathname === "/api/agents/coordinate" && req.method === "POST") {
    const body = await readBody(req);
    const goal = body.goal || "Engineering task";
    const plan = db.agents.slice(0, 6).map((agent, index) => {
      const task = createAgentTask({
        agentId: agent.id,
        title: `${agent.name} Agent handles ${goal.toLowerCase()} context`,
        detail: `Assigned from manual coordination goal: ${goal}.`,
        status: index < 2 ? "running" : "queued",
        source: "manual",
      });
      return {
        id: task.id,
        agent: agent.name,
        step: index + 1,
        task: task.title,
        status: task.status,
      };
    });
    syncAgentRuntimeState();
    recordEvent("Planner Agent", `Coordinated ${plan.length} persisted agent tasks for: ${goal}`, "info", { plan });
    await saveDb();
    sendJson(res, { ok: true, goal, plan, tasks: db.agentTasks.slice(0, 80).map(agentTaskSummary), agents: db.agents });
    return true;
  }

  if (url.pathname === "/api/agents/tasks") {
    syncAgentRuntimeState();
    sendJson(res, { tasks: db.agentTasks.slice(0, 120).map(agentTaskSummary) });
    return true;
  }

  const agentTaskMatch = url.pathname.match(/^\/api\/agents\/tasks\/([^/]+)$/);
  if (agentTaskMatch) {
    syncAgentRuntimeState();
    const task = db.agentTasks.find((item) => item.id === agentTaskMatch[1]);
    if (!task) {
      sendJson(res, { error: "Agent task not found" }, 404);
      return true;
    }
    sendJson(res, { task: agentTaskSummary(task) });
    return true;
  }

  const agentTaskActionMatch = url.pathname.match(/^\/api\/agents\/tasks\/([^/]+)\/(advance|fail|retry|tool-run)$/);
  if (agentTaskActionMatch && req.method === "POST") {
    const task = db.agentTasks.find((item) => item.id === agentTaskActionMatch[1]);
    if (!task) {
      sendJson(res, { error: "Agent task not found" }, 404);
      return true;
    }
    normalizeAgentTask(task);
    const action = agentTaskActionMatch[2];
    let execution = null;
    if (action === "advance") {
      const nextStatus = task.status === "queued" ? "running" : "done";
      transitionAgentTask(task, nextStatus, nextStatus === "running" ? "Agent started task execution." : "Agent completed assigned task.");
    }
    if (action === "fail") {
      transitionAgentTask(task, "failed", "Agent task marked failed during execution.");
    }
    if (action === "retry") {
      task.attempts += 1;
      task.finishedAt = null;
      transitionAgentTask(task, "running", `Retry attempt ${task.attempts} started.`);
    }
    if (action === "tool-run") {
      const body = await readBody(req);
      transitionAgentTask(task, "running", "Agent requested sandbox tool execution.");
      execution = createToolExecution({ task, command: body.command || "npm test -- --changed", tool: body.tool || "sandbox.exec" });
    }
    syncAgentRuntimeState();
    await saveDb();
    sendJson(res, { ok: true, task: agentTaskSummary(task), tasks: db.agentTasks.slice(0, 120).map(agentTaskSummary), agents: db.agents, execution });
    return true;
  }

  if (url.pathname === "/api/architecture") {
    sendJson(res, db.architecture);
    return true;
  }

  if (url.pathname === "/api/repositories/impact" && req.method === "POST") {
    const analysis = await createImpactAnalysis(await readBody(req));
    sendJson(res, { ok: true, analysis, impactAnalyses: db.impactAnalyses.slice(0, 30), memory: db.memory.slice(0, 80) });
    return true;
  }

  if (url.pathname === "/api/repositories/impact") {
    sendJson(res, { impactAnalyses: db.impactAnalyses.slice(0, 80) });
    return true;
  }

  if (url.pathname === "/api/reviews/generate" && req.method === "POST") {
    const report = await createReviewReport(await readBody(req));
    sendJson(res, { ok: true, report, reviewReports: db.reviewReports.slice(0, 30), impactAnalyses: db.impactAnalyses.slice(0, 30) });
    return true;
  }

  if (url.pathname === "/api/reviews") {
    sendJson(res, { reviewReports: db.reviewReports.slice(0, 80) });
    return true;
  }

  if (url.pathname === "/api/workflows") {
    syncWorkflowRuns();
    sendJson(res, { workflows: db.workflows, runs: db.workflowRuns.slice(0, 30) });
    return true;
  }

  if (url.pathname === "/api/workflows/run" && req.method === "POST") {
    const body = await readBody(req);
    const workflow = db.workflows.find((item) => item.id === body.workflowId) || db.workflows[0];
    const run = createWorkflowRun(workflow, body.input || {});
    recordEvent("Workflow Engine", `Started workflow run: ${workflow.name}`, "info", run);
    await saveDb();
    sendJson(res, { ok: true, workflow: run, run, runs: db.workflowRuns.slice(0, 30), agentTasks: db.agentTasks.slice(0, 80).map(agentTaskSummary), state: runtimeSnapshot().metrics });
    return true;
  }

  if (url.pathname === "/api/workflows/runs") {
    syncWorkflowRuns();
    await saveDb();
    sendJson(res, { runs: db.workflowRuns.slice(0, 80) });
    return true;
  }

  const workflowRunMatch = url.pathname.match(/^\/api\/workflows\/runs\/([^/]+)$/);
  if (workflowRunMatch) {
    const run = materializeWorkflowRun(db.workflowRuns.find((item) => item.id === workflowRunMatch[1]));
    if (!run) {
      sendJson(res, { error: "Workflow run not found" }, 404);
      return true;
    }
    await saveDb();
    sendJson(res, { run });
    return true;
  }

  const workflowAdvanceMatch = url.pathname.match(/^\/api\/workflows\/runs\/([^/]+)\/advance$/);
  if (workflowAdvanceMatch && req.method === "POST") {
    const run = db.workflowRuns.find((item) => item.id === workflowAdvanceMatch[1]);
    if (!run) {
      sendJson(res, { error: "Workflow run not found" }, 404);
      return true;
    }
    const current = run.checkpoints.find((checkpoint) => checkpoint.status === "running") || run.checkpoints.find((checkpoint) => checkpoint.status === "queued");
    if (current) {
      current.status = "done";
      current.finishedAt = now();
      current.output = `Completed ${current.name}.`;
      const next = run.checkpoints.find((checkpoint) => checkpoint.status === "queued");
      if (next) {
        next.status = "running";
        next.startedAt = now();
        next.output = `Started ${next.name}.`;
      }
      run.events.unshift({ id: id("wf_evt"), timestamp: now(), message: `Advanced checkpoint: ${current.name}.`, severity: "info" });
    }
    materializeWorkflowRun(run);
    syncAgentRuntimeState();
    recordEvent("Workflow Engine", `Advanced workflow run: ${run.name}`, "info", run);
    await saveDb();
    sendJson(res, { ok: true, run, agentTasks: db.agentTasks.slice(0, 80).map(agentTaskSummary) });
    return true;
  }

  if (url.pathname === "/api/incidents") {
    sendJson(res, { incidents: db.incidents });
    return true;
  }

  if (url.pathname === "/api/incidents/simulate" && req.method === "POST") {
    const incident = {
      id: id("inc"),
      title: "Checkout error spike",
      severity: "medium",
      status: "investigating",
      service: "Gateway",
      confidence: 64,
      startedAt: now(),
      summary: "Local incident record created from the runtime simulator.",
    };
    db.incidents.unshift(incident);
    recordEvent("Incident Center", `Created incident: ${incident.title}`, "warning", incident);
    await saveDb();
    sendJson(res, { ok: true, incident, incidents: db.incidents });
    return true;
  }

  if (url.pathname === "/api/deployments") {
    sendJson(res, { deployments: db.deployments });
    return true;
  }

  if (url.pathname === "/api/analytics") {
    sendJson(res, analyticsSnapshot());
    return true;
  }

  if (url.pathname === "/api/memory/search") {
    const query = (url.searchParams.get("q") || "").toLowerCase();
    const memoryResults = db.memory.filter((item) => `${item.title} ${item.body} ${item.tags.join(" ")}`.toLowerCase().includes(query));
    const fileResults = db.repositories.flatMap((repo) =>
      (repo.analysis?.indexedFiles || [])
        .filter((file) => `${file.path} ${file.language} ${file.imports.join(" ")} ${file.definitions.join(" ")} ${file.tags.join(" ")} ${file.searchText || ""}`.toLowerCase().includes(query))
        .map((file) => ({
          id: `${repo.id}:${file.path}`,
          title: file.path,
          body: `Language: ${file.language}. Definitions: ${file.definitions.slice(0, 10).join(", ") || "none"}. Imports: ${file.imports.slice(0, 10).join(", ") || "none"}.`,
          tags: ["File", file.language, ...file.tags],
          score: 0.82,
          source: "file-index",
        })),
    );
    sendJson(res, { query, results: [...memoryResults, ...fileResults].slice(0, 50) });
    return true;
  }

  if (url.pathname === "/api/plugins") {
    sendJson(res, { plugins: db.plugins });
    return true;
  }

  if (url.pathname === "/api/settings" && req.method === "PATCH") {
    Object.assign(db.settings, await readBody(req));
    recordEvent("Settings", "Runtime settings updated.", "info", db.settings);
    await saveDb();
    sendJson(res, { ok: true, settings: db.settings });
    return true;
  }

  if (url.pathname === "/api/settings") {
    sendJson(res, db.settings);
    return true;
  }

  if (url.pathname === "/api/executions") {
    sendJson(res, { executions: db.executions.slice(0, 120) });
    return true;
  }

  if (url.pathname === "/api/sandbox/run" && req.method === "POST") {
    const body = await readBody(req);
    const task = body.agentTaskId ? db.agentTasks.find((item) => item.id === body.agentTaskId) : null;
    if (task) normalizeAgentTask(task);
    const execution = createToolExecution({ task, command: body.command || "npm test -- --changed", tool: body.tool || "sandbox.exec" });
    syncAgentRuntimeState();
    await saveDb();
    sendJson(res, { ok: true, execution, tasks: db.agentTasks.slice(0, 120).map(agentTaskSummary), executions: db.executions.slice(0, 40) });
    return true;
  }

  if (url.pathname === "/api/events") {
    streamEvents(req, res);
    return true;
  }

  return false;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname.startsWith("/api/") && (await routeApi(req, res, url))) return;
    serveStatic(req, res);
  } catch (error) {
    sendJson(res, { error: error.message || "Internal server error" }, error.status || 500);
  }
});

ensureDb().then(async () => {
  if (!db.repositories.length || !db.repositories[0].analysis?.indexedFiles) {
    await scanRepository(root);
  }
  recordEvent("Runtime API", "Veltrix local runtime initialized.", "info");
  saveDb();
  server.listen(port, () => {
    console.log(`Veltrix running at http://localhost:${port}`);
  });
});
