# Veltrix Architecture

## Layers

Veltrix is designed as a desktop application with an embedded local backend runtime.

## Desktop Layer

- Tauri shell
- Filesystem access
- Secure permission prompts
- Local runtime launch
- Terminal and sandbox bridge
- Web dashboard rendering

## Runtime Layer

- Runtime API
- Repository Intelligence Engine
- Multi-Agent Runtime
- Durable Workflow Engine
- Engineering Memory System
- Event Streaming System
- Sandbox Execution Recorder
- Plugin Host

## Data Layer

Current implementation:

- `.veltrix/runtime-db.json`

Production target:

- PostgreSQL for durable entities
- Redis Streams or NATS for events
- Qdrant for vector memory
- Local filesystem object storage for execution artifacts

## AI Layer

Production target:

- Ollama local models
- Qwen and DeepSeek coding models
- Local embedding models
- Agent tool registry
- Permission-scoped execution

## Service Map

```mermaid
flowchart LR
  Desktop["Desktop Shell"] --> API["Runtime API"]
  API --> Repo["Repository Indexer"]
  API --> Agents["Agent Runtime"]
  API --> Workflows["Workflow Engine"]
  API --> Memory["Engineering Memory"]
  API --> Sandbox["Sandbox"]
  Repo --> Memory
  Agents --> Memory
  Workflows --> Sandbox
  Sandbox --> Events["Event Bus"]
  Events --> Workflows
  Events --> Desktop
  API --> Plugins["Plugin Host"]
```

