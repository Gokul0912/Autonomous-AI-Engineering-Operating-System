# Veltrix

Veltrix is a local console for reviewing code changes before they go out.

It scans a repository, works out which files are affected by the current change set, records task and tool activity, and turns the result into a short review brief. The app is intentionally local-first: runtime state lives in `.veltrix/runtime-db.json`, and the default setup does not need a hosted service.

## Why it exists

Small teams often keep change context spread across terminal output, pull request notes, screenshots, and memory. Veltrix keeps the useful parts together:

- what changed
- what else may be affected
- which checks were recorded
- which task records were created
- what a reviewer should look at first

The current app is a working local product surface, not a marketing shell. The main flow is:

```text
Scan -> Impact -> Assign -> Review
```

## Run it

```powershell
npm.cmd run start
```

Then open:

```text
http://localhost:4173
```

Check syntax:

```powershell
npm.cmd run check
```

Health check:

```powershell
Invoke-RestMethod -Uri http://localhost:4173/api/health
```

## Product Flow

### Scan

Indexes a local repository path. If no path is entered, Veltrix scans the current project folder.

The scanner records readable source files, languages, imports, definitions, tags, dependency edges, and package references.

### Impact

Reads the Git working tree with:

```text
git status --porcelain
```

It uses those files as the starting point, traces nearby dependency edges, scores risk, recommends review agents, and creates a verification plan.

### Assign

Creates persisted task records for the work queue. Tasks keep status, attempts, permissions, logs, and linked tool runs.

### Review

Generates a reviewer-facing brief with changed files, impacted modules, recommended agents, verification steps, and merge blockers.

## What Is Stored

Veltrix writes runtime data to:

```text
.veltrix/runtime-db.json
```

That file contains scan results, memory records, workflow runs, task records, execution audit entries, impact analyses, review briefs, settings, and event history.

## Main Files

```text
index.html        App shell and product layout
styles.css        Responsive interface styling
app.js            Client rendering and API calls
server.js         Local API, scanner, impact analysis, tasks, review briefs
src-tauri/        Desktop shell scaffold
.veltrix/         Local runtime data, created at runtime
```

## API Surface

```text
GET  /api/bootstrap
GET  /api/health
GET  /api/runtime

POST /api/repositories/scan
POST /api/repositories/impact
GET  /api/repositories/impact

POST /api/agents/coordinate
GET  /api/agents/tasks
GET  /api/agents/tasks/:id
POST /api/agents/tasks/:id/advance
POST /api/agents/tasks/:id/fail
POST /api/agents/tasks/:id/retry
POST /api/agents/tasks/:id/tool-run

POST /api/reviews/generate
GET  /api/reviews

POST /api/sandbox/run
GET  /api/executions

GET  /api/memory/search?q=term
GET  /api/settings
PATCH /api/settings
GET  /api/events
```

## Current Boundaries

Veltrix does not apply code patches by itself, run real containers, or sync data to a hosted workspace. Tool execution is recorded as an audit object through the local runtime. Those boundaries are deliberate for this version; the UI only promotes the parts that are actually usable today.
