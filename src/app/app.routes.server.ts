import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [

  // ✅ Dynamic routes → SSR (no prerender)
  {
    path: 'user/jobprofile/:id/job-details',
    renderMode: RenderMode.Server,
  },
  {
    path: 'user/project/:id/project-details',
    renderMode: RenderMode.Server,
  },
  {
    path: 'user/my-jobposts/:id/job-applications',
    renderMode: RenderMode.Server,
  },
  {
    path: 'user/talents/:id/profile',
    renderMode: RenderMode.Server,
  },
  {
  path: 'blog/:id/details',
  renderMode: RenderMode.Server
},

  // ✅ Static routes → prerender (optional)
  {
    path: 'home',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'about',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Server, // 🔥 NOT Prerender
  },
];
