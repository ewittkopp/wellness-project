import { Injectable, signal } from '@angular/core';
import {
  collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, Timestamp
} from 'firebase/firestore';
import { db } from '../firebase.config';

// Notifications sub-object
export interface UserNotifications {
  dailyCheckIn: boolean;
  habitReminder: boolean;
  weeklySummary: boolean;
}

// Updated User interface
export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  notifications: UserNotifications;
}

// Helper to build a new user object with defaults
export function createUserDefaults(
  firstName: string,
  lastName: string,
  email: string,
  role: 'user' | 'admin' = 'user'
): Omit<User, 'id'> {
  const now = Timestamp.now();
  return {
    firstName,
    lastName,
    email,
    role,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    notifications: {
      dailyCheckIn: false,
      habitReminder: false,
      weeklySummary: false,
    }
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users = signal<User[]>([]);
  currentUser = signal<User | null>(null);

  private userCollection = collection(db, 'users');

  loadUsers() {
    onSnapshot(this.userCollection, snapshot => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as User[];
      this.users.set(data);
    });
  }

  loadCurrentUser(uid: string) {
    const userRef = doc(db, 'users', uid);
    onSnapshot(userRef, snapshot => {
      if (snapshot.exists()) {
        this.currentUser.set({ id: snapshot.id, ...snapshot.data() } as User);
      } else {
        this.currentUser.set(null);
      }
    });
  }

  // Create — use createUserDefaults() to build the user object
  async addUser(uid: string, user: Omit<User, 'id'>): Promise<void> {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, user);
  }

  // Update — automatically stamps updatedAt
  async updateUser(id: string, changes: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<void> {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, {
      ...changes,
      updatedAt: Timestamp.now()
    });
  }

  // Delete
  async deleteUser(id: string): Promise<void> {
    const userRef = doc(db, 'users', id);
    await deleteDoc(userRef);
    if (this.currentUser()?.id === id) {
      this.currentUser.set(null);
    }
  }
}