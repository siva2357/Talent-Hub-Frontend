import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const expectedRole = route.data['expectedRole'];
    const currentUserRole = this.authService.getRole();

    // ❌ if no role found
    if (!currentUserRole) {
      this.router.navigate(['/login']);
      return false;
    }

    // ✅ handle array roles
    if (Array.isArray(expectedRole)) {
      if (expectedRole.includes(currentUserRole)) {
        return true;
      }
    }

    // ✅ handle single role
    if (typeof expectedRole === 'string') {
      if (currentUserRole === expectedRole) {
        return true;
      }
    }

    // ❌ access denied
    this.router.navigate(['/access-denied']);
    return false;
  }
}
