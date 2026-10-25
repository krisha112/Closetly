import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-digital-wardrobe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './digital-wardrobe.html',
  styleUrl: './digital-wardrobe.css',
})
export class DigitalWardrobe implements OnDestroy {
  /* =====================================================
     INPUTS FROM APP
  ====================================================== */

  @Input() clothingItems: any[] = [];

  @Input() deletedClothing: string[] = [];

  // MongoDB IDs are strings, not numbers.
  @Input() favoriteItems: string[] = [];

  /* =====================================================
     OUTPUTS TO APP
  ====================================================== */

  @Output() addClothing = new EventEmitter<void>();

  @Output() clothingDetails = new EventEmitter<any>();

  @Output() deleteClothing = new EventEmitter<any>();

  @Output() favoriteToggle = new EventEmitter<any>();

  @Output()
  navigate = new EventEmitter<'wardrobe' | 'outfits' | 'favorites' | 'explore' | 'profile'>();

  /* =====================================================
     SEARCH / FILTER / SORT
  ====================================================== */

  searchText = '';

  selectedCategory = 'All';

  selectedSort = 'recent';

  showFavorites = false;

  /* =====================================================
     SIDEBAR
  ====================================================== */

  sidebarOpen = false;

  /* =====================================================
     DELETE MODAL
  ====================================================== */

  showDeleteModal = false;

  clothingPendingDelete: any = null;

  /* =====================================================
     NOTIFICATION
  ====================================================== */

  showNotification = false;

  notificationMessage = '';

  notificationType: 'success' | 'info' | 'error' = 'success';

  private notificationTimer: ReturnType<typeof setTimeout> | null = null;

  /* =====================================================
     CATEGORIES
  ====================================================== */

  categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories'];

  categoryIcons: Record<string, string> = {
    All: '✦',
    Tops: '◒',
    Bottoms: '◓',
    Dresses: '◇',
    Shoes: '◈',
    Accessories: '✧',
  };

  /* =====================================================
     NAVIGATION
  ====================================================== */

  goToWardrobe(): void {
    this.showFavorites = false;
    this.selectedCategory = 'All';
    this.navigate.emit('wardrobe');
  }

  goToOutfits(): void {
    this.navigate.emit('outfits');
  }

  goToFavorites(): void {
    this.showFavorites = true;
    this.selectedCategory = 'All';
    this.navigate.emit('favorites');
  }

  goToExplore(): void {
    this.navigate.emit('explore');
  }

  goToProfile(): void {
    this.navigate.emit('profile');
  }

  /* =====================================================
     ADD CLOTHING
  ====================================================== */

  openAddClothing(): void {
    this.addClothing.emit();
  }

  /* =====================================================
     CLOTHING DETAILS
  ====================================================== */

  openClothingDetails(clothing: any): void {
    if (!clothing) {
      return;
    }

    this.clothingDetails.emit(clothing);
  }

  /* =====================================================
     DELETE
  ====================================================== */

  deleteItem(clothing: any): void {
    if (!clothing) {
      return;
    }

    this.clothingPendingDelete = clothing;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.clothingPendingDelete) {
      return;
    }

    const clothing = this.clothingPendingDelete;

    this.deleteClothing.emit(clothing);

    this.showDeleteModal = false;
    this.clothingPendingDelete = null;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.clothingPendingDelete = null;
  }

  isDeleted(clothing: any): boolean {
    if (!clothing) {
      return false;
    }

    const clothingId = this.getClothingId(clothing);

    // Support both ID-based deletion and the existing name-based format.
    return (
      this.deletedClothing.includes(clothingId) ||
      this.deletedClothing.includes(String(clothing.name || ''))
    );
  }

  /* =====================================================
     SEARCH
  ====================================================== */

  isSearchMatch(clothing: any): boolean {
    if (!clothing) {
      return false;
    }

    if (!this.searchText.trim()) {
      return true;
    }

    const search = this.searchText.toLowerCase().trim();

    const searchableText = [
      clothing.name,
      clothing.brand,
      clothing.category,
      clothing.color,
      clothing.size,
      clothing.season,
      clothing.occasion,
      clothing.notes,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(search);
  }

  /* =====================================================
     CATEGORY FILTER
  ====================================================== */

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.showFavorites = false;
  }

  isCategoryMatch(clothing: any): boolean {
    if (!clothing) {
      return false;
    }

    if (this.selectedCategory === 'All') {
      return true;
    }

    return clothing.category === this.selectedCategory;
  }

  /* =====================================================
     FAVORITES
  ====================================================== */

  toggleFavorite(clothing: any): void {
    if (!clothing) {
      return;
    }

    const wasFavorite = this.isFavorite(clothing);

    // App manages the favorite list and updates the data.
    this.favoriteToggle.emit(clothing);

    if (wasFavorite) {
      this.displayNotification('Removed from your favorites.', 'info');
    } else {
      this.displayNotification(`${clothing.name || 'Piece'} added to favorites.`, 'success');
    }
  }

  isFavorite(clothing: any): boolean {
    if (!clothing) {
      return false;
    }

    const clothingId = this.getClothingId(clothing);

    if (!clothingId) {
      return false;
    }

    return this.favoriteItems.some((favoriteId) => String(favoriteId) === clothingId);
  }

  private getClothingId(clothing: any): string {
    return String(clothing?._id || clothing?.id || '');
  }

  getFavoriteCount(): number {
    return this.favoriteItems.length;
  }

  showAllClothes(): void {
    this.showFavorites = false;
  }

  showFavoriteClothes(): void {
    this.showFavorites = true;
    this.selectedCategory = 'All';
  }

  isFavoriteViewMatch(clothing: any): boolean {
    if (!this.showFavorites) {
      return true;
    }

    return this.isFavorite(clothing);
  }

  /* =====================================================
     SORT
  ====================================================== */

  changeSort(sort: string): void {
    this.selectedSort = sort;
  }

  getSortedItems(): any[] {
    const visibleItems = this.clothingItems.filter(
      (item) =>
        !this.isDeleted(item) &&
        this.isSearchMatch(item) &&
        this.isCategoryMatch(item) &&
        this.isFavoriteViewMatch(item),
    );

    return [...visibleItems].sort((a, b) => {
      if (this.selectedSort === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      }

      if (this.selectedSort === 'category') {
        return (a.category || '').localeCompare(b.category || '');
      }

      if (this.selectedSort === 'favorites') {
        const aFavorite = this.isFavorite(a) ? 1 : 0;
        const bFavorite = this.isFavorite(b) ? 1 : 0;

        return bFavorite - aFavorite;
      }

      // Recent items appear first using creation timestamps.
      const aDate = new Date(a.createdAt || 0).getTime();
      const bDate = new Date(b.createdAt || 0).getTime();

      if (aDate !== bDate) {
        return bDate - aDate;
      }

      // Fallback for older items without creation timestamps.
      return this.getClothingId(b).localeCompare(this.getClothingId(a));
    });
  }

  /* =====================================================
     COUNTS
  ====================================================== */

  getClothingCount(): number {
    return this.clothingItems.filter((item) => !this.isDeleted(item)).length;
  }

  getCategoryCount(category: string): number {
    return this.clothingItems.filter((item) => !this.isDeleted(item) && item.category === category)
      .length;
  }

  getVisibleItemCount(): number {
    return this.getSortedItems().length;
  }

  /* =====================================================
     FILTER STATE
  ====================================================== */

  hasActiveFilters(): boolean {
    return this.searchText.trim() !== '' || this.selectedCategory !== 'All' || this.showFavorites;
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedCategory = 'All';
    this.showFavorites = false;
    this.selectedSort = 'recent';
  }

  /* =====================================================
     SIDEBAR
  ====================================================== */

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  /* =====================================================
     NOTIFICATIONS
  ====================================================== */

  displayNotification(message: string, type: 'success' | 'info' | 'error' = 'success'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;

    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
    }

    this.notificationTimer = setTimeout(() => {
      this.showNotification = false;
      this.notificationTimer = null;
    }, 3000);
  }

  closeNotification(): void {
    this.showNotification = false;

    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
      this.notificationTimer = null;
    }
  }

  /* =====================================================
     TRACKING
  ====================================================== */

  trackByClothingId(index: number, clothing: any): string | number {
    return clothing?._id || clothing?.id || index;
  }

  /* =====================================================
     CLEANUP
  ====================================================== */

  ngOnDestroy(): void {
    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
      this.notificationTimer = null;
    }
  }
}
