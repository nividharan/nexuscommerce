import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';

export interface User {
  email: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://nexuscommerce-1.onrender.com/api';

  public tokenSignal = signal<string | null>(localStorage.getItem('authToken'));
  public userSignal = signal<User | null>(
    localStorage.getItem('authUser') ? JSON.parse(localStorage.getItem('authUser')!) : null
  );

  constructor(private http: HttpClient, private router: Router) {
    this.initializeSession();
  }

  public initializeSession(): void {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('authUser');
    if (savedToken && savedUser) {
      this.tokenSignal.set(savedToken);
      this.userSignal.set(JSON.parse(savedUser));
    }
  }

  public signup(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/signup`, { email, password }).pipe(
      tap(res => {
        if (res.success && res.token && res.user) {
          this.setSession(res.token, res.user);
        }
      }),
      catchError(err => {
        const msg = err.error?.message || 'Registration failed.';
        return of({ success: false, message: msg });
      })
    );
  }

  public login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(res => {
        if (res.success && res.token && res.user) {
          this.setSession(res.token, res.user);
        }
      }),
      catchError(err => {
        const msg = err.error?.message || 'Authentication failed.';
        return of({ success: false, message: msg });
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }

  private setSession(token: string, user: User): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
    this.tokenSignal.set(token);
    this.userSignal.set(user);
  }
}
