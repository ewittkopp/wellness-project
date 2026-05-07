import { Component, inject, signal } from '@angular/core';
import { DiscussionService, Discussion } from '../discussion.service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ReplyService } from '../reply.service';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase.config';
import { Router } from '@angular/router';
import { UserService } from '../services/user-service';
@Component({
  selector: 'app-discussion',
  imports: [FormsModule, DatePipe],
  templateUrl: './discussion.html',
  styleUrl: './discussion.css',
})
export class DiscussionComponent {

  discussionService = inject(DiscussionService);
  replyService = inject(ReplyService);
  router = inject(Router);

  userService = inject(UserService);

  selectedReply = signal<any | null>(null);
replyEditMessage = signal('');

  title = signal('');
  message = signal('');
  selectedDiscussion = signal<Discussion | null>(null);
  replyMessage = signal('');

  addDiscussion() {
    this.discussionService.addDiscussion(this.title(), this.message());
    this.title.set('');
    this.message.set('');
  }

  selectDiscussion(d: Discussion) {
    this.selectedDiscussion.set(d);
    this.title.set(d.title);
    this.message.set(d.message);
  }

  editDiscussion() {
    const d = this.selectedDiscussion();
    if (!d) return;

    this.discussionService.editDiscussion(
      d.id!,
      this.title(),
      this.message(),
      d.userId
    );

    this.selectedDiscussion.set(null);
    this.title.set('');
    this.message.set('');
  }

  deleteDiscussion(d: Discussion) {
    this.discussionService.deleteDiscussion(d.id!);
  }

  addReply(postId: string) {
    if (!this.replyMessage()) return;
    this.replyService.addReply(postId, this.replyMessage());
    this.replyMessage.set('');
  }

  logout() {
    signOut(auth);
    this.router.navigate(['/login']);
  }

  selectReply(r: any) {
    this.selectedReply.set(r);
    this.replyEditMessage.set(r.message);
  }
  
  editReply() {
    const r = this.selectedReply();
    if (!r) return;
  
    this.replyService.editReply(r.id, this.replyEditMessage());
  
    this.selectedReply.set(null);
    this.replyEditMessage.set('');
  }
  
  deleteReply(id: string) {
    this.replyService.deleteReply(id);
  }
}