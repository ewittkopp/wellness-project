import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalsService, Goal } from '../services/goals.service';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './goals.html',
  styleUrls: ['./goals.css']
})
export class Goals {

  newTitle = signal('');
  newDescription = signal('');
  newTargetValue = signal(0);

  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  constructor(
    public goalsService: GoalsService,
    private userService: UserService
  ) {
    effect(() => {
      const user = this.userService.currentUser();
      if (!user) return;

      this.goalsService.loadGoals();
    });
  }

  async addGoal() {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.newTitle().trim()) {
      this.errorMessage.set('Title is required.');
      return;
    }

    this.isLoading.set(true);

    try {
      await this.goalsService.addGoal({
        title: this.newTitle(),
        description: this.newDescription(),
        targetValue: this.newTargetValue(),
        currentProgress: 0,
        completed: false
      });

      this.successMessage.set('Goal added successfully!');

      this.newTitle.set('');
      this.newDescription.set('');
      this.newTargetValue.set(0);
    } catch (e: any) {
      this.errorMessage.set(e.message || 'Failed to add goal');
    } finally {
      this.isLoading.set(false);
    }
  }

  async deleteGoal(id: string) {
    await this.goalsService.deleteGoal(id);
  }

  onDescriptionInput(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.newDescription.set(value);
  }
}