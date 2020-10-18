import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  email = new FormControl('', [Validators.required, Validators.email]);
  passwd = new FormControl('', [Validators.required]);

  hide = true;

  getErrorMessageEmail() {
    if (this.email.hasError('required')) {
      return 'Введите email';
    }

    return this.email.hasError('email') ? 'Неверный e-mail' : '';
  }

  getErrorMessagePasswd() {
    if (this.passwd.hasError('required')) {
      return 'Введите пароль';
    }

    return this.email.hasError('passwd') ? 'Неверный пароль' : '';
  }
}
