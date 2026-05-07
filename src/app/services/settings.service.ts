import { Injectable } from '@angular/core';
import { db, auth } from '../firebase.config';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { UserService } from './user-service';
import { updateEmail, updatePassword } from 'firebase/auth';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    constructor(private userService: UserService) { }

    private get currentUserId() {
        return this.userService.currentUser()?.id;
    }

    /** Update profile (Firestore + Firebase Auth email) */
    async updateProfile(firstName: string, lastName: string, email: string) {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');

        try {
            // Update Firebase Auth email if changed
            if (email && email !== user.email) {
                await updateEmail(user, email);
            }

            // Update Firestore profile
            await updateDoc(doc(db, 'users', user.uid), {
                firstName,
                lastName,
                email,
                updatedAt: Timestamp.now()
            });

            console.log('Profile updated successfully');
            return true;
        } catch (error: any) {
            console.error('Failed to update profile:', error);
            throw error;
        }
    }

    /** Update notifications */
    async updateNotifications(notifications: any) {
        const id = this.currentUserId;
        if (!id) throw new Error('No user loaded');

        await updateDoc(doc(db, 'users', id), {
            notifications,
            updatedAt: Timestamp.now()
        });

        console.log('Notifications updated successfully');
    }

    /** Change password in Firebase Auth */
    async changePassword(newPassword: string) {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');

        if (newPassword) {
            try {
                await updatePassword(user, newPassword);
                console.log('Password changed successfully');
            } catch (error: any) {
                console.error('Failed to change password:', error);
                throw error;
            }
        }
    }

    /** Deactivate account (Firestore + optional sign-out) */
    async deactivateAccount() {
        const id = this.currentUserId;
        if (!id) throw new Error('No user loaded');

        await updateDoc(doc(db, 'users', id), {
            isActive: false,
            updatedAt: Timestamp.now()
        });

        // Sign out from Firebase Auth
        await auth.signOut();
        console.log('Account deactivated and signed out');
    }
}