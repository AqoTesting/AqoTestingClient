import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
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
import { take } from 'rxjs/operators';
import { Member } from 'src/app/entities/member.entities';
import { Response } from 'src/app/entities/response.entities';
import { Room } from 'src/app/entities/room.entities';
import { MemberService } from 'src/app/services/member.service';
import { RoomService } from 'src/app/services/room.service';
import { SnackService } from 'src/app/services/snack.service';
import { AddMemberComponent } from './add-member.component';
import { FilterMemberComponent } from './filter-member.component';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  members: Member[];
  allColumns: string[];
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
    this.allColumns = this.room.fields.map((field) => field.name);
    this.displayColumns = this.room.fields.map((field) => field.name);
  }

  getMembers() {
    this.subscription.add(
      this.memberService
        .getRoomMembers(this.room.id)
        .pipe(take(1))
        .subscribe((members: Member[]) => {
          this.members = members;
        })
    );
  }

  memberApprove(member: Member) {
    member.isApproved = true;
    this.subscription.add(
      this.memberService
        .memberApprove(member.id)
        .pipe(take(1))
        .subscribe(
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
      this.memberService
        .memberUnregister(member.id)
        .pipe(take(1))
        .subscribe(
          () => {},
          (error) => {
            member.isRegistered = true;
            if (error instanceof Response)
              this.snack.error(error.errorMessageCode);
          }
        )
    );
  }

  memberDelete(member: Member) {
    if (confirm('Вы уверены что хотите удалить участника?')) {
      this.subscription.add(
        this.memberService
          .memberDelete(member.id)
          .pipe(take(1))
          .subscribe(
            () => {
              this.snack.success('Участник успешно удалён');
              this.members = this.members.filter(
                (_member) => _member.id != member.id
              );
            },
            (error) => {
              if (error instanceof Response) {
                this.snack.error(error.errorMessageCode);
              }
            }
          )
      );
    }
  }

  openFilterDialog() {
    const dialogRef = this.dialog.open(FilterMemberComponent, {
      data: this.room.fields,
    });

    this.subscription.add(
      dialogRef
        .afterClosed()
        .pipe(take(1))
        .subscribe((reslt) => {
          if (reslt) {
            this.members = null;
            this.getMembers();
          }
        })
    );
  }

  openAddMemberDialog() {
    const dialogRef = this.dialog.open(AddMemberComponent, {
      data: this.room.fields,
    });

    this.subscription.add(
      dialogRef
        .afterClosed()
        .pipe(take(1))
        .subscribe((reslt) => {
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

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
