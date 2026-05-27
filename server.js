const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const root = __dirname;
const port = Number(process.env.PORT || 4173);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const state = {
  repositories: 12,
  architectureRisk: 42,
  workflowSuccess: 96,
  openInvestigations: 4,
  memoryObjects: 38200,
  activeWorkflow: "OAuth rollout analysis",
  runtimeStartedAt: new Date().toISOString(),
};

const repositories = [
  { name: "veltrix-platform", type: "monorepo", services: 18, language: "TypeScript", health: "Indexing", risk: 42 },
  { name: "identity-runtime", type: "service", services: 5, language: "Go", health: "Degraded", risk: 61 },
  { name: "deployment-orchestrator", type: "service", services: 7, language: "Python", health: "Operational", risk: 28 },
  { name: "desktop-shell", type: "client", services: 3, language: "Rust + React", health: "Operational", risk: 19 },
];

const agents = [
  { name: "Planner", status: "Coordinating", load: 73, permission: "Plan + delegate" },
  { name: "Architecture", status: "Scanning drift", load: 62, permission: "Read architecture graph" },
  { name: "Backend", status: "Validating APIs", load: 81, permission: "Patch services" },
  { name: "Security", status: "Checking auth", load: 67, permission: "Read secrets metadata" },
  { name: "DevOps", status: "Watching deployments", load: 58, permission: "Read CI/CD + Docker" },
  { name: "Testing", status: "Generating tests", load: 49, permission: "Run sandbox tests" },
];

const architecture = {
  nodes: ["Desktop Shell", "Runtime API", "Workflow Engine", "Agent Runtime", "Vector DB", "Sandbox", "Event Bus", "Repository Indexer"],
  edges: [
    ["Desktop Shell", "Runtime API"],
    ["Runtime API", "Workflow Engine"],
    ["Runtime API", "Agent Runtime"],
    ["Agent Runtime", "Vector DB"],
    ["Workflow Engine", "Sandbox"],
    ["Repository Indexer", "Vector DB"],
    ["Event Bus", "Workflow Engine"],
    ["Sandbox", "Event Bus"],
  ],
};

const memory = [
  { title: "ADR-014: Redis session cache", body: "Redis was introduced to remove database pressure from auth session reads during onboarding campaigns.", tags: ["Redis", "Auth", "ADR"] },
  { title: "Incident INC-182", body: "Auth latency rose after deployment 2026.05.19. Rollback reduced P95 from 1.8s to 410ms.", tags: ["Incident", "Deployment", "Rollback"] },
  { title: "PR #4831 OAuth groundwork", body: "Added provider abstraction but left refresh-token rotation coverage for a follow-up.", tags: ["PR", "OAuth", "Testing"] },
  { title: "Architecture boundary note", body: "Gateway owns request authentication; product services consume signed identity envelopes.", tags: ["Gateway", "Boundaries", "Security"] },
];

const eventTemplates = [
  ["Repository Indexer", "Parsed modules, services, route handlers, and database access paths.", "info"],
  ["Workflow Engine", "Checkpoint saved for OAuth rollout analysis.", "info"],
  ["Sandbox", "Recorded isolated test execution with replay artifact.", "info"],
  ["Architecture Agent", "Detected boundary pressure between gateway and billing.", "warning"],
  ["Security Agent", "Queued refresh-token rotation validation.", "warning"],
  ["Memory System", "Linked incident INC-182 to auth deployment history.", "info"],
];

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

function runtimeSnapshot() {
  const uptimeSeconds = Math.floor((Date.now() - Date.parse(state.runtimeStartedAt)) / 1000);
  return {
    mode: "local-first",
    desktop: "Tauri-ready shell",
    host: os.hostname(),
    platform: os.platform(),
    uptimeSeconds,
    services: [
      { name: "Runtime API", status: "online", latencyMs: 18 },
      { name: "Workflow Engine", status: "online", latencyMs: 24 },
      { name: "Agent Runtime", status: "online", latencyMs: 31 },
      { name: "Vector DB", status: "warming", latencyMs: 47 },
      { name: "Sandbox", status: "restricted", latencyMs: 39 },
      { name: "Event Bus", status: "streaming", latencyMs: 12 },
    ],
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

  let index = 0;
  const timer = setInterval(() => {
    const [source, message, severity] = eventTemplates[index % eventTemplates.length];
    const payload = {
      id: Date.now(),
      source,
      message,
      severity,
      timestamp: new Date().toISOString(),
    };
    res.write("event: veltrix\n");
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
    index += 1;
  }, 2200);

  req.on("close", () => clearInterval(timer));
}

async function routeApi(req, res, url) {
  if (url.pathname === "/api/health") {
    sendJson(res, { ok: true, service: "Veltrix AI Engineering OS", state });
    return true;
  }

  if (url.pathname === "/api/runtime") {
    sendJson(res, runtimeSnapshot());
    return true;
  }

  if (url.pathname === "/api/repositories") {
    sendJson(res, { repositories });
    return true;
  }

  if (url.pathname === "/api/agents") {
    sendJson(res, { agents });
    return true;
  }

  if (url.pathname === "/api/architecture") {
    sendJson(res, architecture);
    return true;
  }

  if (url.pathname === "/api/memory/search") {
    const query = (url.searchParams.get("q") || "").toLowerCase();
    const results = memory.filter((item) => `${item.title} ${item.body} ${item.tags.join(" ")}`.toLowerCase().includes(query));
    sendJson(res, { query, results: results.length ? results : memory });
    return true;
  }

  if (url.pathname === "/api/workflows/run" && req.method === "POST") {
    state.architectureRisk = Math.max(18, state.architectureRisk - 2);
    state.workflowSuccess = Math.min(99, state.workflowSuccess + 1);
    sendJson(res, {
      ok: true,
      message: "Workflow started",
      workflow: {
        id: `wf_${Date.now()}`,
        name: state.activeWorkflow,
        checkpoints: ["scan", "index", "impact", "risk", "plan"],
        status: "running",
      },
      state,
    });
    return true;
  }

  if (url.pathname === "/api/sandbox/run" && req.method === "POST") {
    const body = await readBody(req);
    sendJson(res, {
      ok: true,
      execution: {
        id: `exec_${Date.now()}`,
        command: body.command || "npm test -- --changed",
        isolation: "container-policy:restricted",
        status: "recorded",
        replayable: true,
        durationMs: 1280,
      },
    });
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
  if (url.pathname.startsWith("/api/") && (await routeApi(req, res, url))) return;
  serveStatic(req, res);
});

server.listen(port, () => {
  console.log(`Veltrix running at http://localhost:${port}`);
});
