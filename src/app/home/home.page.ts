import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Foodservice } from '../services/foodservice.service';
import { AuthService } from '../auth/auth.service';
import { DateService } from '../services/date.service';
import { CaloriePlan, UserInfo } from '../datatypes/userInfo.mode';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  error: string | null = null;
  user$: Observable<any>;
  userId: string = '';

  currentProgressCarbs: number = 0;
  currentProgressProtein: number = 0;
  currentProgressFat: number = 0;

  totalCalories: number = 0;
  totalFats: number = 0;
  totalProtein: number = 0;
  totalCarbs: number = 0;

  caloriesUnit: string = "kcal";
  fatsUnit: string = "g";
  proteinUnit: string = "g";
  carbsUnit: string = "g";

  totalCaloriesDailyFromCaloriePlan: number = 1800;
  dailyCaloriesRemaining: number = 0;
  totalProteinDailyFromCaloriePlan: number = 135;
  totalFatsDailyFromCaloriePlan: number = 60;
  totalCarbsDailyFromCaloriePlan: number = 200;

  carbsColor: string = '#09c567';
  proteinsColor: string = '#007bff';
  fatsColor: string = '#ff5733';

  AccordionHeaders = ["Breakfast", "Lunch", "Dinner", "Snacks"];
  nutritrions = ["Koolhydraten", "Eiwitten", "Vetten"]

  @ViewChild('myModal', { static: false }) modal!: IonModal;
  @ViewChild('mySettingsModal', { static: false }) settingsModal!: IonModal;

  public confirmedDate: string = "";
  public confirmedDateString: string = "";
  dateOnly: string = "";
  dateSelected: string = "";
  progress: number = 0;
  private tempDate: string = "";

  foodItems: any[] = []; // Auto-updating food items
  foodSubscription!: Subscription;
  dateSubscription!: Subscription;
  date: string = '';

  username: string = "";
  caloriePlan$: Observable<CaloriePlan | null> = this.profileService.caloriePlan$;
  userInfo$: Observable<UserInfo | null> = this.profileService.userInfo$;

  userBmi = 0;
  userGoalWeight = 0;

  constructor(
    private dateService: DateService,
    private router: Router,
    private foodService: Foodservice,
    private authService: AuthService,
    private profileService: ProfileService
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    // Subscribe to selected date
    this.dateSubscription = this.dateService.selectedDate$.subscribe(date => {
      if (date) {
        this.date = date;
      } else {
        this.date = new Date().toISOString().split('T')[0];
        this.dateService.setSelectedDate(this.date);
      }
    });

    // Get current user ID
    this.userId = this.authService.getUid() || '';

    // Subscribe to foodItems BehaviorSubject
    this.foodSubscription = this.foodService.foodItems$.subscribe(items => {
      this.foodItems = items;
      this.calculateTotalNutritionFoodList();
    });

    // Load initial food items into BehaviorSubject
    this.user$.subscribe(user => {
      if (user) {
        this.foodService.loadFoodItemsForDate(this.date, this.userId);
      } else {
        this.foodItems = [];
      }
    });

    this.userInfo$.subscribe(userInfo => {
      if(userInfo){
        console.log(userInfo)
        this.username = userInfo.profile.username
        this.userBmi = userInfo.profile.bmi ?? 0; // Ensure BMI is available
        console.log(this.userBmi)
        this.userGoalWeight = userInfo.profile.goalWeight ?? 0;
      }
    });

    this.caloriePlan$.subscribe(caloriePlan => {
      if (caloriePlan) {
        console.log(caloriePlan)
        this.totalCaloriesDailyFromCaloriePlan = caloriePlan.dailyCalories;
        this.totalProteinDailyFromCaloriePlan = caloriePlan.protein;
        this.totalFatsDailyFromCaloriePlan = caloriePlan.fat;
        this.totalCarbsDailyFromCaloriePlan = caloriePlan.carbs;

        // Recalculate daily calories remaining and progress
        this.calculatePercentage(
          this.totalCaloriesDailyFromCaloriePlan,
          this.totalCalories,
          this.totalCarbs,
          this.totalFats,
          this.totalProtein
        );
      }
    });

    
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.foodSubscription.unsubscribe();
    this.dateSubscription.unsubscribe();
  }

  // Confirm selected date and load corresponding food items
  confirmDate() {
    if (this.tempDate) {
      this.confirmedDateString = this.tempDate;
      this.confirmedDate = this.formatDateToText(this.tempDate);
      const dateOnly = this.tempDate.split('T')[0];
      this.dateService.setSelectedDate(dateOnly);
      this.modal.dismiss();

      // Load food items for new date
      this.foodService.loadFoodItemsForDate(dateOnly, this.userId);
    }
  }

  onDateChange(event: any) {
    this.tempDate = event.detail.value;
  }

  formatDateToText(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const monthNames = [
      "January", "February", "Maart", "April", "Mei", "Juni",
      "Juli", "Augustus", "September", "Oktober", "November", "December"
    ];
    const month = monthNames[monthIndex];
    return `${day} ${month}`;
  }

  goToLogIn() {
    this.authService.logout();
    this.router.navigate(['/log-in']);
    this.settingsModal.dismiss();
  }

  goToProfile(){
    this.router.navigate(['/profile-setup']);
    this.settingsModal.dismiss();
  }

  goToAddFoodItem() {
    this.router.navigate(['/add-item']);
  }

  calculateTotalNutritionFoodList(){
    this.totalCalories = 0;
    this.totalCarbs = 0;
    this.totalFats = 0;
    this.totalProtein = 0;

    for(let item of this.foodItems){
      this.totalCalories += item.calories;
      this.totalCarbs += item.carbs;
      this.totalFats += item.fats;
      this.totalProtein += item.protein;
    }

    this.calculatePercentage(this.totalCaloriesDailyFromCaloriePlan, this.totalCalories, this.totalCarbs, this.totalFats, this.totalProtein)
  }

  calculatePercentage(totalCalories: number, eatenCalories: number, totalCarbs: number, totalFats: number, totalProtein: number) {
    this.currentProgressCarbs = (totalCarbs / this.totalCarbsDailyFromCaloriePlan) * 100;
    this.currentProgressFat = (totalFats / this.totalFatsDailyFromCaloriePlan) * 100;
    this.progress = eatenCalories / totalCalories;
    this.currentProgressProtein = (totalProtein / this.totalProteinDailyFromCaloriePlan) * 100;
    this.dailyCaloriesRemaining = totalCalories - eatenCalories;
    if(totalCalories - eatenCalories < 0){
      this.dailyCaloriesRemaining = 0;
    }
    console.log("progress: " + this.progress);
    this.animateProgress(this.progress); // Example: animate to 100%
  }

  animateProgress(target: number): void {
    const duration = 2000; // 2 seconds
    const stepTime = 20;   // Time per step in ms (20ms between each update)
    const totalSteps = duration / stepTime;
    const stepIncrement = target / totalSteps;

    //set to 0 for animation to start
    this.progress = 0;

    const interval = setInterval(() => {
      this.progress += stepIncrement;

      if (this.progress >= target) {
        this.progress = target;
        clearInterval(interval);
      }
    }, stepTime);
  }  
}
