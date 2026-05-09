import { Routes } from '@angular/router';
import { HabitsComponent } from './habits/habits';
import { DiscussionComponent } from './discussion/discussion';
import { AdminComponent } from './admin/admin';

import { Login } from './login/login';
import { Register } from './register/register';

import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';
import { GuestDashboard } from './guestDashboard/guestDashboard';

import { DailyCheckIn } from './daily-check-in/daily-check-in';
import { Goals } from './goals/goals';
import { Settings } from './settings/settings';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
    { path: '', component: GuestDashboard, canActivate: [publicGuard]},

    { path: 'login', component: Login, canActivate: [publicGuard] },
    { path: 'register', component: Register, canActivate: [publicGuard] },

    { path: 'home', component: GuestDashboard},

    { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },

    { path: 'habit', component: HabitsComponent, canActivate: [authGuard] },
    { path: 'discussion', component: DiscussionComponent, canActivate: [authGuard] },
    { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
    {
        path: 'daily-check-in',
        component: DailyCheckIn,
        canActivate: [authGuard]
    },
    {
        path: 'goals',
        component: Goals,
        canActivate: [authGuard]
    },
    {
        path: 'settings',
        component: Settings,
        canActivate: [authGuard]
    },
];

