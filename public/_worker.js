/**
 * 123kids.com - SEO Worker
 * Intercepts requests to /listing/* pages and injects
 * server-side meta tags before the page reaches the browser.
 * All other requests pass through to the Pages site normally.
 */

const DB_ID = "1d0993c6-cd55-4a60-aa8a-da7d25214549";
const SITE_NAME = "123Kids";
const BASE_URL = "https://www.123kids.com";
const DEFAULT_DESC = "Find the best kids camps, classes, events and birthday spots in Palm Beach County, Florida. Trusted by local families.";
const DEFAULT_IMAGE = `${BASE_URL}/og-default.jpg`;

const CATEGORY_KEYWORDS = {
  "Camps": "kids summer camps, day camps, children camps",
  "Classes": "kids classes, children activities, youth programs",
  "Events": "family events, kids events, children activities",
  "Birthday Spots": "kids birthday party venues, birthday places for kids",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Only intercept listing detail pages
    const listingMatch = url.pathname.match(/^\/listing\/([a-f0-9-]+)$/);
    if (!listingMatch) {
      // Pass everything else through to Pages
      return env.ASSETS.fetch(request);
    }

    const listingId = listingMatch[1];

    try {
      // Fetch listing data from D1
      const listing = await env.DB.prepare(
        "SELECT * FROM listings WHERE id = ?"
      ).bind(listingId).first();

      if (!listing) {
        return env.ASSETS.fetch(request);
      }

      // Get first photo
      const photoRow = await env.DB.prepare(
        "SELECT photo_url FROM listing_photos WHERE listing_id = ? LIMIT 1"
      ).bind(listingId).first();

      const photo = photoRow?.photo_url || DEFAULT_IMAGE;

      // Build SEO content
      const title = `${listing.name} — ${listing.category} in ${listing.city}, FL | ${SITE_NAME}`;
      const description = listing.description
        ? listing.description.slice(0, 155) + (listing.description.length > 155 ? "..." : "")
        : `${listing.name} offers ${listing.category?.toLowerCase()} for kids in ${listing.city}, Florida.${listing.rating ? ` Rated ${listing.rating}/5 by ${listing.review_count} parents.` : ""} Book online at 123Kids.`;
      const canonicalUrl = `${BASE_URL}/listing/${listing.id}`;
      const keywords = `${listing.name}, ${CATEGORY_KEYWORDS[listing.category] || "kids activities"}, ${listing.city} Florida, Palm Beach County`;

      // JSON-LD Schema
      const schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": listing.name,
        "description": description,
        "image": photo,
        "url": canonicalUrl,
        ...(listing.phone ? { "telephone": listing.phone } : {}),
        ...(listing.website ? { "sameAs": [listing.website] } : {}),
        "address": {
          "@type": "PostalAddress",
          "streetAddress": listing.address?.split(",")[0] || "",
          "addressLocality": listing.city,
          "addressRegion": "FL",
          "addressCountry": "US",
          "postalCode": listing.zip || "",
        },
        ...(listing.lat ? {
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": listing.lat,
            "longitude": listing.lng,
          }
        } : {}),
        ...(listing.rating ? {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": listing.rating,
            "reviewCount": listing.review_count || 1,
            "bestRating": 5,
            "worstRating": 1,
          }
        } : {}),
      };

      // Breadcrumb schema
      const breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
          { "@type": "ListItem", "position": 2, "name": "Listings", "item": `${BASE_URL}/listings` },
          { "@type": "ListItem", "position": 3, "name": listing.category, "item": `${BASE_URL}/listings?category=${encodeURIComponent(listing.category)}` },
          { "@type": "ListItem", "position": 4, "name": listing.name, "item": canonicalUrl },
        ],
      };

      // Meta tags HTML to inject
      const metaTags = `
    <!-- SEO: Dynamic meta tags injected by Cloudflare Worker -->
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="keywords" content="${escapeHtml(keywords)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(photo)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:locale" content="en_US" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(photo)}" />

    <!-- JSON-LD Schema -->
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
    <!-- End SEO -->`;

      // Fetch the original HTML from Pages
      const originalResponse = await env.ASSETS.fetch(request);
      const originalHtml = await originalResponse.text();

      // Inject meta tags — replace the default <title> tag and add all meta tags
      let modifiedHtml = originalHtml
        .replace(
          /<title>[^<]*<\/title>/,
          metaTags
        );

      // If no title tag found, inject after <head>
      if (!modifiedHtml.includes("SEO: Dynamic meta tags")) {
        modifiedHtml = originalHtml.replace("<head>", `<head>${metaTags}`);
      }

      return new Response(modifiedHtml, {
        status: originalResponse.status,
        headers: {
          ...Object.fromEntries(originalResponse.headers),
          "Content-Type": "text/html;charset=UTF-8",
          "Cache-Control": "public, max-age=3600",
        },
      });

    } catch (err) {
      // On any error, just serve the original page
      console.error("SEO Worker error:", err);
      return env.ASSETS.fetch(request);
    }
  },
};

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
