import { Component, inject, signal } from '@angular/core';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { DiscussionService } from '../discussion.service';
import { DatePipe } from '@angular/common';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';

interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
}


@Component({
  selector: 'app-admin',
  imports: [DatePipe],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class AdminComponent {

  discussionService = inject(DiscussionService);
  userService = inject(UserService);
  router = inject(Router);

  users = signal<User[]>([]);

  constructor() {
    this.loadUsers();
  }

  loadUsers() {
    const userCollection = collection(db, 'users');

    onSnapshot(userCollection, snapshot => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as User[];

      this.users.set(data);
    });
  }

  deactivateUser(id: string) {
    updateDoc(doc(db, 'users', id), {
      isActive: false
    });
  }

  deletePost(id: string) {
    this.discussionService.deleteDiscussion(id);
  }

  logout() {
    this.userService.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}