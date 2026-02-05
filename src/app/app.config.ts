import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptor/error.interceptor';
import { authInterceptor } from './core/interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    provideHttpClient(
      withInterceptors([
        authInterceptor,   // 👈 FIRST (adds JWT)
        errorInterceptor   // 👈 SECOND (handles errors)
      ])
    ),
    provideToastr({
      positionClass: 'toast-top-right',
      timeOut: 3000,
      preventDuplicates: true,
      closeButton: true
    })
  ]
};
