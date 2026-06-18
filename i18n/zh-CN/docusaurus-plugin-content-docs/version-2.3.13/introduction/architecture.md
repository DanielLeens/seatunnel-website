---
sidebar_position: 2
---

# 架构设计

## 概述

SeaTunnel 是一个分布式数据集成平台，采用插件化架构。连接器层与执行引擎解耦，同一套连接器可在不同引擎上运行。

```mermaid
flowchart LR
    config["作业<br/>配置"]
    core["SeaTunnel 核心层<br/>解析器 / 协调器 / 调度器"]
    engine["执行引擎<br/>Zeta / Flink / Spark"]

    subgraph pipeline["连接器管道"]
        direction LR
        source["Source<br/>数据源连接器"] --> transform["Transform<br/>可选"] --> sink["Sink<br/>目标连接器"]
    end

    config --> core --> engine --> source

    classDef controlNode fill:#0f1d33,stroke:#5db8e2,stroke-width:2px,color:#f8fbff;
    classDef coreNode fill:#10223a,stroke:#5db8e2,stroke-width:2px,color:#f8fbff;
    classDef connectorNode fill:#0c2530,stroke:#2dd4bf,stroke-width:2px,color:#f8fbff;
    classDef engineNode fill:#1f1a34,stroke:#8d7cf6,stroke-width:2px,color:#f8fbff;

    class config controlNode;
    class core coreNode;
    class engine engineNode;
    class source,transform,sink connectorNode;
    style pipeline fill:#081425,stroke:#5db8e2,stroke-width:1.5px,color:#f8fbff;
    linkStyle default stroke:#8ab4f8,stroke-width:2px;
```

## 核心组件

### 1. Connector API

与引擎无关的统一 API，用于开发 Source、Transform、Sink 连接器。

| 组件 | 说明 |
|------|------|
| **Source** | 从外部系统读取数据（数据库、文件、消息队列） |
| **Transform** | 数据转换（字段映射、过滤、类型转换） |
| **Sink** | 将数据写入目标系统 |

### 2. 执行引擎

| 引擎 | 适用场景 |
|------|---------|
| **SeaTunnel Engine (Zeta)** | 数据同步、CDC、低资源消耗 |
| **Apache Flink** | 复杂流处理、已有 Flink 基础设施 |
| **Apache Spark** | 大规模批处理、已有 Spark 基础设施 |

### 3. 翻译层

将 SeaTunnel 统一 API 转换为引擎特定实现，实现连接器跨引擎复用。

## 数据流

```mermaid
flowchart LR
    source[Source] --> split[分片] --> reader[Reader] --> transform[Transform] --> writer[Writer] --> sink[Sink]
    reader -. 快照 .-> state["Checkpoint / 状态"]
    writer -. 快照 .-> state
    state --> tolerance[容错机制]

    classDef data fill:#0c2530,stroke:#2dd4bf,stroke-width:2px,color:#f8fbff;
    classDef runtime fill:#10223a,stroke:#5db8e2,stroke-width:2px,color:#f8fbff;
    classDef guard fill:#1f1a34,stroke:#8d7cf6,stroke-width:2px,color:#f8fbff;

    class source,split,sink data;
    class reader,transform,writer runtime;
    class state,tolerance guard;
    linkStyle default stroke:#8ab4f8,stroke-width:2px;
```

**核心特性：**
- 基于分片的并行读取
- 分布式快照实现精确一次语义
- 自动故障转移和恢复

## 模块结构

| 模块 | 职责 |
|------|------|
| `seatunnel-api` | 核心 API 定义 |
| `seatunnel-connectors-v2` | Source 与 Sink 连接器 |
| `seatunnel-transforms-v2` | Transform 插件 |
| `seatunnel-engine` | SeaTunnel Engine (Zeta) |
| `seatunnel-translation` | Flink 与 Spark 引擎适配器 |
| `seatunnel-core` | 作业提交与 CLI |
| `seatunnel-formats` | 数据格式处理 |
| `seatunnel-e2e` | 端到端测试 |

## 作业执行流程

1. **解析** - 读取并验证作业配置
2. **规划** - 生成带并行度的执行计划
3. **调度** - 将任务分发到 Worker 节点
4. **执行** - 运行 Source → Transform → Sink 管道
5. **监控** - 跟踪进度、指标和检查点

## 下一步

- [引擎对比](../engines/overview.md)
- [快速开始](../getting-started/locally/quick-start-seatunnel-engine.md)
- [连接器列表](../connectors/overview.md)
