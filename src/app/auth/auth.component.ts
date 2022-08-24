import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Auth } from './authModels/auth.model';
import { AuthResponseData, AuthService } from './services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html' 
})
export class AuthComponent implements OnInit, OnDestroy {

  @ViewChild('authForm') authForm: NgForm;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
  
  isLoginMode = true;
  isLoading = false;
  errorMessage = null;
  private alertSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router, private compFactory: ComponentFactoryResolver){}

  ngOnInit(): void {

  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  submitAuth(){
    
    let authObservable: Observable<AuthResponseData>;

    if(this.authForm.valid) {
      this.isLoading = true;
      const email = this.authForm.value.email;
      const password = this.authForm.value.password;
      const userData: Auth = {email, password};
  
      if(this.isLoginMode) {
        authObservable = this.authService.logIn(userData);
      } else {
        authObservable = this.authService.signUp(userData);
      }

      authObservable.subscribe({
        next: () => {
          this.router.navigate(['/recipes']);
        },
        error: (error) => {
          this.showErrorMessage(error)
        }
      });
    }
    this.isLoading = false;
    this.authForm.reset();
  }

  showAlert() {
    this.errorMessage = null;
  }

  private showErrorMessage(errorMessage){
    const compAlertFactory = this.compFactory.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const createdCompRef = hostViewContainerRef.createComponent(compAlertFactory);
    createdCompRef.instance.message = errorMessage;
    this.alertSubscription = createdCompRef.instance.closeAlert.subscribe(() => {
      this.alertSubscription.unsubscribe(); 
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy() {
    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe();
    }
  }

}
 