import type { MetadataRoute } from "next"
import { stories } from "@/lib/content"

const BASE_URL = "https://skillistan.org"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/programs", "/events", "/stories", "/volunteer", "/contact"].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }))

  const storyRoutes = stories.map((story) => ({
    url: `${BASE_URL}/stories/${story.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }))

  return [...staticRoutes, ...storyRoutes]
}
