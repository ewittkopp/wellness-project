import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase.config';
import { UserService, User } from '../services/user-service';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
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

      // use getDoc instead of onSnapshot so we wait for the data directly
      const userRef = doc(db, 'users', credential.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        this.errorMessage.set('User account not found.');
        await signOut(auth);
        return;
      }

      const user = { id: userSnap.id, ...userSnap.data() } as User;

      // also update the signal so the rest of the app has the user
      this.userService.currentUser.set(user);

      if (!user.isActive) {
        this.errorMessage.set('Sorry, your account is deactivated.');
        await signOut(auth);
        return;
      }

      if (user.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/dashboard']);
      }

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