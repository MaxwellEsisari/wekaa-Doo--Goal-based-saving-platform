import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = 'http://localhost:8080/api'; 

  constructor(private http: HttpClient) {}

  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }

  getGoals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/goals`);
  }

  getActivities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/activities`);
  }

  getBadges(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/badges`);
  }

  getMonthlySavings(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/monthly-savings`);
  }

  createGoal(goal: { title: string; target: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/goals`, goal);
  }

  addSavings(goalId: number, amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/goals/${goalId}/savings`, { amount });
  }
}
