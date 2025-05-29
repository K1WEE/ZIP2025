import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../../../shared/modes/users.model';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  access_token: string;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  #http = inject(HttpClient);
  #router = inject(Router);

  login(email: string, password: string) {
    return this.#http.post<LoginResponse>('http://localhost:3000/auth/login', {
      email: email,
      password: password,
    })
  }

  logout() {
    localStorage.removeItem('access_token');
    this.#router.navigate(['/login']).then();
  }

  getUserProfile() {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.#http.get<User>('http://localhost:3000/auth/profile', { headers });
  }
}
