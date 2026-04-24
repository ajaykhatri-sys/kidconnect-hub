import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: object;
}

const SITE_NAME = "123Kids";
const BASE_URL = "https://www.123kids.com";
const DEFAULT_IMAGE = `${BASE_URL}/og-default.jpg`;
const DEFAULT_DESC = "Find the best kids camps, classes, events and birthday spots in Palm Beach County, Florida. Trusted by local families.";

export function useSEO({ title, description, image, url, type = "website", schema }: SEOProps = {}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Kids Activities in Palm Beach County`;
  const metaDesc = description || DEFAULT_DESC;
  const metaImage = image || DEFAULT_IMAGE;
  const metaUrl = url ? `${BASE_URL}${url}` : BASE_URL;

  useEffect(() => {
    // Title
    document.title = fullTitle;

    // Helper to set meta tag
    const setMeta = (attr: string, value: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${value}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, value);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Standard meta
    setMeta("name", "description", metaDesc);
    setMeta("name", "robots", "index, follow");
    setMeta("name", "author", "123Kids");

    // Open Graph
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", metaDesc);
    setMeta("property", "og:image", metaImage);
    setMeta("property", "og:url", metaUrl);
    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", SITE_NAME);

    // Twitter Card
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", metaDesc);
    setMeta("name", "twitter:image", metaImage);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", metaUrl);

    // JSON-LD Schema
    if (schema) {
      let schemaEl = document.getElementById("page-schema");
      if (!schemaEl) {
        schemaEl = document.createElement("script");
        schemaEl.id = "page-schema";
        schemaEl.setAttribute("type", "application/ld+json");
        document.head.appendChild(schemaEl);
      }
      schemaEl.textContent = JSON.stringify(schema);
    }
  }, [fullTitle, metaDesc, metaImage, metaUrl, type]);
}
