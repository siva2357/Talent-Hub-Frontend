import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    provideAnimationsAsync()
  ]
}).catch(console.error);
