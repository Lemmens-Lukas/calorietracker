import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  // Create a BehaviorSubject to hold the selected date
  private selectedDateSource = new BehaviorSubject<string>(''); // Default to empty string
  selectedDate$ = this.selectedDateSource.asObservable(); // Observable to subscribe to

  // Method to update the selected date
  setSelectedDate(date: string) {
    this.selectedDateSource.next(date);
  }
}
