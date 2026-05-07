import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { auth } from './firebase.config';
import { UserService } from './services/user-service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLinkWithHref],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('wellness-project');
  userService = inject(UserService)
  currentUserAuth = signal(auth.currentUser);
  logout(){
    auth.signOut();
    this.update();
  }
  update(){
    this.currentUserAuth = signal(auth.currentUser);
  }
  }
