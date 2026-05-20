import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const profileGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  // If not logged in, allow routing to proceed (authGuard will handle protection if needed)
  if (!user) {
    return true;
  }

  const isProfileFormPath = state.url.includes('/account/profile-form');

  if (!user.profileCompleted) {
    // If profile is NOT complete, redirect to profile form
    if (!isProfileFormPath) {
      router.navigate(['/account/profile-form']);
      return false;
    }
  } else {
    // If profile IS complete, prevent entering profile completion page
    if (isProfileFormPath) {
      const redirectPath = user.role === 'Client' ? '/user/client-dashboard' : '/user/my-dashboard';
      router.navigate([redirectPath]);
      return false;
    }
  }

  return true;
};
