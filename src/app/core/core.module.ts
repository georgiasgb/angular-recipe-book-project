import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { RecipeService } from '../services/recipeService.service';
import { ShoppingListService } from '../services/shoppingListService.service';
import { AuthInterceptorService } from '../auth/services/auth-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';



@NgModule({
  providers: [ RecipeService, ShoppingListService, {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ]
})
export class CoreModule { }
