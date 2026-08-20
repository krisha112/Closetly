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

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://localhost:5000/api/notifications';

  constructor(private http: HttpClient) {}

  getNotifications(userId: string): Observable<NotificationResponse> {
  return this.http.get<NotificationResponse>(
    `${this.apiUrl}?userId=${userId}`
  );
}
 
  markAsRead(id: string): Observable<NotificationData> {
    return this.http.patch<NotificationData>(
      `${this.apiUrl}/${id}/read`,
      {}
    );
  }

  markAllAsRead(): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/read-all`,
      {}
    );
  }

}