import { Injectable, signal } from '@angular/core';
import { collection, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase.config';

export interface Reply {
  id?: string;
  postId: string;
  userId: string;
  message: string;
  createdAt: any;
}

@Injectable({
  providedIn: 'root',
})
export class ReplyService {

  replies = signal<Reply[]>([]);
  private replyCollection = collection(db, 'replies');

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
    const reply: Reply = {
      postId,
      message,
      userId: 'demoUser',
      createdAt: Timestamp.now()
    };

    await addDoc(this.replyCollection, reply);
  }

}