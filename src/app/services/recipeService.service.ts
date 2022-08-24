import { ShoppingListService } from 'src/app/services/shoppingListService.service';
import { EventEmitter, Injectable } from "@angular/core";
import { Recipe } from "../recipe-book/recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()

export class RecipeService {

    recipesChanged = new Subject<Recipe[]>();
    
    private recipes: Recipe[] = [];

    constructor(private shopListService: ShoppingListService, private http: HttpClient){}

    getRecipes() {
        return this.recipes.slice();
    }

    addIngredientsToShopList(newIngredients: Ingredient[]){
        this.shopListService.addRecipeIngredients(newIngredients)
    }

    getRecipeById(id: number) {
        return this.recipes[id]
    }

    addRecipe(newRecipe: Recipe) {
        this.recipes.push(newRecipe);
        this.recipesChanged.next(this.recipes.slice());
    } 

    updateRecipe(id: number, updateRecipe: Recipe) {
        this.recipes[id] = updateRecipe;
        this.recipesChanged.next(this.recipes.slice());
    } 

    deleteRecipe(id: number) {
        this.recipes.splice(id, 1);
        this.recipesChanged.next(this.recipes.slice());
    }

    overwriteRecipes(recipes: Recipe[]){
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }
}