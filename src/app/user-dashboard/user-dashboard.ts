import { Component } from '@angular/core';

@Component({
  selector: 'app-user-dashboard',
  imports: [],
  standalone: true,
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss'
})
export class UserDashboard {
  showNotifications= true;

    toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  createGoal() {
    alert('Create Goal clicked!');
  }
}
