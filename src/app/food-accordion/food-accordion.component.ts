import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Foodservice } from '../services/foodservice.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DateService } from '../services/date.service';

@Component({
  selector: 'app-food-accordion',
  templateUrl: './food-accordion.component.html',
  styleUrls: ['./food-accordion.component.scss'],
})
export class FoodAccordionComponent  implements OnInit {
  @Input() title: string = '';
  
  AccordionHeaders = ["Eten vandaag geconsumeerd"]

  FoodSubscribtion!: Subscription;

  allListsEmpty: boolean = true;

  userId: string = '';

  // new
  databaseList: any[] = [];
  list: any[] = [];
  date: string = '';
  dateSubscription!: Subscription;

  constructor(private foodService: Foodservice, private authService: AuthService, private dateService: DateService) {
    this.checkIfAllListsEmpty();
  }

  addItemToFoodList(index: number, item: string) {
    
  }

  // Ensure this method only accepts one argument
  deleteItemFromList({ listIndex, itemIndex }: { listIndex: number; itemIndex: number }) {
  }

  checkIfAllListsEmpty() {
  }

  ngOnInit() {
    this.userId = this.authService.getUid() || '';
    // Initialize the date to today's date if it hasn't been set
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    this.date = todayString; // Set the default date to today

    // Subscribe to the date changes
    this.dateSubscription = this.dateService.selectedDate$.subscribe(date => {
      // If a new date is received, update the local date property
      if (date) {
        this.date = date;
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.dateSubscription) {
      this.dateSubscription.unsubscribe();
    }
  }

}
