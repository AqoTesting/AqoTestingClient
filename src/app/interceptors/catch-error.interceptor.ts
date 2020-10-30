import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, from, throwError, of } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { SnackService } from '../services/snack.service';
import { environment } from '../../environments/environment';
import { Response } from '../entities/response.entities';

@Injectable()
export class CatchErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private injector: Injector,
    private _snack: SnackService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request.clone()).pipe(
      switchMap((value) => {
        if (value.type == HttpEventType.Response) {
          const httpResponse = value as HttpResponse<any>;

          if (httpResponse.status == 200) {
            const response: Response<any> = new Response(httpResponse.body);

            if (response.succeeded) {
              return of(httpResponse.clone({ body: response.data }));
            } else {
              return throwError(response);
            }
          }
        }

        return of(value);
      }),
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.injector.get(AuthService).unAuthorize();
            this.router.navigate(['/auth/signin']);
          } else {
            this._snack.fatal(error.message.replace(environment.apiUrl, ''));
          }

          return throwError(error);
        } else if (error instanceof Response) {
          return throwError(error);
        }
      })
    );
  }
}
