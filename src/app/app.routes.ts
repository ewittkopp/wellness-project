import { Routes } from '@angular/router';
import { HabitsComponent } from './habits/habits';
import { DiscussionComponent } from './discussion/discussion';
import { AdminComponent } from './admin/admin';

import { Login } from './login/login';
import { Register } from './register/register';

import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },


  { path: 'login', component: Login, canActivate: [publicGuard] },
  { path: 'register', component: Register, canActivate: [publicGuard] },

  { path: 'habit', component: HabitsComponent, canActivate: [authGuard] },
  { path: 'discussion', component: DiscussionComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
];