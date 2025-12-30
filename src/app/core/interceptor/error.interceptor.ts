import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const isBackendApi = req.url.includes('/api/');

  return next(req).pipe(

    // ✅ SUCCESS HANDLING
    tap((event) => {
      if (
        isBackendApi &&
        event instanceof HttpResponse &&
        event.body &&
        typeof event.body === 'object' &&
        'message' in event.body
      ) {
        const body = event.body as { message: string };
        toastr.success(body.message);
      }
    }),

    // ❌ ERROR HANDLING
    catchError((error: HttpErrorResponse) => {

      if (!isBackendApi) {
        return throwError(() => error);
      }

      let message = 'Something went wrong';

      if (error.error?.message) {
        message = error.error.message;
      }

      if (error.status === 0) {
        message = 'Unable to connect to server. Please try again.';
      }

      if (error.status === 401) {
        message = 'Session expired. Please login again.';
      }

      toastr.error(message);
      return throwError(() => error);
    })
  );
};
