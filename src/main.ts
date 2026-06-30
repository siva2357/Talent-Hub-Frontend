import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

(window as any).DEPLOY_TIMESTAMP = '2026-06-30-update';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    provideAnimationsAsync()
  ],
}).catch(console.error);
