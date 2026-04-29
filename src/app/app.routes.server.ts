import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [

  // ✅ Public dynamic content (good for SEO)
  {
    path: 'blog/:id/details',
    renderMode: RenderMode.Server
  },

  // ❌ Protected pages → CLIENT ONLY
  {
    path: 'user/**',
    renderMode: RenderMode.Client
  },

  // ✅ Static pages
  {
    path: 'home',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'about',
    renderMode: RenderMode.Prerender,
  },

  // fallback
  {
    path: '**',
    renderMode: RenderMode.Client
  },
];
