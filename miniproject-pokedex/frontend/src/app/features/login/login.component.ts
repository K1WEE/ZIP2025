import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  #authService = inject(AuthService);
  router = inject(Router);

  fg = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  onSubmit(){
    const email = this.fg.value.email ?? '';
    const password = this.fg.value.password ?? '';
    this.#authService.login(email,password).subscribe({
      next: (res ) => {
        console.log('logged in');
        console.log(res)
        localStorage.setItem('access_token', res.access_token);
        this.router.navigate(['/']).then();
      },
      error: (err) => {
        console.log('login failed',err);
      },
      complete: () => {
        console.log('login complete');
      }
    })
  }
}
