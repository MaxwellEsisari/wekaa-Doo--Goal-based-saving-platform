import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; 
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { SignupRequest } from '../models/signup-request';
import { SignupResponse } from '../models/signup-response';

const API_BASE_URL = 'http://192.168.100.27:8080/api/v1/auth';
const API_URL = `${API_BASE_URL}/login`;
const SIGNUP_API = `${API_BASE_URL}/register`;
const PROFILE_API = 'http://192.168.100.27:8080/api/v1/user/view/profile';

export interface UserFromToken {
  sub: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  imageUrl?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private storageKey = 'authToken';
  private currentUser: UserFromToken | undefined;

  constructor(private http: HttpClient) {
    // ✅ Restore user if available
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }
  // LOGIN
  doLogin(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API_URL, request).pipe(
      tap((res) => {
        const token = res?.data?.token;
        const role = res?.data?.role;

        if (token) this.saveToken(token);

        if (role) {
          localStorage.setItem('role', role); 
        }

      })
    );
  }


  //SIGNUP
  doSignup(request: SignupRequest, file?: File): Observable<SignupResponse> {
    const formData = new FormData();
    formData.append('firstname', request.firstname);
    formData.append('lastname', request.lastname);
    formData.append('email', request.email);
    formData.append('password', request.password);
    formData.append('confirmPassword', request.confirmPassword);
    if (file) formData.append('profileImage', file);

    return this.http.post<SignupResponse>(SIGNUP_API, formData);
  }

  /** TOKEN HANDLING */
  saveToken(token: string) {
    localStorage.setItem(this.storageKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  clearToken() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem('user');
    localStorage.removeItem('role'); // ✅ clear role too
    this.currentUser = undefined;
  }

  /** (Optional) Decode JWT if you want claims, but not role */
  decodeToken(token?: string): UserFromToken | undefined {
    const t = token || this.getToken();
    if (!t) return undefined;
    try {
      return jwtDecode<UserFromToken>(t);
    } catch (e) {
      console.error('Failed to decode token', e);
      return undefined;
    }
  }

  /** FETCH FULL USER PROFILE */
  fetchFullUser(sub: string): Observable<UserFromToken> {
    return this.http.get<UserFromToken>(`${PROFILE_API}?email=${sub}`).pipe(
      tap((user) => {
        this.currentUser = user;
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

/** ROLE HANDLING */
getRole(): string | null {
  return localStorage.getItem('role');
}

getRoles(): string[] {
  const role = localStorage.getItem('role');
  return role ? [role] : [];
}


  /** CURRENT USER */
  getCurrentUser(): UserFromToken | undefined {
    if (!this.currentUser) {
      const stored = localStorage.getItem('user');
      if (stored) this.currentUser = JSON.parse(stored);
    }
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
