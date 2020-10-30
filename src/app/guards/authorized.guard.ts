import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthorizedGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const authorized = this.authService.isAuthorized;
    if (authorized) {
      return true;
    } else {
      this.router.navigate(["/auth/signin"]);
      return false;
    }
  }
}
