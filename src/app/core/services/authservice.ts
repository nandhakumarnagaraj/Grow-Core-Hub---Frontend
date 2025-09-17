import { Injectable } from '@angular/core';
import { UserRole } from '../models/user-role';
import { AuthResponse } from '../models/auth-response';
import { SignupRequest } from '../models/signup-request';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthRequest } from '../models/auth-request';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Authservice {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Load user from localStorage if available
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUserSubject.next(response);
      })
    );
  }

  signup(request: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, request);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    return user ? user.userId : null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  isFreelancer(): boolean {
    return this.hasRole(UserRole.FREELANCER);
  }
}
