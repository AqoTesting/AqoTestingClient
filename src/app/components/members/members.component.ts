import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Room } from 'src/app/entities/room.entities';
import { RoomService } from 'src/app/services/room.service';
import { AddMemberComponent } from './add-member.component';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit {
  get room(): Room {
    return this.roomService.room;
  }

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  openAddMemberDialog() {
    const dialogRef = this.dialog.open(AddMemberComponent, {
      data: this.room.fields,
    });

    dialogRef.afterClosed().subscribe((fields) => {
      console.log('The dialog was closed', fields);
    });
  }
}
