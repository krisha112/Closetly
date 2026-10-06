import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterLink
} from '@angular/router';

import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './login.html',

  styleUrl: './login.css'
})


export class Login {

  email: string = '';

  password: string = '';

  showPassword: boolean = false;

  isLoading: boolean = false;

  errorMessage: string = '';

  successMessage: string = '';


  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  // =========================
  // SHOW / HIDE PASSWORD
  // =========================

  togglePassword(): void {

    this.showPassword =
      !this.showPassword;

  }


  // =========================
  // LOGIN USER
  // =========================

  loginUser(): void {

    // Clear previous messages
    this.errorMessage = '';

    this.successMessage = '';


    // =========================
    // EMPTY FIELD VALIDATION
    // =========================

    if (
      !this.email.trim() ||
      !this.password
    ) {

      this.errorMessage =
        'Please enter your email and password.';

      this.cdr.detectChanges();

      return;
    }


    // =========================
    // EMAIL VALIDATION
    // =========================

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
      !emailPattern.test(
        this.email.trim()
      )
    ) {

      this.errorMessage =
        'Please enter a valid email address.';

      this.cdr.detectChanges();

      return;
    }


    // =========================
    // START LOADING
    // =========================

    this.isLoading = true;

    this.cdr.detectChanges();


    // =========================
    // LOGIN DATA
    // =========================

    const loginData = {

      email:
        this.email.trim(),

      password:
        this.password

    };


    // =========================
    // SEND REQUEST TO DJANGO
    // =========================

    this.authService
      .login(loginData)
      .subscribe({

        // =========================
        // RESPONSE RECEIVED
        // =========================

        next: (response) => {

          // Stop loading
          this.isLoading = false;


          // =========================
          // LOGIN SUCCESSFUL
          // =========================

          if (response.success) {

            // Save JWT token
            this.authService.saveToken(
              response.token
            );


            // Save user information
            this.authService.saveUser(
              response.user
            );


            // Success message
            this.successMessage =
              'Login successful!';


            this.cdr.detectChanges();


            // Go to profile
            this.router.navigate([
              '/profile'
            ]);

          }


          // =========================
          // LOGIN FAILED
          // =========================

          else {

            this.errorMessage =
              response.message ||
              'Login failed.';


            this.cdr.detectChanges();

          }

        },


        // =========================
        // HTTP ERROR
        // =========================

        error: (error) => {

          // Stop loading
          this.isLoading = false;


          // Show backend error
          this.errorMessage =
            error.error?.message ||
            'Unable to connect to the server.';


          this.cdr.detectChanges();

        }

      });

  }

}