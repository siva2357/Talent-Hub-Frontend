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


  // ❌ AUTH FAILURE (ONLY 401)
  if (error.status === 401) {
    toastr.error('Session expired. Please login again.');
    // optional: redirect to login here
    return throwError(() => error);
  }

  // ✅ BUSINESS RULE (403)
  if (error.status === 403) {
    toastr.warning(message);
    return throwError(() => error);
  }


      toastr.error(message);
      return throwError(() => error);
    })
  );
};
