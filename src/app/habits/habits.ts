import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase.config';
import { HabitService, Habit } from '../habits.service';

@Component({
  selector: 'app-habits',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './habits.html',
  styleUrl: './habits.css',
})
export class HabitsComponent {

  habitService = inject(HabitService);
  router = inject(Router);

  name = signal('');
  frequency = signal<'Daily' | 'Weekly'>('Daily');
  selectedHabit = signal<Habit | null>(null);

  async logout() {
    await signOut(auth);
    this.router.navigate(['/login']);
  }

  addHabit() {
    if (!this.name()) return;

    this.habitService.addHabit(this.name(), this.frequency());

    this.name.set('');
    this.frequency.set('Daily');
  }

  selectHabit(h: Habit) {
    this.selectedHabit.set(h);
    this.name.set(h.name);
    this.frequency.set(h.frequency);
  }

  editHabit() {
    const habit = this.selectedHabit();
    if (!habit) return;

    this.habitService.editHabit(habit.id!, this.name(), this.frequency());

    this.selectedHabit.set(null);
    this.name.set('');
  }

  markComplete(habit: Habit) {
    this.habitService.markComplete(habit);
  }

  deleteHabit(id: string) {
    this.habitService.deleteHabit(id);
  }
}