import { Injectable, signal } from '@angular/core';
import { db } from '../firebase.config';
import { collection, addDoc, doc, updateDoc, deleteDoc, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { Unsubscribe } from 'firebase/firestore';
import { UserService } from './user-service';

export interface CheckIn {
    id?: string;
    userId: string;
    date: string;
    mood: number;
    reflection: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

@Injectable({
    providedIn: 'root'
})
export class DailyCheckInService {
    checkIns = signal<CheckIn[]>([]);
    private listener: Unsubscribe | null = null;

    constructor(private userService: UserService) { }

    private get currentUserId() {
        return this.userService.currentUser()?.id;
    }

    loadCheckIns() {
        const user = this.userService.currentUser();
        if (!user) {
            this.checkIns.set([]);
            return;
        }

        if (this.listener) this.listener();

        const q = query(collection(db, 'checkIns'), where('userId', '==', user.id));

        this.listener = onSnapshot(q, snapshot => {
            const list: CheckIn[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as CheckIn));
            this.checkIns.set(list);
        });
    }

    async addCheckIn(mood: number, reflection: string) {
        const user = this.userService.currentUser();
        if (!user) throw new Error('No logged-in user');

        await addDoc(collection(db, 'checkIns'), {
            userId: user.id,
            date: new Date().toISOString().split('T')[0],
            mood,
            reflection,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });
    }

    async deleteCheckIn(id: string) {
        await deleteDoc(doc(db, 'checkIns', id));
    }

    stopListening() {
        if (this.listener) {
            this.listener();
            this.listener = null;
        }
    }
}