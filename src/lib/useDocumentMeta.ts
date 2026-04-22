import { useEffect } from 'react';

interface MetaOptions {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  /** JSON-LD structured data object */
  jsonLd?: Record<string, unknown>;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function setCanonical(url: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = url;
}

const JSON_LD_ID = 'upagraha-json-ld';

function setJsonLd(data: Record<string, unknown> | undefined) {
  const existing = document.getElementById(JSON_LD_ID);
  if (existing) existing.remove();
  if (!data) return;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = JSON_LD_ID;
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}

/**
 * Set document title, description, canonical URL, and structured data
 * for SEO. Resets on unmount to safe defaults so SPA navigation stays clean.
 */
export function useDocumentMeta({ title, description, canonical, type = 'website', jsonLd }: MetaOptions) {
  useEffect(() => {
    const prevTitle = document.title;

    if (title) document.title = title;
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
    }
    if (title) setMeta('property', 'og:title', title);
    setMeta('property', 'og:type', type);
    if (canonical) {
      setCanonical(canonical);
      setMeta('property', 'og:url', canonical);
    }
    setJsonLd(jsonLd);

    return () => {
      document.title = prevTitle;
      setJsonLd(undefined);
    };
  }, [title, description, canonical, type, jsonLd]);
}
