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
  private _currentUser: User;
  private _currentUser$: ReplaySubject<User>;
  private _isAuthorized: boolean = false;

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthorization();
  }

  public get currentUser(): User {
    return this._currentUser;
  }

  public get currentUser$(): Observable<User> {
    if (this._currentUser$ == null || this._currentUser$.hasError) {
      this._currentUser$ = new ReplaySubject<User>();

      if (this._isAuthorized) {
        this.getUser()
          .pipe(take(1))
          .subscribe(
            (data: User) => {
              this._currentUser = data;
              this._currentUser$.next(this._currentUser);
            },
            (error) => {
              this._currentUser = null;
              this._currentUser$.error(error);
            }
          );
      } else {
        this._currentUser = null;
        this._currentUser$.next(this._currentUser);
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

  /* Methods */

  private getUser(): Observable<User> {
    return this.http.get<User>(environment.apiUrl + '/user');
  }

  public getUserTokenSignIn(
    signInUser: SignInUser
  ): Observable<UserToken> {
    return this.http
      .post<UserToken>(
        environment.apiUrl + '/auth/signin',
        signInUser
      )
      .pipe(
        tap((data: UserToken) => {
          this.authorizeByToken(data.token);
        })
      );
  }

  public getUserTokenSignUp(
    signUpUser: SignUpUser
  ): Observable<UserToken> {
    return this.http
      .post<UserToken>(
        environment.apiUrl + '/auth/signup',
        signUpUser
      )
      .pipe(
        tap((data: UserToken) => {
          this.authorizeByToken(data.token);
        })
      );
  }
}
