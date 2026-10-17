import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {

  fullName = '';
  email = '';
  pronouns = '';

  accountStatus = 'Active';
  memberSince = '';
  lastUpdated = '';

  profileImage: string | null = null;
 showPhotoMenu = false;
showDeleteModal = false;
showLogoutModal = false;
isEditing = false;
isLoading = true;

  errorMessage = '';

  editedFullName = '';
  editedEmail = '';
  editedPronouns = '';

  pronounOptions = [
    'They/Them',
    'She/Her',
    'He/Him',
    'She/They',
    'He/They',
    'Prefer not to say'
  ];

  toastVisible = false;
  toastTitle = '';
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  private toastTimer: ReturnType<typeof setTimeout> | undefined;

  currentDay = '';
  currentDate = 0;
  currentMonth = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setCurrentDate();
    this.loadProfile();
  }

  setCurrentDate(): void {
    const today = new Date();

    this.currentDay = today
      .toLocaleDateString('en-US', {
        weekday: 'short'
      })
      .toUpperCase();

    this.currentDate = today.getDate();

    this.currentMonth = today
      .toLocaleDateString('en-US', {
        month: 'short'
      })
      .toUpperCase();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.getProfile().subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.success) {
          const user = response.user;

          this.fullName = user.fullName || '';
          this.email = user.email || '';
          this.pronouns = user.pronouns || '';
          this.profileImage = user.profilePicture || null;

          if (user.createdAt) {
            this.memberSince = new Date(
              user.createdAt
            ).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            });
          }

          if (user.updatedAt) {
            this.lastUpdated = new Date(
              user.updatedAt
            ).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            });
          }

          this.authService.saveUser(user);
          this.cdr.detectChanges();

        } else {
          this.errorMessage =
            response.message ||
            'Unable to load profile.';

          this.showToast(
            'Unable to load profile',
            this.errorMessage,
            'error'
          );
        }
      },

      error: (error) => {
        this.isLoading = false;

        if (error.status === 401) {

          this.errorMessage =
            'Your session has expired. Please login again.';

          this.showToast(
            'Session expired',
            this.errorMessage,
            'error'
          );

          this.authService.logout();

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);

        } else {

          this.errorMessage =
            error.error?.message ||
            'Unable to load profile.';

          this.showToast(
            'Unable to load profile',
            this.errorMessage,
            'error'
          );
        }
      }
    });
  }

  openPhotoMenu(): void {
    this.showPhotoMenu = !this.showPhotoMenu;
  }

  closePhotoMenu(): void {
    this.showPhotoMenu = false;
  }

  getInitials(): string {
    if (!this.fullName) {
      return 'C';
    }

    const names = this.fullName
      .trim()
      .split(/\s+/);

    if (names.length === 1) {
      return names[0]
        .charAt(0)
        .toUpperCase();
    }

    return (
      names[0].charAt(0) +
      names[names.length - 1].charAt(0)
    ).toUpperCase();
  }

  editProfile(): void {
    this.editedFullName = this.fullName;
    this.editedEmail = this.email;
    this.editedPronouns = this.pronouns;

    this.isEditing = true;
  }

  cancelEdit(): void {
    this.editedFullName = '';
    this.editedEmail = '';
    this.editedPronouns = '';

    this.isEditing = false;
  }

  saveProfile(): void {

    const name = this.editedFullName.trim();
    const emailAddress = this.editedEmail.trim();
    const selectedPronouns =
      this.editedPronouns.trim();

    if (!name) {
      this.showToast(
        'Missing information',
        'Please enter your full name.',
        'error'
      );
      return;
    }

    if (!emailAddress) {
      this.showToast(
        'Missing information',
        'Please enter your email address.',
        'error'
      );
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailAddress)) {
      this.showToast(
        'Invalid email',
        'Please enter a valid email address.',
        'error'
      );
      return;
    }

    if (!selectedPronouns) {
      this.showToast(
        'Missing information',
        'Please select your pronouns.',
        'error'
      );
      return;
    }

    const profileData = {
      fullName: name,
      email: emailAddress,
      pronouns: selectedPronouns
    };

    this.authService
      .updateProfile(profileData)
      .subscribe({

        next: (response) => {

          if (response.success) {

            const user = response.user;

            this.fullName =
              user.fullName || '';

            this.email =
              user.email || '';

            this.pronouns =
              user.pronouns || '';

            this.profileImage =
              user.profilePicture || null;

            if (user.updatedAt) {
              this.lastUpdated =
                new Date(
                  user.updatedAt
                ).toLocaleDateString(
                  'en-US',
                  {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  }
                );
            }

            this.authService.saveUser(user);

            this.isEditing = false;

            this.showToast(
              'Profile updated',
              'Your changes have been saved successfully.',
              'success'
            );

            this.cdr.detectChanges();

          } else {

            this.showToast(
              'Update failed',
              response.message ||
                'Unable to update profile.',
              'error'
            );
          }
        },

        error: (error) => {

          this.showToast(
            'Update failed',
            error.error?.message ||
              'Unable to update profile.',
            'error'
          );
        }
      });
  }

  onPhotoSelected(event: Event): void {
    this.showPhotoMenu = false;

    const input =
      event.target as HTMLInputElement;

    if (
      !input.files ||
      input.files.length === 0
    ) {
      return;
    }

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {

      this.showToast(
        'Invalid image',
        'Please select a valid image file.',
        'error'
      );

      return;
    }

    if (file.size > 5 * 1024 * 1024) {

      this.showToast(
        'Image too large',
        'Please select an image smaller than 5 MB.',
        'error'
      );

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {

      const imageData =
        reader.result as string;

      this.profileImage = imageData;

      this.authService
        .updateProfilePhoto(imageData)
        .subscribe({

          next: (response) => {

            if (response.success) {

              this.profileImage =
                response.user.profilePicture;

              this.authService.saveUser(
                response.user
              );

              this.showToast(
                'Photo updated',
                'Your profile photo has been updated.',
                'success'
              );

            } else {

              this.showToast(
                'Photo update failed',
                response.message ||
                  'Unable to update profile photo.',
                'error'
              );
            }
          },

          error: (error) => {

            this.showToast(
              'Photo update failed',
              error.error?.message ||
                'Unable to update profile photo.',
              'error'
            );
          }
        });
    };

    reader.onerror = () => {

      this.showToast(
        'Image error',
        'Unable to load the selected image.',
        'error'
      );
    };

    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.showPhotoMenu = false;

    this.authService
      .updateProfilePhoto(null)
      .subscribe({

        next: (response) => {

          if (response.success) {

            this.profileImage = null;

            this.authService.saveUser(
              response.user
            );

            this.showToast(
              'Photo removed',
              'Your profile photo has been removed.',
              'success'
            );

          } else {

            this.showToast(
              'Unable to remove photo',
              response.message ||
                'Unable to remove profile photo.',
              'error'
            );
          }
        },

        error: (error) => {

          this.showToast(
            'Unable to remove photo',
            error.error?.message ||
              'Unable to remove profile photo.',
            'error'
          );
        }
      });
  }

  showToast(
    title: string,
    message: string,
    type: 'success' | 'error' = 'success'
  ): void {

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastTitle = title;
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    this.cdr.detectChanges();

    this.toastTimer = setTimeout(() => {

      this.toastVisible = false;
      this.toastTitle = '';
      this.toastMessage = '';
      this.toastTimer = undefined;

      this.cdr.detectChanges();

    }, 3000);
  }

  logout(): void {
  this.showLogoutModal = true;
}

cancelLogout(): void {
  this.showLogoutModal = false;
}

confirmLogout(): void {
  this.showLogoutModal = false;

  this.authService.logout();

  this.router.navigate(['/login']);
}

    changePassword(): void {
    this.router.navigate(['/change-password']);
  }

  deleteAccount(): void {
  this.showDeleteModal = true;
}

cancelDeleteAccount(): void {
  this.showDeleteModal = false;
}

confirmDeleteAccount(): void {

  this.showDeleteModal = false;

  this.authService
    .deleteAccount()
    .subscribe({

      next: (response) => {

        if (response.success) {

          this.authService.logout();

          this.showToast(
            'Account deleted',
            'Your Closetly account has been deleted successfully.',
            'success'
          );

          setTimeout(() => {
            this.router.navigate(['/register']);
          }, 1500);

        } else {

          this.showToast(
            'Deletion failed',
            response.message ||
              'Unable to delete your account.',
            'error'
          );
        }
      },

      error: (error) => {

        if (error.status === 401) {

          this.authService.logout();

          this.router.navigate(['/login']);

          return;
        }

        this.showToast(
          'Deletion failed',
          error.error?.message ||
            'Unable to delete your account.',
          'error'
        );
      }
    });
}
}