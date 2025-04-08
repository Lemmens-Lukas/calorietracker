import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth.guard';
import { AddFoodItemComponent } from './add-food-item/add-food-item.component';
import { FoodItemDetailComponent } from './food-item-detail/food-item-detail.component';
import { AddFoodItemFormComponent } from './add-food-item-form/add-food-item-form.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { FoodplandetailComponent } from './foodplandetail/foodplandetail.component';
import { WeightplansetupComponent } from './weightplansetup/weightplansetup.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    canActivate: [AuthGuard], // Apply the AuthGuard here
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'sign-up',
    component: SignupComponent
  },
  {
    path: 'log-in',
    component: LoginComponent
  },
  {
    path: 'add-item',
    component: AddFoodItemComponent
  },
  {
    path: 'add-food-item-in-form',
    component: AddFoodItemFormComponent
  },
  {
    path: 'food-detail/:id',
    component: FoodItemDetailComponent
  },
  {
    path: 'profile-setup',
    component: UserprofileComponent
  },
  {
    path: 'foodplan-detail',
    component: FoodplandetailComponent
  },
  {
    path: 'edit-weight-plan',
    component: WeightplansetupComponent
  },
  {
    path: '**',
    component: LoginComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
