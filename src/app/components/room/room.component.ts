import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Room } from 'src/app/entities/room.entities';
import { RoomService } from 'src/app/services/room.service';
import { Background } from 'src/app/utils/background.utility';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  roomId: string;
  room: Room;
  tabSelectedIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    public location: Location
  ) {
    Background.setColor('#303030');
    this.subscription.add(
      this.route.params.pipe(take(1)).subscribe((params) => {
        this.roomId = params['roomId'];
      })
    );
  }

  ngOnInit(): void {
    this.getRoom();
  }

  getRoom(): void {
    this.subscription.add(
      this.roomService.getUserRoomById(this.roomId).pipe(take(1)).subscribe((data: Room) => {
        this.room = data;
      })
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
