import { Component, AfterViewInit } from '@angular/core';
import { AuthService, UserFromToken } from '../services/auth-service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements AfterViewInit {
  user: UserFromToken | undefined;
  showNotifications = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Load user from AuthService
    this.user = this.authService.getCurrentUser();

    // If not loaded yet, fetch from API using email (sub)
    if (!this.user) {
      const tokenUser = this.authService.decodeToken();
      if (tokenUser?.sub) {
        this.authService.fetchFullUser(tokenUser.sub).subscribe({
          next: (user) => {
            this.user = user;
          },
          error: (err) => {
            console.error('Failed to fetch user profile', err);
          },
        });
      }
    }
  }

  ngAfterViewInit(): void {
    this.loadSavingsChart();  // 👈 ensure chart renders after view init
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  createGoal() {
    alert('Create Goal clicked!');
  }

  private loadSavingsChart() {
    new Chart('savingsChart', {
      type: 'line',
      data: {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [{
          label: 'Savings Growth (KES)',
          data: [120000, 200000, 300000, 450000, 600000, 750000],
          borderColor: '#28a745',
          backgroundColor: 'rgba(40,167,69,0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        }
      }
    });
  }
}
