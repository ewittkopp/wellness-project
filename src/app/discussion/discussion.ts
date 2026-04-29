import { Component, inject, signal } from '@angular/core';
import { DiscussionService } from '../discussion.service';
 import { Discussion } from '../discussion.service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-discussion',
  imports: [FormsModule, DatePipe],
  templateUrl: './discussion.html',
  styleUrl: './discussion.css',
})
export class DiscussionComponent {

discussionService = inject(DiscussionService);

title = signal<string>('');
message = signal<string>('');
selectedDiscussion = signal<Discussion | null>(null);


addDiscussion(){
  this.discussionService.addDiscussion(this.title(), this.message()); 
}

 selectDiscussion(d: Discussion) {
    this.selectedDiscussion.set(d);
    this.title.set(d.title);
    this.message.set(d.message);
   
  }

editDiscussion() {
  const discussion = this.selectedDiscussion();

  if (!discussion) return;

  this.discussionService.editDiscussion(discussion.id!, this.title(), this.message());

  this.selectedDiscussion.set(null);
}

deleteDiscussion(id: string) {
  this.discussionService.deleteDiscussion(id);
}

}
