import { Component, OnInit } from '@angular/core';
import { Attempt } from 'src/app/entities/attempt.entities';
import { Member } from 'src/app/entities/member.entities';
import { Room } from 'src/app/entities/room.entities';
import { MemberService } from 'src/app/services/member.service';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-test-results',
  templateUrl: './test-results.component.html',
  styleUrls: ['./test-results.component.scss'],
})
export class TestResultsComponent implements OnInit {
  get room(): Room {
    return this.roomService.room;
  }
  members: Member[];
  attempts: Attempt[];


  constructor(private roomService: RoomService, private memberService: MemberService) {}

  ngOnInit(): void {
    console.log(this.room)
    this.roomService.room$.subscribe((room) => {
      console.log(room)
    });
    
  }
}
