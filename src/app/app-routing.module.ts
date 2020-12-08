import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/signin/signin.component';
import { RecoverComponentBack } from './components/recover/recover-back.component';
import { RecoverComponentFront } from './components/recover/recover-front.component';
import { SignUpComponent } from './components/signup/signup.component';
import { RoomComponent } from './components/room/room.component';
import { RoomCreateComponent } from './components/room/room-create.component';
import { RoomEditComponent } from './components/room/room-edit.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { AuthorizedGuard } from './guards/authorized.guard';
import { NotAuthorizedGuard } from './guards/not-authorized.guard';
import { ExitAboutGuard } from './guards/exit-about.guard';
import { TestsComponent } from './components/tests/tests.component';
import { MembersComponent } from './components/members/members.component';
import { TestCreateComponent } from './components/test/test-create.component';
import { TestEditComponent } from './components/test/test-edit.component';
import { TestResultsComponent } from './components/test/test-results.component';
import { RoomViewComponent } from './components/room/room-view.component';

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
      {
        path: 'create',
        component: RoomCreateComponent,
        canDeactivate: [ExitAboutGuard],
      },
      {
        path: 'edit/:roomId',
        component: RoomEditComponent,
        canDeactivate: [ExitAboutGuard],
      },
      {
        path: ':roomId',
        component: RoomComponent,
        children: [
          {
            path: '',
            component: RoomViewComponent,
            children: [
              { path: '', redirectTo: 'tests', pathMatch: 'prefix' },
              {
                path: 'tests',
                component: TestsComponent,
              },
              {
                path: 'members',
                component: MembersComponent,
              },
            ],
          },
          {
            path: 'test/create',
            component: TestCreateComponent,
          },
          {
            path: 'test/edit/:testId',
            component: TestEditComponent,
          },
          {
            path: 'test/results/:testId',
            component: TestResultsComponent,
          },
        ],
      },
    ],
  },

  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
