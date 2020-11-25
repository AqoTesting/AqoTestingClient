import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './modules/material.module';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SignInComponent } from './components/signin/signin.component';
import { SignUpComponent } from './components/signup/signup.component';
import { RecoverComponentFront } from './components/recover/recover-front.component';
import { RecoverComponentBack } from './components/recover/recover-back.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoomsComponent } from './components/rooms/rooms.component';
import { RoomComponent } from './components/room/room.component';
import { RoomCreateComponent } from './components/room/room-create.component';
import { RoomEditComponent } from './components/room/room-edit.component';

import { AuthService } from './services/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { AuthorizedGuard } from './guards/authorized.guard';
import { NotAuthorizedGuard } from './guards/not-authorized.guard';
import { SnackService } from './services/snack.service';
import { SnackComponent } from './components/snack/snack.component';
import {
  ErrorMessagesCode,
  ErrorMessagesText,
} from './enums/error-messages.enum';
import { CatchErrorInterceptor } from './interceptors/catch-error.interceptor';
import { RoomService } from './services/room.service';
import { ExitAboutGuard } from './guards/exit-about.guard';
import { TestsComponent } from './components/tests/tests.component';
import { MembersComponent } from './components/members/members.component';
import { TestService } from './services/test.service';
import { AddMemberComponent } from './components/members/add-member.component';
import { MemberService } from './services/member.service';
import { FilterMemberComponent } from './components/members/filter-member.component';
import { TestCreateComponent } from './components/test/test-create.component';
import { TestEditComponent } from './components/test/test-edit.component';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { ImageService } from './services/image.service';
import { ImgBBService } from './services/imgbb.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    SignInComponent,
    SignUpComponent,
    RecoverComponentFront,
    RecoverComponentBack,
    RoomsComponent,
    RoomComponent,
    RoomCreateComponent,
    RoomEditComponent,
    SnackComponent,
    TestsComponent,
    MembersComponent,
    AddMemberComponent,
    FilterMemberComponent,
    TestCreateComponent,
    TestEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    AuthService,
    RoomService,
    SnackService,
    TestService,
    MemberService,
    ImageService,
    ImgBBService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CatchErrorInterceptor,
      multi: true,
    },

    AuthorizedGuard,
    NotAuthorizedGuard,
    ExitAboutGuard,
  ],
  bootstrap: [AppComponent],

  entryComponents: [],
})
export class AppModule {}
