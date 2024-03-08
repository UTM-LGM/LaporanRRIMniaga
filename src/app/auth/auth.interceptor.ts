import { UserService } from './../services/user.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpUserEvent, HttpEvent, HttpHeaders } from "@angular/common/http";
// import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/do';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }


    intercept(
      req: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      if (req.headers.get('No-Auth') === 'True') {
        return next.handle(req);
      }
  
      const userToken = sessionStorage.getItem('userToken');
  
      if (userToken) {
        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${userToken}`,
          },
        });
  
        return next.handle(clonedReq).pipe(
          catchError((error) => {
            if (error.status === 401) {
              this.router.navigate(['/login']);
            }
            throw error;
          })
        );
      } else {
        this.router.navigate(['/login']);
        return next.handle(req);
      }
    }
    
}