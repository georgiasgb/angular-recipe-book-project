import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, Observable, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable(
  // { providedIn: 'root' }
)
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.userSubject.pipe(take(1),
    exhaustMap(user => {
      if ( user ) {         
        const modifiedRequest = req.clone({'params': new HttpParams().set('auth', user.token)});
        return next.handle(modifiedRequest)
      }
      return next.handle(req);
    })
    )
  }
}
