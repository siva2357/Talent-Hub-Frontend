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

  // ✅ handle array roles
  if (Array.isArray(expectedRole)) {
    if (expectedRole.includes(currentUserRole)) {
      return true;
    }
  }
  // ✅ handle single role (optional future use)
  else if (currentUserRole === expectedRole) {
    return true;
  }

  this.router.navigate(['/login']);
  return false;
}
}
