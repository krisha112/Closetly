import { Component } from '@angular/core';

import { DigitalWardrobe } from './pages/digital-wardrobe/digital-wardrobe';
import { AddClothing } from './pages/add-clothing/add-clothing';
import { ClothingDetails } from './pages/clothing-details/clothing-details';
import { EditClothing } from './pages/edit-clothing/edit-clothing';

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [DigitalWardrobe, AddClothing, ClothingDetails, EditClothing],

  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // ==================================================
  // CURRENT PAGE
  // ==================================================

  currentPage:
    | 'wardrobe'
    | 'outfits'
    | 'favorites'
    | 'explore'
    | 'profile'
    | 'add-clothing'
    | 'clothing-details'
    | 'edit-clothing' = 'wardrobe';

  // ==================================================
  // SELECTED CLOTHING
  // ==================================================

  selectedClothing: any = null;

  // ==================================================
  // CLOTHING DATA
  // ==================================================

  clothingItems: any[] = [
    {
      id: 1,
      name: 'Classic White Shirt',
      category: 'Tops',
      color: 'White',
      brand: 'Uniqlo',
      size: 'M',
      season: 'All Season',
      occasion: 'Casual',
      notes: 'A clean everyday white shirt.',
      image:
        'https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=900&q=85',
    },

    {
      id: 2,
      name: 'Olive Linen Top',
      category: 'Tops',
      color: 'Olive',
      brand: 'H&M',
      size: 'S',
      season: 'Summer',
      occasion: 'Casual',
      notes: 'Lightweight linen top for warm days.',
      image:
        'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85',
    },

    {
      id: 3,
      name: 'Mauve Knit Sweater',
      category: 'Tops',
      color: 'Mauve',
      brand: 'Zara',
      size: 'M',
      season: 'Winter',
      occasion: 'Casual',
      notes: 'Soft oversized knit sweater.',
      image:
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85',
    },

    {
      id: 4,
      name: 'Vintage Blue Jeans',
      category: 'Bottoms',
      color: 'Blue',
      brand: 'Levi’s',
      size: '28',
      season: 'All Season',
      occasion: 'Casual',
      notes: 'Classic straight-fit vintage jeans.',
      image:
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=85',
    },

    {
      id: 5,
      name: 'Beige Wide Leg Pants',
      category: 'Bottoms',
      color: 'Beige',
      brand: 'Mango',
      size: '28',
      season: 'Summer',
      occasion: 'Semi Formal',
      notes: 'Elegant wide-leg trousers.',
      image:
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=85',
    },

    {
      id: 6,
      name: 'Black Straight Trousers',
      category: 'Bottoms',
      color: 'Black',
      brand: 'Zara',
      size: '28',
      season: 'All Season',
      occasion: 'Formal',
      notes: 'Minimal black trousers for polished looks.',
      image:
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=85',
    },

    {
      id: 7,
      name: 'Satin Midi Dress',
      category: 'Dresses',
      color: 'Mauve',
      brand: 'Zara',
      size: 'S',
      season: 'Summer',
      occasion: 'Party',
      notes: 'Elegant satin midi dress.',
      image:
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85',
    },

    {
      id: 8,
      name: 'Floral Summer Dress',
      category: 'Dresses',
      color: 'Floral',
      brand: 'H&M',
      size: 'S',
      season: 'Summer',
      occasion: 'Casual',
      notes: 'Light floral dress for daytime outings.',
      image:
        'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=900&q=85',
    },

    {
      id: 9,
      name: 'Classic White Sneakers',
      category: 'Shoes',
      color: 'White',
      brand: 'Nike',
      size: '6',
      season: 'All Season',
      occasion: 'Casual',
      notes: 'Minimal everyday sneakers.',
      image:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85',
    },

    {
      id: 10,
      name: 'Brown Heeled Sandals',
      category: 'Shoes',
      color: 'Brown',
      brand: 'Aldo',
      size: '6',
      season: 'Summer',
      occasion: 'Party',
      notes: 'Simple heels for dressier occasions.',
      image:
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85',
    },

    {
      id: 11,
      name: 'Classic Black Sunglasses',
      category: 'Accessories',
      color: 'Black',
      brand: 'Ray-Ban',
      size: 'One Size',
      season: 'Summer',
      occasion: 'Casual',
      notes: 'Classic sunglasses with a clean silhouette.',
      image:
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85',
    },

    {
      id: 12,
      name: 'Tan Shoulder Bag',
      category: 'Accessories',
      color: 'Tan',
      brand: 'Charles & Keith',
      size: 'One Size',
      season: 'All Season',
      occasion: 'Casual',
      notes: 'Structured everyday shoulder bag.',
      image:
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85',
    },

    {
      id: 13,
      name: 'Cream Blazer',
      category: 'Tops',
      color: 'Cream',
      brand: 'Mango',
      size: 'M',
      season: 'All Season',
      occasion: 'Formal',
      notes: 'A polished neutral blazer for layering.',
      image:
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=85',
    },

    {
      id: 14,
      name: 'Black Evening Dress',
      category: 'Dresses',
      color: 'Black',
      brand: 'Forever New',
      size: 'S',
      season: 'Winter',
      occasion: 'Party',
      notes: 'Elegant black dress for evening events.',
      image:
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=85',
    },

    {
      id: 15,
      name: 'Chocolate Brown Cardigan',
      category: 'Tops',
      color: 'Brown',
      brand: 'Mango',
      size: 'M',
      season: 'Winter',
      occasion: 'Casual',
      notes: 'Warm brown cardigan with a soft finish.',
      image:
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=85',
    },
  ];

  // ==================================================
  // DELETED CLOTHING
  // ==================================================

  deletedClothing: string[] = [];

  // ==================================================
  // FAVORITES
  // ==================================================

  favoriteItems: number[] = [];

  // ==================================================
  // GLOBAL NOTIFICATION
  // ==================================================

  notificationVisible = false;

  notificationMessage = '';

  notificationType: 'success' | 'info' | 'error' = 'success';

  // ==================================================
  // SIDEBAR
  // ==================================================

  sidebarOpen = false;

  // ==================================================
  // PROFILE MENU
  // ==================================================

  profileMenuOpen = false;

  // ==================================================
  // GLOBAL SEARCH
  // ==================================================

  globalSearchText = '';

  // ==================================================
  // NAVIGATION
  // ==================================================

  navigateTo(page: 'wardrobe' | 'outfits' | 'favorites' | 'explore' | 'profile') {
    this.currentPage = page;

    this.sidebarOpen = false;

    this.profileMenuOpen = false;
  }

  // ==================================================
  // SHOW WARDROBE
  // ==================================================

  showWardrobe() {
    this.currentPage = 'wardrobe';

    this.sidebarOpen = false;
  }

  // ==================================================
  // SHOW ADD CLOTHING
  // ==================================================

  showAddClothing() {
    this.currentPage = 'add-clothing';
  }

  // ==================================================
  // SHOW CLOTHING DETAILS
  // ==================================================

  showClothingDetails(clothing: any) {
    this.selectedClothing = {
      ...clothing,
    };

    this.currentPage = 'clothing-details';
  }

  // ==================================================
  // SHOW EDIT CLOTHING
  // ==================================================

  showEditClothing(clothing: any) {
    this.selectedClothing = {
      ...clothing,
    };

    this.currentPage = 'edit-clothing';
  }

  // ==================================================
  // SAVE NEW CLOTHING
  // ==================================================

  saveNewClothing(clothing: any) {
    const newItem = {
      ...clothing,

      id: Date.now(),
    };

    this.clothingItems = [...this.clothingItems, newItem];

    this.currentPage = 'wardrobe';

    this.showNotification(
      'Clothing added to your wardrobe.',

      'success',
    );
  }

  // ==================================================
  // SAVE EDITED CLOTHING
  // ==================================================

  saveEditedClothing(updatedClothing: any) {
    const updatedItem = {
      ...updatedClothing,
    };

    const index = this.clothingItems.findIndex((item) => item.id === updatedItem.id);

    if (index !== -1) {
      const updatedItems = [...this.clothingItems];

      updatedItems[index] = updatedItem;

      this.clothingItems = updatedItems;
    }

    this.selectedClothing = {
      ...updatedItem,
    };

    this.currentPage = 'clothing-details';

    this.showNotification(
      'Clothing updated successfully.',

      'success',
    );
  }

  // ==================================================
  // DELETE CLOTHING
  // ==================================================

  deleteClothing(clothing: any) {
    if (!clothing) {
      return;
    }

    const clothingName = clothing.name || 'Clothing item';

    this.clothingItems = this.clothingItems.filter((item) => item.id !== clothing.id);

    if (!this.deletedClothing.includes(clothingName)) {
      this.deletedClothing = [...this.deletedClothing, clothingName];
    }

    this.favoriteItems = this.favoriteItems.filter((id) => id !== clothing.id);

    this.selectedClothing = null;

    this.currentPage = 'wardrobe';

    this.showNotification(
      `"${clothingName}" was removed from your wardrobe.`,

      'success',
    );
  }

  // ==================================================
  // TOGGLE FAVORITE
  // ==================================================

  toggleFavorite(clothing: any) {
    if (!clothing) {
      return;
    }

    const id = clothing.id;

    if (this.favoriteItems.includes(id)) {
      this.favoriteItems = this.favoriteItems.filter((item) => item !== id);

      this.showNotification(
        'Removed from favorites.',

        'info',
      );
    } else {
      this.favoriteItems = [...this.favoriteItems, id];

      this.showNotification(
        'Added to favorites.',

        'success',
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

    return this.favoriteItems.includes(clothing.id);
  }

  // ==================================================
  // SHOW FAVORITES
  // ==================================================

  showFavorites() {
    this.currentPage = 'favorites';

    this.sidebarOpen = false;
  }

  // ==================================================
  // SHOW OUTFITS
  // ==================================================

  showOutfits() {
    this.currentPage = 'outfits';

    this.sidebarOpen = false;
  }

  // ==================================================
  // SHOW EXPLORE
  // ==================================================

  showExplore() {
    this.currentPage = 'explore';

    this.sidebarOpen = false;
  }

  // ==================================================
  // SHOW PROFILE
  // ==================================================

  showProfile() {
    this.currentPage = 'profile';

    this.profileMenuOpen = false;
  }

  // ==================================================
  // TOGGLE PROFILE MENU
  // ==================================================

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  // ==================================================
  // TOGGLE SIDEBAR
  // ==================================================

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  // ==================================================
  // CLOSE SIDEBAR
  // ==================================================

  closeSidebar() {
    this.sidebarOpen = false;
  }

  // ==================================================
  // GLOBAL SEARCH
  // ==================================================

  updateGlobalSearch(searchText: string) {
    this.globalSearchText = searchText;
  }

  // ==================================================
  // NOTIFICATION
  // ==================================================

  showNotification(
    message: string,

    type: 'success' | 'info' | 'error' = 'success',
  ) {
    this.notificationMessage = message;

    this.notificationType = type;

    this.notificationVisible = true;

    setTimeout(() => {
      this.notificationVisible = false;
    }, 3500);
  }

  // ==================================================
  // CLOSE NOTIFICATION
  // ==================================================

  closeNotification() {
    this.notificationVisible = false;
  }

  // ==================================================
  // BACK FROM ADD CLOTHING
  // ==================================================

  backFromAddClothing() {
    this.currentPage = 'wardrobe';
  }

  // ==================================================
  // BACK FROM DETAILS
  // ==================================================

  backFromDetails() {
    this.currentPage = 'wardrobe';
  }

  // ==================================================
  // BACK FROM EDIT
  // ==================================================

  backFromEdit() {
    this.currentPage = 'clothing-details';
  }
}
