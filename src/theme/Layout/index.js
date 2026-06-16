import React from 'react';
import Head from '@docusaurus/Head';
import Layout from '@theme-original/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const ASK_AI_TRIGGER_ID = 'st-global-ask-ai-trigger';

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
  return (
    <button id={ASK_AI_TRIGGER_ID} type="button" className="st-global-ask-ai" aria-label="Ask AI">
      <span className="st-global-ask-ai-button">
        <MessageIcon />
        <span>Ask AI</span>
      </span>
      <span className="st-global-ask-ai-dot" aria-hidden="true"></span>
    </button>
  );
}

export default function LayoutWrapper(props) {
  const {i18n} = useDocusaurusContext();
  const widgetLanguage = i18n.currentLocale === 'zh-CN' ? 'zh' : 'en';

  // Inject the global Ask AI shortcut once so docs pages and custom pages stay consistent.
  return (
    <>
      <Head>
        <script
          async
          id="st-kapa-widget-script"
          src="https://widget.kapa.ai/kapa-widget.bundle.js"
          data-website-id="3a335e8d-d400-4c7d-baad-d820ee0600a7"
          data-project-name="Apache SeaTunnel"
          data-project-logo="https://seatunnel.apache.org/image/logo.png"
          data-project-color="#444FD9"
          data-language={widgetLanguage}
          data-button-hide="true"
          data-modal-override-open-id-ask-ai={ASK_AI_TRIGGER_ID}
          data-modal-disclaimer="This is a custom LLM with access to all [SeaTunnel documentation](https://seatunnel.apache.org/docs/introduction/about)."
          data-consent-required="true"
          data-consent-screen-disclaimer="By clicking &quot;I agree, let's chat&quot;, you consent to the use of the AI assistant in accordance with kapa.ai's [Privacy Policy](https://www.kapa.ai/content/privacy-policy). This service uses reCAPTCHA, which requires your consent to Google's [Privacy Policy](https://policies.google.com/privacy) and [Terms of Service](https://policies.google.com/terms). By proceeding, you explicitly agree to both kapa.ai's and Google's privacy policies."
          data-bot-protection-mechanism="hcaptcha"
        ></script>
      </Head>
      <Layout {...props} />
      <GlobalAskAi />
    </>
  );
}
