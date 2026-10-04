import { Component } from '@angular/core';
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

  showNotifications = false;
  unreadCount = 0;

  updateUnreadCount(count: number): void {
  this.unreadCount = count;
  }
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

}