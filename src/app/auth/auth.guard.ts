import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root' // ADDED providedIn root here.
})
export class AuthGuard implements CanActivate {
  constructor(private router : Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  boolean {
      if (sessionStorage.getItem('userToken') != null){
        return true;

      }else{

        this.router.navigate(['/signIn']);
        return false;
      }
  }
}
