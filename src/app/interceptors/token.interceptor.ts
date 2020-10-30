import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { SnackService } from '../services/snack.service';
import { environment } from '../../environments/environment';
import { Response } from '../entities/response.entities';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    let headers = request.headers;
    if (token) headers = headers.append('Authorization', `Bearer ${token}`);

    return next.handle(request.clone({ headers }));
  }
}
