import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-circular-progress-bar',
  templateUrl: './circular-progress-bar.component.html',
  styleUrls: ['./circular-progress-bar.component.scss'],
})
export class CircularProgressBarComponent {
  @Input() percentage: number = 0; // Input property for the percentage
  @Input() nutritionValue: number = 0;
  @Input() nutrition: string = "";
  @Input() unit: string = "";
  @Input() strokeColor: string = '#09c567'; // Input property for the stroke color
  @Input() textColor: string = '';

  @Input() showAdditionalInfo: boolean = true
  
  animatedPercentage: number = 0; // The percentage value that will animate
  currentText: number = 0; // The animated text value

  ngOnChanges(changes: SimpleChanges): void {
    console.log('change');
    if (changes['percentage']) {
      this.animatePercentage(this.percentage);
    }
  }

  // Animation logic for the text (not the progress bar)
  animatePercentage(target: number): void {
    let start = this.animatedPercentage;
    const end = target; // Target value (can exceed 100)
    const duration = 200; // Duration of the animation in ms (2 seconds)
    const stepTime = 10; // Time per step in ms (10ms between each update)
  
    const step = () => {
      start += (end - start) / (duration / stepTime); // Smoothly transition from current to target value
      if (Math.abs(start - end) > 0.1) { // Stop when the value is close enough to the target
        this.animatedPercentage = Math.round(start);
        setTimeout(step, stepTime); // Continue the animation
      } else {
        this.animatedPercentage = end; // Ensure the final value is set
      }
    };
  
    step();
  }

  // Ensure percentage is capped at 100
  get cappedPercentage(): number {
    return this.percentage > 100 ? 100 : this.percentage;
  }

  // Calculate the stroke-dashoffset based on the percentage (progress bar caps at 100%)
  calculateOffset(percentage: number): number {
    const radius = 45; // The radius of the circle
    const circumference = 2 * Math.PI * radius; // Circumference of the circle
    const offset = circumference - (Math.min(percentage, 100) / 100) * circumference; // Calculate the offset
    return offset;
  }
}
