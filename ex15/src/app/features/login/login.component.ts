import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';



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

  fg = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  })

  onSubmit(){
    const username = this.fg.value.username ?? '';
    const password = this.fg.value.password ?? '';
    this.#authService.login(username,password).subscribe({
      next: (res ) => {
        console.log('logged in');
        console.log(res)
        localStorage.setItem('access_token', res.accessToken);
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
