import { Component, OnInit } from '@angular/core';
import { IonSegment } from '@ionic/angular';
import { ProfileService } from '../services/profile.service';
import { CaloriePlan, UserInfo } from '../datatypes/userInfo.mode';
import { AuthService } from '../auth/auth.service';
import { first, Observable } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-weightplansetup',
  templateUrl: './weightplansetup.component.html',
  styleUrls: ['./weightplansetup.component.scss'],

})
export class WeightplansetupComponent  implements OnInit {
  selectedSegment: string = 'first'; // Default selected segment

  currentWeigth: number | null = null; // Input value for 'first' segment
  goalWeigth: number | null = null;

  activiteit: string = '';
  plan: string = ''; // Input value for 'third' segment

  button_active: boolean = false;
  userInfo: UserInfo | null = null;

  constructor(private authService: AuthService, private profileService: ProfileService, private router: Router) {}

  ngOnInit() {
    const userId = this.authService.getUid();
    if (userId) {
      this.profileService.getUserInfo(userId).subscribe((userData) => {
        if (userData) {
          this.userInfo = userData;
          console.log("here")
          console.log(this.userInfo)
        }
      });
    }
  }

  // Check if the input field for a specific segment has a value
  isInputValid(segment: string): boolean {
    if (segment === 'first') {
      return this.currentWeigth !== null && !isNaN(this.currentWeigth) && this.currentWeigth > 0
      && this.goalWeigth !== null && !isNaN(this.goalWeigth) && this.goalWeigth > 0;    
    } else if (segment === 'second') {
      return this.activiteit.trim().length > 0;
    } else if (segment === 'third') {
      return this.plan.trim() !== '';
    }
    return false;
  }

  updatePlan() {
    const userId = this.authService.getUid();
    if (!userId) {
      console.error("User ID not found!");
      return;
    }
  
    if (!this.isInputValid('first') || !this.isInputValid('second') || !this.isInputValid('third')) {
      console.error("Invalid input. Please fill in all required fields correctly.");
      return;
    }
  
    // Fetch user data once and then unsubscribe
    this.profileService.getUserInfo(userId).pipe(first()).subscribe((userData) => {
      if (!userData || !userData.profile) { 
        console.error("User profile not found!");
        return;
      }
  
      // Preserve existing fields while updating only the necessary ones
      const updatedData = {
        ...userData.profile, // Keep existing fields
        weight: this.currentWeigth,
        goalWeight: this.goalWeigth,
        activityLevel: this.activiteit,
        plan: this.plan
      };
  
      // Call ProfileService to update Firestore
      this.profileService.updateUserInfo(userId, updatedData)
        .then(() => {
          console.log("User profile and nutrition plan updated successfully.");
          this.router.navigate(['/home']);
        })
        .catch((error) => {
          console.error("Error updating profile:", error);
        });
    });
  }
}
