import { Component, OnInit } from '@angular/core';
import { ErrorMessagesCode } from './enums/error-messages.enum';
import { AuthService } from './services/auth.service';
import { SnackService } from './services/snack.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private _authService: AuthService, private _snack: SnackService) {}

  ngOnInit() {
    this._authService.currentUser$.subscribe((data: any) => {
      console.log(data);
    });
  }
}
