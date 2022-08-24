// import { Ingredient } from './../../shared/ingredient.model';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ShoppingListService } from 'src/app/services/shoppingListService.service';
import { Ingredient } from 'src/app/shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {

  @ViewChild('form', {static: false}) shoppingEditForm: NgForm;
  ingredientId: number;
  editMode = false;

  constructor(private shoplistservice: ShoppingListService) { }

  ngOnInit(): void {
    this.shoplistservice.ingredientSelected.subscribe(
      (ingredientId) => {
        this.editMode = true;
        this.ingredientId = ingredientId;
        const ingredient = this.shoplistservice.getIngredientById(ingredientId)
        this.shoppingEditForm.setValue({
          ingredientName: ingredient.name,
          ingredientAmount: ingredient.amount
        });
    })
  } 

  addIngredient() {
    const newName = this.shoppingEditForm.value.ingredientName;
    const newAmount = +this.shoppingEditForm.value.ingredientAmount;
    const newIngredient = new Ingredient(newName, newAmount);
    
    if (this.editMode) {
      this.shoplistservice.updateIngredient(newIngredient, this.ingredientId);
      this.clearForm()
    } else {
      this.shoplistservice.addNewIngredient(newIngredient);
      this.clearForm()
    }
  } 

  deleteIngredient(){
    this.shoplistservice.deleteIngredient(this.ingredientId);
    this.clearForm();
  }

  clearForm(){
    this.shoppingEditForm.reset();
    this.editMode = false;
  }

}
