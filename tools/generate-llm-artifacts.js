const fs = require("fs");
const path = require("path");
const { createMatcher } = require("@docusaurus/utils");

const versions = require("../versions.json");
const config = require("../docusaurus.config.js");

const ROOT_DIR = path.resolve(__dirname, "..");
const BUILD_DIR = path.join(ROOT_DIR, "build");
const EN_BUILD_DIR = BUILD_DIR;
const ZH_BUILD_DIR = path.join(BUILD_DIR, "zh-CN");
const EN_SITEMAP_PATH = path.join(BUILD_DIR, "sitemap.xml");
const ZH_SITEMAP_PATH = path.join(ZH_BUILD_DIR, "sitemap.xml");
const LLMS_PATH = path.join(BUILD_DIR, "llms.txt");
const LLMS_FULL_PATH = path.join(BUILD_DIR, "llms-full.txt");
const ROBOTS_PATH = path.join(BUILD_DIR, "robots.txt");
const VERSIONED_DOC_PATHS = new Set(
  versions.flatMap((version) => [`/docs/${version}`, `/zh-CN/docs/${version}`])
);
const VERSIONED_DOC_PREFIXES = versions.flatMap((version) => [
  `/docs/${version}/`,
  `/zh-CN/docs/${version}/`,
]);
const HTML_ROUTE_EXCLUDED_PATHS = new Set(["/search", "/zh-CN/search"]);
const META_TAG_PATTERN = /<meta\b[^>]*>/gi;
const HTML_ATTRIBUTE_PATTERN = /([^\s=]+)\s*=\s*["']([^"']*)["']/g;
const DEFAULT_LOCALE = config.i18n?.defaultLocale || "en";
const NON_DEFAULT_LOCALES = (config.i18n?.locales || []).filter(
  (locale) => locale !== DEFAULT_LOCALE
);
const SITEMAP_IGNORE_PATTERNS = getLocalizedSitemapIgnorePatterns(
  getConfiguredSitemapIgnorePatterns()
);
const SITEMAP_IGNORE_MATCHER = createMatcher(SITEMAP_IGNORE_PATTERNS);

/**
 * Return the canonical site origin from the Docusaurus config.
 *
 * @returns {string}
 */
function getSiteOrigin() {
  return new URL(config.url).origin;
}

/**
 * Normalize a public route path into a stable URL pathname.
 *
 * @param {string} routePath
 * @returns {string}
 */
function normalizeRoutePath(routePath) {
  if (!routePath.startsWith("/")) {
    return `/${routePath}`;
  }

  return routePath.replace(/\/{2,}/g, "/");
}

/**
 * Convert a public route path into an absolute URL.
 *
 * @param {string} siteOrigin
 * @param {string} routePath
 * @returns {string}
 */
function toAbsoluteUrl(siteOrigin, routePath) {
  return new URL(normalizeRoutePath(routePath), `${siteOrigin}/`).toString();
}

/**
 * Read the sitemap ignore patterns that the Docusaurus site already enforces.
 *
 * @returns {string[]}
 */
function getConfiguredSitemapIgnorePatterns() {
  const classicPreset = (config.presets || []).find(
    (preset) =>
      Array.isArray(preset) &&
      preset[1] &&
      typeof preset[1] === "object" &&
      preset[1].sitemap
  );

  return classicPreset?.[1]?.sitemap?.ignorePatterns || [];
}

/**
 * Extend the configured sitemap ignore patterns to localized route prefixes.
 *
 * @param {string[]} ignorePatterns
 * @returns {string[]}
 */
function getLocalizedSitemapIgnorePatterns(ignorePatterns) {
  const expandedPatterns = new Set(ignorePatterns);

  for (const pattern of ignorePatterns) {
    if (!pattern.startsWith("/")) {
      continue;
    }

    for (const locale of NON_DEFAULT_LOCALES) {
      if (pattern.startsWith(`/${locale}/`) || pattern === `/${locale}`) {
        continue;
      }

      expandedPatterns.add(`/${locale}${pattern}`);
    }
  }

  return [...expandedPatterns];
}

/**
 * Check whether a route should be excluded from generated sitemap output.
 *
 * @param {string} routePath
 * @returns {boolean}
 */
function isIgnoredSitemapRoute(routePath) {
  return SITEMAP_IGNORE_MATCHER(normalizeRoutePath(routePath));
}

/**
 * Parse a HTML tag attribute map for lightweight metadata checks.
 *
 * @param {string} tag
 * @returns {Record<string, string>}
 */
function parseHtmlAttributes(tag) {
  /** @type {Record<string, string>} */
  const attributes = {};
  let match;

  while ((match = HTML_ATTRIBUTE_PATTERN.exec(tag)) !== null) {
    attributes[match[1].toLowerCase()] = match[2];
  }

  HTML_ATTRIBUTE_PATTERN.lastIndex = 0;
  return attributes;
}

/**
 * Check whether the built page opts out of indexing through robots metadata.
 *
 * @param {string} htmlPath
 * @returns {boolean}
 */
function hasNoIndexRobotsMeta(htmlPath) {
  const html = fs.readFileSync(htmlPath, "utf8");
  const metaTags = html.match(META_TAG_PATTERN) || [];

  return metaTags.some((tag) => {
    const attributes = parseHtmlAttributes(tag);
    const robotsKey =
      attributes.name?.toLowerCase() === "robots" ||
      attributes.property?.toLowerCase() === "robots";
    return robotsKey && attributes.content?.toLowerCase().includes("noindex");
  });
}

/**
 * Walk a built locale directory and collect the published HTML routes.
 *
 * @param {string} siteOrigin
 * @param {string} localeBuildDir
 * @param {string} localePrefix
 * @param {Set<string>} ignoredTopLevelDirs
 * @returns {string[]}
 */
function readBuiltLocaleUrls(
  siteOrigin,
  localeBuildDir,
  localePrefix,
  ignoredTopLevelDirs
) {
  /** @type {Set<string>} */
  const urls = new Set();

  /**
   * @param {string} dir
   */
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      const relativeToLocaleRoot = path.relative(localeBuildDir, entryPath);

      if (
        entry.isDirectory() &&
        dir === localeBuildDir &&
        ignoredTopLevelDirs.has(entry.name)
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        walk(entryPath);
        continue;
      }

      if (!entry.isFile() || entry.name !== "index.html") {
        continue;
      }

      if (hasNoIndexRobotsMeta(entryPath)) {
        continue;
      }

      const relativeDir = path.relative(localeBuildDir, path.dirname(entryPath));
      const routePath =
        relativeDir === ""
          ? localePrefix || "/"
          : `${localePrefix}/${relativeDir.replace(/\\/g, "/")}`;
      const normalizedRoutePath = normalizeRoutePath(routePath);

      if (HTML_ROUTE_EXCLUDED_PATHS.has(normalizedRoutePath)) {
        continue;
      }

      if (isIgnoredSitemapRoute(normalizedRoutePath)) {
        continue;
      }

      urls.add(toAbsoluteUrl(siteOrigin, normalizedRoutePath));
    }
  }

  if (!fs.existsSync(localeBuildDir)) {
    throw new Error(`Built locale directory not found: ${localeBuildDir}`);
  }

  walk(localeBuildDir);
  return [...urls].sort((left, right) =>
    new URL(left).pathname.localeCompare(new URL(right).pathname)
  );
}

/**
 * Escape XML-reserved characters inside a sitemap value.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Build a sitemap from the published locale URLs.
 *
 * @param {string[]} urls
 * @returns {string}
 */
function buildSitemapXml(urls) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const url of urls) {
    lines.push("  <url>");
    lines.push(`    <loc>${escapeXml(url)}</loc>`);
    lines.push("    <changefreq>daily</changefreq>");
    lines.push("    <priority>0.5</priority>");
    lines.push("  </url>");
  }

  lines.push("</urlset>", "");
  return lines.join("\n");
}

/**
 * Check whether a published URL belongs to the current public docs tree.
 *
 * @param {string} url
 * @returns {boolean}
 */
function isCurrentDocsUrl(url) {
  const { pathname } = new URL(url);
  const isDocsPath =
    pathname === "/docs" ||
    pathname.startsWith("/docs/") ||
    pathname === "/zh-CN/docs" ||
    pathname.startsWith("/zh-CN/docs/");

  if (!isDocsPath) {
    return false;
  }

  if (VERSIONED_DOC_PATHS.has(pathname)) {
    return false;
  }

  return !VERSIONED_DOC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Split current docs URLs by locale and keep them sorted for stable output.
 *
 * @param {string[]} urls
 * @returns {{en: string[], "zh-CN": string[]}}
 */
function splitDocsUrlsByLocale(urls) {
  const grouped = {
    en: [],
    "zh-CN": [],
  };

  for (const url of urls) {
    const { pathname } = new URL(url);
    if (pathname.startsWith("/zh-CN/docs")) {
      grouped["zh-CN"].push(url);
      continue;
    }

    grouped.en.push(url);
  }

  const sortByPath = (left, right) =>
    new URL(left).pathname.localeCompare(new URL(right).pathname);

  grouped.en.sort(sortByPath);
  grouped["zh-CN"].sort(sortByPath);

  return grouped;
}

/**
 * Pick a human-friendly docs entry point for each locale.
 *
 * @param {string[]} urls
 * @param {"en" | "zh-CN"} locale
 * @returns {string}
 */
function pickDocsHome(urls, locale) {
  if (!urls.length) {
    return "";
  }

  const preferredPaths =
    locale === "zh-CN"
      ? [
          "/zh-CN/docs/about",
          "/zh-CN/docs/introduction/about",
          "/zh-CN/docs/getting-started/overview",
        ]
      : [
          "/docs/about",
          "/docs/introduction/about",
          "/docs/getting-started/overview",
        ];

  for (const preferredPath of preferredPaths) {
    const preferredUrl = urls.find(
      (url) => new URL(url).pathname === preferredPath
    );
    if (preferredUrl) {
      return preferredUrl;
    }
  }

  return urls[0];
}

/**
 * Build the concise llms.txt entrypoint file.
 *
 * @param {string} siteOrigin
 * @param {{en: string[], "zh-CN": string[]}} docsByLocale
 * @returns {string}
 */
function buildLlmsTxt(siteOrigin, docsByLocale) {
  const englishHome = pickDocsHome(docsByLocale.en, "en");
  const chineseHome = pickDocsHome(docsByLocale["zh-CN"], "zh-CN");

  return [
    "# Apache SeaTunnel",
    "",
    "> Machine-readable discovery entry points for the current public Apache SeaTunnel documentation.",
    "",
    `- Canonical site: ${siteOrigin}/`,
    `- Sitemap: ${siteOrigin}/sitemap.xml`,
    `- Chinese sitemap: ${siteOrigin}/zh-CN/sitemap.xml`,
    `- Full docs inventory: ${siteOrigin}/llms-full.txt`,
    englishHome ? `- English docs home: ${englishHome}` : "",
    chineseHome ? `- Chinese docs home: ${chineseHome}` : "",
    `- Current English docs pages: ${docsByLocale.en.length}`,
    `- Current Chinese docs pages: ${docsByLocale["zh-CN"].length}`,
    "- Build source: the scheduled website workflow syncs docs from apache/seatunnel before every build.",
    "- Scope: only public current docs URLs that actually landed in the final built HTML output are listed here.",
    "",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Build the exhaustive llms-full.txt URL inventory.
 *
 * @param {string} siteOrigin
 * @param {{en: string[], "zh-CN": string[]}} docsByLocale
 * @returns {string}
 */
function buildLlmsFullTxt(siteOrigin, docsByLocale) {
  const allDocsCount = docsByLocale.en.length + docsByLocale["zh-CN"].length;
  const lines = [
    "# Apache SeaTunnel Full Documentation Inventory",
    "",
    `- Canonical site: ${siteOrigin}/`,
    `- Source sitemap: ${siteOrigin}/sitemap.xml`,
    `- Source sitemap (zh-CN): ${siteOrigin}/zh-CN/sitemap.xml`,
    `- Total current docs pages: ${allDocsCount}`,
    "",
    "## English",
  ];

  if (docsByLocale.en.length) {
    lines.push(...docsByLocale.en.map((url) => `- ${url}`));
  } else {
    lines.push("- None");
  }

  lines.push("", "## Chinese");

  if (docsByLocale["zh-CN"].length) {
    lines.push(...docsByLocale["zh-CN"].map((url) => `- ${url}`));
  } else {
    lines.push("- None");
  }

  lines.push("");
  return lines.join("\n");
}

/**
 * Build a robots policy that keeps standard discovery paths explicit.
 *
 * @param {string} siteOrigin
 * @returns {string}
 */
function buildRobotsTxt(siteOrigin) {
  const oaiSearchDirective = getRobotDirective(
    process.env.OAI_SEARCHBOT_POLICY,
    "allow"
  );
  const gptBotDirective = getRobotDirective(
    process.env.GPTBOT_POLICY,
    "allow"
  );

  return [
    "# Apache SeaTunnel crawl policy",
    "# OAI-SearchBot governs ChatGPT Search discovery and citation.",
    "# GPTBot governs whether public content may be fetched for OpenAI training crawls.",
    "# GPTBot rules express crawl permission only and do not guarantee model training inclusion.",
    "# ChatGPT-User represents user-triggered access instead of an autonomous indexing path.",
    `# LLM index: ${siteOrigin}/llms.txt`,
    `# Full docs index: ${siteOrigin}/llms-full.txt`,
    "",
    "User-agent: *",
    "Allow: /",
    "",
    "User-agent: OAI-SearchBot",
    oaiSearchDirective,
    "",
    "User-agent: GPTBot",
    gptBotDirective,
    "",
    "User-agent: ChatGPT-User",
    "Allow: /",
    "",
    `Sitemap: ${siteOrigin}/sitemap.xml`,
    `Sitemap: ${siteOrigin}/zh-CN/sitemap.xml`,
    "",
  ].join("\n");
}

/**
 * Convert a policy flag into a robots directive.
 *
 * @param {string | undefined} rawPolicy
 * @param {"allow" | "disallow"} fallbackPolicy
 * @returns {"Allow: /" | "Disallow: /"}
 */
function getRobotDirective(rawPolicy, fallbackPolicy) {
  const normalizedPolicy = (rawPolicy || fallbackPolicy).trim().toLowerCase();
  return normalizedPolicy === "disallow" ? "Disallow: /" : "Allow: /";
}

/**
 * Generate build-time LLM and crawl artifacts from the final built HTML output.
 */
function main() {
  const siteOrigin = getSiteOrigin();
  const englishUrls = readBuiltLocaleUrls(
    siteOrigin,
    EN_BUILD_DIR,
    "",
    new Set(["assets", "zh-CN"])
  );
  const chineseUrls = readBuiltLocaleUrls(
    siteOrigin,
    ZH_BUILD_DIR,
    "/zh-CN",
    new Set(["assets"])
  );
  const publishedUrls = [...new Set([...englishUrls, ...chineseUrls])].sort(
    (left, right) =>
      new URL(left).pathname.localeCompare(new URL(right).pathname)
  );
  const currentDocsUrls = publishedUrls.filter(isCurrentDocsUrl);

  if (!currentDocsUrls.length) {
    throw new Error("No current docs URLs were found in the final built HTML output.");
  }

  const docsByLocale = splitDocsUrlsByLocale(currentDocsUrls);

  if (!docsByLocale.en.length || !docsByLocale["zh-CN"].length) {
    throw new Error(
      "Expected both English and Chinese current docs URLs in the final built HTML output."
    );
  }

  fs.writeFileSync(EN_SITEMAP_PATH, buildSitemapXml(englishUrls));
  fs.writeFileSync(ZH_SITEMAP_PATH, buildSitemapXml(chineseUrls));
  fs.writeFileSync(LLMS_PATH, buildLlmsTxt(siteOrigin, docsByLocale));
  fs.writeFileSync(LLMS_FULL_PATH, buildLlmsFullTxt(siteOrigin, docsByLocale));
  fs.writeFileSync(ROBOTS_PATH, buildRobotsTxt(siteOrigin));

  console.log(
    `Generated discovery artifacts from built HTML output: ${publishedUrls.length} published URLs, ${docsByLocale.en.length} English docs, and ${docsByLocale["zh-CN"].length} Chinese docs.`
  );
}

main();
