
import { Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard';
import { ReactPageComponent } from './pages/React-page/React-page';
import { WardrobePageComponent } from './pages/Wardrobe-page/Wardrobe-page';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { ResetPassword } from './pages/reset-password/reset-password';
import { Profile } from './pages/profile/profile';
import { ChangePassword } from './pages/change-password/change-password';

import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Public authentication pages
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'forgot-password',
    component: ForgotPassword
  },
  {
    path: 'reset-password',
    component: ResetPassword
  },

  // Protected Closetly pages
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'wardrobe',
    component: WardrobePageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'outfit-creator',
    component: ReactPageComponent,
    data: { reactPage: 'createOutfit' },
    canActivate: [authGuard]
  },
  {
    path: 'my-outfits',
    component: ReactPageComponent,
    data: { reactPage: 'outfits' },
    canActivate: [authGuard]
  },
  {
    path: 'favourites',
    component: ReactPageComponent,
    data: { reactPage: 'favorites' },
    canActivate: [authGuard]
  },

  // Protected account pages
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard]
  },
  {
    path: 'change-password',
    component: ChangePassword,
    canActivate: [authGuard]
  },

  // Unknown URLs return to login
  {
    path: '**',
    redirectTo: 'login'
  }
];
