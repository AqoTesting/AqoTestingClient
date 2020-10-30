import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/app/entities/user.entities';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  
  public get user(): User {
    return this._authService.currentUser;
  }

  constructor(private _authService: AuthService, private _router: Router) {}

  ngOnInit(): void {
  }

  signOut(): void {
    this._authService.unAuthorize();
    this._router.navigate(['auth/signin']);
  }
}
