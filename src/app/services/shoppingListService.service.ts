import { EventEmitter, Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";

@Injectable()

export class ShoppingListService {

  ingredientsChanged = new Subject<Ingredient[]>();

  private ingredients: Ingredient[] = [
    new Ingredient('Milk', 2),
    new Ingredient('Butter', 1),
    new Ingredient('Salt', 1),
    new Ingredient('Tomatoes', 5)
  ];

  ingredientSelected = new Subject<number>();

  getIngredients() {
    return this.ingredients.slice()
  }

  getIngredientById(id: number) {
    return this.ingredients.slice()[id]
  }

  addNewIngredient(newIngredient: Ingredient) {
    this.ingredients.push(newIngredient);
    this.ingredientsChanged.next(this.ingredients.slice())
  }

  addRecipeIngredients(ingredientsFromRecipe: Ingredient[]) {
    this.ingredients.push(...ingredientsFromRecipe);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  updateIngredient(ingredientEdited: Ingredient, id: number){
    this.ingredients[id] = ingredientEdited;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(indexId: number) {
    this.ingredients.splice(indexId, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}