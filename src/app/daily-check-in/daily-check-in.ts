import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DailyCheckInService, CheckIn } from '../services/daily-check-in.service';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-daily-check-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './daily-check-in.html',
  styleUrls: ['./daily-check-in.css']
})
export class DailyCheckIn {

  mood = signal(3);
  reflection = signal('');
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  constructor(
    public checkInService: DailyCheckInService,
    private userService: UserService
  ) {
    effect(() => {
      const user = this.userService.currentUser();
      if (user) {
        this.checkInService.loadCheckIns();
      } else {
        this.checkInService.stopListening();
      }
    });
  }

  async submitCheckIn() {
    this.errorMessage.set('');
    this.successMessage.set('');
    if (this.reflection().trim() === '') {
      this.errorMessage.set('Please write a reflection before submitting.');
      return;
    }

    this.isLoading.set(true);
    try {
      await this.checkInService.addCheckIn(this.mood(), this.reflection());
      this.successMessage.set('Check-in submitted successfully!');
      this.reflection.set('');
      this.mood.set(3);
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Failed to submit check-in.');
    } finally {
      this.isLoading.set(false);
    }
  }
}