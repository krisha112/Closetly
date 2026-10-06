import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css']
})
export class ChangePassword {

  router = inject(Router);
  private authService = inject(AuthService);


  // =========================================
  // FORM FIELDS
  // =========================================

  currentPassword: string = '';

  newPassword: string = '';

  confirmPassword: string = '';


  // =========================================
  // VISIBILITY TOGGLES
  // =========================================

  showCurrentPassword: boolean = false;

  showNewPassword: boolean = false;

  showConfirmPassword: boolean = false;


  // =========================================
  // UI STATE
  // =========================================

  isSubmitting: boolean = false;

  errorMessage: string = '';

  successMessage: string = '';


  // =========================================
  // PASSWORD VALIDATION
  // =========================================

  get hasMinLength(): boolean {

    return this.newPassword.length >= 8;

  }


  get hasUppercase(): boolean {

    return /[A-Z]/.test(
      this.newPassword
    );

  }


  get hasNumber(): boolean {

    return /\d/.test(
      this.newPassword
    );

  }


  get hasSpecialChar(): boolean {
  return /[^A-Za-z0-9]/.test(this.newPassword);
}


  get isPasswordValid(): boolean {

    return (
      this.hasMinLength &&
      this.hasUppercase &&
      this.hasNumber &&
      this.hasSpecialChar
    );

  }


  // =========================================
  // PASSWORD VISIBILITY
  // =========================================

  toggleVisibility(
    field: 'current' | 'new' | 'confirm'
  ): void {

    if (field === 'current') {

      this.showCurrentPassword =
        !this.showCurrentPassword;

    } else if (field === 'new') {

      this.showNewPassword =
        !this.showNewPassword;

    } else if (field === 'confirm') {

      this.showConfirmPassword =
        !this.showConfirmPassword;

    }

  }


  // =========================================
  // CHANGE PASSWORD
  // =========================================

  onChangePassword(): void {

    this.errorMessage = '';

    this.successMessage = '';


    // -------------------------------
    // CURRENT PASSWORD
    // -------------------------------

    if (!this.currentPassword.trim()) {

      this.errorMessage =
        'Please enter your current password.';

      return;

    }


    // -------------------------------
    // NEW PASSWORD
    // -------------------------------

    if (!this.newPassword.trim()) {

      this.errorMessage =
        'Please enter a new password.';

      return;

    }


    // -------------------------------
    // PASSWORD REQUIREMENTS
    // -------------------------------

    if (!this.isPasswordValid) {

      this.errorMessage =
        'Please ensure your new password meets all security requirements.';

      return;

    }


    // -------------------------------
    // SAME PASSWORD CHECK
    // -------------------------------

    if (
      this.currentPassword ===
      this.newPassword
    ) {

      this.errorMessage =
        'New password cannot be the same as your current password.';

      return;

    }


    // -------------------------------
    // CONFIRM PASSWORD
    // -------------------------------

    if (
      this.newPassword !==
      this.confirmPassword
    ) {

      this.errorMessage =
        'New password and confirm password do not match.';

      return;

    }


    // -------------------------------
    // START API REQUEST
    // -------------------------------

    this.isSubmitting = true;


    const passwordData = {

      currentPassword:
        this.currentPassword,

      newPassword:
        this.newPassword,

      confirmPassword:
        this.confirmPassword

    };


    // -------------------------------
    // CALL DJANGO API
    // -------------------------------

    this.authService
      .changePassword(passwordData)
      .subscribe({

        next: (response) => {

          this.isSubmitting = false;


          if (response.success) {

            this.successMessage =
              'Password updated successfully! Redirecting back to profile...';


            // Clear password fields
            this.currentPassword = '';

            this.newPassword = '';

            this.confirmPassword = '';


            // Return to profile
            setTimeout(() => {

              this.router.navigate([
                '/profile'
              ]);

            }, 2000);


          } else {

            this.errorMessage =
              response.message ||
              'Unable to change password.';

          }

        },


        error: (error) => {

          this.isSubmitting = false;


          this.errorMessage =
            error.error?.message ||
            'Unable to change password.';

        }

      });

  }

}