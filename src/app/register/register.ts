import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';
import { UserService, createUserDefaults } from '../services/user-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  firstName = signal('');
  lastName = signal('');
  email = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  constructor(private router: Router, private userService: UserService) {}

  async register() {
    this.errorMessage.set('');

    if (!this.firstName() || !this.lastName()) {
      this.errorMessage.set('Please enter your first and last name.');
      return;
    }

    this.isLoading.set(true);

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        this.email(),
        this.password()
      );

      const newUser = createUserDefaults(
        this.firstName(),
        this.lastName(),
        this.email()
      );

      await this.userService.addUser(credential.user.uid, newUser);
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
      case 'auth/email-already-in-use': return 'An account with this email already exists.';
      case 'auth/weak-password': return 'Password must be at least 6 characters.';
      case 'auth/invalid-email': return 'Please enter a valid email address.';
      default: return 'Registration failed. Please try again.';
    }
  }
}