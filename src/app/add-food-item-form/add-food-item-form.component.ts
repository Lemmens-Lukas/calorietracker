import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Food } from '../datatypes/Food.model';
import { Foodservice } from '../services/foodservice.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-food-item-form',
  templateUrl: './add-food-item-form.component.html',
  styleUrls: ['./add-food-item-form.component.scss'],
})
export class AddFoodItemFormComponent  implements OnInit {
  item: Food | null = null;
  date: string = '';
  addNewFoodForm!: FormGroup;
  file: any;
  food: Food = new Food();
  idFromRoute: string | null = null;
  selectedImageUrl: string | ArrayBuffer | null = null;
  categories: string[] = ['fruit', 'vegetable', 'dairy', 'meat', 'pasta', 'fish', 'chips', 'nuts', "soda's", 'grain', 'freezer'];

  constructor(private foodService: Foodservice, private router: Router, private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {
    this.addNewFoodForm = this.fb.group({
      calories: [0, Validators.required],
      vetten: [0, Validators.required],
      eiwitten: [0, Validators.required],
      koolhydraten: [0, Validators.required],
      categorie: ['', Validators.required],
      name: ['', Validators.required],
      img:[null, ],
    });

    this.route.paramMap.subscribe((params) => {
      this.idFromRoute = params.get('id')? params.get('id') : null;
      console.log(this.idFromRoute);
    })
  }

  // adding food item to database
  async onSubmit(): Promise<void> {
    const newFoodItem = { ...this.addNewFoodForm.value } as Food;
    console.log(newFoodItem)
  
    if (this.idFromRoute) {
      console.log(this.idFromRoute);
      const newId = this.foodService.createFoodID();
      if (this.file) {
        const path = 'foodlist/' + newId + '/' + this.file.name;
        newFoodItem.img = await this.foodService.uploadImg(path, this.file);
        console.log('img: ' + newFoodItem.img);
      }
      else{
        newFoodItem.img = this.food.img;
      }
      console.log(this.idFromRoute);
      this.foodService.updateFoodItem(newFoodItem, this.idFromRoute)
      await this.router.navigate(["/home"]);
    } else {
      // Creating a new food item
    if (this.file) {
      const newId = this.foodService.createFoodID();
      const path = 'food/' + newId + '/' + this.file.name; // Path where the image will be stored
      newFoodItem.img = await this.foodService.uploadImg(path, this.file); // Upload the image before adding the item
      console.log('New food image uploaded:', newFoodItem.img);
    } else {
      newFoodItem.img = ''; // Set to empty string if no image is selected
    }

      this.foodService.addFoodItemToDatabase(newFoodItem)
        .subscribe(
          ((food) => {
            console.log(food)
            this.router.navigate(['/home']);
          })
        )  
    }
  }

  selectImg(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      this.file = target.files[0];
  
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImageUrl = reader.result; // Store preview URL
      };
      reader.readAsDataURL(this.file); // Convert file to data URL
    }
  }

}
