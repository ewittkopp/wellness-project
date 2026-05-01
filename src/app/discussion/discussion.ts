import { Component, inject, signal } from '@angular/core';
import { DiscussionService, Discussion } from '../discussion.service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ReplyService } from '../reply.service';

@Component({
  selector: 'app-discussion',
  imports: [FormsModule, DatePipe],
  templateUrl: './discussion.html',
  styleUrl: './discussion.css',
})
export class DiscussionComponent {

  discussionService = inject(DiscussionService);
  replyService = inject(ReplyService);

  title = signal<string>('');
  message = signal<string>('');
  selectedDiscussion = signal<Discussion | null>(null);

  replyMessage = signal<string>('');

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
    const discussion = this.selectedDiscussion();
    if (!discussion) return;

    this.discussionService.editDiscussion(
      discussion.id!,
      this.title(),
      this.message()
    );

    this.selectedDiscussion.set(null);
    this.title.set('');
    this.message.set('');
  }

  deleteDiscussion(id: string) {
    this.discussionService.deleteDiscussion(id);
  }

  addReply(postId: string) {
    if (!this.replyMessage()) return;

    this.replyService.addReply(postId, this.replyMessage());
    this.replyMessage.set('');
  }
}