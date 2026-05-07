import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase.config';

export const publicGuard: CanActivateFn = () => {
  const router = inject(Router);
  console.log('publicGuard triggered'); // add this

  return new Promise<boolean | any>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('auth state user:', user); // add this
      unsubscribe();
      if (user) {
        resolve(router.createUrlTree(['/dashboard']));
      } else {
        resolve(true);
      }
    }, (error) => {
      console.error('Public guard error:', error);
      unsubscribe();
      resolve(true);
    });
  });
};