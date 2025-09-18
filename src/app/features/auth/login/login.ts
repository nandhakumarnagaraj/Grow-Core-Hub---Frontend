// Updated login.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Authservice } from '../../../core/services/authservice';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthRequest } from '../../../core/models/auth-request';
import { UserRole } from '../../../core/models/user-role';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  showPassword = false;
  errorMessage = '';
  returnUrl = '';

  constructor(
    private fb: FormBuilder,
    private authService: Authservice,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    // Get return url from route parameters or default to dashboard
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    // Mark all fields as touched to trigger validation
    this.markFormGroupTouched(this.loginForm);
    
    if (this.loginForm.valid && !this.loading) {
      this.loading = true;
      this.errorMessage = '';

      const credentials: AuthRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.loading = false;
          // Navigate based on user role
          if (response.role === UserRole.ADMIN) {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate([this.returnUrl]);
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        },
      });
    }
  }

  navigateToSignup(): void {
    this.router.navigate(['/auth/signup']);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (fieldName === 'email') {
        if (field.errors['required']) return 'Email is required';
        if (field.errors['email']) return 'Please enter a valid email address';
      }
      if (fieldName === 'password') {
        if (field.errors['required']) return 'Password is required';
        if (field.errors['minlength']) return 'Password must be at least 6 characters';
      }
    }
    return '';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}