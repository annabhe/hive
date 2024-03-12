import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { TokenStorageService } from './_services/token-storage.service';


// export const AuthGuard: CanActivateFn = (
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  
//     const router: Router = inject(Router);
//     const tokenStorage: TokenStorageService = inject(TokenStorageService);

//     if (!tokenStorage.getToken()) {
//         return router.navigate(['login'])
//     }
//     // return router.navigate(['forbidden']);
//     return true
//   }

import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if(!this.tokenStorage.getToken()) {
        this.router.navigate(['login'])
      }
      return true;
  }
}