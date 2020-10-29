import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserToken } from 'src/app/entities/user.entities';
import { Response } from 'src/app/entities/response.entities';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup = new FormGroup({
    login: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(320),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(128),
    ]),
  });

  hide = true;

  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {}

  getErrorMessageLogin() {
    let login = this.signInForm.controls['login'];
    if (login.hasError('required')) {
      return 'Введите логин или email';
    } else if (login.hasError('minlength')) {
      return 'Логин или email слишком короткий';
    } else if (login.hasError('maxlength')) {
      return 'Логин или email слишком длинный';
    }

    return '';
  }

  getErrorMessagePassword() {
    let password = this.signInForm.controls['password'];

    if (password.hasError('required')) {
      return 'Введите пароль';
    } else if (password.hasError('minlength')) {
      return 'Пароль слишком короткий';
    } else if (password.hasError('maxlength')) {
      return 'Пароль слишком длинный';
    }

    return '';
  }

  onSubmit() {
    this.signInForm.disable();
    this._authService.getUserTokenSignIn(this.signInForm.value).subscribe(
      (response: Response<UserToken>) => {
        if (response.succeeded) {
          //this.router.navigate(["rooms"]);
        } else {
          this.signInForm.enable();
        }
      },
      (error) => {
        this.signInForm.enable();
      }
    );
  }
}
