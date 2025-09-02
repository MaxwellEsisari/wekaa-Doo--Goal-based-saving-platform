import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { Observable } from 'rxjs';
import { SignupRequest } from '../models/signup-request';
import { SignupResponse } from '../models/signup-response';

const API_URL = 'http://localhost:8080/api/v1/auth/login';
const SIGNUP_API ='http://localhost:8080/api/v1/auth/register';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  doLogin(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API_URL, request);
  }

  doSignup(request: SignupRequest, file?: File): Observable<SignupResponse> {
    const formData = new FormData();
    formData.append('firstName', request.firstName);
    formData.append('lastName', request.lastName);
    formData.append('email', request.email);
    formData.append('password', request.password);

    if (file) {
      formData.append('image', file);
    }

    return this.http.post<SignupResponse>(SIGNUP_API, formData);
  }

}

