// Firebase url
import { Recipe } from './../recipe-book/recipe.model';
import { RecipeService } from './../services/recipeService.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, map, take, tap } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }

  storeRecipe() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('FIREBASE', recipes)
    .subscribe(() => console.log('Success!'));
  }
  
  getStoredRecipe() {
    return this.http.get<Recipe[]>('FIREBASE')
    .pipe(map(recipes => {
      return recipes.map(recipe => {
        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
      })
    }), tap((recipes) => {
      this.recipeService.overwriteRecipes(recipes);
    }))
  }
}
