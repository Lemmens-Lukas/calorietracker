import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ProfileService } from '../services/profile.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-foodplan-card',
  templateUrl: './foodplan-card.component.html',
  styleUrls: ['./foodplan-card.component.scss']
})
export class FoodplanCardComponent implements OnInit, OnDestroy {
  userId: string = '';
  userInfo: any;
  weightHistory: any;
  caloriePlan: any;

  private unsubscribe$ = new Subject<void>(); // Used to clean up subscriptions

  constructor(private authService: AuthService, private profileService: ProfileService, private router: Router) { }

  ngOnInit() {
    // Get the current user ID
    this.userId = this.authService.getUid() || '';

    if (this.userId) {
      // Trigger fetching of user info from Firestore
      this.profileService.getUserInfo(this.userId);
    }

    // Subscribe to the BehaviorSubjects
    this.profileService.userInfo$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(userInfo => {
        if (userInfo) {
          this.userInfo = userInfo;
          console.log('User Info:', this.userInfo);
        }
      });

    this.profileService.caloriePlan$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(caloriePlan => {
        if (caloriePlan) {
          this.caloriePlan = caloriePlan;
          console.log('Calorie Plan:', this.caloriePlan);
        }
      });

    this.profileService.weightHistory$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(weightHistory => {
        if (weightHistory) {
          this.weightHistory = weightHistory;
          console.log('Weight History:', this.weightHistory);
        }
      });
  }

  goToEditWeightplan(){
    this.router.navigate(['/edit-weight-plan']);
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
