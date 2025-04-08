export class Food {
    constructor(
      public id?: string,
      public name: string = "",
      public calories: number = 0,
      public quantity: number = 0,
      public vetten: number = 0,
      public eiwitten: number = 0,
      public koolhydraten: number = 0,
      public img: string = "",
      public categorie: string = ""
      ){}
  }

      /*export interface Food {
        id?: string;
        name: string;
        categorie: string;
        img: string;
        calories: number;
        quantity: number;
        vetten: number;
        fats: number;
        protein: number;
        eiwitten: number;
        carbs: number;
        koolhydraten: number; // Add this line
        // Add any other fields like protein, fat, etc.
      }*/