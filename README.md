# Veltrix AI Engineering OS

Veltrix is a local-first autonomous AI engineering operating system for repository intelligence, multi-agent orchestration, workflow execution, architecture memory, incident response, deployment analysis, and engineering analytics.

This repository contains the first complete product foundation:

- Desktop-ready Tauri shell scaffold
- Local Node.js runtime API
- Persistent local runtime database in `.veltrix/runtime-db.json`
- Repository scanner and framework/language detection
- Multi-agent runtime with persisted task records
- Durable workflow simulation with checkpoints
- Incident response center
- Deployment intelligence
- Engineering memory retrieval
- Plugin and settings surfaces
- Live event stream and bottom runtime console

## Run

```powershell
npm.cmd run start
```

Open:

```text
http://localhost:4173
```

Health check:

```powershell
Invoke-RestMethod -Uri http://localhost:4173/api/health
```

## Scripts

```text
npm.cmd run start        Start local runtime and dashboard
npm.cmd run check        Syntax-check backend and frontend
npm.cmd run desktop:dev  Run the Tauri shell after Tauri CLI is installed
```

## Runtime API

```text
GET  /api/bootstrap
GET  /api/runtime
GET  /api/repositories
POST /api/repositories/scan
GET  /api/agents
GET  /api/agents/tasks
POST /api/agents/coordinate
GET  /api/architecture
GET  /api/workflows
POST /api/workflows/run
GET  /api/workflows/runs
GET  /api/workflows/runs/:id
POST /api/workflows/runs/:id/advance
GET  /api/incidents
POST /api/incidents/simulate
GET  /api/deployments
GET  /api/analytics
GET  /api/memory/search?q=redis
GET  /api/plugins
GET  /api/settings
PATCH /api/settings
POST /api/sandbox/run
GET  /api/events
```

## Product Architecture

Veltrix is designed as:

```text
Desktop Shell
  -> Local Runtime API
    -> Repository Indexer
    -> Agent Runtime
    -> Workflow Engine
    -> Event Bus
    -> Engineering Memory
    -> Sandbox Execution
    -> Plugin Host
```

The current version uses a zero-dependency local runtime so it can run immediately. Subsystems that are not connected yet report honest empty or unconfigured states. The next production phase can attach Docker, PostgreSQL, Redis, Qdrant, Ollama, and LangGraph without changing the product model.

## Repository Intelligence

Repository scans accept a local path, validate that it exists, index readable source files, extract imports/definitions/tags, resolve local import edges where possible, summarize external package references, and generate the architecture graph from measured module relationships.

## Workflow Execution

Workflow runs are persisted with checkpoint state, progress, timing, run events, and inspection APIs. The dashboard can start runs from workflow definitions, show run history, inspect a selected execution, and manually advance checkpoints.

## Agent Execution

Workflow checkpoints now create persisted agent tasks. Each task records the assigned agent, source workflow run, checkpoint, status, timing, and event history. Agent cards derive their load and active work from the task queue, and the Agents view includes the live execution queue. Manual agent coordination also creates persisted tasks instead of temporary UI-only plans.
