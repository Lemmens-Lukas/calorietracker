import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc, docData, DocumentData, CollectionReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Food } from '../datatypes/Food.model';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private db: Firestore) { }

  /*getFoodItems(): Observable<Food[]>{
    return collectionData<Food>(
      collection(this.db, 'foodlist') as CollectionReference<Food>,
      {idField: "id"}
    )
  }*/
}
