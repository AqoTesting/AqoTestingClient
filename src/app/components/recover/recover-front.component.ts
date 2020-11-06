import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Background } from 'src/app/utils/background.utility';

@Component({
  selector: 'app-recover-front',
  templateUrl: './recover-front.component.html',
  styleUrls: ['./recover.component.scss'],
})
export class RecoverComponentFront implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(private snackBar: MatSnackBar) {
    Background.setColor("#9c27b0");
  }

  ngOnInit(): void {}

  getErrorMessageEmail() {
    if (this.email.hasError('required')) {
      return 'Введите email';
    }

    return this.email.hasError('email') ? 'Неверный e-mail' : '';
  }

  sendRecoveryRequest() {
    this.snackBar.open('Запрос на восстановление отправлен', 'OK', {
      duration: 5000,
    });
  }
}
