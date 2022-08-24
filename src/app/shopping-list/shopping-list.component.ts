import { ShoppingListService } from './../services/shoppingListService.service';
import { Ingredient } from './../shared/ingredient.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  ingredients: object[]; 

  constructor(private shoplistservice: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.shoplistservice.getIngredients();
    this.shoplistservice.ingredientsChanged.subscribe((newIngredients: Ingredient[]) => {this.ingredients = newIngredients})
  }

  ingredientSelected(ingredientId: number) {
    this.shoplistservice.ingredientSelected.next(ingredientId);
  }

}
 