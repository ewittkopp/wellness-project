import { Injectable, signal, inject } from '@angular/core';
import { collection, Timestamp, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase.config';
import { UserService } from './services/user-service';

export interface Reply {
  id?: string;
  postId: string;
  userId: string;
  userName: string;
  message: string;
  createdAt: any;
}

@Injectable({
  providedIn: 'root',
})
export class ReplyService {

  replies = signal<Reply[]>([]);
  private replyCollection = collection(db, 'replies');
  userService = inject(UserService);

  constructor() {
    this.loadReplies();
  }

  loadReplies() {
    onSnapshot(this.replyCollection, snapshot => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Reply[];

      this.replies.set(data);
    });
  }

  async addReply(postId: string, message: string) {
    const user = this.userService.currentUser();
  
    const reply = {
      postId: postId,
      message: message,
      userId: user?.id || '',
      userName: user
        ? user.firstName + ' ' + user.lastName
        : 'Anonymous',
      createdAt: Timestamp.now()
    };
  
    await addDoc(this.replyCollection, reply);
  }

  async editReply(id: string, message: string) {
    await updateDoc(doc(db, 'replies', id), {
      message: message,
      updatedAt: Timestamp.now()
    });
  }
  
  async deleteReply(id: string) {
    await deleteDoc(doc(db, 'replies', id));
  }
}