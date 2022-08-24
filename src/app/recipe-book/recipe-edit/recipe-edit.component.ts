import { Ingredient } from './../../shared/ingredient.model';
import { Recipe } from './../recipe.model';
import { RecipeService } from './../../services/recipeService.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  id: number;
  editMode: boolean = false;
  recipeEditForm: FormGroup;

  constructor(private activRoute: ActivatedRoute, private recipeService: RecipeService, private route: Router) { }

  ngOnInit(): void {
    this.activRoute.params.subscribe(
      (params: Params) => {
        this.id = parseInt(params['id']);
        this.editMode = params['id'] ? true : false;
        this.initForm()
      }
    )
  }

  get controls() {
    return (<FormArray>this.recipeEditForm.get('recipeIngredients')).controls
  }

  private initForm() {
    let recipeName: string = '';
    let recipeImage: string = '';
    let recipeDescription: string = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipeById(this.id);

      recipeName = recipe.name;
      recipeImage = recipe.imagePath;
      recipeDescription = recipe.description;

      if(recipe['ingredients']){
        for(let ingredient of recipe.ingredients){
          recipeIngredients.push(new FormGroup({
            'name': new FormControl(ingredient.name, Validators.required),
            'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
          }))
        }
      }
    }

    this.recipeEditForm = new FormGroup({
      'recipeName': new FormControl(recipeName, Validators.required),
      'recipeImage': new FormControl(recipeImage, Validators.required),
      'recipeDescription': new FormControl(recipeDescription, Validators.required),
      'recipeIngredients': recipeIngredients
    })
  }
  
  onSubmit() {
    const newRecipe = new Recipe(
    this.recipeEditForm.value['recipeName'],
    this.recipeEditForm.value['recipeDescription'],
    this.recipeEditForm.value['recipeImage'],
    this.recipeEditForm.value['recipeIngredients']);
    
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, newRecipe);
    } else {
      this.recipeService.addRecipe(newRecipe);
    }
    this.onCancel();
  }

  onCancel() {
    this.recipeEditForm.reset();
    this.route.navigate(['../'], {relativeTo: this.activRoute});
  }

  onAddIngredient() {
    const ingredientGroup = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    });
    (<FormArray>this.recipeEditForm.get('recipeIngredients')).push(ingredientGroup);
  }

  onDeleteIngredient(id: number) {
    (<FormArray>this.recipeEditForm.get('recipeIngredients')).removeAt(id)
  }

}
