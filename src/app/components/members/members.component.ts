import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Room } from 'src/app/entities/room.entities';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  room: Room;

  constructor(private route: ActivatedRoute, private roomService: RoomService) { 
    
  }

  ngOnInit(): void {
  }

}
