import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-digital-wardrobe',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './digital-wardrobe.html',
  styleUrl: './digital-wardrobe.css'
})
export class DigitalWardrobe {

  // ==================================================
  // DATA RECEIVED FROM APP
  // ==================================================

  @Input() clothingItems: any[] = [];

  @Input() deletedClothing: string[] = [];


  // ==================================================
  // EVENTS SENT TO APP
  // ==================================================

  @Output() addClothing = new EventEmitter<void>();

  @Output() clothingDetails = new EventEmitter<any>();

  @Output() deleteClothing = new EventEmitter<any>();


  // ==================================================
  // SEARCH
  // ==================================================

  searchText = '';


  // ==================================================
  // CATEGORY FILTER
  // ==================================================

  selectedCategory = 'All';


  // ==================================================
  // SORTING
  // ==================================================

  selectedSort = 'recent';


  // ==================================================
  // FAVORITES
  // ==================================================

  favoriteItems: number[] = [];


  // ==================================================
  // FAVORITES VIEW
  // ==================================================

  showFavorites = false;


  // ==================================================
  // MOBILE SIDEBAR
  // ==================================================

  sidebarOpen = false;


  // ==================================================
  // DELETE CONFIRMATION MODAL
  // ==================================================

  showDeleteModal = false;

  clothingPendingDelete: any = null;


  // ==================================================
  // NOTIFICATION
  // ==================================================

  showNotification = false;

  notificationMessage = '';

  notificationType:
    | 'success'
    | 'info'
    | 'error' = 'success';


  // ==================================================
  // CATEGORIES
  // ==================================================

  categories = [
    'All',
    'Tops',
    'Bottoms',
    'Dresses',
    'Shoes',
    'Accessories'
  ];


  // ==================================================
  // CATEGORY ICONS
  // ==================================================

  categoryIcons: { [key: string]: string } = {

    All: '✦',

    Tops: '◒',

    Bottoms: '◓',

    Dresses: '◇',

    Shoes: '◈',

    Accessories: '✧'

  };


  // ==================================================
  // OPEN ADD CLOTHING
  // ==================================================

  openAddClothing() {

    this.addClothing.emit();

  }


  // ==================================================
  // OPEN CLOTHING DETAILS
  // ==================================================

  openClothingDetails(clothing: any) {

    if (!clothing) {
      return;
    }

    this.clothingDetails.emit(clothing);

  }


  // ==================================================
  // REQUEST DELETE
  // ==================================================

  deleteItem(clothing: any) {

    if (!clothing) {
      return;
    }

    this.clothingPendingDelete = clothing;

    this.showDeleteModal = true;

  }


  // ==================================================
  // CONFIRM DELETE
  // ==================================================

  confirmDelete() {

    if (!this.clothingPendingDelete) {
      return;
    }

    const clothing = this.clothingPendingDelete;

    this.deleteClothing.emit(clothing);

    this.showDeleteModal = false;

    this.clothingPendingDelete = null;

  }


  // ==================================================
  // CANCEL DELETE
  // ==================================================

  cancelDelete() {

    this.showDeleteModal = false;

    this.clothingPendingDelete = null;

  }


  // ==================================================
  // CHECK IF DELETED
  // ==================================================

  isDeleted(clothing: any): boolean {

    if (!clothing) {
      return false;
    }

    return this.deletedClothing.includes(
      clothing.name
    );

  }


  // ==================================================
  // SEARCH MATCH
  // ==================================================

  isSearchMatch(clothing: any): boolean {

    if (!clothing) {
      return false;
    }

    if (!this.searchText.trim()) {
      return true;
    }

    const search =
      this.searchText
        .toLowerCase()
        .trim();


    const searchableText = [

      clothing.name,

      clothing.brand,

      clothing.category,

      clothing.color,

      clothing.size,

      clothing.season,

      clothing.occasion,

      clothing.notes

    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();


    return searchableText.includes(search);

  }


  // ==================================================
  // CATEGORY SELECT
  // ==================================================

  selectCategory(category: string) {

    this.selectedCategory = category;

    this.showFavorites = false;

  }


  // ==================================================
  // CATEGORY MATCH
  // ==================================================

  isCategoryMatch(clothing: any): boolean {

    if (!clothing) {
      return false;
    }

    if (this.selectedCategory === 'All') {
      return true;
    }

    return (
      clothing.category ===
      this.selectedCategory
    );

  }


  // ==================================================
  // FAVORITE TOGGLE
  // ==================================================

  toggleFavorite(clothing: any) {

    if (!clothing) {
      return;
    }

    const id = clothing.id;


    if (
      this.favoriteItems.includes(id)
    ) {

      this.favoriteItems =
        this.favoriteItems.filter(
          item => item !== id
        );


      this.displayNotification(
        'Removed from your favorites.',
        'info'
      );

    } else {

      this.favoriteItems = [
        ...this.favoriteItems,
        id
      ];


      this.displayNotification(
        `${clothing.name || 'Piece'} added to favorites.`,
        'success'
      );

    }

  }


  // ==================================================
  // CHECK FAVORITE
  // ==================================================

  isFavorite(clothing: any): boolean {

    if (!clothing) {
      return false;
    }

    return this.favoriteItems.includes(
      clothing.id
    );

  }


  // ==================================================
  // FAVORITE COUNT
  // ==================================================

  getFavoriteCount(): number {

    return this.favoriteItems.length;

  }


  // ==================================================
  // SHOW ALL CLOTHES
  // ==================================================

  showAllClothes() {

    this.showFavorites = false;

  }


  // ==================================================
  // SHOW FAVORITES
  // ==================================================

  showFavoriteClothes() {

    this.showFavorites = true;

    this.selectedCategory = 'All';

  }


  // ==================================================
  // FAVORITE VIEW MATCH
  // ==================================================

  isFavoriteViewMatch(clothing: any): boolean {

    if (!this.showFavorites) {
      return true;
    }

    return this.isFavorite(clothing);

  }


  // ==================================================
  // SORT
  // ==================================================

  changeSort(sort: string) {

    this.selectedSort = sort;

  }


  // ==================================================
  // GET SORTED CLOTHING
  // ==================================================

  getSortedItems(): any[] {

    const visibleItems =
      this.clothingItems.filter(
        item =>
          !this.isDeleted(item) &&
          this.isSearchMatch(item) &&
          this.isCategoryMatch(item) &&
          this.isFavoriteViewMatch(item)
      );


    return [...visibleItems].sort(
      (a, b) => {

        if (this.selectedSort === 'name') {

          return (a.name || '')
            .localeCompare(
              b.name || ''
            );

        }


        if (
          this.selectedSort ===
          'category'
        ) {

          return (a.category || '')
            .localeCompare(
              b.category || ''
            );

        }


        if (
          this.selectedSort ===
          'favorites'
        ) {

          const aFav =
            this.isFavorite(a)
              ? 1
              : 0;

          const bFav =
            this.isFavorite(b)
              ? 1
              : 0;

          return bFav - aFav;

        }


        return 0;

      }
    );

  }


  // ==================================================
  // GET CLOTHING COUNT
  // ==================================================

  getClothingCount(): number {

    return this.clothingItems.filter(
      item => !this.isDeleted(item)
    ).length;

  }


  // ==================================================
  // GET CATEGORY COUNT
  // ==================================================

  getCategoryCount(
    category: string
  ): number {

    return this.clothingItems.filter(
      item =>
        !this.isDeleted(item) &&
        item.category === category
    ).length;

  }


  // ==================================================
  // GET SEARCH RESULT COUNT
  // ==================================================

  getVisibleItemCount(): number {

    return this.getSortedItems().length;

  }


  // ==================================================
  // CHECK IF SEARCH/FILTER IS ACTIVE
  // ==================================================

  hasActiveFilters(): boolean {

    return (
      this.searchText.trim() !== '' ||
      this.selectedCategory !== 'All' ||
      this.showFavorites
    );

  }


  // ==================================================
  // CLEAR FILTERS
  // ==================================================

  clearFilters() {

    this.searchText = '';

    this.selectedCategory = 'All';

    this.showFavorites = false;

    this.selectedSort = 'recent';

  }


  // ==================================================
  // SIDEBAR
  // ==================================================

  toggleSidebar() {

    this.sidebarOpen =
      !this.sidebarOpen;

  }


  // ==================================================
  // CLOSE SIDEBAR
  // ==================================================

  closeSidebar() {

    this.sidebarOpen = false;

  }


  // ==================================================
  // NOTIFICATION
  // ==================================================

  displayNotification(
    message: string,
    type:
      | 'success'
      | 'info'
      | 'error' = 'success'
  ) {

    this.notificationMessage =
      message;

    this.notificationType =
      type;

    this.showNotification =
      true;


    setTimeout(() => {

      this.showNotification =
        false;

    }, 3000);

  }


  // ==================================================
  // CLOSE NOTIFICATION
  // ==================================================

  closeNotification() {

    this.showNotification =
      false;

  }


  // ==================================================
  // TRACK BY
  // ==================================================

  trackByClothingId(
    index: number,
    clothing: any
  ) {

    return clothing.id ?? index;

  }

}