import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guest-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './guest-dashboard.html',
  styleUrl: './guest-dashboard.css'
})
export class GuestDashboard {

  sampleGoals = [
    { title: 'Meditate Daily', progress: 70, category: 'Mindfulness' },
    { title: 'Exercise 3x a Week', progress: 50, category: 'Physical' },
    { title: 'Read Before Bed', progress: 85, category: 'Mental' },
  ];

  sampleJournal = [
    { date: 'May 5, 2026', excerpt: 'Today I felt really productive. I managed to complete my morning routine without feeling rushed...' },
    { date: 'May 4, 2026', excerpt: 'Struggled a bit today but reminded myself that progress is not always linear...' },
    { date: 'May 3, 2026', excerpt: 'Great day overall! Had a walk outside and it really helped clear my head...' },
  ];

  samplePosts = [
    { author: 'Alex M.', category: 'Mindfulness', content: 'Anyone else find that a 5-minute morning meditation sets the tone for the whole day?' },
    { author: 'Jordan K.', category: 'Goals', content: 'Just hit 30 days on my daily walk goal! Small steps really do add up.' },
    { author: 'Riley T.', category: 'Stress', content: 'Been using the daily check-in prompts for two weeks and I can already see patterns in my mood.' },
  ];

  samplePrompts = [
    'What is one thing you are grateful for today?',
    'How would you describe your energy level this morning?',
    'What is one small win you can celebrate from yesterday?',
  ];

  weeklySummary = [
    { day: 'Mon', mood: 80 },
    { day: 'Tue', mood: 60 },
    { day: 'Wed', mood: 75 },
    { day: 'Thu', mood: 50 },
    { day: 'Fri', mood: 90 },
    { day: 'Sat', mood: 85 },
    { day: 'Sun', mood: 70 },
  ];

  maxMood = 100;

  getMoodColor(mood: number): string {
    if (mood >= 75) return '#2e7d32';
    if (mood >= 50) return '#f9a825';
    return '#c62828';
  }
}