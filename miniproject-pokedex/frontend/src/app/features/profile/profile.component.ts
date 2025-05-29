import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { User } from '../../shared/models/users.model';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  #authServices = inject(AuthService);

  profile = signal<User | null>(null);
  
  constructor(){
    this.#authServices.getUserProfile().subscribe({
      next: (res) => {
        this.profile.set(res);
        console.log('profile', res);
      },
      error: (err) => {
        console.log('error',err);
      }
    })
  }

  logout() {
    this.#authServices.logout();
  }
  
}
