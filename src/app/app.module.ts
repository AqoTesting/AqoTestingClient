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
import { RoomCreateComponent } from './components/rooms/room-create.component';
import { RoomEditComponent } from './components/rooms/room-edit.component';

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
    SnackService,
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
  ],
  bootstrap: [AppComponent],

  entryComponents: [],
})
export class AppModule {}
