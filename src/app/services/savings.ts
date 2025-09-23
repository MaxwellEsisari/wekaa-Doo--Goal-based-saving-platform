import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// ✅ Define models (optional but recommended)
export interface SavingsPlanRequest {
  catUuid: string;
  amount: number;
  timeline: number;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

export interface SavingsPlanResponse {
  id: string;
  catUuid: string;
  amount: number;
  timeline: number;
  frequency: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class Savings {

  private baseUrl = 'http://localhost:8080/api/v1/savings'; 

  constructor(private http: HttpClient) {}

  // === Create new savings plan ===
  addPlan(data: SavingsPlanRequest): Observable<SavingsPlanResponse> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.post<SavingsPlanResponse>(
      `${this.baseUrl}/add-plan`,
      data,
      { headers }
    );
  }

  // === Get all user plans ===
  getPlans(): Observable<SavingsPlanResponse[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get<SavingsPlanResponse[]>(`${this.baseUrl}`, { headers });
  }

  // === Delete a plan ===
  deletePlan(planId: string): Observable<void> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.delete<void>(`${this.baseUrl}/${planId}`, { headers });
  }
}
