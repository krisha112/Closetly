import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { SidebarComponent } from '../../components/sidebar/sidebar';
import { NavbarComponent } from '../../components/navbar/navbar';

import {
  DashboardService,
  DashboardData
} from '../../services/dashboard';

import { ClothingService, ClothingItem } from '../../services/Clothing';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink,
    SidebarComponent,
    NavbarComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardData = {
    totalClothes: 0,
    totalOutfits: 0,
    favoriteOutfits: 0,
    recentClothes: []
  };

  clothingItems: ClothingItem[] = [];
  insightsPeriod: 'week' | 'month' | 'threeMonths' = 'month';
  loadingClothes = true;
  clothingError = '';

  constructor(
  private dashboardService: DashboardService,
  private clothingService: ClothingService,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadClothingItems();
  }

 
loadDashboardData(): void {
  this.dashboardService.getDashboardData().subscribe({
    next: (data) => {
      console.log('DASHBOARD API RESPONSE:', data);

      this.dashboardData = {
        ...data,
        recentClothes: data.recentClothes ?? []
      };
    },
    error: (error) => {
      console.error('Could not load dashboard summary:', error);
    }
  });
}


  loadClothingItems(): void {
    this.loadingClothes = true;
    this.clothingError = '';

    this.clothingService.getClothingItems().subscribe({
     next: (response) => {
  console.log('CLOTHING DATA:', response.data);

  this.clothingItems = (response.data ?? []).map(item => ({
    ...item,
    id: item._id ?? item.id
  }));

  this.loadingClothes = false;
  this.cdr.detectChanges();

  console.log('ITEM COUNT:', this.clothingItems.length);
},
      error: (error) => {
        console.error('Could not load dashboard clothing:', error);
        this.clothingError = 'Could not load your clothing collection.';
        this.loadingClothes = false;
      }
    });
  }

  get recentClothes(): ClothingItem[] {
    return [...this.clothingItems]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt ?? 0).getTime();
        const dateB = new Date(b.createdAt ?? 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 4);
  }

  get totalClothes(): number {
    return this.clothingItems.length;
  }

  get categoryInsights(): Array<{
    name: string;
    icon: string;
    count: number;
    percentage: number;
  }> {
    const categories = [
      { name: 'Tops', icon: 'checkroom' },
      { name: 'Bottoms', icon: 'straighten' },
      { name: 'Dresses', icon: 'checkroom' },
      { name: 'Shoes', icon: 'steps' },
      { name: 'Accessories', icon: 'shopping_bag' }
    ];

    const maximum = Math.max(
      1,
      ...categories.map(category =>
        this.clothingItems.filter(
          item => item.category?.toLowerCase() === category.name.toLowerCase()
        ).length
      )
    );

    return categories.map(category => {
      const count = this.clothingItems.filter(
        item => item.category?.toLowerCase() === category.name.toLowerCase()
      ).length;

      return {
        ...category,
        count,
        percentage: Math.round((count / maximum) * 100)
      };
    });
  }

  onInsightsPeriodChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;

    if (
      value === 'week' ||
      value === 'month' ||
      value === 'threeMonths'
    ) {
      this.insightsPeriod = value;
    }
  }
}
