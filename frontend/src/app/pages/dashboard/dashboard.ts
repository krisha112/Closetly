import { Component, OnInit } from '@angular/core';

import { SidebarComponent } from '../../components/sidebar/sidebar';
import { NavbarComponent } from '../../components/navbar/navbar';
import { DashboardCardComponent } from '../../components/dashboard-card/dashboard-card';
import { ChartsComponent } from '../../components/charts/charts';
import { RecentActivityComponent } from '../../components/recent-activity/recent-activity';

import {
  DashboardService,
  DashboardData
} from '../../services/dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidebarComponent,
    NavbarComponent,
    DashboardCardComponent,
    ChartsComponent,
    RecentActivityComponent
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

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {

    this.dashboardService
      .getDashboardData()
      .subscribe({

        next: (data) => {
          this.dashboardData = data;
        },

        error: (error) => {
          console.log(
            'Could not load dashboard data.',
            'Using default values.',
            error
          );
        }

      });

  }

}