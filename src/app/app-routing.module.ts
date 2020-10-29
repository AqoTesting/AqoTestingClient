import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/signin/signin.component';
import { RecoverComponentBack } from './components/recover/recover-back.component';
import { RecoverComponentFront } from './components/recover/recover-front.component';
import { SignUpComponent } from './components/signup/signup.component';
import { RoomComponent } from './components/room/room.component';
import { RoomCreateComponent } from './components/rooms/room-create.component';
import { RoomEditComponent } from './components/rooms/room-edit.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { AuthorizedGuard } from './guards/authorized.guard';
import { NotAuthorizedGuard } from './guards/not-authorized.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },

  {
    path: 'auth',
    canActivate: [NotAuthorizedGuard],
    children: [
      { path: '', redirectTo: 'auth/signin', pathMatch: 'full' },
      { path: 'signin', component: SignInComponent },
      { path: 'signup', component: SignUpComponent },
      { path: 'recover', component: RecoverComponentFront },
      { path: 'recover/:code', component: RecoverComponentBack },
      { path: '**', redirectTo: 'signin' },
    ],
  },

  {
    path: 'rooms',
    canActivate: [AuthorizedGuard],
    component: RoomsComponent,
  },

  {
    path: 'room',
    canActivate: [AuthorizedGuard],
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
