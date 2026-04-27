import { Component, inject, signal} from '@angular/core';
import { HabitService } from '../habits.service';
import { FormsModule } from '@angular/forms';
import { Habit } from '../habits.service';

@Component({
  selector: 'app-habits',
  imports: [FormsModule],
  templateUrl: './habits.html',
  styleUrl: './habits.css',
})
export class HabitsComponent {

  habitService = inject(HabitService);

  name = signal<string>('');
  frequency = signal<'Daily' | 'Weekly'>('Daily');
  selectedHabit = signal<Habit | null>(null);




  addHabit(){
    this.habitService.addHabit(this.name(), this.frequency()); 
  }

  selectHabit(h: Habit) {
    this.selectedHabit.set(h);
    this.name.set(h.name);
    this.frequency.set(h.frequency);
   
  }
  editHabit() {
    const habit = this.selectedHabit();
  
    if (!habit) return;
  
    this.habitService.editHabit(habit.id!, this.name(), this.frequency());
  
    this.selectedHabit.set(null);
  }
  markComplete(habit: Habit){

    this.habitService.markComplete(habit);
  }
  deleteHabit(id: string) {
    this.habitService.deleteHabit(id);
  }

}
