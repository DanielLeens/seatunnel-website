import React, {useEffect} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Home from './home';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function() {
    const isBrowser = useIsBrowser();
    const {siteConfig} = useDocusaurusContext();

    useEffect(() => {
        if (!isBrowser) {
            return undefined;
        }

        document.body.classList.add('seatunnel-homepage-page');
        const nav = document.getElementsByTagName('nav')[0];
        nav?.classList.add('index-nav');

        return () => {
            document.body.classList.remove('seatunnel-homepage-page');
            nav?.classList.remove('index-nav');
        };
    }, [isBrowser]);

    return (
        <Layout
            title={siteConfig.title}
            description="Apache SeaTunnel is the open source data integration platform for batch, CDC, streaming, and multi-engine data movement."
            noFooter
            wrapperClassName="seatunnel-homepage-shell">
            <main>
                <Home />
            </main>
        </Layout>
    );
}
