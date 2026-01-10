import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

(self as any).MonacoEnvironment = {
  getWorkerUrl: function (_moduleId: string, label: string) {
    const base = `${location.origin}/assets/monaco/vs`;

    switch (label) {
      case 'typescript':
      case 'javascript':
        return `${base}/language/typescript/tsWorker.js`;
      case 'json':
        return `${base}/language/json/jsonWorker.js`;
      case 'css':
        return `${base}/language/css/cssWorker.js`;
      case 'html':
        return `${base}/language/html/htmlWorker.js`;
      default:
        return `${base}/editor/editor.worker.js`;
    }
  }
};

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    provideMonacoEditor(),
    provideAnimationsAsync()
  ]
}).catch(console.error);
