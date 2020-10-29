import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { throwError as observableThrowError, Observable, from } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { SnackService } from '../services/snack.service';
import { environment } from '../../environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private injector: Injector,
    private _snack: SnackService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    let lastEvent: HttpEvent<any> = null;

    /*
      const noSpinner = !!req.headers.get("NoSpinner");
      if (!noSpinner) {
        this.visoad.startLoading();
      }
  
      let headers = req.headers.delete("NoSpinner");
    */

    let headers = req.headers;
    headers = headers.append('Authorization', `Bearer ${token}`);
    headers = headers.append('Content-Type', 'application/json');

    if (token) {
      req = req.clone({
        headers: headers,
      });
    }
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        lastEvent = event;

        if (event instanceof HttpResponse && ~(event.status / 100) > 3) {
          //// DEBUG console.log("HttpResponse::event =", event, ";");
        } else {
          //// DEBUG console.log("event =", event, ";");
        }
        return event;
      }),
      catchError((err: any, caught) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.injector.get(AuthService).unAuthorize();
            // DEBUG console.log("err.error =", err.error, ";");
            this.router.navigate(['/auth/login']);
          } else {
            this._snack.fatal(err.message.replace(environment.apiUrl, ''));
          }

          //if (!err.status) this.mainTenanceService.isError();

          return observableThrowError(err);
        }
      }),
      finalize(() => {
        //if (!noSpinner) this.visoad.completeLoading();
      })
    );
  }
}
