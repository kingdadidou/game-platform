import type { MetadataRoute } from 'next';

const siteUrl = 'https://game-platform-rosy.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: siteUrl, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/lobby`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/dernier-conseil`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/metropole`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/traitre-a-bord`, lastModified, changeFrequency: 'weekly', priority: 0.9 }
  ];
}
