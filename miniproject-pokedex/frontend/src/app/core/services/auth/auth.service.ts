import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User, UserData } from '../../../shared/models/users.model';
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

  register(user: UserData) {
    return this.#http.post<UserData>('http://localhost:3000/users', user).pipe(
      tap((response) => {
        console.log('User registered:', response);
      })
    );
  }

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
    return this.#http.get<User>('http://localhost:3000/users/me', { headers });
  }

  updateUserProfile(userinfo: User): Observable<User> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.#http.patch<User>('http://localhost:3000/users', userinfo, { headers }).pipe(
      tap((user) => {
        // Optionally handle the updated user data
        console.log('User profile updated:', user);
      })
    );
  }
}
