import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  /* ========================================================
     FORM FIELDS
  ======================================================== */

  fullName: string = '';

  email: string = '';

  password: string = '';

  confirmPassword: string = '';

  termsAccepted: boolean = false;


  /* ========================================================
     PASSWORD VISIBILITY
  ======================================================== */

  showPassword: boolean = false;

  showConfirmPassword: boolean = false;


  /* ========================================================
     FORM STATE
  ======================================================== */

  isLoading: boolean = false;

  errorMessage: string = '';

  successMessage: string = '';


  /* ========================================================
     CONSTRUCTOR
  ======================================================== */

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  /* ========================================================
     PASSWORD SHOW / HIDE
  ======================================================== */

  togglePassword(): void {

    this.showPassword = !this.showPassword;

  }


  toggleConfirmPassword(): void {

    this.showConfirmPassword =
      !this.showConfirmPassword;

  }


  /* ========================================================
     PASSWORD REQUIREMENTS
  ======================================================== */

  hasMinLength(): boolean {

    return this.password.length >= 8;

  }


  hasNumber(): boolean {

    return /[0-9]/.test(this.password);

  }


  hasUppercase(): boolean {

    return /[A-Z]/.test(this.password);

  }


  hasSpecialSymbol(): boolean {

    return /[^A-Za-z0-9]/.test(this.password);

  }


  /* ========================================================
     REGISTER USER
  ======================================================== */

  registerUser(): void {

    /* ------------------------------------------------------
       Clear previous messages
    ------------------------------------------------------ */

    this.errorMessage = '';

    this.successMessage = '';


    /* ------------------------------------------------------
       Check required fields
    ------------------------------------------------------ */

    if (
      !this.fullName.trim() ||
      !this.email.trim() ||
      !this.password ||
      !this.confirmPassword
    ) {

      this.errorMessage =
        'Please fill in all required fields.';

      return;

    }


    /* ------------------------------------------------------
       Validate email
    ------------------------------------------------------ */

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(this.email.trim())) {

      this.errorMessage =
        'Please enter a valid email address.';

      return;

    }


    /* ------------------------------------------------------
       Password requirement 1
       Minimum 8 characters
    ------------------------------------------------------ */

    if (!this.hasMinLength()) {

      this.errorMessage =
        'Password must be at least 8 characters long.';

      return;

    }


    /* ------------------------------------------------------
       Password requirement 2
       At least 1 number
    ------------------------------------------------------ */

    if (!this.hasNumber()) {

      this.errorMessage =
        'Password must contain at least 1 number.';

      return;

    }


    /* ------------------------------------------------------
       Password requirement 3
       At least 1 uppercase letter
    ------------------------------------------------------ */

    if (!this.hasUppercase()) {

      this.errorMessage =
        'Password must contain at least 1 uppercase letter.';

      return;

    }


    /* ------------------------------------------------------
       Password requirement 4
       At least 1 special symbol
    ------------------------------------------------------ */

    if (!this.hasSpecialSymbol()) {

      this.errorMessage =
        'Password must contain at least 1 special symbol.';

      return;

    }


    /* ------------------------------------------------------
       Confirm password
    ------------------------------------------------------ */

    if (
      this.password !== this.confirmPassword
    ) {

      this.errorMessage =
        'Passwords do not match.';

      return;

    }


    /* ------------------------------------------------------
       Terms and Conditions
    ------------------------------------------------------ */

    if (!this.termsAccepted) {

      this.errorMessage =
        'Please accept the Terms & Conditions.';

      return;

    }


    /* ------------------------------------------------------
       Start loading
    ------------------------------------------------------ */

    this.isLoading = true;


    /* ------------------------------------------------------
       Prepare user data
    ------------------------------------------------------ */

    const userData = {

      fullName:
        this.fullName.trim(),

      email:
        this.email.trim(),

      password:
        this.password,

      confirmPassword:
        this.confirmPassword

    };


    /* ------------------------------------------------------
       Send registration request
    ------------------------------------------------------ */

    this.authService
      .register(userData)
      .subscribe({

        /* ==================================================
           SUCCESS
        ================================================== */

        next: (response) => {

          this.isLoading = false;


          if (response.success) {

            this.successMessage =
              'Registration successful!';


            /* ----------------------------------------------
               Save JWT token
            ---------------------------------------------- */

            this.authService
              .saveToken(response.token);


            /* ----------------------------------------------
               Save user information
            ---------------------------------------------- */

            this.authService
              .saveUser(response.user);


            /* ----------------------------------------------
               Go to Profile
            ---------------------------------------------- */

            this.router.navigate([
              '/profile'
            ]);

          }

          else {

            this.errorMessage =
              response.message ||
              'Registration failed.';

          }

        },


        /* ==================================================
           ERROR
        ================================================== */

        error: (error) => {

          this.isLoading = false;

          this.errorMessage =
            error.error?.message ||
            'Unable to connect to the server.';

        }

      });

  }

}