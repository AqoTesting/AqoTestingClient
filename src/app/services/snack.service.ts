import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import {
  ErrorMessagesCode,
  ErrorMessagesText,
} from '../enums/error-messages.enum';
import { SnackComponent } from '../components/snack/snack.component';

@Injectable()
export class SnackService {
  constructor(private _bar: MatSnackBar) {}

  public fatal(message: string, duration: number = 5000): MatSnackBarRef<any> {
    return this._bar.openFromComponent(SnackComponent, {
      duration,
      data: { message, type: "error" },
    });
  }

  public error(errorCode: ErrorMessagesCode, duration: number = 5000): MatSnackBarRef<any> {
    const message = ErrorMessagesText[ErrorMessagesCode[errorCode]];
    return this._bar.openFromComponent(SnackComponent, {
      duration,
      data: { message, type: "error" },
    });
  }

  public success(message: string, duration: number = 5000): MatSnackBarRef<any> {
    return this._bar.openFromComponent(SnackComponent, {
      duration,
      data: { message, type: "success" },
    });
  }
}
