
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { NavbarComponent } from '../../components/navbar/navbar';
import { DigitalWardrobe } from '../digital-wardrobe/digital-wardrobe';
import { ClothingService, ClothingItem } from '../../services/Clothing';

@Component({
  selector: 'app-wardrobe-page',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    NavbarComponent,
    DigitalWardrobe
  ],
  templateUrl: './wardrobe-page.html',
  styleUrl: './wardrobe-page.css'
})
export class WardrobePageComponent implements OnInit {
  private clothingService = inject(ClothingService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  clothingItems: ClothingItem[] = [];
  favoriteItems: Array<string | number> = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadClothing();
  }

  loadClothing(): void {
    this.loading = true;
    this.errorMessage = '';

    this.clothingService.getClothingItems().subscribe({
      next: (response) => {
        this.clothingItems = (response.data ?? []).map(item => ({
          ...item,
          id: item._id ?? item.id
        }));

        this.favoriteItems = this.clothingItems
          .filter(item => item.isFavorite)
          .map(item => item._id ?? item.id)
          .filter((id): id is string | number => id !== undefined);

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Could not load wardrobe:', error);
        this.errorMessage =
          'Could not load wardrobe. Check that the backend and database are running.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleFavorite(item: ClothingItem): void {
    const id = item._id ?? item.id;
    if (id === undefined) return;

    const wasFavorite = this.favoriteItems.some(
      favoriteId => String(favoriteId) === String(id)
    );

    this.clothingService.updateClothingItem(String(id), {
      isFavorite: !wasFavorite
    }).subscribe({
      next: (response) => {
        const updatedItem = response.data;

        this.clothingItems = this.clothingItems.map(clothing =>
          String(clothing._id ?? clothing.id) === String(id)
            ? {
                ...clothing,
                ...updatedItem,
                id: updatedItem._id ?? updatedItem.id ?? id,
                isFavorite: !wasFavorite
              }
            : clothing
        );

        this.favoriteItems = wasFavorite
          ? this.favoriteItems.filter(
              favoriteId => String(favoriteId) !== String(id)
            )
          : [
              ...this.favoriteItems.filter(
                favoriteId => String(favoriteId) !== String(id)
              ),
              String(id)
            ];

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Could not update favorite:', error);
        this.errorMessage =
          'Could not update favorite. Please try again.';
      }
    });
  }

  deleteClothing(item: ClothingItem): void {
    const id = item._id ?? item.id;
    if (id === undefined) return;

    this.clothingService.deleteClothingItem(String(id)).subscribe({
      next: () => {
        this.clothingItems = this.clothingItems.filter(
          clothing =>
            String(clothing._id ?? clothing.id) !== String(id)
        );

        this.favoriteItems = this.favoriteItems.filter(
          favoriteId => String(favoriteId) !== String(id)
        );

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Could not delete clothing:', error);
        this.errorMessage =
          'Could not delete this item. Please try again.';
      }
    });
  }

  showAddMessage(): void {
    this.errorMessage =
      'Add Clothing is not connected to the main dashboard yet.';
  }

  showDetails(item: ClothingItem): void {
    console.log('Selected clothing:', item);
    this.errorMessage =
      'Clothing details are not connected to the main dashboard yet.';
  }

  onWardrobeNavigate(
    page: 'wardrobe' | 'outfits' | 'favorites' | 'explore' | 'profile'
  ): void {
    switch (page) {
      case 'wardrobe':
      case 'favorites':
        this.loadClothing();
        break;

      case 'outfits':
        void this.router.navigate(['/my-outfits']);
        break;

      case 'explore':
        void this.router.navigate(['/outfit-creator']);
        break;

      case 'profile':
        this.errorMessage = 'Profile page is not connected yet.';
        break;
    }
  }
}
