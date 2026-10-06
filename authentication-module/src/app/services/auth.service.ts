import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://127.0.0.1:8000/api/auth';

  constructor(private http: HttpClient) {}


  // =========================
  // REGISTER
  // =========================

  register(userData: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/register/`,
      userData
    );
  }


  // =========================
  // LOGIN
  // =========================

  login(loginData: {
  email: string;
  password: string;
}): Observable<any> {

  return this.http.post(
    `${this.apiUrl}/login/`,
    loginData
  ).pipe(

    catchError((error) => {

      if (error.status === 401) {

        return of({
          success: false,
          message:
            error.error?.message ||
            'Invalid email or password.'
        });

      }

      return of({
        success: false,
        message:
          error.error?.message ||
          'Unable to connect to the server.'
      });

    })

  );
}

forgotPassword(email: string): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/forgot-password/`,
    { email }
  );
}

resetPassword(passwordData: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/reset-password/`,
    passwordData
  );
}

  // =========================
  // GET USER PROFILE
  // =========================

  getProfile(): Observable<any> {

    const token = this.getToken();

    return this.http.get(
      `${this.apiUrl}/profile/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

// =========================
// UPDATE USER PROFILE
// =========================

updateProfile(profileData: {
  fullName: string;
  email: string;
  pronouns: string;
}): Observable<any> {

  const token = this.getToken();

  return this.http.put(
    `${this.apiUrl}/profile/update/`,
    profileData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

// =========================
// UPDATE PROFILE PHOTO
// =========================

updateProfilePhoto(profilePicture: string | null): Observable<any> {

  const token = this.getToken();

  return this.http.put(
    `${this.apiUrl}/profile/photo/`,
    {
      profilePicture: profilePicture
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

// =========================
// CHANGE PASSWORD
// =========================

changePassword(passwordData: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Observable<any> {

  const token = this.getToken();

  return this.http.put(
    `${this.apiUrl}/profile/change-password/`,
    passwordData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

  // =========================
  // SAVE JWT TOKEN
  // =========================

  saveToken(token: string): void {
    localStorage.setItem(
      'closetly_token',
      token
    );
  }


  // =========================
  // GET JWT TOKEN
  // =========================

  getToken(): string | null {
    return localStorage.getItem(
      'closetly_token'
    );
  }


 // =========================
// CHECK LOGIN
// =========================

isLoggedIn(): boolean {

  const token = this.getToken();

  if (!token) {
    return false;
  }

  try {

    const payload = JSON.parse(
      atob(token.split('.')[1])
    );

    const currentTime = Math.floor(
      Date.now() / 1000
    );

    if (
      payload.exp &&
      payload.exp < currentTime
    ) {

      this.logout();

      return false;
    }

    return true;

  } catch {

    this.logout();

    return false;
  }
}


  // =========================
  // LOGOUT
  // =========================

  logout(): void {

    localStorage.removeItem(
      'closetly_token'
    );

    localStorage.removeItem(
      'closetly_user'
    );
  }


  // =========================
  // SAVE USER INFORMATION
  // =========================

  saveUser(user: any): void {

    localStorage.setItem(
      'closetly_user',
      JSON.stringify(user)
    );
  }


  // =========================
  // GET USER INFORMATION
  // =========================

  getUser(): any {

    const user = localStorage.getItem(
      'closetly_user'
    );

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  }

}

