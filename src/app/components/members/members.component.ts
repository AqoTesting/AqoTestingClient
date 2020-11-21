import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { error } from 'protractor';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/entities/member.entities';
import { Response } from 'src/app/entities/response.entities';
import { Room } from 'src/app/entities/room.entities';
import { MemberService } from 'src/app/services/member.service';
import { RoomService } from 'src/app/services/room.service';
import { SnackService } from 'src/app/services/snack.service';
import { AddMemberComponent } from './add-member.component';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  members: Member[];
  displayColumns: string[];

  get room(): Room {
    return this.roomService.room;
  }

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private memberService: MemberService,
    private snack: SnackService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMembers();
    this.displayColumns = this.room.fields.map((field) => field.name);
  }

  getMembers() {
    this.subscription.add(
      this.memberService
        .getRoomMembers(this.room.id)
        .subscribe((members: Member[]) => {
          this.members = members;
        })
    );
  }

  memberApprove(member: Member) {
    member.isApproved = true;
    this.subscription.add(
      this.memberService.memberApprove(member.id).subscribe(
        () => {},
        (error) => {
          member.isApproved = false;
          if (error instanceof Response)
            this.snack.error(error.errorMessageCode);
        }
      )
    );
  }

  memberUnregister(member: Member) {
    member.isRegistered = false;
    this.subscription.add(
      this.memberService.memberUnregister(member.id).subscribe(
        () => {},
        (error) => {
          member.isRegistered = true;
          if (error instanceof Response)
            this.snack.error(error.errorMessageCode);
        }
      )
    );
  }

  openAddMemberDialog() {
    const dialogRef = this.dialog.open(AddMemberComponent, {
      data: this.room.fields,
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe((reslt) => {
        if (reslt) {
          this.members = null;
          this.getMembers();
        }
      })
    );
  }

  getFieldsKeys(fields: any): string[] {
    return Object.keys(fields);
  }

  ngOnDestroy() {}
}
