import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  MatIconModule
],
  templateUrl: './notification-panel.html',
  styleUrl: './notification-panel.scss'
})
export class NotificationPanelComponent {

  notifications: NotificationData[] = [
    {
      message: 'White Linen Shirt was added to your wardrobe.',
      type: 'clothes',
      isRead: false
    },
    {
      message: 'Your Casual Summer outfit has been saved.',
      type: 'outfit',
      isRead: false
    },
    {
      message: 'Weekend Chic was added to your favorites.',
      type: 'outfit',
      isRead: true
    },
    {
      message: 'A new item was added to your wishlist.',
      type: 'wishlist',
      isRead: true
    }
  ];

  constructor(
    private notificationService: NotificationService
  ) {}

  get unreadCount(): number {
    return this.notifications.filter(
      notification => !notification.isRead
    ).length;
  }

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

  markAsRead(notification: NotificationData): void {

    notification.isRead = true;

    if (notification._id) {

      this.notificationService
        .markAsRead(notification._id)
        .subscribe({
          next: () => {
            console.log('Notification marked as read.');
          },
          error: (error) => {
            console.log(
              'Backend not connected yet. Local status updated.',
              error
            );
          }
        });

    }

  }

  markAllAsRead(): void {

    this.notifications.forEach(
      notification => notification.isRead = true
    );

    this.notificationService
      .markAllAsRead()
      .subscribe({
        next: () => {
          console.log('All notifications marked as read.');
        },
        error: (error) => {
          console.log(
            'Backend not connected yet. Local status updated.',
            error
          );
        }
      });

  }

}