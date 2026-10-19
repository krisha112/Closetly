
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
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
export class NavbarComponent implements OnInit, OnDestroy {
  showNotifications = false;
  unreadCount = 0;
  pageTitle = 'Dashboard';

  private routerSubscription?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updatePageTitle(this.router.url);

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updatePageTitle((event as NavigationEnd).urlAfterRedirects);
      });
  }

  private updatePageTitle(url: string): void {
    const path = url.split('?')[0].split('/').filter(Boolean).pop();

    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      'outfit-creator': 'Outfit Creator',
      'my-outfits': 'My Outfits',
      favourites: 'Favourites',
      wardrobe: 'Wardrobe',
      profile: 'Profile'
    };

    this.pageTitle = titles[path ?? 'dashboard'] ?? 'Dashboard';
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  updateUnreadCount(count: number): void {
    this.unreadCount = count;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
}
