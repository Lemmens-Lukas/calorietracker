import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CaloriePlan, UserInfo } from '../datatypes/userInfo.mode';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-foodplandetail',
  templateUrl: './foodplandetail.component.html',
  styleUrls: ['./foodplandetail.component.scss'],
})
export class FoodplandetailComponent  implements OnInit {
  carbsColor: string = '#09c567';
  proteinsColor: string = '#007bff';
  fatsColor: string = '#ff5733';

  currentProgressCarbs: number = 60;
  currentProgressProtein: number = 20;
  currentProgressFat: number = 20;

  totalCarbs: number = 0;
  nutritrions = ["Koolhydraten", "Eiwitten", "Vetten"]
  carbsUnit: string = "g";

  totalCaloriesDailyFromCaloriePlan: number = 0;
  caloriePlan$: Observable<CaloriePlan | null> = this.profileService.caloriePlan$;

  userInfo$: Observable<UserInfo | null> = this.profileService.userInfo$;
  profileCaloriePlan:string = "";

  constructor(private router: Router, private profileService: ProfileService) { }

  ngOnInit() {
    this.userInfo$.subscribe(userInfo => {
      if(userInfo){
        this.profileCaloriePlan = userInfo.profile.plan ;
      }
    });
    this.caloriePlan$.subscribe(caloriePlan => {
      if (caloriePlan) {
        console.log(caloriePlan)
        this.totalCaloriesDailyFromCaloriePlan = caloriePlan.dailyCalories;
        this.currentProgressCarbs = caloriePlan.carbsPlan * 100;
        this.currentProgressProtein = caloriePlan.proteinPlan * 100;
        this.currentProgressFat = caloriePlan.fatPlan * 100;
      }
    });
  }

  goToEditWeightplan(){
    this.router.navigate(['/edit-weight-plan']);
  }

}
