import React, {useEffect} from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import '../access-hub.less';

const versions = require('../../../versions.json');
const SLACK_DIRECT_URL = 'https://s.apache.org/seatunnel-slack';

function localizePath(locale: string, path: string) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return locale === 'zh-CN' ? `/zh-CN${normalizedPath}` : normalizedPath;
}

export default function AskAiPage() {
    const {i18n} = useDocusaurusContext();
    const locale = i18n.currentLocale;
    const isZh = locale === 'zh-CN';
    const version = versions[0];

    useEffect(() => {
        document.body.classList.add('seatunnel-hub-page');
        return () => document.body.classList.remove('seatunnel-hub-page');
    }, []);

    const docsOverviewPath = useBaseUrl(localizePath(locale, `/docs/${version}/introduction/about`));
    const quickStartPath = useBaseUrl(localizePath(locale, `/docs/${version}/getting-started/locally/quick-start-seatunnel-engine`));
    const connectorsPath = useBaseUrl(localizePath(locale, `/docs/${version}/connectors/source`));
    const transformsPath = useBaseUrl(localizePath(locale, `/docs/${version}/transforms`));
    const communityPath = useBaseUrl(localizePath(locale, '/community/contribution_guide/contribute'));

    const content = isZh ? {
        titleLead: 'Ask',
        titleAccent: 'AI',
        subtitle: '优先从 SeaTunnel 官方资源里拿到准确答案。这里整理了最常用、可直接访问的文档、连接器、示例和社区入口。',
        note: '如果你在排查 connector、配置、运行时行为或升级问题，这几个入口是目前最可靠的第一手资料。',
        primaryButton: '阅读文档',
        secondaryButton: '快速开始',
        cards: [
            {
                kicker: 'Documentation',
                title: '概览与架构',
                text: '从项目定位、核心能力和执行引擎开始，先建立完整心智模型。',
                href: docsOverviewPath,
            },
            {
                kicker: 'Connectors',
                title: '连接器目录',
                text: '按 source 和 sink 查看可用连接器，确认能力边界和配置入口。',
                href: connectorsPath,
            },
            {
                kicker: 'Transforms',
                title: '转换能力',
                text: '查看轻量转换组件，判断哪些逻辑应该放在链路中完成。',
                href: transformsPath,
            },
            {
                kicker: 'Examples',
                title: '官方示例',
                text: '直接参考真实配置示例，减少从零试错的成本。',
                href: 'https://github.com/apache/seatunnel/tree/dev/seatunnel-examples',
            },
            {
                kicker: 'Community',
                title: '贡献与社区',
                text: '查看社区参与方式、问题反馈入口和协作规则。',
                href: communityPath,
            },
            {
                kicker: 'Support',
                title: 'Slack 入口',
                text: '如果你需要实时交流，可以直接打开 Apache SeaTunnel 官方 Slack 工作区。',
                href: SLACK_DIRECT_URL,
            },
        ],
    } : {
        titleLead: 'Ask',
        titleAccent: 'AI',
        subtitle: 'Start with the official SeaTunnel resources that answer most connector, configuration, runtime, and upgrade questions accurately.',
        note: 'For real production questions, the official docs, examples, and community channels remain the fastest path to reliable answers.',
        primaryButton: 'Read the Docs',
        secondaryButton: 'Quick Start',
        cards: [
            {
                kicker: 'Documentation',
                title: 'Overview and architecture',
                text: 'Start with project scope, core capabilities, and execution engines to build the right mental model.',
                href: docsOverviewPath,
            },
            {
                kicker: 'Connectors',
                title: 'Connector catalog',
                text: 'Browse native source and sink connectors to confirm capability boundaries and configuration entry points.',
                href: connectorsPath,
            },
            {
                kicker: 'Transforms',
                title: 'Transform library',
                text: 'Review lightweight transform options before pushing logic downstream.',
                href: transformsPath,
            },
            {
                kicker: 'Examples',
                title: 'Official examples',
                text: 'Use real pipeline examples to shorten setup and debugging time.',
                href: 'https://github.com/apache/seatunnel/tree/dev/seatunnel-examples',
            },
            {
                kicker: 'Community',
                title: 'Contribution and support',
                text: 'Reach the contribution guide, issue paths, and community collaboration channels.',
                href: communityPath,
            },
            {
                kicker: 'Support',
                title: 'Slack access',
                text: 'Open the official Apache SeaTunnel Slack workspace for direct real-time discussion.',
                href: SLACK_DIRECT_URL,
            },
        ],
    };

    return (
        <Layout
            title={isZh ? 'Ask AI' : 'Ask AI'}
            description={isZh ? 'SeaTunnel 官方知识入口与社区支持页面。' : 'Official SeaTunnel knowledge entry points and support routes.'}>
            <main className="st-hub-page">
                <div className="st-hub-container">
                    <section className="st-hub-hero">
                        <p className="st-hub-eyebrow">SeaTunnel</p>
                        <h1 className="st-hub-title">
                            {content.titleLead} <span className="st-hub-gradient">{content.titleAccent}</span>
                        </h1>
                        <p className="st-hub-subtitle">{content.subtitle}</p>
                        <div className="st-hub-actions">
                            <a href={docsOverviewPath} className="st-hub-button st-hub-button-primary">{content.primaryButton}</a>
                            <a href={quickStartPath} className="st-hub-button st-hub-button-secondary">{content.secondaryButton}</a>
                        </div>
                    </section>

                    <div className="st-hub-note">{content.note}</div>

                    <section className="st-hub-grid">
                        {content.cards.map((card) => {
                            const isExternal = card.href.startsWith('http');
                            return (
                                <a
                                    key={card.title}
                                    href={card.href}
                                    className="st-hub-card"
                                    {...(isExternal ? {target: '_blank', rel: 'noreferrer'} : {})}>
                                    <p className="st-hub-card-kicker">{card.kicker}</p>
                                    <h2 className="st-hub-card-title">{card.title}</h2>
                                    <p className="st-hub-card-text">{card.text}</p>
                                </a>
                            );
                        })}
                    </section>
                </div>
            </main>
        </Layout>
    );
}
