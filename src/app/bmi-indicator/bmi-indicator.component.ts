import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { Observable } from 'rxjs';
import { UserInfo } from '../datatypes/userInfo.mode';

@Component({
  selector: 'app-bmi-indicator',
  templateUrl: './bmi-indicator.component.html',
  styleUrls: ['./bmi-indicator.component.scss'],
})
export class BmiIndicatorComponent  implements OnInit {
  userBmi = 0;
  userInfo$: Observable<UserInfo | null> = this.profileService.userInfo$;
  constructor(private profileService: ProfileService){

  }
  
  ngOnInit(): void {
    this.userInfo$.subscribe(userInfo => {
      if(userInfo){
        this.userBmi = userInfo.profile.bmi ?? 0;
      }
    });
    this.calculateArrowPosition();
  }
  // Input property to receive BMI value from the parent component
  // Input property to receive BMI value from the parent component
  @Input() bmi: number = 0;
  
  // Arrow position, to be updated based on BMI value
  arrowPosition: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    // When the BMI value changes, update the arrow position
    if (changes['bmi']) {
      this.calculateArrowPosition();
    }
  }

  calculateArrowPosition(): void {
    if (this.bmi < 18.5) {
      // Underweight (0 to 18.5)
      this.arrowPosition = (this.bmi / 18.5) * 18.5; // Limit to 18.5% range
    } else if (this.bmi >= 18.5 && this.bmi <= 24.9) {
      // Normal weight (18.5 to 24.9)
      this.arrowPosition = ((this.bmi - 18.5) / 6.4) * 40.6 + 18.5;
    } else if (this.bmi >= 25 && this.bmi <= 29.9) {
      // Overweight (25 to 29.9)
      this.arrowPosition = ((this.bmi - 25) / 5) * 20 + 59.1;
    } else if (this.bmi >= 30) {
      // Obese (30 and above)
      this.arrowPosition = ((this.bmi - 30) / 10) * 20 + 79.5;
    }
  
    // Ensure that the arrow stays within 0% to 100% range
    this.arrowPosition = Math.min(100, Math.max(0, this.arrowPosition));
  }
}
