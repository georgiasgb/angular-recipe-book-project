import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
// import { CommonModule } from '@angular/common';
import { SharedModule } from './../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    // CommonModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild([{path: '', component: AuthComponent}]) 
  ]
})
export class AuthModule { }
 