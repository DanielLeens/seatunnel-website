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

**Two sources flowing into one sink** is a direct manifestation of this model.

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

![](/image/20260606/data-flow/17792421251124.jpg)

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

The successful experiment you ran is essentially this:

```text
SourceA ┐
        ├──► Sink
SourceB ┘
```

### Internally, SeaTunnel builds a DAG like this:

```text
DataStream A ┐
             ├──► Sink Operator
DataStream B ┘
```

### Key question: Why can they be merged?

Because:

> A Sink is not “bound to one source”; it “subscribes to one or more data flows”.

When you write:

```text
sink {
  jdbc {
    plugin_input = "a,b"
  }
}
```

Or when you use multiple sources that eventually connect to the same sink, SeaTunnel internally does the following:

- Takes multiple input streams;
- Merges them into one Logical Input;
- Writes records in record order.

⚠️ Note:

- It is not a join.
- It is not SQL union.
- It is stream-level merge/append.

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
Sink continuously consumes records
```

- This is **stream semantics**.

As long as the Schema is consistent, the records can enter the same sink.

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
> Source plugins generate data streams, Transform plugins process data streams and output new data streams, and Sink plugins consume one or more data streams and write the data into external systems.
>
> Multiple data streams can converge at a Sink. As long as their Schemas are compatible, SeaTunnel writes them using stream-level append semantics, rather than relational join semantics.

## 7. Direct Impact on Your Builder / Strategy Design

Now you can be very certain about three things:

### 1️⃣ The Builder must support N Sources → M Sinks

It is not a 1→1 model. It is a **graph model**.

### 2️⃣ plugin_output is a “first-class citizen”

If someone does not set `plugin_output` in your Builder:

- You should automatically generate one for them.

This is a platform-level capability.

### 3️⃣ A Sink logically allows multiple input streams

Even if the DSL shows only one:

```text
plugin_input = "s1"
```

The semantic model in your Builder should be:

```text
Set<DataStream>
```

Instead of String.

## 8. Key Facts You Have Already Verified

Here are the conclusions you have already validated through practice:

✅ SeaTunnel is a DAG, not a linear ETL tool.  
✅ Multiple Sources can flow into one Sink.  
✅ The merge is stream-level append, not SQL join.  
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

Just remember this universal rule table:

![](/image/20260606/data-flow/17792425500018.jpg)

The connection depends on two things:

- `plugin_output`: What is the name of the data flow I produce?
- `plugin_input`: Which data flow, or data flows, do I consume?

For example, two Sources → one Sink:

```text
SourceA ┐
        ├──► Sink
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
