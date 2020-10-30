import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetRoomsItem } from 'src/app/entities/room.entities';
import { User } from 'src/app/entities/user.entities';
import { AuthService } from 'src/app/services/auth.service';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent implements OnInit {

  public rooms: GetRoomsItem[];

  constructor(private _roomService: RoomService) {}

  ngOnInit(): void {
    this._roomService.getUserRooms().subscribe(data => {
      this.rooms = data;
    });
  }
}
