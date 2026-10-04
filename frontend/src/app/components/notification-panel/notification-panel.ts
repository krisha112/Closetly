import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import {
  NotificationService,
  NotificationData
} from '../../services/notification';

@Component({
  selector: 'app-notification-panel',
  standalone: true,
  imports: [
  CommonModule,
  DatePipe,
  MatIconModule
],
  templateUrl: './notification-panel.html',
  styleUrl: './notification-panel.scss'
})
export class NotificationPanelComponent implements OnInit {
  @Output() unreadCountChange = new EventEmitter<number>();
  notifications: NotificationData[] = [];

  // Temporary user ID
  // Later this will come from the logged-in user.
  userId = '';

  constructor(
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  // Load notifications from backend
  loadNotifications(): void {

    if (!this.userId) {
      console.log('User ID not available yet.');
      return;
    }

    this.notificationService
      .getNotifications(this.userId)
      .subscribe({
        next: (response) => {
  this.notifications = response.data;
  this.emitUnreadCount();

  console.log('Notifications loaded:', this.notifications);
},

        error: (error) => {
          console.log(
            'Unable to load notifications from backend.',
            error
          );
        }
      });

  }

  // Count unread notifications
  get unreadCount(): number {
  return this.notifications.filter(
    notification => !notification.isRead
  ).length;
}

emitUnreadCount(): void {
  this.unreadCountChange.emit(this.unreadCount);
}

  // Select icon according to notification type
  getIcon(type: string): string {

    switch (type) {

      case 'clothes':
        return 'checkroom';

      case 'outfit':
        return 'style';

      case 'profile':
        return 'person';

      case 'wishlist':
        return 'favorite_border';

      case 'system':
        return 'info';

      default:
        return 'notifications';

    }

  }

  // Mark one notification as read
  markAsRead(notification: NotificationData): void {

    notification.isRead = true;
    this.emitUnreadCount();
    if (notification._id) {

      this.notificationService
        .markAsRead(notification._id)
        .subscribe({
          next: () => {
            console.log('Notification marked as read.');
          },

          error: (error) => {
            console.log(
              'Backend error while marking notification as read.',
              error
            );
          }
        });

    }

  }

  // Mark all notifications as read
 markAllAsRead(): void {

  this.notifications.forEach(
    notification => notification.isRead = true
  );

  this.emitUnreadCount();

  // Do not call backend until a user ID is available.
  if (!this.userId) {
    console.log('User ID not available. Notifications marked as read locally.');
    return;
  }

  this.notificationService
    .markAllAsRead(this.userId)
    .subscribe({
      next: () => {
        console.log('All notifications marked as read.');
      },
      error: (error) => {
        console.log(
          'Backend error while marking notifications as read.',
          error
        );
      }
    });
}

}