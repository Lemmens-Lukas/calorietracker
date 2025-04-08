import { Component, OnInit } from '@angular/core';
import { Foodservice } from '../services/foodservice.service';
import { Food } from '../datatypes/Food.model';
import { Subscription } from 'rxjs';
import { DateService } from '../services/date.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-food-item',
  templateUrl: './add-food-item.component.html',
  styleUrls: ['./add-food-item.component.scss'],
})
export class AddFoodItemComponent  implements OnInit {

  foodList: Food[] = [];
  FoodSubscribtion!: Subscription;
  filterStatus = "";
  date: string = '';
  selectedCategory: string = ''; // Selected category filter
  uniqueCategories: string[] = []; // List of unique categories
  
  constructor(private foodService: Foodservice, private dateService: DateService, private router: Router) { }

  ngOnInit() {
    this.FoodSubscribtion = this.foodService.getFoodItemsFromPublicDatabase()
    .subscribe(foodlist => {
      this.foodList = foodlist;
      console.log(foodlist)
      this.extractUniqueCategories();
      console.log(this.uniqueCategories)
    })
    this.dateService.selectedDate$.subscribe(date => {
      // If a new date is received, update the local date property
      if (date) {
        this.date = date;
        console.log(this.date)
      }
    });
  }

  extractUniqueCategories() {
    this.uniqueCategories = [...new Set(this.foodList.map(item => item.categorie))];
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.detail.value;
  }

  goToDetail(itemId: string | undefined){
    console.log(itemId)
  }

  goToFoodDetail(item: any){
    console.log(item)
    this.router.navigate(['/food-detail', item.id]);
  }

  // route for adding new item to database (form)
  addNewItem(): void {
    this.router.navigate(['/add-food-item-in-form']);
  }

  async addItemToTodayFoodList(item: any) {
    const foodItem = [{
      id: item.id,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      name: item.name,
      fats: item.fats,
      img: item.img,
    }]

    console.log("hhheeerrree")
    console.log(foodItem)

    await this.foodService.addFoodList(this.date, foodItem); // Call the service to add the food list
    this.router.navigate(['/home']);
  }

  search(searchValue: string){
    this.filterStatus = searchValue;
  }

}
