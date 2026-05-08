import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyCheckInService } from '../services/daily-check-in.service';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-daily-check-in',
  standalone: true,
  imports: [CommonModule],
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

      if (!user) {
        this.checkInService.stopListening();
        return;
      }

      this.checkInService.loadCheckIns();
    });
  }

  async submitCheckIn() {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.reflection().trim()) {
      this.errorMessage.set('Reflection is required');
      return;
    }

    this.isLoading.set(true);

    try {
      await this.checkInService.addCheckIn(
        this.mood(),
        this.reflection()
      );

      this.successMessage.set('Check-in submitted');

      this.mood.set(3);
      this.reflection.set('');

    } catch (e: any) {
      this.errorMessage.set(e.message || 'Failed to submit');
    } finally {
      this.isLoading.set(false);
    }
  }

  onReflectionInput(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.reflection.set(value);
  }
}