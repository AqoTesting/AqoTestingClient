import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RecoverComponentBack } from './components/recover/recover-back.component';
import { RecoverComponentFront } from './components/recover/recover-front.component';
import { RegistrationComponent } from './components/registration/registration.component';

const routes: Routes = [
  { path: "", component: HomeComponent },

  { path: 'auth', children: [
    { path: "login", component: LoginComponent },
    { path: "registration", component: RegistrationComponent },
    { path: "recover", component: RecoverComponentFront },
    { path: "recover/:code", component: RecoverComponentBack },
    { path: '**', redirectTo: 'login' }
  ]},

  { path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
