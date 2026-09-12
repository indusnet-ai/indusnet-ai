import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://indusnet-ai.com";

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/industries",
    "/training",
    "/assessment",
    "/portfolio",
    "/blog",
    "/contact",
    "/careers",
  ];

  const blogSlugs = [
    "what-is-rag",
    "ai-agents-vs-chatbots",
    "hipaa-compliant-ai-healthcare",
    "future-of-genai-on-premise",
    "ai-automation-trends-enterprise",
  ];

  const staticEntries = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const blogEntries = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}
