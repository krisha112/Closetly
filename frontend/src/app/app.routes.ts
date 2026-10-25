
import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { ReactPageComponent } from './pages/React-page/React-page';
import { WardrobePageComponent } from './pages/Wardrobe-page/Wardrobe-page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'wardrobe',
    component: WardrobePageComponent
  },
  {
    path: 'outfit-creator',
    component: ReactPageComponent,
    data: { reactPage: 'createOutfit' }
  },
  {
    path: 'my-outfits',
    component: ReactPageComponent,
    data: { reactPage: 'outfits' }
  },
  {
    path: 'favourites',
    component: ReactPageComponent,
    data: { reactPage: 'favorites' }
  }
];
