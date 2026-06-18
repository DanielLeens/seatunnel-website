/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, {useEffect, useRef} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useIsBrowser from '@docusaurus/useIsBrowser';
import useBaseUrl from '@docusaurus/useBaseUrl';
import './index.less';
import systemConfiguration from '../../js/sysConfig';

const versions = require('../../../versions.json');

const SLACK_URL = 'https://s.apache.org/seatunnel-slack';
const EXAMPLES_URL = 'https://github.com/apache/seatunnel/tree/dev/seatunnel-examples';

const HERO_SOURCES = [
    {name: 'MySQL CDC', colorClass: 'orange'},
    {name: 'PostgreSQL', colorClass: 'blue'},
    {name: 'Apache Kafka', colorClass: 'green'},
    {name: 'Amazon S3', colorClass: 'yellow'},
    {name: 'MongoDB', colorClass: 'purple'},
];

const HERO_SINKS = [
    {name: 'ClickHouse', colorClass: 'teal'},
    {name: 'Apache Iceberg', colorClass: 'blue'},
    {name: 'Elasticsearch', colorClass: 'orange'},
    {name: 'Apache Doris', colorClass: 'green'},
    {name: 'Apache Paimon', colorClass: 'pink'},
];

// Keep the marquee aligned with connectors and integrations that already have
// public support pages in the current SeaTunnel documentation set.
const CONNECTOR_MARQUEE_ITEMS = [
    'MySQL',
    'PostgreSQL',
    'Oracle',
    'SQL Server',
    'TiDB',
    'MariaDB',
    'MongoDB',
    'DynamoDB',
    'Cassandra',
    'HBase',
    'Neo4j',
    'DB2',
    'Greenplum',
    'OceanBase',
    'Apache Kafka',
    'Apache Pulsar',
    'RabbitMQ',
    'RocketMQ',
    'ActiveMQ',
    'AWS SQS',
    'Elasticsearch',
    'Apache Druid',
    'Typesense',
    'ClickHouse',
    'Apache Doris',
    'StarRocks',
    'Snowflake',
    'Cloudberry',
    'Amazon Redshift',
    'Amazon S3',
    'HDFS',
    'Alibaba OSS',
    'LocalFile',
    'Apache Iceberg',
    'Apache Hudi',
    'Delta Lake',
    'Apache Paimon',
    'Apache Kudu',
    'Apache Hive',
    'InfluxDB',
    'Apache IoTDB',
    'TDengine',
    'Redis',
    'Aerospike',
    'FTP',
    'SFTP',
    'HTTP',
    'GraphQL',
    'Google Sheets',
    'Google Firestore',
    'Slack',
    'DingTalk',
    'Feishu',
    'Email',
    'MaxCompute',
    'TableStore',
    'SelectDB Cloud',
    'Milvus',
    'Qdrant',
    'Lance',
    'Apache Fluss',
    'HugeGraph',
    'Prometheus',
    'SLS',
    'Sentry',
    'SensorsData',
    'Web3j',
];

const HOME_COPY = {
    'en': {
        badge: `v${versions[0]} live / Apache Top-Level Project`,
        nav: {
            docs: 'Docs',
            connectors: 'Connectors',
            blog: 'Blog',
            community: 'Community',
            download: 'Download',
        },
        hero: {
            titleLead: 'High-performance',
            titleAccent: 'data integration',
            titleTail: 'for every workload.',
            subtitle: 'Build one pipeline definition and run it on Zeta, Flink, or Spark. SeaTunnel powers batch, streaming, CDC, multimodal, and AI data movement across production systems.',
            primaryButton: 'Quick Start',
            secondaryButton: 'Read the Docs',
            helperButton: 'View Connectors',
            localeButton: '简体中文',
            meta: [
                'Zeta Engine',
                'Apache Flink',
                'Apache Spark',
                'CDC / Exactly-Once',
                'Schema Evolution',
            ],
        },
        trust: {
            label: 'Used in production by',
        },
        stats: [
            {value: '9.4k+', label: 'GitHub Stars'},
            {value: '~200', label: 'Data Connectors'},
            {value: '3', label: 'Execution Engines'},
            {value: '2.3k+', label: 'GitHub Forks'},
        ],
        architecture: {
            eyebrow: 'Architecture',
            titleLead: 'Not ETL.',
            titleAccent: 'EtLT.',
            lead: 'SeaTunnel handles extract, lightweight transform, and load. Your warehouse or lakehouse can keep the heavy downstream transformation while SeaTunnel moves reliable, structured data between systems.',
            headers: {
                sources: '01 Upstream Sources',
                engine: '02 EtLT Engine',
                targets: '03 Downstream Targets',
            },
            rows: [
                {
                    source: {
                        title: 'Database',
                        tag: 'OLTP / CDC',
                        dotClass: 'orange',
                        chips: ['MySQL', 'PostgreSQL', 'Oracle', 'SQL Server', 'TiDB'],
                    },
                    target: {
                        title: 'Data Warehouse',
                        tag: 'OLAP',
                        dotClass: 'yellow',
                        chips: ['ClickHouse', 'Apache Doris', 'StarRocks', 'Snowflake'],
                    },
                },
                {
                    source: {
                        title: 'Streaming',
                        tag: 'Pub/Sub',
                        dotClass: 'blue',
                        chips: ['Apache Kafka', 'Apache Pulsar', 'RocketMQ', 'RabbitMQ'],
                    },
                    target: {
                        title: 'Lakehouse',
                        tag: 'Open Tables',
                        dotClass: 'green',
                        chips: ['Apache Iceberg', 'Apache Hudi', 'Apache Paimon', 'Delta Lake'],
                    },
                },
                {
                    source: {
                        title: 'Data Lake',
                        tag: 'Object Storage',
                        dotClass: 'orange',
                        chips: ['Amazon S3', 'Alibaba OSS', 'HDFS', 'LocalFile'],
                    },
                    target: {
                        title: 'AI & Analytics',
                        tag: 'Vector / LLM',
                        dotClass: 'purple',
                        chips: ['Milvus', 'Qdrant', 'Elasticsearch', 'Typesense'],
                    },
                },
            ],
            engineBadges: [
                'Zeta Engine / Apache Flink / Apache Spark',
                'CDC / Exactly-Once / Schema Evolution',
            ],
        },
        features: {
            eyebrow: 'Why SeaTunnel',
            title: 'Production-grade from day one.',
            lead: 'Real fault tolerance, schema evolution, and multi-engine scale for production pipelines.',
            schema: {
                number: '01',
                icon: 'schema',
                accent: 'violet',
                title: 'Schema changes? Handled automatically.',
                description: 'SeaTunnel detects upstream schema changes and propagates them downstream in real time, so teams do not need to pause the pipeline for every column change.',
            },
            cards: [
                {
                    number: '02',
                    title: 'Real-Time CDC',
                    description: 'Capture INSERT, UPDATE, and DELETE events from MySQL, Oracle, PostgreSQL, SQL Server, MongoDB, and more with low latency.',
                    icon: 'lightning',
                    accent: 'blue',
                },
                {
                    number: '03',
                    title: 'Exactly-Once Semantics',
                    description: 'Checkpoint-backed fault tolerance keeps records consistent across failures, retries, and restarts.',
                    icon: 'shield',
                    accent: 'teal',
                },
                {
                    number: '04',
                    title: 'Multi-Engine Support',
                    description: 'Write one pipeline definition and run it on Zeta, Flink, or Spark without rewriting connector logic.',
                    icon: 'layers',
                    accent: 'amber',
                },
            ],
        },
        connectors: {
            eyebrow: '~200 Native Connectors',
            titleLead: 'If your data lives there,',
            titleAccent: 'SeaTunnel connects to it.',
            lead: 'Native connectors across databases, streams, lakehouses, search systems, and object stores.',
            categories: [
                {
                    label: 'OLTP Databases',
                    items: [
                        {name: 'MySQL / MySQL CDC', colorClass: 'orange'},
                        {name: 'PostgreSQL', colorClass: 'blue'},
                        {name: 'Oracle', colorClass: 'red'},
                        {name: 'SQL Server', colorClass: 'maroon'},
                        {name: 'TiDB / MariaDB', colorClass: 'cyan'},
                        {name: '+25 via JDBC', colorClass: 'green'},
                    ],
                },
                {
                    label: 'Streaming & Messaging',
                    items: [
                        {name: 'Apache Kafka', colorClass: 'black'},
                        {name: 'Apache Pulsar', colorClass: 'blue'},
                        {name: 'RabbitMQ', colorClass: 'orange'},
                        {name: 'RocketMQ', colorClass: 'red'},
                        {name: 'AWS SQS', colorClass: 'indigo'},
                        {name: 'ActiveMQ', colorClass: 'green'},
                    ],
                },
                {
                    label: 'OLAP & Analytics',
                    items: [
                        {name: 'ClickHouse', colorClass: 'yellow'},
                        {name: 'Apache Doris', colorClass: 'blue'},
                        {name: 'StarRocks', colorClass: 'indigo'},
                        {name: 'Snowflake', colorClass: 'sky'},
                        {name: 'Amazon Redshift', colorClass: 'blue'},
                        {name: 'Cloudberry', colorClass: 'purple'},
                    ],
                },
                {
                    label: 'Data Lakes & Storage',
                    items: [
                        {name: 'Amazon S3 / Hudi', colorClass: 'orange'},
                        {name: 'Alibaba OSS', colorClass: 'blue'},
                        {name: 'HDFS / LocalFile', colorClass: 'sky'},
                        {name: 'Apache Iceberg', colorClass: 'green'},
                        {name: 'Delta Lake', colorClass: 'orange'},
                        {name: 'Apache Paimon', colorClass: 'green'},
                    ],
                },
            ],
            more: 'Also: MongoDB / Redis / Elasticsearch / Neo4j / Cassandra / HBase / Druid / HugeGraph / IoTDB / InfluxDB / DynamoDB / Milvus / Qdrant ...',
        },
        flow: {
            eyebrow: 'How it works',
            titleLead: 'Extract. transform. Load. Transform.',
            titleAccent: 'Elegantly simple.',
            lead: 'One config file defines the full EtLT pipeline, from ingestion through lightweight transformation and delivery.',
            steps: [
                {
                    label: '01 Extract',
                    title: 'Read from anywhere',
                    tags: ['MySQL-CDC', 'Kafka', 'PostgreSQL', 'MongoDB', 'Oracle', 'S3', 'Hive', '+193 more'],
                },
                {
                    label: '02 Lightweight transform',
                    title: 'Shape and enrich in-flight',
                    tags: ['SQL Transform', 'FieldMapper', 'Copy', 'Replace', 'FieldEncrypt', 'Split', 'FilterRowKind', 'Jsonpath'],
                    highlight: true,
                },
                {
                    label: '03 Load',
                    title: 'Deliver anywhere',
                    tags: ['ClickHouse', 'Iceberg', 'Doris', 'StarRocks', 'Paimon', 'Kafka', 'Redis', '+193 more'],
                },
            ],
        },
        code: {
            eyebrow: 'Simple by design',
            titleLead: 'A config file.',
            titleTail: "That's all it takes.",
            lead: 'Declare your source, transform, and sink in plain config, then deploy on any supported engine without rewriting the pipeline.',
            primaryButton: 'Read the Docs',
            secondaryButton: 'See Examples',
            fileName: 'mysql-cdc-to-clickhouse.conf',
        },
        cta: {
            titleLead: 'Start moving your data',
            titleAccent: 'without limits.',
            lead: 'Open source. Apache licensed. Free forever. Built for production teams that need a reliable integration layer instead of another fragile demo.',
            primaryButton: 'Quick Start',
            secondaryButton: 'GitHub',
            tertiaryButton: 'Slack Access',
        },
        footer: {
            tagline: 'Distributed data integration for the modern data stack.',
            apache: 'An Apache Software Foundation Project',
            columns: [
                {
                    title: 'Product',
                    items: [
                        {label: 'Overview', hrefKey: 'docsOverview'},
                        {label: 'Connectors', hrefKey: 'connectors'},
                        {label: 'Transforms', hrefKey: 'transforms'},
                        {label: 'SeaTunnel Web', hrefKey: 'seatunnelWeb'},
                        {label: 'Changelog', hrefKey: 'releases'},
                    ],
                },
                {
                    title: 'Developers',
                    items: [
                        {label: 'Documentation', hrefKey: 'docsOverview'},
                        {label: 'Quick Start', hrefKey: 'quickStart'},
                        {label: 'API Reference', hrefKey: 'apiReference'},
                        {label: 'Contributing', hrefKey: 'community'},
                        {label: 'Roadmap', hrefKey: 'roadmap'},
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        {label: 'GitHub', hrefKey: 'github'},
                        {label: 'Slack', hrefKey: 'slack'},
                        {label: 'Twitter / X', hrefKey: 'twitter'},
                        {label: 'Mailing List', hrefKey: 'mailingList'},
                        {label: 'Blog', hrefKey: 'blog'},
                    ],
                },
            ],
        },
        askAi: 'Ask AI',
    },
    'zh-CN': {
        badge: `v${versions[0]} 已发布 / Apache 顶级项目`,
        nav: {
            docs: '文档',
            connectors: '连接器',
            blog: '博客',
            community: '社区',
            download: '下载',
        },
        hero: {
            titleLead: '超高性能',
            titleAccent: '数据集成',
            titleTail: '工具',
            subtitle: '支持多模态数据集成，一次定义 pipeline，可运行在 Zeta、Flink 和 Spark 上，覆盖批处理、流处理、CDC 与实时同步场景。',
            primaryButton: '快速开始',
            secondaryButton: '阅读文档',
            helperButton: '查看连接器',
            localeButton: 'English',
            meta: [
                'Zeta Engine',
                'Apache Flink',
                'Apache Spark',
                'CDC / Exactly-Once',
                'Schema Evolution',
            ],
        },
        trust: {
            label: '已被以下团队用于生产环境',
        },
        stats: [
            {value: '9.4k+', label: 'GitHub Stars'},
            {value: '~200', label: '数据连接器'},
            {value: '3', label: '执行引擎'},
            {value: '2.3k+', label: 'GitHub Forks'},
        ],
        architecture: {
            eyebrow: '架构',
            titleLead: '不是 ETL',
            titleAccent: '而是 EtLT',
            lead: 'SeaTunnel 负责抽取、轻量转换与装载，把重量级的下游转换保留给仓库或湖仓，让数据链路更清晰也更稳定。',
            headers: {
                sources: '01 上游数据源',
                engine: '02 EtLT 引擎',
                targets: '03 下游目标',
            },
            rows: [
                {
                    source: {
                        title: '数据库',
                        tag: 'OLTP / CDC',
                        dotClass: 'orange',
                        chips: ['MySQL', 'PostgreSQL', 'Oracle', 'SQL Server', 'TiDB'],
                    },
                    target: {
                        title: '数仓',
                        tag: 'OLAP',
                        dotClass: 'yellow',
                        chips: ['ClickHouse', 'Apache Doris', 'StarRocks', 'Snowflake'],
                    },
                },
                {
                    source: {
                        title: '消息流',
                        tag: 'Pub/Sub',
                        dotClass: 'blue',
                        chips: ['Apache Kafka', 'Apache Pulsar', 'RocketMQ', 'RabbitMQ'],
                    },
                    target: {
                        title: '湖仓',
                        tag: 'Open Tables',
                        dotClass: 'green',
                        chips: ['Apache Iceberg', 'Apache Hudi', 'Apache Paimon', 'Delta Lake'],
                    },
                },
                {
                    source: {
                        title: '数据湖',
                        tag: 'Object Storage',
                        dotClass: 'orange',
                        chips: ['Amazon S3', 'Alibaba OSS', 'HDFS', 'LocalFile'],
                    },
                    target: {
                        title: 'AI 与分析',
                        tag: 'Vector / LLM',
                        dotClass: 'purple',
                        chips: ['Milvus', 'Qdrant', 'Elasticsearch', 'Typesense'],
                    },
                },
            ],
            engineBadges: [
                'Zeta Engine / Apache Flink / Apache Spark',
                'CDC / Exactly-Once / Schema Evolution',
            ],
        },
        features: {
            eyebrow: '为什么选择 SeaTunnel',
            title: '从第一天起就是生产级',
            lead: '容错、模式演进和多引擎扩展能力都按分布式生产环境要求设计。',
            schema: {
                number: '01',
                icon: 'schema',
                accent: 'violet',
                title: 'Schema 变化？自动处理',
                description: 'SeaTunnel 能检测上游 Schema 变化并实时同步到下游，减少因为字段变更带来的人工迁移与任务中断。',
            },
            cards: [
                {
                    number: '02',
                    title: '实时 CDC',
                    description: '支持 MySQL、Oracle、PostgreSQL、SQL Server、MongoDB 等多种数据库的实时变更捕获。',
                    icon: 'lightning',
                    accent: 'blue',
                },
                {
                    number: '03',
                    title: 'Exactly-Once 语义',
                    description: '基于 checkpoint 的容错保证任务在失败、重试与重启场景下仍保持数据一致性。',
                    icon: 'shield',
                    accent: 'teal',
                },
                {
                    number: '04',
                    title: '多引擎支持',
                    description: '同一份 pipeline 定义可运行在 Zeta、Flink 或 Spark 上，无需重写连接器逻辑。',
                    icon: 'layers',
                    accent: 'amber',
                },
            ],
        },
        connectors: {
            eyebrow: '约 200 个原生连接器',
            titleLead: '只要你的数据在那里，',
            titleAccent: 'SeaTunnel 就能连接',
            lead: '覆盖数据库、消息系统、湖仓、搜索系统与对象存储等主流数据系统。',
            categories: [
                {
                    label: 'OLTP 数据库',
                    items: [
                        {name: 'MySQL / MySQL CDC', colorClass: 'orange'},
                        {name: 'PostgreSQL', colorClass: 'blue'},
                        {name: 'Oracle', colorClass: 'red'},
                        {name: 'SQL Server', colorClass: 'maroon'},
                        {name: 'TiDB / MariaDB', colorClass: 'cyan'},
                        {name: '+25 via JDBC', colorClass: 'green'},
                    ],
                },
                {
                    label: '流式与消息系统',
                    items: [
                        {name: 'Apache Kafka', colorClass: 'black'},
                        {name: 'Apache Pulsar', colorClass: 'blue'},
                        {name: 'RabbitMQ', colorClass: 'orange'},
                        {name: 'RocketMQ', colorClass: 'red'},
                        {name: 'AWS SQS', colorClass: 'indigo'},
                        {name: 'ActiveMQ', colorClass: 'green'},
                    ],
                },
                {
                    label: 'OLAP 与分析',
                    items: [
                        {name: 'ClickHouse', colorClass: 'yellow'},
                        {name: 'Apache Doris', colorClass: 'blue'},
                        {name: 'StarRocks', colorClass: 'indigo'},
                        {name: 'Snowflake', colorClass: 'sky'},
                        {name: 'Amazon Redshift', colorClass: 'blue'},
                        {name: 'Cloudberry', colorClass: 'purple'},
                    ],
                },
                {
                    label: '数据湖与存储',
                    items: [
                        {name: 'Amazon S3 / Hudi', colorClass: 'orange'},
                        {name: 'Alibaba OSS', colorClass: 'blue'},
                        {name: 'HDFS / LocalFile', colorClass: 'sky'},
                        {name: 'Apache Iceberg', colorClass: 'green'},
                        {name: 'Delta Lake', colorClass: 'orange'},
                        {name: 'Apache Paimon', colorClass: 'green'},
                    ],
                },
            ],
            more: '还包括：MongoDB / Redis / Elasticsearch / Neo4j / Cassandra / HBase / Druid / HugeGraph / IoTDB / InfluxDB / DynamoDB / Milvus / Qdrant ...',
        },
        flow: {
            eyebrow: '工作方式',
            titleLead: 'Extract. transform. Load. Transform.',
            titleAccent: '保持简单',
            lead: '一份配置文件即可定义整条 EtLT pipeline，从抽取、轻量转换到目标写入。',
            steps: [
                {
                    label: '01 抽取',
                    title: '从任何地方读取',
                    tags: ['MySQL-CDC', 'Kafka', 'PostgreSQL', 'MongoDB', 'Oracle', 'S3', 'Hive', '+193 more'],
                },
                {
                    label: '02 轻量转换',
                    title: '在链路中完成清洗与增强',
                    tags: ['SQL Transform', 'FieldMapper', 'Copy', 'Replace', 'FieldEncrypt', 'Split', 'FilterRowKind', 'Jsonpath'],
                    highlight: true,
                },
                {
                    label: '03 装载',
                    title: '写入任何目标',
                    tags: ['ClickHouse', 'Iceberg', 'Doris', 'StarRocks', 'Paimon', 'Kafka', 'Redis', '+193 more'],
                },
            ],
        },
        code: {
            eyebrow: '设计上就是简单',
            titleLead: '一份配置文件',
            titleTail: '就够了',
            lead: '用一份配置描述 source、transform 与 sink，然后在任意支持的执行引擎上运行，无需重复改写 pipeline。',
            primaryButton: '阅读文档',
            secondaryButton: '查看示例',
            fileName: 'mysql-cdc-to-clickhouse.conf',
        },
        cta: {
            titleLead: '开始让数据流动',
            titleAccent: '不受限制',
            lead: '开源、Apache License、永久免费。为真正的生产团队提供稳定的数据集成底座，而不是一套只能演示的页面。',
            primaryButton: '快速开始',
            secondaryButton: 'GitHub',
            tertiaryButton: 'Slack 入口',
        },
        footer: {
            tagline: '面向现代数据栈的分布式数据集成平台。',
            apache: 'Apache Software Foundation 项目',
            columns: [
                {
                    title: '产品',
                    items: [
                        {label: '概览', hrefKey: 'docsOverview'},
                        {label: '连接器', hrefKey: 'connectors'},
                        {label: '转换', hrefKey: 'transforms'},
                        {label: 'SeaTunnel Web', hrefKey: 'seatunnelWeb'},
                        {label: '变更记录', hrefKey: 'releases'},
                    ],
                },
                {
                    title: '开发者',
                    items: [
                        {label: '文档', hrefKey: 'docsOverview'},
                        {label: '快速开始', hrefKey: 'quickStart'},
                        {label: 'API 参考', hrefKey: 'apiReference'},
                        {label: '参与贡献', hrefKey: 'community'},
                        {label: 'Roadmap', hrefKey: 'roadmap'},
                    ],
                },
                {
                    title: '社区',
                    items: [
                        {label: 'GitHub', hrefKey: 'github'},
                        {label: 'Slack', hrefKey: 'slack'},
                        {label: 'Twitter / X', hrefKey: 'twitter'},
                        {label: '邮件列表', hrefKey: 'mailingList'},
                        {label: '博客', hrefKey: 'blog'},
                    ],
                },
            ],
        },
        askAi: 'Ask AI',
    },
};

function localizePath(language, path) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return language === 'zh-CN' ? `/zh-CN${normalizedPath}` : normalizedPath;
}

function handleFeatureGlow(event) {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
}

function ArrowRightIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="m12 5 7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function LightningIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3 5 6v6c0 5 3.5 8.5 7 9 3.5-.5 7-4 7-9V6l-7-3Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function LayersIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m3 12 9 4.5 9-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m3 16.5 9 4.5 9-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function SchemaIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 5.5h12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M6 12h12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M6 18.5h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="17.5" cy="18.5" r="1.5" fill="currentColor" />
        </svg>
    );
}

function FeatureIcon({icon}) {
    if (icon === 'lightning') {
        return <LightningIcon />;
    }
    if (icon === 'shield') {
        return <ShieldIcon />;
    }
    if (icon === 'schema') {
        return <SchemaIcon />;
    }
    return <LayersIcon />;
}

export default function Home() {
    const {i18n} = useDocusaurusContext();
    const isBrowser = useIsBrowser();
    const pageRef = useRef(null);
    const heroWarpCanvasRef = useRef(null);
    const ctaWarpCanvasRef = useRef(null);
    const flowCanvasRef = useRef(null);

    const language = isBrowser
        ? (window.location.pathname.startsWith('/zh-CN/') ? 'zh-CN' : 'en')
        : (i18n.currentLocale === 'zh-CN' ? 'zh-CN' : 'en');
    const isChinese = language === 'zh-CN';
    const content = HOME_COPY[language] || HOME_COPY.en;
    const version = versions[0];
    const assetRoot = useBaseUrl('/');
    const docsOverviewPath = useBaseUrl(localizePath(language, `/docs/${version}/introduction/about`));
    const quickStartPath = useBaseUrl(localizePath(language, `/docs/${version}/getting-started/locally/quick-start-seatunnel-engine`));
    const connectorsPath = useBaseUrl(localizePath(language, `/docs/${version}/connectors/source`));
    const logoPath = `${assetRoot}image/logo.png`;

    useEffect(() => {
        if (!isBrowser || !pageRef.current) {
            return undefined;
        }

        document.body.classList.add('seatunnel-homepage-page');

        const root = pageRef.current;
        const revealElements = Array.from(root.querySelectorAll('.st-home-rv'));
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (!entry.isIntersecting) {
                    return;
                }
                window.setTimeout(() => {
                    entry.target.classList.add('in');
                    entry.target.querySelectorAll('.st-home-meteor-line').forEach((meteorNode) => {
                        meteorNode.classList.add('go');
                    });
                    if (entry.target.classList.contains('st-home-meteor-line')) {
                        entry.target.classList.add('go');
                    }
                }, index * 65);
                revealObserver.unobserve(entry.target);
            });
        }, {threshold: 0.08});

        // Tie reveal luminance to viewport position so copy brightens as it scrolls into focus.
        const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
        const updateRevealProgress = () => {
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            revealElements.forEach((element) => {
                const rect = element.getBoundingClientRect();
                const start = viewportHeight;
                const end = viewportHeight * 0.28;
                const progress = clamp((start - rect.top) / Math.max(start - end, 1), 0, 1);
                element.style.setProperty('--rv-progress', progress.toFixed(3));
            });
        };
        let revealFrame = 0;
        const requestRevealProgressUpdate = () => {
            if (revealFrame) {
                return;
            }
            revealFrame = window.requestAnimationFrame(() => {
                revealFrame = 0;
                updateRevealProgress();
            });
        };
        revealElements.forEach((element) => revealObserver.observe(element));
        requestRevealProgressUpdate();
        window.addEventListener('scroll', requestRevealProgressUpdate, {passive: true});
        window.addEventListener('resize', requestRevealProgressUpdate);

        const heroTimer = window.setTimeout(() => {
            root.querySelector('#st-home-hero-meteor')?.classList.add('go');
        }, 1300);

        const visibilityHandlers = [];

        const startWarpCanvas = (canvasRef, options = {}) => {
            const canvas = canvasRef.current;
            if (!canvas) {
                return () => {};
            }
            const context = canvas.getContext('2d');
            if (!context) {
                return () => {};
            }

            const {
                alphaMultiplier = 1,
                centerYFactor = 0.45,
                lineCount = 90,
                opacity = 1,
                widthMultiplier = 1,
            } = options;
            const lines = Array.from({length: lineCount}, () => makeWarpLine());
            let frameId;

            function makeWarpLine() {
                return {
                    angle: Math.random() * Math.PI * 2,
                    progress: Math.random(),
                    speed: 0.003 + Math.random() * 0.007,
                    maxFraction: 0.25 + Math.random() * 0.55,
                    hue: 265 + Math.random() * 65,
                    alpha: Math.min((0.25 + Math.random() * 0.55) * alphaMultiplier, 1),
                    width: (0.4 + Math.random() * 1.2) * widthMultiplier,
                };
            }

            function resize() {
                const deviceRatio = window.devicePixelRatio || 1;
                canvas.width = canvas.offsetWidth * deviceRatio;
                canvas.height = canvas.offsetHeight * deviceRatio;
                context.setTransform(deviceRatio, 0, 0, deviceRatio, 0, 0);
            }

            function draw() {
                const width = canvas.offsetWidth;
                const height = canvas.offsetHeight;
                if (!width || !height) {
                    frameId = window.requestAnimationFrame(draw);
                    return;
                }
                context.clearRect(0, 0, width, height);
                context.save();
                context.globalAlpha = opacity;

                const centerX = width * 0.5;
                const centerY = height * centerYFactor;
                const diagonal = Math.hypot(width, height);

                lines.forEach((line) => {
                    line.progress += line.speed;
                    if (line.progress > 1) {
                        Object.assign(line, makeWarpLine());
                        line.progress = 0;
                    }

                    const maxLength = diagonal * line.maxFraction;
                    const tailDistance = maxLength * line.progress * 0.6;
                    const headDistance = maxLength * line.progress;
                    const cosAngle = Math.cos(line.angle);
                    const sinAngle = Math.sin(line.angle);
                    const x1 = centerX + cosAngle * tailDistance;
                    const y1 = centerY + sinAngle * tailDistance;
                    const x2 = centerX + cosAngle * headDistance;
                    const y2 = centerY + sinAngle * headDistance;
                    const gradient = context.createLinearGradient(x1, y1, x2, y2);

                    gradient.addColorStop(0, `hsla(${line.hue},80%,65%,0)`);
                    gradient.addColorStop(0.6, `hsla(${line.hue},80%,68%,${line.alpha * 0.6})`);
                    gradient.addColorStop(1, `hsla(${line.hue},85%,75%,${line.alpha})`);

                    context.beginPath();
                    context.moveTo(x1, y1);
                    context.lineTo(x2, y2);
                    context.strokeStyle = gradient;
                    context.lineWidth = line.width;
                    context.stroke();
                });
                context.restore();

                frameId = window.requestAnimationFrame(draw);
            }

            const visibilityHandler = () => {
                if (document.hidden) {
                    window.cancelAnimationFrame(frameId);
                } else {
                    frameId = window.requestAnimationFrame(draw);
                }
            };

            resize();
            window.addEventListener('resize', resize);
            document.addEventListener('visibilitychange', visibilityHandler);
            visibilityHandlers.push(() => document.removeEventListener('visibilitychange', visibilityHandler));
            frameId = window.requestAnimationFrame(draw);

            return () => {
                window.cancelAnimationFrame(frameId);
                window.removeEventListener('resize', resize);
            };
        };

        const startFlowCanvas = () => {
            const canvas = flowCanvasRef.current;
            if (!canvas) {
                return () => {};
            }
            const context = canvas.getContext('2d');
            if (!context) {
                return () => {};
            }

            let frame = 0;
            let frameId;

            function resize() {
                const deviceRatio = window.devicePixelRatio || 1;
                canvas.width = canvas.offsetWidth * deviceRatio;
                canvas.height = canvas.offsetHeight * deviceRatio;
                context.setTransform(deviceRatio, 0, 0, deviceRatio, 0, 0);
            }

            function draw() {
                frame += 1;
                const width = canvas.offsetWidth;
                const height = canvas.offsetHeight;
                if (!width || !height) {
                    frameId = window.requestAnimationFrame(draw);
                    return;
                }
                const centerY = height / 2;
                const dash = 10;
                const gap = 8;
                const period = dash + gap;
                // Keep the divider motion readable instead of turning it into a noisy scan line.
                const offset = -(frame * 0.26) % period;
                const gradient = context.createLinearGradient(0, 0, width, 0);

                gradient.addColorStop(0, 'rgba(66,184,236,0)');
                gradient.addColorStop(0.06, 'rgba(66,184,236,.75)');
                gradient.addColorStop(0.52, 'rgba(124,58,237,.75)');
                gradient.addColorStop(0.94, 'rgba(240,24,138,.75)');
                gradient.addColorStop(1, 'rgba(240,24,138,0)');

                context.clearRect(0, 0, width, height);
                context.save();
                context.setLineDash([dash, gap]);
                context.lineDashOffset = offset;
                context.beginPath();
                context.moveTo(0, centerY);
                context.lineTo(width, centerY);
                context.strokeStyle = gradient;
                context.lineWidth = 2.5;
                context.stroke();
                context.restore();

                const pulseCount = 5;
                for (let index = 0; index < pulseCount; index += 1) {
                    const phase = ((frame / 380) + (index / pulseCount)) % 1;
                    const pulseX = phase * width;
                    const hueRatio = width > 0 ? (pulseX / width) : 0;
                    const hue = 197 + (hueRatio * 130);
                    const radius = 11 + (Math.sin((frame * 0.022) + index) * 2);
                    const pulseGradient = context.createRadialGradient(pulseX, centerY, 0, pulseX, centerY, radius * 2.2);
                    pulseGradient.addColorStop(0, `hsla(${hue},90%,78%,1)`);
                    pulseGradient.addColorStop(0.35, `hsla(${hue},85%,68%,.55)`);
                    pulseGradient.addColorStop(1, `hsla(${hue},85%,65%,0)`);

                    context.beginPath();
                    context.arc(pulseX, centerY, radius * 2.2, 0, Math.PI * 2);
                    context.fillStyle = pulseGradient;
                    context.fill();
                }

                frameId = window.requestAnimationFrame(draw);
            }

            const visibilityHandler = () => {
                if (document.hidden) {
                    window.cancelAnimationFrame(frameId);
                } else {
                    frameId = window.requestAnimationFrame(draw);
                }
            };

            resize();
            window.addEventListener('resize', resize);
            document.addEventListener('visibilitychange', visibilityHandler);
            visibilityHandlers.push(() => document.removeEventListener('visibilitychange', visibilityHandler));
            frameId = window.requestAnimationFrame(draw);

            return () => {
                window.cancelAnimationFrame(frameId);
                window.removeEventListener('resize', resize);
            };
        };

        const stopHeroWarpCanvas = startWarpCanvas(heroWarpCanvasRef, {
            alphaMultiplier: 0.48,
            lineCount: 84,
            opacity: 0.88,
            widthMultiplier: 0.88,
        });
        const stopCtaWarpCanvas = startWarpCanvas(ctaWarpCanvasRef);
        const stopFlowCanvas = startFlowCanvas();

        return () => {
            document.body.classList.remove('seatunnel-homepage-page');
            window.clearTimeout(heroTimer);
            revealObserver.disconnect();
            window.removeEventListener('scroll', requestRevealProgressUpdate);
            window.removeEventListener('resize', requestRevealProgressUpdate);
            if (revealFrame) {
                window.cancelAnimationFrame(revealFrame);
            }
            stopHeroWarpCanvas();
            stopCtaWarpCanvas();
            stopFlowCanvas();
            visibilityHandlers.forEach((cleanup) => cleanup());
        };
    }, [isBrowser]);

    const schemaExample = [
        '# Before -> After (detected automatically)',
        '',
        '-- v1 schema -------------------------',
        'id       BIGINT',
        'name     VARCHAR(255)',
        '',
        '-- v2 schema (auto-propagated) ------',
        'id       BIGINT',
        'name     VARCHAR(255)',
        'email    VARCHAR(512)    NEW',
        'phone    VARCHAR(32)     ADDED',
    ].join('\n');

    const codeExample = `
<span class="st-home-code-comment"># Real-time: MySQL CDC -&gt; ClickHouse</span>

<span class="st-home-code-keyword">env</span> <span class="st-home-code-punctuation">{</span>
  <span class="st-home-code-key">parallelism</span> <span class="st-home-code-punctuation">=</span> <span class="st-home-code-value">4</span>
  <span class="st-home-code-key">job.mode</span> <span class="st-home-code-punctuation">=</span> <span class="st-home-code-string">"STREAMING"</span>
  <span class="st-home-code-key">checkpoint.interval</span> <span class="st-home-code-punctuation">=</span> <span class="st-home-code-value">10000</span>
<span class="st-home-code-punctuation">}</span>

<span class="st-home-code-keyword">source</span> <span class="st-home-code-punctuation">{</span>
  <span class="st-home-code-keyword">MySQL-CDC</span> <span class="st-home-code-punctuation">{</span>
    <span class="st-home-code-key">hostname</span> <span class="st-home-code-punctuation">=</span> <span class="st-home-code-string">"db.prod.internal"</span>
    <span class="st-home-code-key">username</span> <span class="st-home-code-punctuation">=</span> <span class="st-home-code-string">"reader"</span>
    <span class="st-home-code-key">password</span> <span class="st-home-code-punctuation">=</span> <span class="st-home-code-string">"\${DB_PASS}"</span>
    <span class="st-home-code-key">database-names</span> <span class="st-home-code-punctuation">=</span> <span class="st-home-code-string">["orders"]</span>
    <span class="st-home-code-key">table-names</span> <span class="st-home-code-punctuation">=</span> <span class="st-home-code-string">["orders.events"]</span>
    <span class="st-home-code-key">base-url</span> <span class="st-home-code-punctuation">=</span> <span class="st-home-code-string">"jdbc:mysql://db.prod.internal:3306"</span>
  <span class="st-home-code-punctuation">}</span>
<span class="st-home-code-punctuation">}</span>

<span class="st-home-code-keyword">transform</span> <span class="st-home-code-punctuation">{</span>
  <span class="st-home-code-keyword">Sql</span> <span class="st-home-code-punctuation">{</span>
    <span class="st-home-code-key">query</span> <span class="st-home-code-punctuation">=</span> <span class="st-home-code-string">"""</span>
<span class="st-home-code-string">      SELECT *, NOW() AS synced_at</span>
<span class="st-home-code-string">      FROM events WHERE status != 'deleted'</span>
<span class="st-home-code-string">    """</span>
  <span class="st-home-code-punctuation">}</span>
<span class="st-home-code-punctuation">}</span>

<span class="st-home-code-keyword">sink</span> <span class="st-home-code-punctuation">{</span>
  <span class="st-home-code-keyword">ClickHouse</span> <span class="st-home-code-punctuation">{</span>
    <span class="st-home-code-key">host</span> <span class="st-home-code-punctuation">=</span> <span class="st-home-code-string">"ch.analytics:8123"</span>
    <span class="st-home-code-key">database</span> <span class="st-home-code-punctuation">=</span> <span class="st-home-code-string">"analytics"</span>
    <span class="st-home-code-key">table</span> <span class="st-home-code-punctuation">=</span> <span class="st-home-code-identifier">events_realtime</span>
    <span class="st-home-code-key">primary_key</span> <span class="st-home-code-punctuation">=</span> <span class="st-home-code-string">["id"]</span>
  <span class="st-home-code-punctuation">}</span>
<span class="st-home-code-punctuation">}</span>`;

    return (
        <div className="st-home" ref={pageRef}>
            <section className="st-home-hero">
                <div className="st-home-orb st-home-orb-1"></div>
                <div className="st-home-orb st-home-orb-2"></div>
                <div className="st-home-orb st-home-orb-3"></div>
                <canvas ref={heroWarpCanvasRef} className="st-home-hero-warp-canvas"></canvas>

                <div className="st-home-hero-content">
                    <div className="st-home-hero-badge">
                        <span className="st-home-badge-dot"></span>
                        <span>{content.badge}</span>
                    </div>

                    <h1 className={`st-home-hero-title${isChinese ? ' st-home-hero-title-zh' : ''}`}>
                        {isChinese ? (
                            <>
                                <span className="st-home-hero-title-line">{content.hero.titleLead}</span>
                                <span className="st-home-hero-title-line st-home-hero-title-line-zh">
                                    <span className="st-home-gradient" id="st-home-hero-meteor">{content.hero.titleAccent}</span>
                                    {content.hero.titleTail}
                                </span>
                            </>
                        ) : (
                            <>
                                {content.hero.titleLead}<br />
                                <span className="st-home-gradient" id="st-home-hero-meteor">{content.hero.titleAccent}</span>
                                <br />
                                {content.hero.titleTail}
                            </>
                        )}
                    </h1>

                    <p className="st-home-hero-subtitle">{content.hero.subtitle}</p>

                    <div className="st-home-hero-buttons">
                        <a href={quickStartPath} className="st-home-btn st-home-btn-primary st-home-btn-lg">
                            <span>{content.hero.primaryButton}</span>
                            <ArrowRightIcon />
                        </a>
                        <a href={docsOverviewPath} className="st-home-btn st-home-btn-outline st-home-btn-lg">{content.hero.secondaryButton}</a>
                        <a href={connectorsPath} className="st-home-btn st-home-btn-outline st-home-btn-lg">{content.hero.helperButton}</a>
                    </div>

                    <div className="st-home-hero-meta">
                        {content.hero.meta.map((item) => (
                            <span key={item} className="st-home-meta-tag">{item}</span>
                        ))}
                    </div>
                </div>

                <div className="st-home-hero-visual">
                    <div className="st-home-pipeline-visual">
                        <div className="st-home-pipeline-column">
                            <div className="st-home-pipeline-label">Sources</div>
                            {HERO_SOURCES.map((item) => (
                                <div key={item.name} className="st-home-pipeline-item">
                                    <span className={`st-home-pipeline-dot st-home-dot-${item.colorClass}`}></span>
                                    <span>{item.name}</span>
                                </div>
                            ))}
                            <div className="st-home-pipeline-item st-home-pipeline-item-muted">+195 more sources</div>
                        </div>

                        <div className="st-home-pipeline-tunnel">
                            <div className="st-home-pipeline-tunnel-label">In</div>
                            <div className="st-home-tunnel-line"></div>
                            <div className="st-home-tunnel-line"></div>
                            <div className="st-home-tunnel-line"></div>
                        </div>

                        <div className="st-home-pipeline-center">
                            <div className="st-home-pipeline-tunnel-label st-home-pipeline-center-label">SeaTunnel</div>
                            <div className="st-home-pipeline-center-icon">
                                <img src={logoPath} alt="SeaTunnel" />
                            </div>
                            <div className="st-home-pipeline-center-name">EtLT / Route</div>
                        </div>

                        <div className="st-home-pipeline-tunnel">
                            <div className="st-home-pipeline-tunnel-label">Out</div>
                            <div className="st-home-tunnel-line"></div>
                            <div className="st-home-tunnel-line"></div>
                            <div className="st-home-tunnel-line"></div>
                        </div>

                        <div className="st-home-pipeline-column">
                            <div className="st-home-pipeline-label">Sinks</div>
                            {HERO_SINKS.map((item) => (
                                <div key={item.name} className="st-home-pipeline-item">
                                    <span className={`st-home-pipeline-dot st-home-dot-${item.colorClass}`}></span>
                                    <span>{item.name}</span>
                                </div>
                            ))}
                            <div className="st-home-pipeline-item st-home-pipeline-item-muted">+195 more sinks</div>
                        </div>
                    </div>
                </div>

                <div className="st-home-hero-fade"></div>
            </section>

            <div className="st-home-stats-divider">
                <canvas ref={flowCanvasRef} className="st-home-flow-canvas"></canvas>
            </div>

            <section className="st-home-stats">
                {content.stats.map((stat) => (
                    <div key={stat.label} className="st-home-stat st-home-rv">
                        <div className="st-home-stat-number">{stat.value}</div>
                        <div className="st-home-stat-label">{stat.label}</div>
                    </div>
                ))}
            </section>

            <section className="st-home-section st-home-architecture">
                <div className="st-home-container">
                    <p className="st-home-eyebrow st-home-rv">{content.architecture.eyebrow}</p>
                    <h2 className="st-home-section-title st-home-rv">
                        {content.architecture.titleLead} <span className="st-home-gradient st-home-meteor-line">{content.architecture.titleAccent}</span>
                    </h2>
                    <p className="st-home-section-lead st-home-rv">{content.architecture.lead}</p>

                    <div className="st-home-architecture-header st-home-rv">
                        <div>{content.architecture.headers.sources}</div>
                        <div></div>
                        <div className="st-home-architecture-header-center">{content.architecture.headers.engine}</div>
                        <div></div>
                        <div className="st-home-architecture-header-right">{content.architecture.headers.targets}</div>
                    </div>

                    <div className="st-home-architecture-grid st-home-rv">
                        <div className="st-home-architecture-engine">
                            <div className="st-home-architecture-engine-box">
                                <img src={logoPath} alt="SeaTunnel" />
                                <div className="st-home-architecture-engine-name">SeaTunnel</div>
                                <div className="st-home-architecture-engine-word">
                                    <span className="st-home-architecture-engine-e">E</span>
                                    <span className="st-home-architecture-engine-t-small">t</span>
                                    <span className="st-home-architecture-engine-l">L</span>
                                    <span className="st-home-architecture-engine-t">T</span>
                                </div>
                                <div className="st-home-architecture-engine-badges">
                                    {content.architecture.engineBadges.map((badge) => (
                                        <span key={badge}>{badge}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {content.architecture.rows.map((row) => (
                            <React.Fragment key={`${row.source.title}-${row.target.title}`}>
                                <div className="st-home-architecture-card">
                                    <div className="st-home-architecture-card-head">
                                        <span className={`st-home-architecture-card-dot st-home-dot-${row.source.dotClass}`}></span>
                                        <span>{row.source.title}</span>
                                        <span className="st-home-architecture-card-tag">{row.source.tag}</span>
                                    </div>
                                    <div className="st-home-architecture-chip-list">
                                        {row.source.chips.map((chip) => (
                                            <span key={chip} className="st-home-architecture-chip">{chip}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="st-home-architecture-connector">
                                    <div className="st-home-architecture-line"></div>
                                    <span>&gt;</span>
                                </div>
                                <div className="st-home-architecture-connector st-home-architecture-connector-right">
                                    <div className="st-home-architecture-line"></div>
                                    <span>&gt;</span>
                                </div>
                                <div className="st-home-architecture-card">
                                    <div className="st-home-architecture-card-head">
                                        <span className={`st-home-architecture-card-dot st-home-dot-${row.target.dotClass}`}></span>
                                        <span>{row.target.title}</span>
                                        <span className="st-home-architecture-card-tag">{row.target.tag}</span>
                                    </div>
                                    <div className="st-home-architecture-chip-list">
                                        {row.target.chips.map((chip) => (
                                            <span key={chip} className="st-home-architecture-chip">{chip}</span>
                                        ))}
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>

            <section className="st-home-section">
                <div className="st-home-container">
                    <p className="st-home-eyebrow st-home-rv">{content.features.eyebrow}</p>
                    <h2 className="st-home-section-title st-home-rv">{content.features.title}</h2>
                    <p className="st-home-section-lead st-home-rv">{content.features.lead}</p>

                    <div className="st-home-feature-grid">
                        <article className="st-home-feature-card st-home-feature-card-wide st-home-rv" onMouseMove={handleFeatureGlow}>
                            <div className="st-home-feature-accent"></div>
                            <div className="st-home-feature-copy st-home-feature-copy-wide">
                                <div className="st-home-feature-number">{content.features.schema.number}</div>
                                <div className={`st-home-feature-icon st-home-feature-icon-${content.features.schema.accent}`}>
                                    <FeatureIcon icon={content.features.schema.icon} />
                                </div>
                                <h3 className="st-home-feature-title st-home-feature-title-large">{content.features.schema.title}</h3>
                                <p className="st-home-feature-description st-home-feature-description-large">{content.features.schema.description}</p>
                            </div>
                            <pre className="st-home-schema-demo">{schemaExample}</pre>
                        </article>

                        {content.features.cards.map((card) => (
                            <article
                                key={card.number}
                                className="st-home-feature-card st-home-rv"
                                onMouseMove={handleFeatureGlow}>
                                <div className="st-home-feature-accent"></div>
                                <div className="st-home-feature-number">{card.number}</div>
                                <div className={`st-home-feature-icon st-home-feature-icon-${card.accent}`}>
                                    <FeatureIcon icon={card.icon} />
                                </div>
                                <h3 className="st-home-feature-title">{card.title}</h3>
                                <p className="st-home-feature-description">{card.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="st-home-section st-home-connectors-section">
                <div className="st-home-container">
                    <p className="st-home-eyebrow st-home-eyebrow-blue st-home-rv">{content.connectors.eyebrow}</p>
                    <h2 className="st-home-section-title st-home-rv">
                        {content.connectors.titleLead}<br />
                        <span className="st-home-gradient">{content.connectors.titleAccent}</span>
                    </h2>
                    <p className="st-home-section-lead st-home-rv">{content.connectors.lead}</p>

                    <div className="st-home-connector-categories st-home-rv">
                        {content.connectors.categories.map((category) => (
                            <article key={category.label} className="st-home-connector-category">
                                <div className="st-home-connector-category-label">{category.label}</div>
                                <div className="st-home-connector-list">
                                    {category.items.map((item) => (
                                        <div key={item.name} className="st-home-connector-item">
                                            <span className={`st-home-connector-item-dot st-home-dot-${item.colorClass}`}></span>
                                            <span>{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="st-home-marquee st-home-rv">
                        <div className="st-home-marquee-fade"></div>
                        <div className="st-home-marquee-track">
                            {[...CONNECTOR_MARQUEE_ITEMS, ...CONNECTOR_MARQUEE_ITEMS].map((item, index) => (
                                <span key={`${item}-${index}`} className="st-home-marquee-chip">{item}</span>
                            ))}
                        </div>
                    </div>

                    <div className="st-home-connector-more st-home-rv">{content.connectors.more}</div>
                </div>
            </section>

            <section className="st-home-section">
                <div className="st-home-container">
                    <p className="st-home-eyebrow st-home-rv">{content.flow.eyebrow}</p>
                    <h2 className="st-home-section-title st-home-rv">
                        {content.flow.titleLead}<br />
                        <span className="st-home-gradient st-home-meteor-line">{content.flow.titleAccent}</span>
                    </h2>
                    <p className="st-home-section-lead st-home-rv">{content.flow.lead}</p>

                    <div className="st-home-flow-grid st-home-rv">
                        {content.flow.steps.map((step, index) => (
                            <React.Fragment key={step.label}>
                                <article className={`st-home-flow-card${step.highlight ? ' st-home-flow-card-highlight' : ''}`}>
                                    <div className="st-home-flow-card-label">{step.label}</div>
                                    <h3 className="st-home-flow-card-title">{step.title}</h3>
                                    <div className="st-home-flow-card-tags">
                                        {step.tags.map((tag) => (
                                            <span key={tag} className={`st-home-flow-tag${step.highlight ? ' st-home-flow-tag-highlight' : ''}`}>{tag}</span>
                                        ))}
                                    </div>
                                </article>
                                {index < content.flow.steps.length - 1 ? (
                                    <div className="st-home-flow-arrow" aria-hidden="true">
                                        <ArrowRightIcon />
                                    </div>
                                ) : null}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>

            <section className="st-home-section st-home-code-section">
                <div className="st-home-container st-home-code-layout">
                    <div className="st-home-code-copy st-home-rv">
                        <p className="st-home-eyebrow">{content.code.eyebrow}</p>
                        <h2 className="st-home-section-title st-home-code-title">
                            {content.code.titleLead}<br />
                            {content.code.titleTail}
                        </h2>
                        <p className="st-home-section-lead st-home-code-lead">{content.code.lead}</p>
                        <div className="st-home-code-actions">
                            <a href={docsOverviewPath} className="st-home-btn st-home-btn-primary">
                                <span>{content.code.primaryButton}</span>
                                <ArrowRightIcon />
                            </a>
                            <a href={EXAMPLES_URL} className="st-home-btn st-home-btn-dark" target="_blank" rel="noreferrer">{content.code.secondaryButton}</a>
                        </div>
                    </div>

                    <div className="st-home-code-box st-home-rv">
                        <div className="st-home-code-topbar">
                            <div className="st-home-code-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <span className="st-home-code-filename">{content.code.fileName}</span>
                            <span></span>
                        </div>
                        <pre className="st-home-code-body">
                            <code dangerouslySetInnerHTML={{__html: codeExample}} />
                        </pre>
                    </div>
                </div>
            </section>

            <section className="st-home-cta-section">
                <canvas ref={ctaWarpCanvasRef} className="st-home-warp-canvas"></canvas>
                <div className="st-home-cta-orb st-home-cta-orb-1"></div>
                <div className="st-home-cta-orb st-home-cta-orb-2"></div>
                <div className="st-home-cta-grid"></div>
                <div className="st-home-cta-inner st-home-rv">
                    <h2 className="st-home-cta-title">
                        {content.cta.titleLead}<br />
                        <span className="st-home-gradient st-home-meteor-line">{content.cta.titleAccent}</span>
                    </h2>
                    <p className="st-home-cta-subtitle">{content.cta.lead}</p>
                    <div className="st-home-cta-actions">
                        <a href={quickStartPath} className="st-home-btn st-home-btn-primary st-home-btn-lg">
                            <span>{content.cta.primaryButton}</span>
                            <ArrowRightIcon />
                        </a>
                        <a href={systemConfiguration.github.projectUrl} className="st-home-btn st-home-btn-outline st-home-btn-lg" target="_blank" rel="noreferrer">{content.cta.secondaryButton}</a>
                        <a href={SLACK_URL} className="st-home-btn st-home-btn-outline st-home-btn-lg" target="_blank" rel="noreferrer">{content.cta.tertiaryButton}</a>
                    </div>
                </div>
            </section>

        </div>
    );
}
