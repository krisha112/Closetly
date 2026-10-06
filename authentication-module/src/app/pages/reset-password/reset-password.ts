import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {

  token: string = '';

  newPassword: string = '';
  confirmPassword: string = '';

  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  isLoading: boolean = false;

  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      this.token = params['token'] || '';

      if (!this.token) {

        this.errorMessage =
          'Invalid or missing password reset link.';

        this.cdr.detectChanges();
      }

    });

  }


  // =============================================
  // SHOW / HIDE PASSWORD
  // =============================================

  togglePassword(field: 'new' | 'confirm'): void {

    if (field === 'new') {

      this.showNewPassword =
        !this.showNewPassword;

    } else {

      this.showConfirmPassword =
        !this.showConfirmPassword;

    }

  }


  // =============================================
  // PASSWORD REQUIREMENTS
  // =============================================

  hasMinLength(): boolean {
    return this.newPassword.length >= 8;
  }


  hasNumber(): boolean {
    return /[0-9]/.test(this.newPassword);
  }


  hasUppercase(): boolean {
    return /[A-Z]/.test(this.newPassword);
  }


  hasSpecialSymbol(): boolean {
    return /[^A-Za-z0-9]/.test(this.newPassword);
  }


  // =============================================
  // RESET PASSWORD
  // =============================================

  resetPassword(): void {

    this.errorMessage = '';
    this.successMessage = '';


    // ---------------------------------------------
    // TOKEN VALIDATION
    // ---------------------------------------------

    if (!this.token) {

      this.errorMessage =
        'Invalid or missing password reset link.';

      this.cdr.detectChanges();

      return;
    }


    // ---------------------------------------------
    // NEW PASSWORD VALIDATION
    // ---------------------------------------------

    if (!this.newPassword) {

      this.errorMessage =
        'Please enter a new password.';

      this.cdr.detectChanges();

      return;
    }


    // ---------------------------------------------
    // PASSWORD REQUIREMENTS VALIDATION
    // ---------------------------------------------

    const passwordRequirementsMet =
      this.hasMinLength() &&
      this.hasNumber() &&
      this.hasUppercase() &&
      this.hasSpecialSymbol();


    if (!passwordRequirementsMet) {

      this.errorMessage =
        'Please ensure your new password meets all security requirements.';

      this.cdr.detectChanges();

      return;
    }


    // ---------------------------------------------
    // CONFIRM PASSWORD VALIDATION
    // ---------------------------------------------

    if (!this.confirmPassword) {

      this.errorMessage =
        'Please confirm your new password.';

      this.cdr.detectChanges();

      return;
    }


    if (this.newPassword !== this.confirmPassword) {

      this.errorMessage =
        'Passwords do not match.';

      this.cdr.detectChanges();

      return;
    }


    // ---------------------------------------------
    // START LOADING
    // ---------------------------------------------

    this.isLoading = true;

    this.cdr.detectChanges();


    // ---------------------------------------------
    // PASSWORD DATA
    // ---------------------------------------------

    const passwordData = {

      token: this.token,

      newPassword: this.newPassword,

      confirmPassword: this.confirmPassword

    };


    // ---------------------------------------------
    // SEND REQUEST
    // ---------------------------------------------

    this.authService
      .resetPassword(passwordData)
      .subscribe({

        // -----------------------------------------
        // SUCCESS RESPONSE
        // -----------------------------------------

        next: (response) => {

          console.log(
            'SUCCESS:',
            response.success,
            'MESSAGE:',
            response.message
          );


          this.isLoading = false;


          // ---------------------------------------
          // PASSWORD RESET SUCCESS
          // ---------------------------------------

          if (response.success) {

            this.successMessage =
              response.message ||
              'Password reset successfully!';


            // -------------------------------------
            // SAVE JWT TOKEN
            // -------------------------------------

            if (response.token) {

              localStorage.setItem(
                'closetly_token',
                response.token
              );

            }


            // -------------------------------------
            // SAVE USER INFORMATION
            // -------------------------------------

            if (response.user) {

              localStorage.setItem(
                'closetly_user',
                JSON.stringify(response.user)
              );

            }


            // -------------------------------------
            // CLEAR PASSWORD FIELDS
            // -------------------------------------

            this.newPassword = '';
            this.confirmPassword = '';


            this.cdr.detectChanges();


            // -------------------------------------
            // REDIRECT TO LOGIN
            // -------------------------------------

            setTimeout(() => {

              this.router.navigate(['/login']);

            }, 1500);

          }


          // ---------------------------------------
          // BACKEND RETURNED FAILURE
          // ---------------------------------------

          else {

            this.errorMessage =
              response.message ||
              'Unable to reset password.';

            this.cdr.detectChanges();

          }

        },


        // -----------------------------------------
        // HTTP ERROR
        // -----------------------------------------

        error: (error) => {

          console.log(
            'RESET ERROR:',
            error
          );


          this.isLoading = false;


          this.errorMessage =
            error.error?.message ||
            'Unable to reset password.';


          this.cdr.detectChanges();

        }

      });

  }

}
