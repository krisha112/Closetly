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
  currentPage:
    | 'wardrobe'
    | 'outfits'
    | 'favorites'
    | 'explore'
    | 'profile'
    | 'add-clothing'
    | 'clothing-details'
    | 'edit-clothing' = 'wardrobe';

  selectedClothing: any = null;

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

  deletedClothing: string[] = [];

  favoriteItems: number[] = [];

  notificationVisible = false;
  notificationMessage = '';
  notificationType: 'success' | 'info' | 'error' = 'success';

  sidebarOpen = false;
  profileMenuOpen = false;

  globalSearchText = '';

  // -----------------------------
  // NAVIGATION
  // -----------------------------

  navigateTo(page: 'wardrobe' | 'outfits' | 'favorites' | 'explore' | 'profile'): void {
    this.currentPage = page;
    this.sidebarOpen = false;
    this.profileMenuOpen = false;
  }

  showWardrobe(): void {
    this.currentPage = 'wardrobe';
    this.sidebarOpen = false;
  }

  showAddClothing(): void {
    this.currentPage = 'add-clothing';
    this.sidebarOpen = false;
  }

  showOutfits(): void {
    this.currentPage = 'outfits';
    this.sidebarOpen = false;
  }

  showFavorites(): void {
    this.currentPage = 'favorites';
    this.sidebarOpen = false;
  }

  showExplore(): void {
    this.currentPage = 'explore';
    this.sidebarOpen = false;
  }

  showProfile(): void {
    this.currentPage = 'profile';
    this.sidebarOpen = false;
    this.profileMenuOpen = false;
  }

  // -----------------------------
  // CLOTHING DETAILS
  // -----------------------------

  showClothingDetails(clothing: any): void {
    if (!clothing) return;

    this.selectedClothing = { ...clothing };
    this.currentPage = 'clothing-details';
  }

  showEditClothing(clothing: any): void {
    if (!clothing) return;

    this.selectedClothing = { ...clothing };
    this.currentPage = 'edit-clothing';
  }

  // -----------------------------
  // ADD CLOTHING
  // -----------------------------

  saveNewClothing(clothing: any): void {
    if (!clothing) return;

    const newItem = {
      ...clothing,
      id: Date.now(),
    };

    this.clothingItems = [...this.clothingItems, newItem];

    this.currentPage = 'wardrobe';

    this.showNotification('Clothing added to your wardrobe.', 'success');
  }

  backFromAddClothing(): void {
    this.currentPage = 'wardrobe';
  }

  // -----------------------------
  // EDIT CLOTHING
  // -----------------------------

  saveEditedClothing(updatedClothing: any): void {
    if (!updatedClothing) return;

    const index = this.clothingItems.findIndex((item) => item.id === updatedClothing.id);

    if (index === -1) return;

    const updatedItems = [...this.clothingItems];

    updatedItems[index] = {
      ...updatedClothing,
    };

    this.clothingItems = updatedItems;

    this.selectedClothing = {
      ...updatedClothing,
    };

    this.currentPage = 'clothing-details';

    this.showNotification('Clothing updated successfully.', 'success');
  }

  backFromEdit(): void {
    if (this.selectedClothing) {
      this.currentPage = 'clothing-details';
    } else {
      this.currentPage = 'wardrobe';
    }
  }

  // -----------------------------
  // DELETE CLOTHING
  // -----------------------------

  deleteClothing(clothing: any): void {
    if (!clothing) return;

    const clothingName = clothing.name || 'Clothing item';

    this.clothingItems = this.clothingItems.filter((item) => item.id !== clothing.id);

    if (!this.deletedClothing.includes(clothingName)) {
      this.deletedClothing = [...this.deletedClothing, clothingName];
    }

    this.favoriteItems = this.favoriteItems.filter((id) => id !== clothing.id);

    this.selectedClothing = null;

    this.currentPage = 'wardrobe';

    this.showNotification(`"${clothingName}" was removed from your wardrobe.`, 'success');
  }

  // -----------------------------
  // FAVORITES
  // -----------------------------

  toggleFavorite(clothing: any): void {
    if (!clothing) return;

    const id = clothing.id;

    if (this.favoriteItems.includes(id)) {
      this.favoriteItems = this.favoriteItems.filter((item) => item !== id);

      this.showNotification('Removed from favorites.', 'info');
    } else {
      this.favoriteItems = [...this.favoriteItems, id];

      this.showNotification('Added to favorites.', 'success');
    }
  }

  isFavorite(clothing: any): boolean {
    if (!clothing) return false;

    return this.favoriteItems.includes(clothing.id);
  }

  getFavoriteCount(): number {
    return this.favoriteItems.length;
  }

  getFavoriteItems(): any[] {
    return this.clothingItems.filter((clothing) => this.favoriteItems.includes(clothing.id));
  }

  // -----------------------------
  // CLOTHING COUNTS
  // -----------------------------

  getClothingCount(): number {
    return this.clothingItems.length;
  }

  getCategories(): string[] {
    return ['Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories'];
  }

  getCategoryCount(category: string): number {
    return this.clothingItems.filter((clothing) => clothing.category === category).length;
  }

  // -----------------------------
  // SIDEBAR / PROFILE
  // -----------------------------

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

  // -----------------------------
  // SEARCH
  // -----------------------------

  updateGlobalSearch(searchText: string): void {
    this.globalSearchText = searchText;
  }

  // -----------------------------
  // NOTIFICATIONS
  // -----------------------------

  showNotification(message: string, type: 'success' | 'info' | 'error' = 'success'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.notificationVisible = true;

    setTimeout(() => {
      this.notificationVisible = false;
    }, 3500);
  }

  closeNotification(): void {
    this.notificationVisible = false;
  }

  // -----------------------------
  // DETAILS PAGE
  // -----------------------------

  backFromDetails(): void {
    this.currentPage = 'wardrobe';
    this.selectedClothing = null;
  }
}
