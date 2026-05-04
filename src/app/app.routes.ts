import { Routes } from '@angular/router';
import { HabitsComponent } from './habits/habits';
import { DiscussionComponent } from './discussion/discussion';
import { AdminComponent } from './admin/admin';

export const routes: Routes = [
    { path: 'habit', component: HabitsComponent },
    { path: 'discussion', component: DiscussionComponent },
    { path: 'admin', component: AdminComponent }

];
