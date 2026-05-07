import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';
import { GuestDashboard } from './guestDashboard/guestDashboard';

export const routes: Routes = [
  { path: '', component: GuestDashboard },
  { path: 'login', component: Login, canActivate: [publicGuard] },
  { path: 'register', component: Register, canActivate: [publicGuard]  },
  {path: 'dashboard', component: GuestDashboard, canActivate: [authGuard]  }
//   { path: 'dashboard', component: Dashboard, canActivate: [authGuard] } -> need to add a dashboard before routing to it with authGuard
];