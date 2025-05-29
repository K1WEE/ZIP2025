import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fg = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirm_password: new FormControl('')
  });

  #authService = inject(AuthService);
  router = inject(Router);

  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  successMessage = '';

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.fg.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = {
        first_name: this.fg.value.first_name,
        last_name: this.fg.value.last_name,
        email: this.fg.value.email,
        password: this.fg.value.password,
        confirm_password: this.fg.value.confirm_password
      };

      if (formData.password !== formData.confirm_password) {
        this.errorMessage = 'Passwords do not match';
        this.isLoading = false;
        return;
      }

      this.performRegistration(formData);
    } else {
      this.errorMessage = 'Please fill in all required fields';
    }
  }

  private performRegistration(userData: any): void {
      this.#authService.register(userData).subscribe({
      next: (res) => {
        console.log('Registration data:', res);
        this.fg.reset();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message;
        console.error('Registration error:', err);
      },
      complete: () => {
        this.successMessage = 'Account created successfully!';
        this.isLoading = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']).then();
  }
}
