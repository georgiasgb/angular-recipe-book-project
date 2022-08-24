// Firebase url
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError, Subject, tap, BehaviorSubject } from 'rxjs';
import { Auth } from '../authModels/auth.model';
import { User } from '../authModels/user.model';
import { environment } from '../../../environments/environment'

export interface AuthResponseData {
  kind?: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubject = new BehaviorSubject<User>(null); 

  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  signUp(userAuthData: Auth) {

    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey, 
      {
        email: userAuthData.email, 
        password: userAuthData.password,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handleError), tap(respData => this.handleUserAuthentication(respData)))
  }

  logIn(userAuthData: Auth) {

    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey, 
      {
        email: userAuthData.email,
        password: userAuthData.password,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handleError), tap(respData => this.handleUserAuthentication(respData)))
  }

  logOut() {
    this.userSubject.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogIn() {
    const userData: {email: string, id: string, _token: string, _tokenExpirationDate: Date} = JSON.parse(localStorage.getItem('userData'));
    if(userData) {
      const loadedUser = new User(userData.email, userData.id, userData._token, 
        new Date(userData._tokenExpirationDate)
      );
      if(loadedUser.token) {
        this.userSubject.next(loadedUser);
        const tokenDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime(); 
        this.autoLogOut(tokenDuration);
      }
    }
  }

  autoLogOut(tokenDuration : number) {
    console.log('Token timer: ' + tokenDuration);
    this.tokenExpirationTimer = setTimeout(() => {this.logOut()}, tokenDuration);
  }

  private handleUserAuthentication(respData: AuthResponseData) {
    const tokenExpiresInMili = parseInt(respData.expiresIn) * 1000;
    const expirationDate = new Date(new Date().getTime() + tokenExpiresInMili); 
    const user = new User(respData.email, respData.localId, respData.idToken, expirationDate);
    this.userSubject.next(user);
    this.autoLogOut(tokenExpiresInMili);

    localStorage.setItem('userData', JSON.stringify(user)); 
  }

  private handleError(error: HttpErrorResponse){
    let errorMessage = {header:'An error occurred', message:"An unknown error occurred!"}
      if(error.error || error.error.error){
        switch(error.error.error.message){
          // Sign Up
          case 'EMAIL_EXISTS':
            errorMessage.header = 'Email exists already';
            errorMessage.message = 'The email address is already in use by another account.';
            break;
          case 'OPERATION_NOT_ALLOWED':
            errorMessage.header = 'Operation not allowed';
            errorMessage.message = 'Password sign-in is disabled for this project.';
            break;
          case 'TOO_MANY_ATTEMPTS_TRY_LATER':
            errorMessage.header = 'Too many attempts made';
            errorMessage.message = 'We have blocked all requests from this device due to unusual activity. Try again later.';
            break;  
          // Log In
          case 'EMAIL_NOT_FOUND':
            errorMessage.header = 'Email not found';
            errorMessage.message = 'There is no user record corresponding to this identifier.';
            break;
          case 'INVALID_PASSWORD':
            errorMessage.header = 'Invalid password';
            errorMessage.message = 'The password is invalid or the user does not have a password.';
            break;
          case 'USER_DISABLED':
            errorMessage.header = 'User disabled';
            errorMessage.message = 'The user account has been disabled by an administrator.';
            break;
          default:
            errorMessage;
        }
      }
    return throwError(errorMessage)
  }
}
