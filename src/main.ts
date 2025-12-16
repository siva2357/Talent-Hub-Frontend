import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    provideMonacoEditor()
  ]
}).catch(err => console.error(err));
