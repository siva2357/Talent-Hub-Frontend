import 'zone.js'; // 👈 MUST BE FIRST
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    provideMonacoEditor(),
    provideAnimationsAsync()
  ]
}).catch(err => console.error(err));
