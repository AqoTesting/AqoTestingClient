import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './services/auth.service';
import { SnackService } from './services/snack.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private _authService: AuthService,
    private _snack: SnackService,
    private _bar: MatSnackBar
  ) {}

  ngOnInit() {
    //this._bar.open("f", "OK");
    //this._snack.success("Комната <b>Хрен</b> успешно создана!", 5000000);
  }
}
