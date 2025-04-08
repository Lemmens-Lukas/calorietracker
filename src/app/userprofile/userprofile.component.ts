import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ProfileService } from '../services/profile.service';
import { UserInfo } from '../datatypes/userInfo.mode';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss'],
})
export class UserprofileComponent implements OnInit {
  userInfo: UserInfo | null = null; // Property to store the user's profile data
  isEditable: boolean = false;
  userProfileForm!: FormGroup;

  constructor(private authService: AuthService, private profileService: ProfileService,private router: Router, private fb: FormBuilder,) {
  }

  ngOnInit() {
    // Initialize the form
    this.userProfileForm = this.fb.group({
      username: [{ value: '', disabled: true }, Validators.required],
      age: [{ value: '', disabled: true }, Validators.required],
      height: [{ value: '', disabled: true }, Validators.required],
      weight: [{ value: '', disabled: true }, Validators.required],
      gender: [{ value: '', disabled: true }, Validators.required],
      activityLevel: [{ value: '', disabled: true }, Validators.required],
      goalWeight: [{ value: '', disabled: true }, Validators.required],
      plan: [{ value: '', disabled: true }, Validators.required],
    });

    // Fetch user profile data
    const userId = this.authService.getUid();
    if (userId) {
      this.profileService.getUserInfo(userId).subscribe((userData) => {
        if (userData) {
          this.userInfo = userData;
          console.log(this.userInfo)
          this.userProfileForm.patchValue(userData.profile);

          // Enable editing if profile is incomplete
          if (!userData.profile.profileComplete) {
            this.isEditable = true;
            this.userProfileForm.enable();
          }
        }
      });
    }
  }

  // 🔄 Toggle edit mode
  onToggleChange(event: any) {
    this.isEditable = event.detail.checked;
    this.isEditable ? this.userProfileForm.enable() : this.userProfileForm.disable();
  }

  // 🔄 Submit changes
  onSubmit() {
    if (this.userProfileForm.valid) {
      const updatedData = this.userProfileForm.value;
      const userId = this.authService.getUid();

      if (userId) {
        this.profileService.updateUserInfo(userId, updatedData)
          .then(() => {
            console.log('Profile and nutrition updated successfully:', updatedData);
            this.router.navigate(['/home']);
          })
          .catch((error) => console.error('Error updating profile:', error));
      }
    } else {
      console.log('Form is invalid');
    }
  }
}

