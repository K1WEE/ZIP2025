import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = signal(!!localStorage.getItem('access_token'));

  constructor(private router: Router) {}

  login(token: string) {
    localStorage.setItem('access_token', token);
    this.isAuthenticated.set(true);
    this.router.navigate(['/']);
  }

  logout() {
    localStorage.removeItem('access_token');
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
