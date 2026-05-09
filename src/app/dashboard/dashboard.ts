import { Component, inject } from '@angular/core';
import { UserService } from '../services/user-service';
import { HabitService } from '../habits.service';
import { GoalsService } from '../services/goals.service';
import { DailyCheckInService } from '../services/daily-check-in.service';
import { RouterLink } from "@angular/router";
import { DiscussionService } from '../discussion.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  userService = inject(UserService);
  habitService = inject(HabitService);
  goalsService = inject(GoalsService);
  checkinService = inject(DailyCheckInService);
  discussionService = inject(DiscussionService);

  currentUserId = this.userService.currentUser()?.id;
  currentUser = this.userService.currentUser();
  goals = this.goalsService.goals();
  currentDate = new Date().toISOString().split('T')[0]

  completedGoals(){
    let count = 0
    for(let i = 0; i < this.goals.length; i++){
      if(this.goals[i].completed){
        count++;
      }
    }
    return count;
  }

  checkInComplete(){
    for(let i = 0; i < this.checkinService.checkIns().length; i++){
      if(this.checkinService.checkIns()[i].date == this.currentDate){
        return true
      }
    }
    return false;
  }
}
