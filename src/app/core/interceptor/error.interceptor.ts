import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const router = inject(Router);
  const storage = inject(StorageService);

  const isBackendApi = req.url.includes('/api/');
  const isLogout = req.url.includes('/auth/logout');

  return next(req).pipe(

    tap((event) => {
      if (
        isBackendApi &&
        event instanceof HttpResponse &&
        event.body &&
        typeof event.body === 'object' &&
        'message' in event.body
      ) {
        if (isLogout) {
          setTimeout(() => {
            toastr.success((event.body as any).message);
          }, 100);
        } else {
          toastr.success((event.body as any).message);
        }
      }
    }),

    catchError((error: HttpErrorResponse) => {

      if (!isBackendApi) {
        return throwError(() => error);
      }

      // ✅ SSR SAFE FIX
      if (storage.get('isLoggingOut') === 'true') {
        return throwError(() => error);
      }

      if (error.status === 401) {
        toastr.error('Session expired. Please login again.');
        router.navigate(['/login']);
        return throwError(() => error);
      }

      if (error.status === 403) {
        toastr.warning(error.error?.message ?? 'Access denied');
        return throwError(() => error);
      }

      if (error.status === 429) {
        toastr.warning('Too many requests. Please slow down.');
        return throwError(() => error);
      }

      if (error.status >= 500) {
        toastr.error('Server error. Please try again later.');
        return throwError(() => error);
      }

      if (error.status === 0) {
        toastr.error('Unable to connect to server. Please try again.');
        return throwError(() => error);
      }

      toastr.error(error.error?.message ?? 'Something went wrong');
      return throwError(() => error);
    })
  );
};
