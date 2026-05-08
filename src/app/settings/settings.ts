import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { auth } from '../firebase.config';
import { UserService, User, UserNotifications } from '../services/user-service';
import { SettingsService } from '../services/settings.service';
import { updateEmail, updatePassword, deleteUser as firebaseDeleteUser } from 'firebase/auth';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
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

  constructor(
    private userService: UserService,
    private settingsService: SettingsService
  ) {

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
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isLoading.set(true);

    try {
      await this.settingsService.updateProfile(
        this.firstName(),
        this.lastName(),
        this.email()
      );

      this.successMessage.set('Profile updated successfully!');
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Failed to update profile');
    } finally {
      this.isLoading.set(false);
    }
  }

  async updateNotifications() {
    this.isLoading.set(true);

    try {
      await this.settingsService.updateNotifications(this.notifications());
      this.successMessage.set('Notifications updated!');
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Failed to update notifications');
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

    this.isLoading.set(true);

    try {
      await this.settingsService.changePassword(this.password());

      this.successMessage.set('Password updated!');
      this.password.set('');
      this.confirmPassword.set('');
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Failed to update password');
    } finally {
      this.isLoading.set(false);
    }
  }

  async deactivateAccount() {
    if (!confirm('Are you sure? This cannot be undone.')) return;

    this.isLoading.set(true);

    try {
      await this.settingsService.deactivateAccount();
      await firebaseDeleteUser(auth.currentUser!);

      this.successMessage.set('Account deactivated');
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Failed to deactivate account');
    } finally {
      this.isLoading.set(false);
    }
  }
}