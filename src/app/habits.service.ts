import { Injectable, signal } from '@angular/core';
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase.config';

export interface Habit {
  id?: string;
userId?: string;
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

  constructor() {
    this.loadHabits();
  }

  loadHabits() {
    onSnapshot(this.habitCollection, snapshot => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Habit[];

      this.habits.set(data);
    });
  }

  async addHabit(name: string, frequency: 'Daily' | 'Weekly') {
    const habit: Habit = {
      name,
      frequency,
      userId: 'demoUser',
      startDate: new Date().toISOString(),
      completedDays: 0,
      trackedDays: 0,
      completionRate: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await addDoc(this.habitCollection, habit);
  }

  getTrackedDays(startDate: any): number {
    const start = new Date(startDate);
    const today = new Date();

    const diff = today.getTime() - start.getTime();

    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  }

  async markComplete(habit: Habit) {
    const completedDays = habit.completedDays + 1;
    const trackedDays = this.getTrackedDays(habit.startDate);

    const completionRate = trackedDays === 0 ? 0 : completedDays / trackedDays;

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