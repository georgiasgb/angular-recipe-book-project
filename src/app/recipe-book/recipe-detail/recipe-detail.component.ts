import { RecipeService } from './../../services/recipeService.service';
import { Recipe } from './../recipe.model';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {

  recipeDetail: Recipe;
  id: number;
  subcription: Subscription;

  constructor(private recipeService: RecipeService, private activRoute: ActivatedRoute,
    private router: Router) { }
 
  ngOnInit(): void {
    this.subcription = this.activRoute.params.subscribe(
      (params: Params) => {
        this.id = parseInt(params['id']);
        this.recipeDetail = this.recipeService.getRecipeById(this.id);
      }
    )
  }

  addToShoppingList(){
    this.recipeService.addIngredientsToShopList(this.recipeDetail.ingredients)
  }

  goToEdit() {
    this.router.navigate(['edit'], {relativeTo: this.activRoute})
  }

  deleteRecipe(){
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }

  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }
  
}
