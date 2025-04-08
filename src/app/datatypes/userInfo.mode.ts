export interface Profile {
    profileComplete: boolean;
    username: string;
    age: number | null;
    height: number | null;
    weight: number | null;
    gender: string;
    createdAt: Date;
    email: string;
    activityLevel: string;
    goalWeight: number | null;
    bmi: number | null;
    plan: string;
  }

export interface CaloriePlan{
    carbs: number;
    fat: number;
    dailyCalories: number;
    protein: number;
    carbsPlan: number;
    fatPlan: number;
    proteinPlan: number;
}

export interface WeightHistory{
    date: string;
    weight: number;
}
  
export interface UserInfo {
    profile: Profile;
    caloriePlan: CaloriePlan;
    weightHistory: WeightHistory[];
  }