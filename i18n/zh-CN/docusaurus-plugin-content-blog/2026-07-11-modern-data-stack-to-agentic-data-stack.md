---
slug: modern-data-stack-to-agentic-data-stack
title: "从 Modern Data Stack 到 Agentic Data Stack：为什么 Apache SeaTunnel 值得被理解为数据集成运行时"
tags: [Architecture, Data Integration, Lakehouse]
---

过去十年，Modern Data Stack 改变了企业建设数据平台的方式。数据摄取、Lakehouse 或云数仓、dbt、编排系统、指标层、BI 与治理工具，被重新拆分成一组可以灵活组合的模块化能力。它让数据平台从过去那种重型、封闭、强耦合的体系，逐步演化成一个更开放、更云原生、也更容易扩展的现代工程系统。

但当企业真正把这套体系跑到生产环境，另一个事实会越来越明显：整个平台的输入质量、变化速度和可恢复性，往往还是取决于最前面的那一层，也就是数据集成。

也正因为如此，下一代数据工程体系的关键问题，已经不再只是“把数据放到哪里”，而是“数据如何持续、可靠、可治理地进入平台”。从这个角度看，Apache SeaTunnel 的价值，不应该只被理解成一个 connector 工具，而更应该被理解成面向现代数据平台和未来 Agent 系统的 Data Integration Runtime。

## 一、Modern Data Stack 让平台更模块化了，但也低估了“数据进入平台”这件事

Modern Data Stack 的贡献非常大。它把传统数据平台中混在一起的一大团能力，拆成了更清晰的层次：数据摄取负责 E，Lakehouse / Warehouse 负责统一存储与计算，dbt 负责大部分建模与转换，编排系统负责任务生命周期，治理、质量、指标与 BI 负责把数据价值推向业务侧。

这种分层让企业更容易选型，也更容易把不同技术组合成适合自己的平台。但在真实生产环境里，最容易被低估的恰恰是最前面的数据摄取层。因为所谓“把数据同步进来”从来都不只是一个连接器问题，它很快会变成一整套持续运行的问题：要不要做 CDC、如何做增量捕获、如何处理 schema drift、如何控制源端压力、如何在失败后恢复、如何避免重复写入、如何让下游接收到更健康的数据。

换句话说，Modern Data Stack 让企业重新认识了 Lakehouse 和建模层的重要性，但今天我们还需要继续往前走一步：重新认识数据集成层本身的工程价值。它决定了后面所有层看到的事实是否完整、及时、一致、可恢复。

![图 1：从 Modern Data Stack 到 Agentic Data Stack，总览 SeaTunnel 作为 Data Integration Runtime 的位置。](/image/20260711/modern-data-stack-to-agentic-data-stack/01-overview.jpg)

## 二、从 ETL 到 ELT，再到 EtLT：真正变化的是责任边界，不只是术语

传统 ETL 的逻辑是先 Transform 再 Load。它适合规则明确、边界稳定、变化不快的场景。优势是进入目标系统之前就已经把数据处理得比较规整，但代价是前置链路重、灵活性弱，一旦业务变化频繁，维护成本就会持续上升。

ELT 则把更多事情推到目标端去做：先 Extract，再 Load，最后在 Lakehouse 或云数仓里 Transform。它充分利用了现代底座更强的存储和计算能力，让企业能保留更多原始数据，也让分析建模更灵活。

但 Pure ELT 并不总是最优解。如果什么都先加载进去，再统一处理，那么 schema drift、脏字段、CDC 事件差异、敏感数据、重复记录、格式不一致等问题，也会被原样推进平台。后面的 Lakehouse、dbt、语义层和分析团队，就不得不为前面没有处理好的工程问题买单。

这也是 EtLT 变得重要的原因。EtLT 并不是重新回到重型 ETL，而是在 Load 之前增加一层必要的 lightweight transform：先做轻量标准化、过滤、映射、路由、CDC 事件整理和结构适配，再进入统一底座，最后再由 dbt、SQL 模型和语义层完成真正面向业务的大 Transform。它重新划分的不是字母顺序，而是工程责任边界。

![图 2：ETL、ELT 与 EtLT 的区别。EtLT 把进入平台前必须处理好的工程问题前移，但没有把所有业务逻辑都前移。](/image/20260711/modern-data-stack-to-agentic-data-stack/02-etl-elt-etlt.jpg)

## 三、SeaTunnel 在 EtLT 里的位置：它更像运行时，而不只是连接器集合

当我们把视角切到 EtLT，就会发现 SeaTunnel 的定位非常自然。它最适合承担的是 E + 小写 t + L：连接异构数据源、执行 CDC / 增量采集、完成轻量 transform，并把数据稳定送入 Lakehouse、分析引擎或下游存储系统。

这也是 SeaTunnel 和单纯 connector catalog 的区别。企业真正需要的不是“能不能连上”，而是“连上之后能不能持续跑、稳定跑、出错后恢复、处理状态，并把数据准备成下游可消费的样子”。

从工程本质看，更准确的表达不是“SeaTunnel 是一个数据同步工具”，而是“SeaTunnel 是面向现代数据平台的数据集成运行时”。结合不同 connector、执行引擎和配置方式，它可以承接 checkpoint 恢复、schema-aware 处理、可靠交付等模式，这恰恰是 EtLT 最需要的一层。

![图 3：SeaTunnel 在 EtLT 中承担 E + lightweight t + L。它负责把数据准备到适合进入平台的状态，而不是替代后续的业务建模层。](/image/20260711/modern-data-stack-to-agentic-data-stack/03-seatunnel-in-etlt.jpg)

## 四、为什么 Pure ELT 会开始失灵：好分析的前提，是先有一次“好落地”

很多团队刚开始做现代数据平台时，会天然倾向于 Pure ELT：既然 Lakehouse 足够强，那就先全量装进去，后面再慢慢整理。这种思路在早期、简单或探索性场景里没有问题，但只要进入高频变更、CDC、多源异构和持续生产运行阶段，问题就会迅速冒出来。

schema drift 会直接带进平台，让表结构越来越难治理；脏字段和敏感字段未经处理就落地，会抬高治理与合规成本；不同来源的 CDC 事件差异会把复杂度推给下游模型；重复和噪声记录增多后，分析结果会越来越依赖补救性清洗。

EtLT 的意义就在这里。它不是为了把所有业务逻辑都搬回前置层，而是为了先把 landing 这一步做好：把输入标准化、把 schema-aware 处理做好、把 CDC 事件整理清楚、把必要的过滤和路由完成，再把数据送进 Lakehouse。只有这样，下游的 dbt、SQL 模型、语义层和指标层，才不会一开始就建立在混乱输入上。

![图 4：Pure ELT 的问题不在于“先 Load”本身，而在于跳过了进入平台之前那层必要的工程标准化。](/image/20260711/modern-data-stack-to-agentic-data-stack/04-pure-elt-breakdown.jpg)

## 五、到了 Agent 时代，SeaTunnel 会更像“可被调用的数据执行层”

如果说 Modern Data Stack 解决的是工具模块化，那么 Agentic Data Stack 解决的就是工具可调用。未来的数据平台不会只是让人手动点界面、配任务、看日志，而会越来越多地让 Agent 围绕目标去理解系统、分析上下文、规划动作、验证结果，并根据反馈不断优化。

在这个闭环里，Agent 负责的是理解与决策：识别目标属于什么业务语境，分析 lineage、依赖和影响范围，判断该走 ETL、ELT 还是 EtLT，决定调用哪些工具、承担哪些风险。

SeaTunnel 负责的则是把这些决策变成真正可执行的数据动作。更准确地说，它可以通过执行 API、编排集成或更高层控制层，承接同步、CDC 执行、受控重跑、选择性重载以及可恢复交付等动作。Agent 只有在能够调用可靠的数据执行系统时，才真正具备“行动力”，而这正是运行时层的重要性所在。

![图 5：Agent 负责目标理解与动作规划，SeaTunnel 负责把规划落成真实的数据流动。](/image/20260711/modern-data-stack-to-agentic-data-stack/05-agents-use-seatunnel.jpg)

## 六、最终形态：SeaTunnel 不只是 Modern Data Stack 的一个组件，而是 Agentic Data Stack 的运行时基础设施之一

如果用分层视角来看下一代数据工程平台，我们大致会看到这样一套结构：最底层是 Data Sources；其上是 Data Integration Runtime；再往上是 Unified Data Foundation；然后是 Transformation & Semantics；再上面是 Orchestration & Governance；最上层才是 Agent Layer。

在这个结构里，SeaTunnel 所在的位置非常关键。它处于“数据源”和“统一数据底座”之间，负责把原始世界里的异构变化，转化成平台能够持续承接的标准化输入。没有这一层，Lakehouse 更像一个被动接收数据的容器；有了这一层，Lakehouse 才更有机会成为稳定的统一事实底座。

也正因为如此，SeaTunnel 不应该只被理解成某个时代里的“同步工具”。在 Modern Data Stack 里，它承担的是更真实、更生产级的数据集成职责；到了 Agentic Data Stack 里，它进一步成为让数据工程系统从“能分析”走向“能行动”的运行时基础设施之一。

![图 6：Agentic Data Stack 的分层视图，SeaTunnel 位于 Data Integration Runtime 层。](/image/20260711/modern-data-stack-to-agentic-data-stack/06-agentic-data-stack-layers.jpg)

## 结语

从 Modern Data Stack 走向 Agentic Data Stack，真正变化的并不是多了一个大模型界面，而是数据工程的操作范式正在改变：过去是人定义流程、系统执行流程；未来会越来越变成人定义目标、系统生成动作、工具执行动作、反馈再回流到系统。

在这个变化里，Lakehouse 很重要，dbt 很重要，编排和治理也都很重要。但如果要问“谁负责把真实世界的数据变化，持续、可靠、可恢复地带入平台”，答案仍然会指向数据集成运行时。

这正是 Apache SeaTunnel 的独特价值所在。它不是简单的连接器列表，而是让整个数据平台真正运转起来的一层关键基础设施。
