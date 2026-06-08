---
slug: apache-seatunnel-core-concept-data-flow
title: "Deep Dive! Apache SeaTunnel: Core Concept of Data Flow"
tags: [SeaTunnel, Architecture, "Data Flow"]
---

# Deep Dive! Apache SeaTunnel: Core Concept of Data Flow

---

In the field of data integration and synchronization, Apache SeaTunnel is undoubtedly one of the most popular tools today. This series will dive deep into its advanced usage.

The first article starts with one of SeaTunnel’s core concepts: **Data Flow**. It analyzes the underlying principles, such as how data flows and is transformed, and explains how this concept applies to complex scenarios through examples.

## One-Sentence Summary: The Conclusion First

> SeaTunnel is not a linear “source → sink” tool.
>
> - It is a DAG execution engine driven by **DataStream / DataFlow**.

In SeaTunnel's **Zeta engine**, multiple upstream branches converging on one downstream stage is a direct manifestation of this model.

## 1. SeaTunnel’s Core Concept: Data Flow

Inside SeaTunnel, **everything revolves around data flow**.

### What is a data flow?

> Data flow = a stream of Records with a consistent structure and Schema.

It is not a table, not a file, and not a SQL result set.

It is:

```text
Record1 → Record2 → Record3 → ...
```

### Every plugin “operates on data flow”

In practice, a plugin either produces a stream, consumes a stream, or does both when it sits in the middle of a pipeline.

## 2. The Real Meaning of plugin_output / plugin_input

You may have been “using” them for a long time, but now it is time to truly “understand” them.

### 1️⃣ plugin_output

```text
plugin_output = "source_data_output_1"
```

Its meaning is not simply “a name”.

It means:

> Assign a unique ID to the data flow produced by the current plugin.

You can understand it as:

```text
DataStream<ID = source_data_output_1>
```

### 2️⃣ plugin_input

```text
plugin_input = "source_data_output_1"
```

Its meaning is:

> This plugin wants to consume a specific data flow.

### In one sentence

```text
plugin_output / plugin_input = the “connection ports” of data flow
```

## 3. SeaTunnel’s DAG Model: You Are Already Using It

Under SeaTunnel's **Zeta engine** and its `LogicalDag` model, the successful experiment you ran is essentially this:

```text
SourceA ┐
        ├──► Downstream Stage
SourceB ┘
```

### Internally, SeaTunnel builds a DAG like this:

```text
DataStream A ┐
             ├──► Downstream Vertex
DataStream B ┘
```

### Key question: Why can they converge?

Because:

> In Zeta's logical graph, one downstream vertex can be connected to multiple upstream data flows.

That is a graph-level capability first, not a blanket guarantee that every runtime plugin instance accepts multiple `plugin_input` values directly.

In Zeta, SeaTunnel internally does the following:

- Takes multiple input streams;
- Represents them as a multiple-input vertex in the `LogicalDag`;
- Splits the graph into executable pipelines during physical planning.

A precise caveat is important here:

- Zeta's DAG model can express multiple-input vertices.
- The current Flink and Spark starter implementations still reject multiple `plugin_input` values in a single plugin instance.
- So treat this as a **Zeta / logical-graph concept**, not as a universal sink-plugin contract.

## 4. How Is This Fundamentally Different from “SQL / ETL” Thinking?

This is where many people get confused.

### The SQL world

```text
SELECT * FROM A
UNION ALL
SELECT * FROM B
```

- This is **result-set semantics**.

### The SeaTunnel world

```text
Record stream from A
Record stream from B
↓
A downstream stage processes the records according to the configured graph
```

- This is **stream semantics**.

In Zeta, as long as the graph and Schema assumptions are valid, the downstream stage can be planned from those upstream streams.

## 5. The Role of Schema in Data Flow: Must Remember

> Data flow = Record + Schema

### Prerequisites for data flow convergence in SeaTunnel:

- The number of fields must be consistent.
- Field types must be compatible.
- Field names must be aligned, or at least mappable.

Otherwise:

- The job may fail at runtime.
- Or the Sink may fail to write the data.

When you said “the target fields are definitely aligned”, that is exactly why your experiment succeeded.

## 6. Formal Definition of SeaTunnel’s Data Flow Model

You can directly use the following standard wording in future design discussions, solution explanations, or documentation:

> SeaTunnel uses DataStream as its core abstraction.
>
> Source plugins generate data streams, Transform plugins process data streams and output new data streams, and Sink plugins consume upstream data streams and write the data into external systems.
>
> In SeaTunnel Zeta's `LogicalDag`, multiple data streams can converge at one downstream vertex. Whether that convergence is expressed directly by a specific sink plugin or through an intermediate stage depends on the engine/runtime implementation.

## 7. Direct Impact on Your Builder / Strategy Design

Now you can be very certain about three things:

### 1️⃣ The Builder must support N Sources → M Sinks

It is not a 1→1 model. It is a **graph model**.

### 2️⃣ plugin_output is a “first-class citizen”

If someone does not set `plugin_output` in your Builder:

- You should automatically generate one for them.

This is a platform-level capability.

### 3️⃣ In Zeta, the logical graph may contain multiple-input vertices

Even if the DSL shows only one:

```text
plugin_input = "s1"
```

Your Builder should model upstream relationships as:

```text
Set<DataStream>
```

instead of hard-coding every downstream step as a single linear String-to-String hop.

## 8. Key Facts You Have Already Verified

Here are the conclusions you have already validated through practice:

✅ SeaTunnel is a DAG, not a linear ETL tool.  
✅ In Zeta's DAG model, multiple upstream branches can converge on one downstream stage.  
✅ That convergence is a graph-level concept, not automatically a direct multi-input sink contract in every engine implementation.  
✅ Schema alignment is the prerequisite.  
✅ The DSL describes data flow, not SQL.

## 9. Summary

### SeaTunnel has only three core roles

```text
Source     →   Transform   →   Sink
(produces)     (modifies)      (consumes)
data flow      data flow       data flow
```

### How are data flows “connected”?

Just remember this connection rule:


The connection depends on two things:

- `plugin_output`: What is the name of the data flow I produce?
- `plugin_input`: Which upstream data flow am I consuming?

For example, two upstream branches converging on one downstream stage in Zeta:

```text
SourceA ┐
        ├──► Downstream Stage
SourceB ┘
```

One Source → two Sinks:

```text
         ┌──► SinkA
Source ──┤
         └──► SinkB
```

Two independent flows in one conf file:

```text
SourceA ───► SinkA

SourceB ───► SinkB
```
