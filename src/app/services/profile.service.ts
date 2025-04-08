import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, catchError, from, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private userInfoSubject = new BehaviorSubject<any>(null);
  userInfo$ = this.userInfoSubject.asObservable();

  private caloriePlanSubject = new BehaviorSubject<any>(null);
  caloriePlan$ = this.caloriePlanSubject.asObservable();

  private weightHistorySubject = new BehaviorSubject<any>(null);
  weightHistory$ = this.weightHistorySubject.asObservable();

  proteinRatio: number = 0;
  carbRatio: number = 0;
  fatRatio: number = 0;

  constructor(private firestore: Firestore) {}

  // 🏋️‍♂️ Calculate Nutrition Plan
calculateNutrition(profile: any) {
  const { age, height, weight, gender, activityLevel, goalWeight, plan } = profile;
  console.log(age, height, weight, gender, activityLevel, goalWeight, plan);

  // 1️⃣ Calculate Basal Metabolic Rate (BMR)
  let BMR: number;
  const targetWeight = goalWeight ?? weight; // Use goalWeight if provided, otherwise current weight

  if (gender === 'male') {
    BMR = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    BMR = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // 2️⃣ Calculate Total Daily Energy Expenditure (TDEE)
  const activityMultipliers: { [key: string]: number } = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    super_active: 1.9,
  };

  const TDEE = BMR * (activityMultipliers[activityLevel] || 1.2);

  // 3️⃣ Automatically Determine Caloric Adjustment Based on Weight Goal
  let dailyCalories = TDEE;
  const weightDifference = goalWeight - weight; // Positive = Gain, Negative = Lose, Zero = Maintain

  if (weightDifference > 0) {
    dailyCalories += 500; // Surplus for weight gain
    console.log("User wants to GAIN weight");
  } else if (weightDifference < 0) {
    dailyCalories -= 500; // Deficit for weight loss
    console.log("User wants to LOSE weight");
  } else {
    console.log("User wants to MAINTAIN weight");
  }

  // 4️⃣ Define Macronutrient Ratios Based on Plan Type
  //let proteinRatio = 0.1; // Default: 10% protein
  //let carbRatio = 0.6;    // Default: 60% carbs
  //let fatRatio = 0.3;     // Default: 30% fats
  
  this.proteinRatio = 0.1;
  this.carbRatio = 0.6;
  this.fatRatio = 0.3

  switch (plan) {
    case 'muscle_preservation':
      this.proteinRatio = 0.25;
      this.carbRatio = 0.5;
      this.fatRatio = 0.25;
      break;
    case 'endurance':
      this.proteinRatio = 0.2;
      this.carbRatio = 0.6;
      this.fatRatio = 0.2;
      break;
    case 'athletic':
      this.proteinRatio = 0.2;
      this.carbRatio = 0.55;
      this.fatRatio = 0.25;
      break;
    case 'balanced':
      this.proteinRatio = 0.1;
      this.carbRatio = 0.6;
      this.fatRatio = 0.3;
      break;
    default:
      console.warn('Unknown plan type, using default macros.');
  }

  // 5️⃣ Calculate Macronutrients
  const proteinPerKg = 2.0; // 2g protein per kg of goal weight
  const dailyProtein = goalWeight ? targetWeight * proteinPerKg : (dailyCalories * this.proteinRatio) / 4;

  const dailyCarbs = (dailyCalories * this.carbRatio) / 4;
  const dailyFats = (dailyCalories * this.fatRatio) / 9;

  console.log(dailyCalories, dailyProtein, dailyCarbs, dailyFats);

  return {
    dailyCalories: Math.round(dailyCalories),
    protein: Math.round(dailyProtein),
    carbs: Math.round(dailyCarbs),
    fat: Math.round(dailyFats),
    carbsPlan: this.carbRatio,
    proteinPlan: this.proteinRatio,
    fatPlan: this.fatRatio  
  };
}

  calculateBMI(weight: number | null, height: number | null): number | null {
    if (!weight || !height) return null;  // Ensure values exist
    const heightInMeters = height / 100;  // Convert cm to meters
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2)); // Round to 2 decimals
  }


  // Fetch user data and store it in BehaviorSubjects
  getUserInfo(userId: string): Observable<any> {
    const userDocRef = doc(this.firestore, `users/${userId}`);

    return from(getDoc(userDocRef)).pipe(
      map(docSnapshot => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          console.log(data)

          // Compute BMI dynamically
          const bmi = this.calculateBMI(data?.['profile']?.weight, data?.['profile']?.height);
          // Add BMI to the returned data
          const updatedData = { ...data, profile: { ...data['profile'], bmi } };

          this.userInfoSubject.next(data);
          this.caloriePlanSubject.next(data['caloriePlan']);
          this.weightHistorySubject.next(data['weightHistory']);

          return updatedData; // Return data to allow further processing in subscribing components
        } else {
          console.error('Document does not exist!');
          return null; // Return null if document does not exist
        }
      }),
      catchError(error => {
        console.error('Error fetching user data:', error);
        return []; // Return empty array or handle error as needed
      })
    );
  }

  // Method to update the userinfo and calorie plan
  updateUserInfo(uid: string, updatedData: any): Promise<void> {
    const userDocRef = doc(this.firestore, 'users', uid);

    if (updatedData.weight && updatedData.height) {
      const heightInMeters = updatedData.height / 100;
      updatedData.bmi = parseFloat((updatedData.weight / (heightInMeters ** 2)).toFixed(1));
    }

    // Calculate the new calorie plan based on the updated profile data
    const caloriePlan = this.calculateNutrition(updatedData);
    console.log(caloriePlan)

    // Update Firestore with the new profile and calorie plan
    return updateDoc(userDocRef, {
      profile: { ...updatedData }, // Merge new data
      caloriePlan: caloriePlan, // Save the calculated calorie plan
      'profile.profileComplete': true, // Ensure profile is marked as completed
    });
  }
}

