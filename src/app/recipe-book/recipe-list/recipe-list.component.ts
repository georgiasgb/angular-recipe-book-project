import { RecipeService } from './../../services/recipeService.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  recipes: Recipe[] = this.recipeService.getRecipes();

  subcription: Subscription;
  
  constructor(private recipeService: RecipeService, private router: Router, private activRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.subcription = this.recipeService.recipesChanged.subscribe(
      newRecipes => {
        this.recipes = newRecipes;
      }
    )
  }

  goToAddNew() {
    this.router.navigate(['addNew'], {relativeTo: this.activRouter})
  }

  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }

}
