import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../../../shared/modes/users.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  #http = inject(HttpClient);
  #router = inject(Router);

  login(username: string, password: string) {
    return this.#http.post<User>('https://dummyjson.com/auth/login',
      {
        username: username, // can use only username cuz its same name values 
        password: password,
        expiresInMins: 30,
      })
  }

  logout() {
    localStorage.removeItem('access_token');
    this.#router.navigate(['/login']).then();
  }

  getUserProfile() {
    return this.#http.get<User>('https://dummyjson.com/auth/me')
  }
}
