import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../app/auth/auth.service'; // Import your AuthService
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { Auth} from "@angular/fire/auth";
import { catchError, from, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ProfileService } from './services/profile.service';
import { user } from 'rxfire/auth';
import { UserInfo } from './datatypes/userInfo.mode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  userInfo: any;
  userId: string = "";

  constructor(private authService: AuthService, private profileService: ProfileService, private router: Router) {}

  canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> {
    // Check if the user is logged in
    if (this.authService.isLoggedIn()) {
      const userId = this.authService.getUid();

      // Check if the user ID exists
      if (userId) {
        return this.profileService.getUserInfo(userId).pipe(
          map(userInfo => {
            // If the profile is complete, allow the route to be activated
            if (userInfo?.profile?.profileComplete) {
              console.log("To Home")
              return true;
            } else {
              // Otherwise, redirect to profile setup
              console.log("To Profile")
              this.router.navigate(['/profile-setup']);
              return false;
            }
          }),
          catchError(() => {
            // If there is an error while fetching user info, redirect to profile setup
            console.log("To Profile because error")
            this.router.navigate(['/profile-setup']);
            return of(false);
          })
        );
      }
    }

    // If the user is not logged in, redirect to login
    this.router.navigate(['/log-in']);
    return of(false);
  }


  /*canActivate(): Observable<boolean> {
    if (this.authService.isLoggedIn()) {
      const userId = this.authService.getUid();

      if (userId) {
        return this.profileService.getUserInfo(userId).pipe(
          map((userInfo: UserInfo) => {  // Use the UserInfo type
            if (userInfo) {
              console.log(userInfo["profile"].profileComplete)
              if (userInfo.profile.profileComplete) {
                return true; // Allow access to the home page
              } else {
                this.router.navigate(['profile-setup']);
                return false; // Redirect to profile setup if profile is not complete
              }
            } else {
              this.router.navigate(['profile-setup']);
              return false; // Redirect if userInfo is not found
            }
          })
        );
      } else {
        this.router.navigate(['log-in']);
        return of(false); // Redirect to login if no userId
      }
    } else {
      this.router.navigate(['log-in']);
      return of(false); // Deny access if not logged in
    }
  }*/

  canActivatee(): boolean {
    if (this.authService.isLoggedIn()) {
      console.log("im logged in")
      this.userId = this.authService.getUid() || '';
      console.log(this.userId)
      return true; // Allow access
    } else {
      this.router.navigate(['log-in']); // Redirect to login
      return false; // Deny access
    }
  }
}