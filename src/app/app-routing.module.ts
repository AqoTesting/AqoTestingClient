import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ReductionComponent } from './components/reduction/reduction.component';
import { RegistrationComponent } from './components/registration/registration.component';

const routes: Routes = [
  { path: "", component: HomeComponent },

  { path: 'auth', children: [
    { path: "login", component: LoginComponent },
    { path: "registration", component: RegistrationComponent },
    { path: "reduction", component: ReductionComponent },
    { path: '**', redirectTo: 'login' }
  ]},

  { path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
