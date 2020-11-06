import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Background } from 'src/app/utils/background.utility';
import RepeatValidator from '../../validators/repeat.validator';

@Component({
  selector: 'app-registration',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignUpComponent implements OnInit {
  constructor() {
    Background.setColor("#9c27b0");
  }

  ngOnInit(): void {}

  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(30),
  ]);
  email = new FormControl('', [Validators.required, Validators.email]);
  passwd = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(30),
  ]);

  repeatPasswd = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(30),
    RepeatValidator(this.passwd),
  ]);

  hide = true;

  getErrorMessageName() {
    if (this.name.hasError('required')) return 'Введите имя';

    if (this.name.hasError('minlength')) return 'Имя слишком короткое';

    if (this.name.hasError('maxlength')) return 'Имя слишком длинное';

    return this.email.hasError('email') ? 'Неверный e-mail' : '';
  }

  getErrorMessageEmail() {
    if (this.email.hasError('required')) return 'Введите email';

    return this.email.hasError('email') ? 'Неверный e-mail' : '';
  }

  getErrorMessagePasswd() {
    if (this.passwd.hasError('required')) return 'Введите пароль';

    if (this.passwd.hasError('minlength')) return 'Пароль слишком короткий';

    if (this.passwd.hasError('maxlength')) return 'Пароль слишком длинный';

    return '';
  }

  getErrorMessageRepeatPasswd() {
    if (this.repeatPasswd.hasError('required')) return 'Введите пароль';

    if (this.repeatPasswd.hasError('minlength'))
      return 'Пароль слишком короткий';

    if (this.repeatPasswd.hasError('maxlength'))
      return 'Пароль слишком длинный';

    if (this.repeatPasswd.hasError('repeat')) {
      return 'Пароли не совпадают';
    }

    return '';
  }
}
