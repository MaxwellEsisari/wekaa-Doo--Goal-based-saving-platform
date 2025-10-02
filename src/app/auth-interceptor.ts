import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './services/auth-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    let authReq = req;

    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });

      // If currentUser is missing, fetch full user
      if (!this.authService.getCurrentUser()) {
        const payload = this.authService.decodeToken();
        if (payload?.sub) this.authService.fetchFullUser(payload.sub).subscribe();
      }
    }

    return next.handle(authReq).pipe(
      tap(() => console.log('➡️ HTTP Request:', authReq.url, 'Token:', !!token)),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.authService.clearToken();
          window.location.href = '/login';
        }
        return throwError(() => err);
      })
    );
  }
}
