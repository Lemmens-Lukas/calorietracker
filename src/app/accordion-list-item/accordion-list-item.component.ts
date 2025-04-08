import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DateService } from '../services/date.service';
import { Foodservice } from '../services/foodservice.service';
import { Food } from '../datatypes/Food.model';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { user } from 'rxfire/auth';

@Component({
  selector: 'app-accordion-list-item',
  templateUrl: './accordion-list-item.component.html',
  styleUrls: ['./accordion-list-item.component.scss'],
})
export class AccordionListItemComponent implements OnInit, OnDestroy {
  @Input() header: string = '';
  @Output() addItem: EventEmitter<string> = new EventEmitter();
  @Output() deleteItemEvent: EventEmitter<{ listIndex: number; itemIndex: number }> = new EventEmitter();

  list: Food[] = [];
  date: string = '';
  userId: string = '';

  private subscriptions: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private dateService: DateService,
    private foodService: Foodservice,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUid() || '';

    // Set default date to today
    const todayString = new Date().toISOString().split('T')[0];
    this.date = todayString;

    // Subscribe to date changes
    const dateSub = this.dateService.selectedDate$.subscribe(date => {
      if (date) {
        this.date = date;
      }
      this.loadFoodItems(); // Fetch food items whenever date changes
    });
    this.subscriptions.add(dateSub);

    // Subscribe to foodItems$ observable for updates
    const foodSub = this.foodService.foodItems$.subscribe(items => {
      this.list = items || [];
    });
    this.subscriptions.add(foodSub);

    // Initial load
    this.loadFoodItems();
  }

  // Load food items for selected date
  loadFoodItems(): void {
    this.foodService.loadFoodItemsForDate(this.date, this.userId);
  }

  addNewItem(): void {
    const newItem = prompt('Enter a new item:');
    if (newItem) {
      this.addItem.emit(newItem);
    }
  }

  /*onDelete(itemId: string | undefined): void {
    this.foodService.deleteFoodItemById(this.date, itemId, this.userId).then(() => {
      console.log('Item deleted successfully');
      this.loadFoodItems(); // Refresh the list
    }).catch(error => {
      console.error('Error deleting item:', error);
    });
  }*/

    onDelete(itemId: string | undefined): void {
      if (!itemId) {
        console.error('Item ID is undefined');
        return;
      }
    
      // Show confirmation alert before deletion
      this.alertController.create({
        header: 'Delete Item',
        message: 'Are you sure you want to delete this item?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel', // Dismiss the alert and do nothing
            handler: () => {
              console.log('Deletion canceled');
            }
          },
          {
            text: 'Delete',
            role: 'destructive', // Highlighted as a destructive action
            handler: () => {
              // Proceed with deletion
              this.foodService.deleteFoodItemById(this.date, itemId, this.userId)
                .then(() => {
                  console.log('Item deleted successfully');
                  this.loadFoodItems(); // Refresh the list
                })
                .catch(error => {
                  console.error('Error deleting item:', error);
                });
            }
          }
        ]
      }).then(alert => {
        alert.present(); // Show the alert to the user
      });
    }

  goToDetail(itemId: string | undefined): void {
    this.router.navigate(['/food-detail', itemId]);
    // Navigate to the detail page for this item (to be implemented)
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Prevent memory leaks
  }

  goToaddNewItemToDatabase(){
    this.router.navigate(['/add-item']);
  }
}
