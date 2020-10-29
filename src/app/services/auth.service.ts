import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Response } from '../entities/response.entities';
import {
  SignInUser,
  SignUpUser,
  User,
  UserToken,
} from '../entities/user.entities';

import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  private _currentUser$: ReplaySubject<User> = null;
  private _isAuthorized: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthorization();
  }

  public get currentUser$(): Observable<User> {
    if (this._currentUser$ == null || this._currentUser$.hasError) {
      this._currentUser$ = new ReplaySubject<User>();

      if (this._isAuthorized) {
        this.getUser()
          .pipe(take(1))
          .subscribe(
            (value: Response<User>) => {
              this._currentUser$.next(value.data);
            },
            (error) => {
              this._currentUser$.error(error);
            }
          );
      } else {
        this._currentUser$.next(null);
      }
    }

    return this._currentUser$;
  }

  public setAuthorized(authorized) {
    if (authorized) {
      if (!this._isAuthorized) {
        this._isAuthorized = true;
        this.currentUser$.subscribe();
      }
    } else {
      if (this._isAuthorized) {
        this._isAuthorized = false;
        this._currentUser$ = null;
      }
    }
  }

  private checkAuthorization() {
    this.setAuthorized(!!localStorage.getItem('token'));
  }

  public authorizeByToken(token: string) {
    localStorage.setItem('token', token);
    this.setAuthorized(true);
  }

  public unAuthorize() {
    localStorage.removeItem('token');
    this.setAuthorized(false);
  }

  public get isAuthorized() {
    this.checkAuthorization();
    return this._isAuthorized;
  }

  public redirectTo(path: string) {
    this.router.navigate([path]);
  }

  /* Methods */

  private getUser(): Observable<Response<User>> {
    return this.http.get<Response<User>>(environment.apiUrl + '/user');
  }

  public getUserTokenSignIn(
    signInUser: SignInUser
  ): Observable<Response<UserToken>> {
    return this.http
      .post<Response<UserToken>>(
        environment.apiUrl + '/auth/signin',
        signInUser
      )
      .pipe(
        tap((response: Response<UserToken>) => {
          this.authorizeByToken(response.data.token);
        })
      );
  }

  public getUserTokenSignUp(
    signUpUser: SignUpUser
  ): Observable<Response<UserToken>> {
    return this.http
      .post<Response<UserToken>>(
        environment.apiUrl + '/auth/signup',
        signUpUser
      )
      .pipe(
        tap((response: Response<UserToken>) => {
          this.authorizeByToken(response.data.token);
        })
      );
  }
}
