import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, addDoc, setDoc, updateDoc, collection, getDocs, query, where, CollectionReference } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Food } from '../datatypes/Food.model';
import {getDownloadURL, ref, Storage, uploadBytesResumable} from "@angular/fire/storage";

@Injectable({
  providedIn: 'root'
})
export class Foodservice {
  private foodItemsSubject = new BehaviorSubject<any[]>([]);
  public foodItems$ = this.foodItemsSubject.asObservable();

  constructor(private firestore: Firestore, private authService: AuthService, private storage: Storage) {}

  /** Load food items for given date and userId and push to BehaviorSubject */
  loadFoodItemsForDate(date: string, userId: string): void {
    const foodListsRef = collection(this.firestore, `users/${userId}/foodLists`);
    const q = query(foodListsRef, where('date', '==', date));
  
    from(getDocs(q)).pipe(
      map(querySnapshot => {
        const docsData = querySnapshot.docs.map(doc => {
          const data = doc.data() as { items?: any[] }; // 👈 Type assertion here
          return {
            id: doc.id,
            ...data
          };
        });
        return docsData.length > 0 ? docsData[0].items || [] : [];
      }),
      catchError(error => {
        console.error('Error loading food items:', error);
        this.foodItemsSubject.next([]);
        return of([]);
      })
    ).subscribe(items => {
      this.foodItemsSubject.next(items);
    });
  }
  

  /** Add new food items and update Firestore + BehaviorSubject */
  async addFoodList(date: string, newItems: any[]): Promise<void> {
    const uid = await this.authService.getUid();
    if (!uid) {
      console.error('User not logged in.');
      return;
    }

    const foodListDocRef = doc(this.firestore, `users/${uid}/foodLists/${date}`);
    const docSnapshot = await getDoc(foodListDocRef);

    try {
      if (docSnapshot.exists()) {
        const currentData = docSnapshot.data();
        const existingItems = currentData?.['items'] || [];
        const updatedItems = [...existingItems];

        newItems.forEach(newItem => {
          const existingIndex = updatedItems.findIndex(item => item.id === newItem.id);
        
          if (existingIndex !== -1) {
            // Update existing item
            updatedItems[existingIndex] = { ...updatedItems[existingIndex], ...newItem };
          } else {
            // Add new item if not found
            updatedItems.push(newItem);
          }
        });

        /*newItems.forEach(newItem => {
          const exists = updatedItems.some(item => item.id === newItem.id);
          if (!exists) {
            updatedItems.push(newItem);
          } else {
            console.log(`Item with id ${newItem.id} already exists. Skipping.`);
          }
        });*/

        await updateDoc(foodListDocRef, { items: updatedItems });
        console.log(`Food items for ${date} updated successfully.`);
      } else {
        await setDoc(foodListDocRef, { date: date, items: newItems });
        console.log(`Food list for ${date} created successfully.`);
      }

      // Refresh the BehaviorSubject
      this.loadFoodItemsForDate(date, uid);
    } catch (error) {
      console.error('Error updating food list:', error);
    }
  }

  /** Delete a food item by its ID and update Firestore + BehaviorSubject */
  async deleteFoodItemById(date: string, itemId: string, userId: string): Promise<void> {
    const foodListRef = doc(this.firestore, `users/${userId}/foodLists/${date}`);
    const docSnapshot = await getDoc(foodListRef);

    try {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const existingItems = data?.['items'] || [];
        const updatedItems = existingItems.filter((item: any) => item.id !== itemId);

        await updateDoc(foodListRef, { items: updatedItems });
        console.log(`Item with id ${itemId} deleted.`);

        // Refresh the BehaviorSubject
        this.loadFoodItemsForDate(date, userId);
      } else {
        console.warn(`No document found for date ${date}`);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }

  /** Fetch public food items database */
  getFoodItemsFromPublicDatabase(): Observable<Food[]> {
    return from(getDocs(collection(this.firestore, 'foodlist') as CollectionReference<Food>)).pipe(
      map(querySnapshot =>
        querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      )
    );
  }

  getFoodItemById(id: string): Observable<Food> {
    // Define a reference to the document in the Firestore collection
    const foodDocRef = doc(this.firestore, `foodlist/${id}`);

    // Use 'getDoc' to fetch the document snapshot
    return from(getDoc(foodDocRef)).pipe(
      map((docSnapshot) => {
        // Check if the document exists
        if (docSnapshot.exists()) {
          return docSnapshot.data() as Food;  // Return the food item data as a 'Food' object
        } else {
          // If the document does not exist, throw an error
          throw new Error('Food item not found');
        }
      })
    );
  }

  createFoodID(){
    return Math.random().toString(36).substring(2);
  }

  addFoodItemToDatabase(newFoodItem: Food){
    const FoodCollection = collection(this.firestore, 'foodlist');
    return from(addDoc(FoodCollection, newFoodItem));
  }

  updateFoodItem(updatedFoodItem: Food, id: string) {
    const foodDocRef = doc(this.firestore, `foodlist/${id}`);  // Reference the document
    return from(updateDoc(foodDocRef, updatedFoodItem as { [key: string]: any}));  // Update the document with the new data
  }

  async uploadImg(path: string, file: File): Promise<string> {
    const storageRef = ref(this.storage, path);
    const task = uploadBytesResumable(storageRef, file);
    await task;
    const url = await getDownloadURL(storageRef);
    console.log(url);
    return url;
  }

}
