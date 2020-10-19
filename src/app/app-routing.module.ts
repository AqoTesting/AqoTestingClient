import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RecoverComponentBack } from './components/recover/recover-back.component';
import { RecoverComponentFront } from './components/recover/recover-front.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { RoomComponent } from './components/room/room.component';
import { RoomCreateComponent } from './components/rooms/room-create.component';
import { RoomEditComponent } from './components/rooms/room-edit.component';
import { RoomsComponent } from './components/rooms/rooms.component';

const routes: Routes = [
  { path: '', component: HomeComponent },

  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'registration', component: RegistrationComponent },
      { path: 'recover', component: RecoverComponentFront },
      { path: 'recover/:code', component: RecoverComponentBack },
      { path: '**', redirectTo: 'login' },
    ],
  },

  {
    path: 'rooms',
    component: RoomsComponent,
  },

  {
    path: 'room',
    children: [
      { path: '', redirectTo: '/rooms', pathMatch: 'full' },
      { path: 'create', component: RoomCreateComponent },
      { path: 'edit/:roomId', component: RoomEditComponent },
      { path: ':roomId', component: RoomComponent },
    ],
  },

  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
