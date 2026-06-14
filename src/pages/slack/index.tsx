import React, {useEffect} from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import '../access-hub.less';

const versions = require('../../../versions.json');
const SLACK_DIRECT_URL = 'https://s.apache.org/seatunnel-slack';
const SLACK_INVITE_MAIL = 'mailto:dev@seatunnel.apache.org?subject=Request%20to%20join%20SeaTunnel%20Slack';
const MAILING_LIST_URL = 'https://lists.apache.org/list.html?dev@seatunnel.apache.org';

function localizePath(locale: string, path: string) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return locale === 'zh-CN' ? `/zh-CN${normalizedPath}` : normalizedPath;
}

export default function SlackPage() {
    const {i18n} = useDocusaurusContext();
    const locale = i18n.currentLocale;
    const isZh = locale === 'zh-CN';
    const version = versions[0];

    useEffect(() => {
        document.body.classList.add('seatunnel-hub-page');
        return () => document.body.classList.remove('seatunnel-hub-page');
    }, []);

    const docsOverviewPath = useBaseUrl(localizePath(locale, `/docs/${version}/introduction/about`));
    const communityPath = useBaseUrl(localizePath(locale, '/community/contribution_guide/contribute'));
    const subscribePath = useBaseUrl(localizePath(locale, '/community/contribution_guide/subscribe'));

    const content = isZh ? {
        titleLead: 'Join SeaTunnel',
        titleAccent: 'Slack',
        subtitle: '官网首页使用官方 Slack 短链直达。这里同时保留直达入口与邮件列表等备用沟通路径。',
        note: '如果直达链接在你的浏览器环境里不可用，再走邮件列表或邀请申请；涉及长期讨论与归档，仍然优先使用官方 mailing list。',
        primaryButton: '打开 Slack',
        secondaryButton: '邮件列表',
        steps: [
            {
                number: '01',
                title: '发送邀请申请',
                text: '通过 dev@seatunnel.apache.org 说明你的背景、问题方向或贡献意向，社区会按流程协助你进入 Slack。',
            },
            {
                number: '02',
                title: '先看社区指南',
                text: '在进入实时讨论前，先了解贡献流程、提问方式和协作约定，能显著提高沟通效率。',
            },
            {
                number: '03',
                title: '异步问题走邮件列表',
                text: '涉及设计讨论、长期归档或需要社区共识的问题，优先使用官方 mailing list。',
            },
        ],
        cards: [
            {
                kicker: 'Direct Link',
                title: '官方直达链接',
                text: '与官网首页一致，直接打开官方 Slack 短链。',
                href: SLACK_DIRECT_URL,
            },
            {
                kicker: 'Community',
                title: '贡献指南',
                text: '查看社区参与方式、Issue 提交流程和协作约定。',
                href: communityPath,
            },
            {
                kicker: 'Subscribe',
                title: '订阅指南',
                text: '了解如何订阅与使用官方开发者邮件列表。',
                href: subscribePath,
            },
            {
                kicker: 'Archive',
                title: '邮件归档',
                text: '查阅历史讨论，避免重复提问并快速定位已有结论。',
                href: MAILING_LIST_URL,
            },
            {
                kicker: 'Documentation',
                title: '文档概览',
                text: '先从官方文档理解能力边界，再进入社区问更精准的问题。',
                href: docsOverviewPath,
            },
            {
                kicker: 'GitHub',
                title: '项目仓库',
                text: '需要反馈 bug、查看 roadmap 或参与代码时，直接访问官方仓库。',
                href: 'https://github.com/apache/seatunnel',
            },
        ],
    } : {
        titleLead: 'Join SeaTunnel',
        titleAccent: 'Slack',
        subtitle: 'The homepage uses the official Slack short link directly. This page keeps that direct link and the fallback community routes in one place.',
        note: 'Use the direct Slack link first. If that route is not usable in your browser environment, fall back to the mailing list or invite request email.',
        primaryButton: 'Open Slack',
        secondaryButton: 'Mailing list',
        steps: [
            {
                number: '01',
                title: 'Request an invite',
                text: 'Email dev@seatunnel.apache.org with your background, question area, or contribution context so the community can route the Slack invite correctly.',
            },
            {
                number: '02',
                title: 'Read the community guide',
                text: 'Review contribution expectations, issue flow, and collaboration norms before jumping into real-time discussion.',
            },
            {
                number: '03',
                title: 'Use the mailing list for async topics',
                text: 'Design decisions, archived answers, and broader community discussions should still flow through the official mailing list.',
            },
        ],
        cards: [
            {
                kicker: 'Direct Link',
                title: 'Official direct link',
                text: 'Use the same direct Slack short link exposed on the homepage.',
                href: SLACK_DIRECT_URL,
            },
            {
                kicker: 'Community',
                title: 'Contribution guide',
                text: 'See how SeaTunnel handles questions, issues, and contribution workflows.',
                href: communityPath,
            },
            {
                kicker: 'Subscribe',
                title: 'Subscription guide',
                text: 'Learn how to subscribe to and use the official developer mailing list.',
                href: subscribePath,
            },
            {
                kicker: 'Archive',
                title: 'Mail archive',
                text: 'Search prior discussions before opening a new thread.',
                href: MAILING_LIST_URL,
            },
            {
                kicker: 'Documentation',
                title: 'Docs overview',
                text: 'Ground your question in the official docs before escalating to the community.',
                href: docsOverviewPath,
            },
            {
                kicker: 'GitHub',
                title: 'Project repository',
                text: 'Use the official repository for bugs, roadmap context, and code-level collaboration.',
                href: 'https://github.com/apache/seatunnel',
            },
        ],
    };

    return (
        <Layout
            title={isZh ? 'Slack 入口' : 'Slack Access'}
            description={isZh ? 'SeaTunnel 社区 Slack 加入入口。' : 'SeaTunnel community Slack access page.'}>
            <main className="st-hub-page">
                <div className="st-hub-container">
                    <section className="st-hub-hero">
                        <p className="st-hub-eyebrow">SeaTunnel Community</p>
                        <h1 className="st-hub-title">
                            {content.titleLead} <span className="st-hub-gradient">{content.titleAccent}</span>
                        </h1>
                        <p className="st-hub-subtitle">{content.subtitle}</p>
                        <div className="st-hub-actions">
                            <a href={SLACK_DIRECT_URL} className="st-hub-button st-hub-button-primary" target="_blank" rel="noreferrer">{content.primaryButton}</a>
                            <a href={MAILING_LIST_URL} className="st-hub-button st-hub-button-secondary" target="_blank" rel="noreferrer">{content.secondaryButton}</a>
                        </div>
                    </section>

                    <div className="st-hub-note">{content.note}</div>

                    <section className="st-hub-grid">
                        {content.cards.map((card) => {
                            const isExternal = card.href.startsWith('http') || card.href.startsWith('mailto:');
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

                    <section className="st-hub-steps">
                        {content.steps.map((step) => (
                            <article key={step.number} className="st-hub-step">
                                <div className="st-hub-step-number">{step.number}</div>
                                <h2 className="st-hub-step-title">{step.title}</h2>
                                <p className="st-hub-step-text">{step.text}</p>
                            </article>
                        ))}
                    </section>
                </div>
            </main>
        </Layout>
    );
}
