import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { CircularProgressBarComponent } from '../circular-progress-bar/circular-progress-bar.component'; // Adjust the path as needed
import { HomePageRoutingModule } from './home-routing.module';
import { FoodAccordionComponent } from '../food-accordion/food-accordion.component';
import { AccordionListItemComponent } from '../accordion-list-item/accordion-list-item.component';
import { FoodplanCardComponent } from '../foodplan-card/foodplan-card.component';
import { PlanCardComponent } from '../plan-card/plan-card.component';
import { AddFoodItemComponent } from '../add-food-item/add-food-item.component';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { FilterPipe } from '../filter.pipe';
import { FoodItemDetailComponent } from '../food-item-detail/food-item-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddFoodItemFormComponent } from '../add-food-item-form/add-food-item-form.component';
import { UserprofileComponent } from '../userprofile/userprofile.component';
import { BmiIndicatorComponent } from '../bmi-indicator/bmi-indicator.component';
import { FoodplandetailComponent } from '../foodplandetail/foodplandetail.component';
import { WeightplansetupComponent } from '../weightplansetup/weightplansetup.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    FilterPipe,
    ReactiveFormsModule,
  ],
  declarations: [HomePage, CircularProgressBarComponent, FoodAccordionComponent, 
    AccordionListItemComponent, FoodplanCardComponent, PlanCardComponent, AddFoodItemComponent,
  SearchbarComponent, FoodItemDetailComponent, AddFoodItemFormComponent, UserprofileComponent, 
  BmiIndicatorComponent, FoodplandetailComponent, WeightplansetupComponent],
})
export class HomePageModule {}
