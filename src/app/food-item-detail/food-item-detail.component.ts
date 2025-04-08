import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Foodservice } from '../services/foodservice.service';
import { Food } from '../datatypes/Food.model';
import { DateService } from '../services/date.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-food-item-detail',
  templateUrl: './food-item-detail.component.html',
  styleUrls: ['./food-item-detail.component.scss'],
})
export class FoodItemDetailComponent  implements OnInit {
  item: Food | null = null;
  date: string = '';
  itemId: string = '';
  foodForm!: FormGroup;

  caloriesPerItem: number = 0;
  fatsPerItem: number = 0;
  proteinPerItem: number = 0;
  carbsPerItem: number = 0;
  
  constructor(private activatedRoute: ActivatedRoute,
    private foodService: Foodservice, private dateService: DateService, private router: Router, private fb: FormBuilder) {
    
   }

  ngOnInit() {
    this.foodForm = this.fb.group({
      calories: [0, Validators.required],
      quantity: [Validators.required],
      fats: [0, Validators.required],
      protein: [0, Validators.required],
      carbs: [0, Validators.required]
    });
    // Retrieve the 'id' parameter from the URL
    this.activatedRoute.params.subscribe(params => {
      const itemId = params['id'];
      this.itemId = itemId;
      console.log('Item ID:', itemId);  // Just to check if the id is correct
      this.loadFoodItem(itemId); // Use the ID to load the item
    });

    this.dateService.selectedDate$.subscribe(date => {
      // If a new date is received, update the local date property
      if (date) {
        this.date = date;
        console.log(this.date)
      }
    });
  }

  loadFoodItem(id: string): void {
    this.foodService.getFoodItemById(id).subscribe(item => {
      this.item = item; 
      console.log(this.item) // Set the item data to display in the form
      this.foodForm.patchValue({
        calories: item.calories || 0,
        quantity: item.quantity || null,
        fats: item.vetten || 0,
        protein: item.eiwitten || 0,
        carbs: item.koolhydraten || 0,
        img: item.img
      });
    });
  }

  calculateTotals(): void {
    const { calories, fats, protein, carbs, quantity } = this.foodForm.value;
    console.log(quantity)

    this.caloriesPerItem = (calories / 100) * quantity;
    this.fatsPerItem = (fats / 100) * quantity;
    this.proteinPerItem = (protein / 100) * quantity;
    this.carbsPerItem = (carbs / 100) * quantity;

    console.log('Total kcal:', this.caloriesPerItem);
    console.log('Total fats:', this.fatsPerItem);
    console.log('Total protein:', this.proteinPerItem);
    console.log('Total carbs:', this.carbsPerItem);
  }

  async addItemToTodayFoodList(item: any) {
    this.calculateTotals()
    const foodItem = [{
      id: this.itemId,
      calories: this.caloriesPerItem,
      protein: this.proteinPerItem,
      carbs: this.carbsPerItem,
      name: item.name,
      fats: this.fatsPerItem,
      img: item.img,
    }]

    console.log(foodItem)

    await this.foodService.addFoodList(this.date, foodItem); // Call the service to add the food list
    this.router.navigate(['/home']);
  }

  onSubmit(): void {
    if (this.foodForm.valid) {
      const updatedData = this.foodForm.value;
      this.calculateTotals();
      console.log('Updated Food Item:', updatedData);
      // Optionally: Call foodService to save changes
    }
  }

}
