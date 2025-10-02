import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth-service';
import { AdminDashboard } from "../admin-dashboard/admin-dashboard";
import { UserDashboard } from "../user-dashboard/user-dashboard";

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  templateUrl: './dashboard.html',
  imports: [CommonModule, AdminDashboard, UserDashboard], 
})
export class Dashboard {
  constructor(private authService: AuthService) {}

  // Always up-to-date
  get role(): string | null {
    return this.authService.getRole();
  }
}
