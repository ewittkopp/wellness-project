import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase.config';

export const publicGuard: CanActivateFn = () => {
  const router = inject(Router);

  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.navigate(['/dashboard']);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};