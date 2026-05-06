import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  email = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  constructor(private router: Router, private userService: UserService) {}

  async login() {
    this.errorMessage.set('');
    this.isLoading.set(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        this.email(),
        this.password()
      );
      this.userService.loadCurrentUser(credential.user.uid);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage.set(this.getFriendlyError(error.code));
    } finally {
      this.isLoading.set(false);
    }
  }

  private getFriendlyError(code: string): string {
    switch (code) {
      case 'auth/user-not-found': return 'No account found with this email.';
      case 'auth/wrong-password': return 'Incorrect password. Please try again.';
      case 'auth/invalid-email': return 'Please enter a valid email address.';
      case 'auth/too-many-requests': return 'Too many attempts. Please try again later.';
      default: return 'Login failed. Please try again.';
    }
  }
}