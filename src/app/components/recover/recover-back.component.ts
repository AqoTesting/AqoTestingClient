import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Background } from 'src/app/utils/background.utility';
import RepeatValidator from '../../validators/repeat.validator';

@Component({
  selector: 'app-recover-back',
  templateUrl: './recover-back.component.html',
  styleUrls: ['./recover.component.scss'],
})
export class RecoverComponentBack implements OnInit {
  code: string;

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

  constructor(private route: ActivatedRoute, private snackBar: MatSnackBar) {
    Background.setColor("#9c27b0");
    this.route.params.subscribe(({ code }) => (this.code = code));
  }

  ngOnInit(): void {}

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

  sendRecoveryRequest() {
    this.snackBar.open('Ваш пароль обновлен', 'OK', {
      duration: 5000,
    });
  }
}
