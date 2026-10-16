
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { SidebarComponent } from '../../components/sidebar/sidebar';
import { NavbarComponent } from '../../components/navbar/navbar';

import {
  DashboardService,
  DashboardData
} from '../../services/dashboard';

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

  insightsPeriod: 'week' | 'month' | 'threeMonths' = 'month';

  // Sample clothing cards for the empty dashboard preview.
  // These are not saved to the database.
  sampleClothes = [
    {
      name: 'White Knit Top',
      category: 'Tops',
      size: 'S',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=85'
    },
    {
      name: 'Wide Leg Jeans',
      category: 'Bottoms',
      size: 'M',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&q=85'
    },
    {
      name: 'Floral Midi Dress',
      category: 'Dresses',
      size: 'S',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=85'
    },
    {
      name: 'Beige Blazer',
      category: 'Outerwear',
      size: 'M',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=85'
    }
  ];

  // Illustrative values for the Style Insights preview.
  sampleCategories = [
    { name: 'Tops', icon: 'checkroom', count: 12, percentage: 74 },
    { name: 'Bottoms', icon: 'straighten', count: 8, percentage: 54 },
    { name: 'Dresses', icon: 'checkroom', count: 6, percentage: 39 },
    { name: 'Shoes', icon: 'steps', count: 10, percentage: 69 },
    { name: 'Accessories', icon: 'shopping_bag', count: 7, percentage: 51 }
  ];

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = {
          ...data,
          recentClothes: data.recentClothes ?? []
        };
      },
      error: (error) => {
        console.log(
          'Could not load dashboard data. Using default values.',
          error
        );
      }
    });
  }

  onInsightsPeriodChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value;

    if (
      value === 'week' ||
      value === 'month' ||
      value === 'threeMonths'
    ) {
      this.insightsPeriod = value;
    }
  }
}
