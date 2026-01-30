import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const token = localStorage.getItem('JWT_Token');

  // 🚫 Skip auth for public endpoints
  const isAuthEndpoint =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/recruiter/signup') ||
    req.url.includes('/auth/jobSeeker/signup') ||
    req.url.includes('/auth/verify-verification-code') ||
    req.url.includes('/auth/send-verification-code');

  if (token && !isAuthEndpoint) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
