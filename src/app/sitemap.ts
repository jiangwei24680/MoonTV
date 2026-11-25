import type { MetadataRoute } from 'next';

const BASE_URL = 'https://moontv.hookjune.qzz.io';

const STATIC_ROUTES = [
  '',
  '/about',
  '/privacy',
  '/guide',
  '/articles',
  '/articles/movies-nov-2026',
  '/articles/tv-nov-2026',
  '/articles/variety-nov-2026',
  '/douban',
  '/channels',
  '/search',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.7,
  }));
}
