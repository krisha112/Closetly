import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  RouterLink
} from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {

  email: string = '';

  errorMessage: string = '';
  successMessage: string = '';

  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  sendResetLink(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (this.email.trim() === '') {
      this.errorMessage =
        'Please enter your email address.';
      this.cdr.detectChanges();
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(this.email.trim())) {
      this.errorMessage =
        'Please enter a valid email address.';
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    const email =
      this.email.trim().toLowerCase();

    this.authService
      .forgotPassword(email)
      .subscribe({

        next: (response) => {

          this.isLoading = false;

          if (response.success) {

            this.successMessage =
              'Password reset link has been sent to your email. Please check your inbox and click the link to reset your password.';

            this.email = '';

          } else {

            this.errorMessage =
              response.message ||
              'Unable to send password reset link.';
          }

          this.cdr.detectChanges();
        },

        error: (error) => {

          this.isLoading = false;

          if (error.status === 404) {

            this.errorMessage =
              error.error?.message ||
              'No account found with this email address.';

          } else if (error.status === 400) {

            this.errorMessage =
              error.error?.message ||
              'Please enter a valid email address.';

          } else {

            this.errorMessage =
              error.error?.message ||
              'Unable to connect to the server.';
          }

          this.cdr.detectChanges();
        }
      });
  }
}