import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Check if user is authenticated
    if (!user.username) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check if route requires a specific role
    const requiredRole = route.data['role'];
    if (requiredRole && user.role !== requiredRole) {
      alert('Access Denied: You do not have the necessary permissions!');
      this.router.navigate(['/dashboard']); // Redirect to a safe page
      return false;
    }

    return true; // Allow access
  }
}

