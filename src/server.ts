import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine({
  allowedHosts: ['localhost']
});

/* =====================================================
   🔥 1. SERVE STATIC ASSETS (ONLY FILES)
   ===================================================== */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,   // ❌ do NOT auto-serve index.html
    redirect: false,
  })
);

/* =====================================================
   🔥 2. SSR HANDLER (MAIN RENDER)
   ===================================================== */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        next();
      }
    })
    .catch(next);
});

/* =====================================================
   🚀 START SERVER
   ===================================================== */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;

  app.listen(port, (error) => {
    if (error) throw error;

    console.log(`✅ SSR server running at http://localhost:${port}`);
  });
}

/* =====================================================
   🔗 EXPORT HANDLER (for Firebase / CLI)
   ===================================================== */
export const reqHandler = createNodeRequestHandler(app);
