import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth-service';
import { AdminDashboard } from '../admin-dashboard/admin-dashboard';
import { UserDashboard } from '../user-dashboard/user-dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AdminDashboard, UserDashboard],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  role: string | null = null;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.role = this.auth.getRole();  // 'ROLE_ADMIN' | 'ROLE_USER' | null
  }
}
