import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  constructor() {}

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
    this.RepeatValidator(this.passwd)
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

  RepeatValidator(compared: FormControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (compared.value != control.value) {
            return { 'repeat': true };
        }
        return null;
    };
}
}
