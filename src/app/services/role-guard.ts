import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const role = this.authService.getRole();
    const loggedIn = this.authService.isLoggedIn();

    console.log("🛡️ Guard check → LoggedIn:", loggedIn, "Role:", role);

    if (loggedIn && (role === 'ADMIN' || role === 'USER')) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }

}
