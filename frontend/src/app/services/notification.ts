import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NotificationData {
  _id?: string;
  userId?: string;
  message: string;
  type: 'clothes' | 'outfit' | 'profile' | 'wishlist' | 'system';
  isRead: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationResponse {
  success: boolean;
  count: number;
  data: NotificationData[];
}

export interface NotificationActionResponse {
  success: boolean;
  message: string;
  data: NotificationData;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://localhost:5000/api/notifications';

  constructor(private http: HttpClient) {}

  // Get User Notifications
  getNotifications(userId: string): Observable<NotificationResponse> {
    return this.http.get<NotificationResponse>(
      `${this.apiUrl}?userId=${userId}`
    );
  }

  // Mark One Notification as Read
  markAsRead(id: string): Observable<NotificationActionResponse> {
    return this.http.patch<NotificationActionResponse>(
      `${this.apiUrl}/${id}/read`,
      {}
    );
  }

  // Mark All Notifications as Read
  markAllAsRead(userId: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/read-all`,
      { userId }
    );
  }
}