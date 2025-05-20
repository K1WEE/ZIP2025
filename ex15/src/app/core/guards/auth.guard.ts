import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const accessToken = localStorage.getItem('access_token');

  const router = inject(Router);

  if(accessToken){
    return true;
  }else{
    router.navigate(['/login']).then();
    return false;
  }
};
