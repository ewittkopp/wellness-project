import { Injectable, signal, inject } from '@angular/core';
import {
  collection,
  Timestamp,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase.config';
import { UserService } from './services/user-service';

export interface Discussion {
  id?: string;
  userId: string;
  userName: string;
  title: string;
  message: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  flagged: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DiscussionService {

  userService = inject(UserService);

  discussions = signal<Discussion[]>([]);
  private discussionCollection = collection(db, 'discussions');

  constructor() {
    this.loadDiscussions();
  }

  loadDiscussions() {
    onSnapshot(this.discussionCollection, snapshot => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Discussion[];

      this.discussions.set(data);
    });
  }

  async addDiscussion(title: string, message: string) {
    const user = this.userService.currentUser();

    const discussion: Discussion = {
      title,
      message,
      userId: user?.id || '',
      userName: user ? user.firstName + ' ' + user.lastName : 'Anonymous',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      flagged: false
    };

    await addDoc(this.discussionCollection, discussion);
  }

  async editDiscussion(id: string, title: string, message: string, userId: string) {
    const currentUser = this.userService.currentUser();
    if (!currentUser || currentUser.id !== userId) return;

    await updateDoc(doc(db, 'discussions', id), {
      title,
      message,
      updatedAt: Timestamp.now()
    });
  }

  async deleteDiscussion(id: string) {
    await deleteDoc(doc(db, 'discussions', id));
  }
}