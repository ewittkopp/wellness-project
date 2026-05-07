import { Injectable, signal, inject } from '@angular/core';
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase.config';
import { UserService } from './services/user-service';

export interface Habit {
  id?: string;
  userId: string;
  name: string;
  frequency: 'Daily' | 'Weekly';
  startDate: any;
  completedDays: number;
  trackedDays: number;
  completionRate: number;
  createdAt: any;
  updatedAt: any;
}

@Injectable({
  providedIn: 'root',
})
export class HabitService {

  habits = signal<Habit[]>([]);
  private habitCollection = collection(db, 'habits');
  userService = inject(UserService);

  constructor() {
    this.loadHabits(); 
  }


  loadHabits() {
    onSnapshot(this.habitCollection, snapshot => {
      const user = this.userService.currentUser();

      if (!user) {
        this.habits.set([]); 
        return;
      }

      const data = snapshot.docs
        .map(doc => ({
          ...doc.data(),
          id: doc.id
        }) as Habit)
        .filter(h => h.userId === user.id);

      this.habits.set(data);
    });
  }


  async addHabit(name: string, frequency: 'Daily' | 'Weekly') {
    const user = this.userService.currentUser();

    if (!user) {
      alert('Please login first');
      return;
    }

    const habit: Habit = {
      name,
      frequency,
      userId: user.id!, 
      startDate: new Date().toISOString(),
      completedDays: 0,
      trackedDays: 0,
      completionRate: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await addDoc(this.habitCollection, habit);
  }

  async markComplete(habit: Habit) {
    const completedDays = habit.completedDays + 1;
    const trackedDays = habit.trackedDays + 1;

    const completionRate =
      trackedDays === 0 ? 0 : completedDays / trackedDays;

    await updateDoc(doc(db, 'habits', habit.id!), {
      completedDays,
      trackedDays,
      completionRate,
      updatedAt: new Date()
    });
  }

  async editHabit(id: string, name: string, frequency: 'Daily' | 'Weekly') {
    await updateDoc(doc(db, 'habits', id), {
      name,
      frequency,
      updatedAt: new Date()
    });
  }

  async deleteHabit(id: string) {
    await deleteDoc(doc(db, 'habits', id));
  }
}