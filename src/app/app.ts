import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, Router } from '@angular/router';
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
  router = inject(Router)
  logout(){
    auth.signOut();
    this.currentUserAuth = signal(auth.currentUser);
    this.router.navigate(['/dashboard'])
  }
  update(){
    this.currentUserAuth = signal(auth.currentUser);
  }
}
