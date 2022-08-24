import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { RecipeBookComponent } from './recipe-book.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeDefaultStartComponent } from './recipe-default-start/recipe-default-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RecipeRoutingModule } from './recipe-routing.module';

@NgModule({
  declarations: [
    RecipeBookComponent,
    RecipeDetailComponent,
    RecipeListComponent,
    RecipeItemComponent,
    RecipeDefaultStartComponent,
    RecipeEditComponent,
  ],
  imports: [
    SharedModule,
    RecipeRoutingModule,
    ReactiveFormsModule,
    ]
})
export class RecipesModule { }
