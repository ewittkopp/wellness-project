import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { auth } from '../firebase.config';
import { UserService, User, UserNotifications } from '../services/user-service';
import { updateEmail, updatePassword, deleteUser as firebaseDeleteUser } from 'firebase/auth';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class Settings {

  firstName = signal('');
  lastName = signal('');
  email = signal('');
  notifications = signal<UserNotifications>({
    dailyCheckIn: false,
    habitReminder: false,
    weeklySummary: false
  });

  password = signal('');
  confirmPassword = signal('');
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  constructor(private userService: UserService) {
    effect(() => {
      const user: User | null = this.userService.currentUser();
      if (user) {
        this.firstName.set(user.firstName);
        this.lastName.set(user.lastName);
        this.email.set(user.email);
        this.notifications.set({ ...user.notifications });
      }
    });
  }

  async updateProfile() {
    const user = this.userService.currentUser();
    if (!user) return;

    this.errorMessage.set('');
    this.successMessage.set('');
    this.isLoading.set(true);

    try {
      await this.userService.updateUser(user.id!, {
        firstName: this.firstName(),
        lastName: this.lastName(),
        email: this.email(),
        notifications: { ...this.notifications() }
      });

      if (auth.currentUser && auth.currentUser.email !== this.email()) {
        await updateEmail(auth.currentUser, this.email());
      }

      this.successMessage.set('Profile updated successfully!');
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Failed to update profile');
    } finally {
      this.isLoading.set(false);
    }
  }

  async changePassword() {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.password() !== this.confirmPassword()) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    const fbUser = auth.currentUser;
    if (!fbUser) {
      this.errorMessage.set('No logged-in user');
      return;
    }

    this.isLoading.set(true);
    try {
      await updatePassword(fbUser, this.password());
      this.successMessage.set('Password updated successfully!');
      this.password.set('');
      this.confirmPassword.set('');
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Failed to update password');
    } finally {
      this.isLoading.set(false);
    }
  }

  async deactivateAccount() {
    const user = this.userService.currentUser();
    if (!user || !auth.currentUser) return;

    if (!confirm('Are you sure you want to deactivate your account? This cannot be undone.')) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      await this.userService.deleteUser(user.id!);
      await firebaseDeleteUser(auth.currentUser);

      this.successMessage.set('Account deactivated successfully!');
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Failed to deactivate account');
    } finally {
      this.isLoading.set(false);
    }
  }
}