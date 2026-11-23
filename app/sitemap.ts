import {guides} from '@/lib/public-guides';
import type { MetadataRoute } from 'next';

const siteUrl = 'https://game-platform-rosy.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {url:siteUrl+'/guides',lastModified,changeFrequency:'monthly',priority:0.8},
    ...guides.map(g=>({url:siteUrl+'/guides/'+g.slug,lastModified,changeFrequency:'monthly' as const,priority:0.8})),
    { url: siteUrl, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/lobby`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/dernier-conseil`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/metropole`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/traitre-a-bord`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/frontieres-express`, lastModified, changeFrequency: 'weekly', priority: 0.9 }
  ];
}
