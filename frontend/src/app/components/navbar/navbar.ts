import { Component, ViewChild } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { NotificationPanelComponent } from '../notification-panel/notification-panel';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    NotificationPanelComponent
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {

  @ViewChild(NotificationPanelComponent)
  notificationPanel?: NotificationPanelComponent;

  showNotifications = false;

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  get unreadCount(): number {
    return this.notificationPanel?.unreadCount ?? 0;
  }

}