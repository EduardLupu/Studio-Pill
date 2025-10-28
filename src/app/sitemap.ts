import { MetadataRoute } from 'next'

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://studiopill.com/',
      lastModified: new Date(),
    },
    {
      url: 'https://studiopill.com/about',
      lastModified: new Date(),
    },
  ]
}