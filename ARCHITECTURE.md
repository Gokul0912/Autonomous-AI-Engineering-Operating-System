# Architecture

Veltrix runs as a local service with a browser console. The runtime keeps its state in a JSON database so the product can be used without external infrastructure during development.

## Layers

```text
Console UI
  -> Local API
    -> Repository scanner
    -> Dependency graph
    -> Workflow store
    -> Task store
    -> Execution audit
    -> Impact analysis
    -> Review reports
```

## Runtime

The Node.js server owns all durable state and exposes the HTTP API used by the console. It also serves the static frontend.

The runtime database is:

```text
.veltrix/runtime-db.json
```

This file contains repositories, indexed memory, workflow runs, task records, tool executions, impact analyses, review reports, settings, and events.

## Repository Index

The scanner walks a local directory, skips dependency/build folders, reads supported source files, and extracts lightweight code signals. It records local import edges and external package references. The architecture graph is generated from that index.

## Workflows and Tasks

Workflow definitions create persistent runs. Each checkpoint creates a task record with an owner, status, permissions, logs, attempts, and optional tool executions. Task state is updated through explicit API actions.

## Impact and Review

Impact analysis starts from Git working-tree changes when available. It traces nearby files through dependency edges, assigns risk, recommends workers, and builds a verification plan. Review reports are generated from the latest impact analysis.

## Desktop Shell

The `src-tauri` folder contains the desktop shell configuration. The current app can run in a browser during development and can later be packaged as a local desktop client.
