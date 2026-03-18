import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

canActivate(route: ActivatedRouteSnapshot): boolean {

  if (this.authService.isLoggedIn() && this.authService.getToken()) {

    const expectedRole = route.data?.['expectedRole'];
    const userRole = this.authService.getRole();

    if (expectedRole) {
      if (Array.isArray(expectedRole)) {
        if (!expectedRole.includes(userRole)) {
          this.router.navigate(['/login']);
          return false;
        }
      } else if (userRole !== expectedRole) {
        this.router.navigate(['/login']);
        return false;
      }
    }

    return true;
  }

  this.router.navigate(['/login']);
  return false;
}

}
