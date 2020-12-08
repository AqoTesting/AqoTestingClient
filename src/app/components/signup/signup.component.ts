import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Response } from 'src/app/entities/response.entities';
import { AuthService } from 'src/app/services/auth.service';
import { SnackService } from 'src/app/services/snack.service';
import { Background } from 'src/app/utils/background.utility';
import RepeatValidator from '../../validators/repeat.validator';

@Component({
  selector: 'app-registration',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignUpComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();

  signUpForm: FormGroup = this.fb.group({
    login: [
      '',
      [Validators.required, Validators.minLength(1), Validators.maxLength(32)],
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.minLength(6),
        Validators.maxLength(320),
      ],
    ],
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(30)],
    ],
    repeatPassword: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(30)],
    ],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snack: SnackService
  ) {
    Background.setColor('#9c27b0');
    this.signUpForm.controls.repeatPassword.setValidators(
      RepeatValidator(this.signUpForm.controls.password)
    );
  }

  ngOnInit(): void {}

  hide = true;

  getErrorMessage(control: FormControl) {
    if (control.hasError('required')) return 'Введите значение';
    else if (control.hasError('minlength')) return 'Значение слишком короткое';
    else if (control.hasError('maxlength')) return 'Значение слишком длинное';
    else if (control.hasError('repeat')) return 'Значения не совпадают';
    else if (control.hasError('url')) return 'Неверный формат URL';

    return '';
  }

  onSubmit() {
    this.signUpForm.disable();
    const signUp = this.signUpForm.value;
    delete signUp.repeatPassword;
    this.subscription.add(
      this.authService.getUserTokenSignUp(signUp).pipe(take(1)).subscribe(
        () => {
          this.router.navigate(['/rooms']);
        },
        (error) => {
          if (error instanceof Response) {
            this.snack.error(error.errorMessageCode);
          }
          this.signUpForm.enable();
        }
      )
    );
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
