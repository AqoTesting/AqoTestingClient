import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './modules/material.module';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { RecoverComponentFront } from './components/recover/recover-front.component';
import { RecoverComponentBack } from './components/recover/recover-back.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoomsComponent } from './components/rooms/rooms.component';
import { RoomComponent } from './components/room/room.component';
import { RoomCreateComponent } from './components/rooms/room-create.component';
import { RoomEditComponent } from './components/rooms/room-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    RegistrationComponent,
    RecoverComponentFront,
    RecoverComponentBack,
    RoomsComponent,
    RoomComponent,
    RoomCreateComponent,
    RoomEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],

  entryComponents: [],
})
export class AppModule {}
