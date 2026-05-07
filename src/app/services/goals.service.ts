import { Injectable, signal } from '@angular/core';
import { db } from '../firebase.config';
import { collection, addDoc, doc, updateDoc, deleteDoc, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { Unsubscribe } from 'firebase/firestore';
import { UserService } from './user-service';

export interface Goal {
    id?: string;
    userId: string;
    title: string;
    description: string;
    targetValue: number;
    currentProgress: number;
    completed: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

@Injectable({
    providedIn: 'root'
})
export class GoalsService {
    goals = signal<Goal[]>([]);
    private goalsListener: Unsubscribe | null = null;

    constructor(private userService: UserService) { }

    private get currentUserId() {
        return this.userService.currentUser()?.id;
    }

    loadGoals() {
        const user = this.userService.currentUser();
        if (!user) {
            console.log('No logged-in user');
            this.goals.set([]);
            return;
        }

        if (this.goalsListener) this.goalsListener();

        const goalsQuery = query(
            collection(db, 'goals'),
            where('userId', '==', user.id)
        );

        this.goalsListener = onSnapshot(goalsQuery, snapshot => {
            const list: Goal[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Goal));
            this.goals.set(list);
            console.log('Goals updated from Firebase:', list);
        });
    }

    async addGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) {
        const user = this.userService.currentUser();
        if (!user) throw new Error('No logged-in user');

        await addDoc(collection(db, 'goals'), {
            ...goal,
            userId: user.id,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });

        console.log('Goal added!');
    }

    async updateGoal(id: string, changes: Partial<Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>) {
        await updateDoc(doc(db, 'goals', id), {
            ...changes,
            updatedAt: Timestamp.now()
        });
    }

    async deleteGoal(id: string) {
        await deleteDoc(doc(db, 'goals', id));
    }

    stopListening() {
        if (this.goalsListener) {
            this.goalsListener();
            this.goalsListener = null;
        }
    }
}