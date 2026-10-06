import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    RouterLinkActive
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {

  /* =========================================
     USER INFORMATION
     ========================================= */

  fullName: string = '';

  email: string = '';

  pronouns: string = '';

  accountStatus: string = 'Active';

  memberSince: string = '';

  lastUpdated: string = '';


  /* =========================================
     PROFILE PHOTO
     ========================================= */

  profileImage: string | null = null;


  /* =========================================
     EDIT MODE
     ========================================= */

  isEditing: boolean = false;

  editedFullName: string = '';

  editedEmail: string = '';

  editedPronouns: string = '';


  /* =========================================
     PRONOUN OPTIONS
     ========================================= */

  pronounOptions: string[] = [
    'They/Them',
    'She/Her',
    'He/Him',
    'She/They',
    'He/They',
    'Prefer not to say'
  ];


  /* =========================================
     LOADING / ERROR
     ========================================= */

  isLoading: boolean = true;

  errorMessage: string = '';


  constructor(
  private router: Router,
  private authService: AuthService,
  private cdr: ChangeDetectorRef
) {}


  /* =========================================
     LOAD PROFILE WHEN PAGE OPENS
     ========================================= */

  ngOnInit(): void {

    this.loadProfile();

  }


  /* =========================================
     GET PROFILE FROM BACKEND
     ========================================= */

  loadProfile(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.authService.getProfile().subscribe({

      next: (response) => {

        this.isLoading = false;

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


          /* ================================
             ACCOUNT CREATED DATE
             ================================ */

          if (user.createdAt) {

            const createdDate =
              new Date(user.createdAt);

            this.memberSince =
              createdDate.toLocaleDateString(
                'en-US',
                {
                  month: 'long',
                  year: 'numeric'
                }
              );

          }


          /* ================================
             LAST UPDATED DATE
             ================================ */

          if (user.updatedAt) {

            const updatedDate =
              new Date(user.updatedAt);

            this.lastUpdated =
              updatedDate.toLocaleDateString(
                'en-US',
                {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                }
              );

          }


          /* ================================
             SAVE UPDATED USER LOCALLY
             ================================ */

          this.authService.saveUser(user);
          this.cdr.detectChanges();
        } else {

          this.errorMessage =
            response.message ||
            'Unable to load profile.';

        }

      },

      error: (error) => {

        this.isLoading = false;

        if (error.status === 401) {

          this.errorMessage =
            'Your session has expired. Please login again.';

          this.authService.logout();

          setTimeout(() => {

            this.router.navigate(['/login']);

          }, 1000);

        } else {

          this.errorMessage =
            error.error?.message ||
            'Unable to load profile.';

        }

      }

    });

  }


  /* =========================================
     GET INITIALS
     ========================================= */

  getInitials(): string {

    if (!this.fullName) {

      return 'C';

    }

    const names =
      this.fullName
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


  /* =========================================
     OPEN EDIT MODE
     ========================================= */

  editProfile(): void {

    this.editedFullName =
      this.fullName;

    this.editedEmail =
      this.email;

    this.editedPronouns =
      this.pronouns;

    this.isEditing = true;

  }


  /* =========================================
     CANCEL EDIT
     ========================================= */

  cancelEdit(): void {

    this.editedFullName = '';

    this.editedEmail = '';

    this.editedPronouns = '';

    this.isEditing = false;

  }


  /* =========================================
     SAVE PROFILE
     ========================================= */

  /* =========================================
   SAVE PROFILE
   ========================================= */

saveProfile(): void {

  const name =
    this.editedFullName.trim();

  const emailAddress =
    this.editedEmail.trim();

  const selectedPronouns =
    this.editedPronouns.trim();


  if (name === '') {

    alert(
      'Please enter your full name.'
    );

    return;

  }


  if (emailAddress === '') {

    alert(
      'Please enter your email address.'
    );

    return;

  }


  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  if (!emailPattern.test(emailAddress)) {

    alert(
      'Please enter a valid email address.'
    );

    return;

  }


  if (selectedPronouns === '') {

    alert(
      'Please select your pronouns.'
    );

    return;

  }


  const profileData = {

    fullName: name,

    email: emailAddress,

    pronouns: selectedPronouns

  };


  this.authService.updateProfile(
    profileData
  ).subscribe({

    next: (response) => {

      if (response.success) {

        const user = response.user;


        // Update page with new information
        this.fullName =
          user.fullName;

        this.email =
          user.email;

        this.pronouns =
          user.pronouns;

        this.profileImage =
          user.profilePicture || null;


        // Update last updated date
        if (user.updatedAt) {

          const updatedDate =
            new Date(user.updatedAt);

          this.lastUpdated =
            updatedDate.toLocaleDateString(
              'en-US',
              {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              }
            );

        }


        // Update localStorage
        this.authService.saveUser(
          user
        );


        this.isEditing =
          false;


        alert(
          'Profile updated successfully!'
        );

      } else {

        alert(
          response.message ||
          'Unable to update profile.'
        );

      }

    },

    error: (error) => {

      alert(
        error.error?.message ||
        'Unable to update profile.'
      );

    }

  });

}

 /* =========================================
   PROFILE PHOTO
   ========================================= */

onPhotoSelected(event: Event): void {

  const input =
    event.target as HTMLInputElement;


  if (
    !input.files ||
    input.files.length === 0
  ) {

    return;

  }


  const file =
    input.files[0];


  if (!file.type.startsWith('image/')) {

    alert(
      'Please select a valid image file.'
    );

    return;

  }


  if (
    file.size >
    5 * 1024 * 1024
  ) {

    alert(
      'Please select an image smaller than 5 MB.'
    );

    return;

  }


  const reader =
    new FileReader();


  reader.onload = () => {

    const imageData =
      reader.result as string;


    // Show photo immediately
    this.profileImage =
      imageData;


    // Save photo to MongoDB
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

            alert(
              'Profile photo updated successfully!'
            );

          } else {

            alert(
              response.message ||
              'Unable to update profile photo.'
            );

          }

        },

        error: (error) => {

          alert(
            error.error?.message ||
            'Unable to update profile photo.'
          );

        }

      });

  };


  reader.onerror = () => {

    alert(
      'Unable to load the selected image.'
    );

  };


  reader.readAsDataURL(file);

}

  

 /* =========================================
   REMOVE PHOTO
   ========================================= */

removePhoto(): void {

  this.authService
    .updateProfilePhoto(null)
    .subscribe({

      next: (response) => {

        if (response.success) {

          this.profileImage = null;

          this.authService.saveUser(
            response.user
          );

          alert(
            'Profile photo removed successfully!'
          );

        } else {

          alert(
            response.message ||
            'Unable to remove profile photo.'
          );

        }

      },

      error: (error) => {

        alert(
          error.error?.message ||
          'Unable to remove profile photo.'
        );

      }

    });

}


  /* =========================================
     LOGOUT
     ========================================= */

  logout(): void {

    const confirmLogout =
      confirm(
        'Are you sure you want to logout?'
      );


    if (confirmLogout) {

      this.authService.logout();

      this.router.navigate(['/login']);

    }

  }

}