import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { ClothingService, ClothingItem } from './services/clothing.service';

import { DigitalWardrobe } from './pages/digital-wardrobe/digital-wardrobe';
import { AddClothing } from './pages/add-clothing/add-clothing';
import { ClothingDetails } from './pages/clothing-details/clothing-details';
import { EditClothingComponent } from './pages/edit-clothing/edit-clothing';

type AppPage =
  | 'wardrobe'
  | 'outfits'
  | 'favorites'
  | 'explore'
  | 'profile'
  | 'add-clothing'
  | 'clothing-details'
  | 'edit-clothing';

type NotificationType = 'success' | 'error' | 'info';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DigitalWardrobe, AddClothing, ClothingDetails, EditClothingComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly clothingService = inject(ClothingService);
  private readonly subscriptions = new Subscription();

  currentPage: AppPage = 'wardrobe';
  selectedClothing: any = null;
  clothingItems: any[] = [];
  favoriteItems: string[] = [];
  deletedClothing: string[] = [];

  sidebarOpen = false;
  profileMenuOpen = false;
  globalSearchText = '';

  notificationVisible = false;
  notificationMessage = '';
  notificationType: NotificationType = 'success';

  isLoading = false;

  private notificationTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.loadClothingItems();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();

    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
    }
  }

  private normalizeClothing(item: ClothingItem): any {
    return {
      ...item,
      _id: item._id || undefined,
      id: String(item._id || item.id || ''),
      isFavorite: Boolean(item.isFavorite),
    };
  }

  private getClothingId(clothing: any): string {
    return String(clothing?._id || clothing?.id || '');
  }

  loadClothingItems(): void {
    this.isLoading = true;

    this.subscriptions.add(
      this.clothingService.getClothingItems().subscribe({
        next: (response) => {
          this.clothingItems = (response.data || []).map((item) => this.normalizeClothing(item));

          this.favoriteItems = this.clothingItems
            .filter((item) => item.isFavorite)
            .map((item) => this.getClothingId(item));

          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Unable to load clothing:', error);

          this.showNotification(
            'Unable to load your wardrobe. Please check that the backend and database are running.',
            'error',
          );
        },
      }),
    );
  }

  navigateTo(page: string): void {
    const validPages: AppPage[] = [
      'wardrobe',
      'outfits',
      'favorites',
      'explore',
      'profile',
      'add-clothing',
      'clothing-details',
      'edit-clothing',
    ];

    if (validPages.includes(page as AppPage)) {
      this.currentPage = page as AppPage;
    }

    this.sidebarOpen = false;
    this.profileMenuOpen = false;
  }

  showWardrobe(): void {
    this.currentPage = 'wardrobe';
  }

  showAddClothing(): void {
    this.currentPage = 'add-clothing';
  }

  backFromAddClothing(): void {
    this.currentPage = 'wardrobe';
  }

  showOutfits(): void {
    this.currentPage = 'outfits';
  }

  showFavorites(): void {
    this.currentPage = 'favorites';
  }

  showExplore(): void {
    this.currentPage = 'explore';
  }

  showProfile(): void {
    this.currentPage = 'profile';
  }

  showClothingDetails(clothing: any): void {
    if (!clothing) {
      return;
    }

    this.selectedClothing = clothing;
    this.currentPage = 'clothing-details';
  }

  showEditClothing(clothing: any): void {
    if (!clothing) {
      return;
    }

    this.selectedClothing = { ...clothing };
    this.currentPage = 'edit-clothing';
  }

  saveNewClothing(clothing: ClothingItem): void {
    this.subscriptions.add(
      this.clothingService.addClothingItem(clothing).subscribe({
        next: (response) => {
          const savedItem = this.normalizeClothing(response.data);

          this.clothingItems = [savedItem, ...this.clothingItems];

          if (savedItem.isFavorite) {
            this.favoriteItems = [...this.favoriteItems, this.getClothingId(savedItem)];
          }

          this.selectedClothing = null;
          this.currentPage = 'wardrobe';

          this.showNotification(`"${savedItem.name}" was added to your wardrobe.`, 'success');
        },
        error: (error) => {
          console.error('Unable to save clothing:', error);

          this.showNotification(
            'Your clothing could not be saved. Please check the backend and try again.',
            'error',
          );
        },
      }),
    );
  }

  saveEditedClothing(updatedClothing: ClothingItem): void {
    const id = this.getClothingId(updatedClothing);

    if (!id) {
      this.showNotification(
        'Unable to identify this clothing item. Please try opening it again.',
        'error',
      );
      return;
    }

    this.subscriptions.add(
      this.clothingService.updateClothingItem(id, updatedClothing).subscribe({
        next: (response) => {
          const savedItem = this.normalizeClothing(response.data);

          this.clothingItems = this.clothingItems.map((item) =>
            this.getClothingId(item) === id ? savedItem : item,
          );

          this.selectedClothing = savedItem;

          this.favoriteItems = this.clothingItems
            .filter((item) => item.isFavorite)
            .map((item) => this.getClothingId(item));

          this.currentPage = 'clothing-details';

          this.showNotification(`"${savedItem.name}" was updated successfully.`, 'success');
        },
        error: (error) => {
          console.error('Unable to update clothing:', error);

          this.showNotification('Your changes could not be saved. Please try again.', 'error');
        },
      }),
    );
  }

  backFromEdit(): void {
    this.currentPage = this.selectedClothing ? 'clothing-details' : 'wardrobe';
  }

  deleteClothing(clothing: any): void {
    const id = this.getClothingId(clothing);

    if (!id) {
      this.showNotification('Unable to identify this clothing item.', 'error');
      return;
    }

    this.subscriptions.add(
      this.clothingService.deleteClothingItem(id).subscribe({
        next: () => {
          const clothingName = clothing.name || 'Clothing item';

          this.clothingItems = this.clothingItems.filter((item) => this.getClothingId(item) !== id);

          this.favoriteItems = this.favoriteItems.filter((favoriteId) => favoriteId !== id);

          this.deletedClothing = [...this.deletedClothing, clothingName];

          this.selectedClothing = null;
          this.currentPage = 'wardrobe';

          this.showNotification(`"${clothingName}" was removed from your wardrobe.`, 'success');
        },
        error: (error) => {
          console.error('Unable to delete clothing:', error);

          this.showNotification(
            'The clothing item could not be deleted. Please try again.',
            'error',
          );
        },
      }),
    );
  }

  toggleFavorite(clothing: any): void {
    const id = this.getClothingId(clothing);

    if (!id) {
      this.showNotification('Unable to identify this clothing item.', 'error');
      return;
    }

    const existingItem = this.clothingItems.find((item) => this.getClothingId(item) === id);

    if (!existingItem) {
      return;
    }

    const newFavoriteState = !existingItem.isFavorite;

    this.subscriptions.add(
      this.clothingService
        .updateClothingItem(id, {
          isFavorite: newFavoriteState,
        })
        .subscribe({
          next: (response) => {
            const updatedItem = this.normalizeClothing(response.data);

            this.clothingItems = this.clothingItems.map((item) =>
              this.getClothingId(item) === id ? updatedItem : item,
            );

            if (this.selectedClothing && this.getClothingId(this.selectedClothing) === id) {
              this.selectedClothing = updatedItem;
            }

            this.favoriteItems = this.clothingItems
              .filter((item) => item.isFavorite)
              .map((item) => this.getClothingId(item));

            this.showNotification(
              updatedItem.isFavorite
                ? `"${updatedItem.name}" added to favorites.`
                : `"${updatedItem.name}" removed from favorites.`,
              'success',
            );
          },
          error: (error) => {
            console.error('Unable to update favorite:', error);

            this.showNotification('Your favorite could not be updated. Please try again.', 'error');
          },
        }),
    );
  }

  isFavorite(clothing: any): boolean {
    return this.favoriteItems.includes(this.getClothingId(clothing));
  }

  getFavoriteCount(): number {
    return this.favoriteItems.length;
  }

  getFavoriteItems(): any[] {
    return this.clothingItems.filter((item) => this.isFavorite(item));
  }

  getClothingCount(): number {
    return this.clothingItems.length;
  }

  getCategories(): string[] {
    return ['Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories'];
  }

  getCategoryCount(category: string): number {
    return this.clothingItems.filter((item) => item.category === category).length;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeProfileMenu(): void {
    this.profileMenuOpen = false;
  }

  updateGlobalSearch(searchText: string): void {
    this.globalSearchText = searchText;
  }

  showNotification(message: string, type: NotificationType = 'success'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.notificationVisible = true;

    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
    }

    this.notificationTimer = setTimeout(() => {
      this.notificationVisible = false;
      this.notificationTimer = null;
    }, 3500);
  }

  closeNotification(): void {
    this.notificationVisible = false;

    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
      this.notificationTimer = null;
    }
  }

  backFromDetails(): void {
    this.currentPage = 'wardrobe';
    this.selectedClothing = null;
  }
}
