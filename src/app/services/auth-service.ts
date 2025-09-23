import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { SignupRequest } from '../models/signup-request';
import { SignupResponse } from '../models/signup-response';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'http://10.20.33.81:8080/api/v1/auth';
const API_URL = `${API_BASE_URL}/login`;
const SIGNUP_API = `${API_BASE_URL}/register`;
const PROFILE_API = 'http://10.20.33.81:8080/api/v1/user/view/profile';

interface JwtPayload {
  sub: string;            // username/email
  role?: string;          // single role
  roles?: string[];       // multiple roles
  authorities?: string[]; // spring security style
  exp: number;            // expiry time
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private storageKey = 'authToken';

  constructor(private http: HttpClient) {}

  // 🔹 Login
  doLogin(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API_URL, request);
  }

  // 🔹 Signup
  doSignup(request: SignupRequest, file?: File): Observable<SignupResponse> {
    const formData = new FormData();
    formData.append('firstname', request.firstname);
    formData.append('lastname', request.lastname);
    formData.append('email', request.email);
    formData.append('password', request.password);
    formData.append('confirmPassword', request.confirmPassword);

    if (file) {
      formData.append('profileImage', file);
    }

    return this.http.post<SignupResponse>(SIGNUP_API, formData);
  }

  // 🔹 Save token
  saveToken(token: string) {
    localStorage.setItem(this.storageKey, token);
  }

  // 🔹 Get token
  getToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  // 🔹 Clear token
  clearToken() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem('user');
  }

  // 🔹 Fetch profile (needs token)
  getProfile(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No auth token found. Please login first.');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(PROFILE_API, { headers });
  }

  // inside auth.service.ts
  getUserDetails(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log("🔑 Full decoded JWT:", decoded);

      let user: any = { email: decoded.sub };

      try {
        // try parsing sub as JSON (if backend packed details there)
        const parsed = JSON.parse(decoded.sub);
        user = { ...parsed };
      } catch {
        // sub is just email string → keep default
      }

      return user;
    } catch (err) {
      console.error("❌ Invalid token", err);
      return null;
    }
  }

  getRole(): string | null {
    const user = this.getUserDetails();
    return user?.role || null;
  }


  // 🔹 Check login
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
