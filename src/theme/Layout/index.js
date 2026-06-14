import React from 'react';
import Layout from '@theme-original/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Keep the floating Ask AI entry aligned with the current locale route layout.
function localizePath(locale, path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return locale === 'zh-CN' ? `/zh-CN${normalizedPath}` : normalizedPath;
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5.833 14.167 2.5 17.5V4.167C2.5 3.246 3.246 2.5 4.167 2.5h11.666c.921 0 1.667.746 1.667 1.667v8.333c0 .921-.746 1.667-1.667 1.667H5.833Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.667 7.083h6.666M6.667 10.417h4.166"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GlobalAskAi() {
  const {i18n} = useDocusaurusContext();
  const askAiPath = useBaseUrl(localizePath(i18n.currentLocale, '/ask-ai'));

  return (
    <a href={askAiPath} className="st-global-ask-ai" aria-label="Ask AI">
      <span className="st-global-ask-ai-button">
        <MessageIcon />
        <span>Ask AI</span>
      </span>
      <span className="st-global-ask-ai-dot" aria-hidden="true"></span>
    </a>
  );
}

export default function LayoutWrapper(props) {
  // Inject the global Ask AI shortcut once so docs pages and custom pages stay consistent.
  return (
    <>
      <Layout {...props} />
      <GlobalAskAi />
    </>
  );
}
