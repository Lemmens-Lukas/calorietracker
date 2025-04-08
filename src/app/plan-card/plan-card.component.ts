import { Component, Input, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { Observable, Subscription } from 'rxjs';
import { UserInfo } from '../datatypes/userInfo.mode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plan-card',
  templateUrl: './plan-card.component.html',
  styleUrls: ['./plan-card.component.scss'],
})
export class PlanCardComponent  implements OnInit {
  currentWeight = 55;
  userGoalWeight = 58;

  weightDifference = 0;

  weighDifferencePositive: boolean = false;

  userInfo$: Observable<UserInfo | null> = this.profileService.userInfo$;
  private userInfoSubscription!: Subscription;

  @Input() buttonActive = true
  
  constructor(private profileService: ProfileService, private router: Router) { }

  ngOnInit() {
    this.userInfoSubscription = this.userInfo$.subscribe(userInfo => {
      if (userInfo) {
        if (
          userInfo.profile.weight !== this.currentWeight ||
          userInfo.profile.goalWeight !== this.userGoalWeight
        ) {
          console.log('User info changed:', userInfo);
        }

        this.currentWeight = userInfo.profile.weight ?? 0;
        this.userGoalWeight = userInfo.profile.goalWeight ?? 0;
        this.calculateWeightDifference();
      }
    });
  }

  calculateWeightDifference() {
    this.weightDifference = this.userGoalWeight - this.currentWeight;
    this.weighDifferencePositive = this.weightDifference > 0;
  }

  goToDetail(){
    this.router.navigate(['/foodplan-detail']);  
  }

  ngOnDestroy() {
    if (this.userInfoSubscription) {
      this.userInfoSubscription.unsubscribe();
    }
  }

}
