import { Component, inject } from '@angular/core';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  userService = inject(UserService);

}
