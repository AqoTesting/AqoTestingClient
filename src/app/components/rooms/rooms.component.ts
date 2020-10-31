import { Route } from '@angular/compiler/src/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GetRoomsItem } from 'src/app/entities/room.entities';
import { User } from 'src/app/entities/user.entities';
import { Response } from 'src/app/entities/response.entities';
import { AuthService } from 'src/app/services/auth.service';
import { SnackService } from 'src/app/services/snack.service';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent implements OnInit, OnDestroy {
  roomsSub: Subscription;
  rooms: GetRoomsItem[];

  constructor(
    private _roomService: RoomService,
    private _snackService: SnackService
  ) {}

  ngOnInit(): void {
    this.updateRoomsItem();
  }

  private updateRoomsItem(): void {
    this.roomsSub = this._roomService.getUserRooms().subscribe((data) => {
      this.rooms = data;
    });
  }

  deleteRoom(room: GetRoomsItem): void {
    if (confirm(`Вы уверены, что хотите удалить комнату ${room.name}?`)) {
      this._roomService.deleteRoomById(room.id).subscribe(
        () => {
          this._snackService.success(
            `Комната ${room.name} была успешно удалена`
          );
          this.rooms = this.rooms.filter((_room) => _room.id != room.id);
          this.updateRoomsItem();
        },
        (error) => {
          if (error instanceof Response)
            this._snackService.error(error.errorMessageCode);
        }
      );
    }
  }

  ngOnDestroy() {
    if (this.roomsSub) this.roomsSub.unsubscribe();
  }
}
