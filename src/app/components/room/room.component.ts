import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Room } from 'src/app/entities/room.entities';
import { RoomService } from 'src/app/services/room.service';
import { Background } from 'src/app/utils/background.utility';
import { Location } from '@angular/common';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
  roomId: string;
  room: Room;
  roomSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    public location: Location
  ) {
    Background.setColor('#303030');
    this.route.params.subscribe((params) => {
      this.roomId = params['roomId'];
    });
  }

  ngOnInit(): void {
    this.getRoom();
  }

  getRoom(): void {
    this.roomSub = this.roomService
      .getUserRoomById(this.roomId)
      .subscribe((data: Room) => {
        this.room = data;
      });
  }

  ngOnDestroy(): void {
    if (this.roomSub) this.roomSub.unsubscribe();
  }
}
