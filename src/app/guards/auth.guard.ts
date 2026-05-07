import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase.config';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  return new Promise<boolean | any>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve(true);
      } else {
        resolve(router.createUrlTree(['/login']));
      }
    }, (error) => {
      console.error('Auth guard error:', error);
      unsubscribe();
      resolve(router.createUrlTree(['/login']));
    });
  });
};