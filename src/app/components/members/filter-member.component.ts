import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Response } from 'src/app/entities/response.entities';
import { Room, RoomField } from 'src/app/entities/room.entities';
import { MemberService } from 'src/app/services/member.service';
import { RoomService } from 'src/app/services/room.service';
import { SnackService } from 'src/app/services/snack.service';
import { MembersComponent } from './members.component';

@Component({
  selector: 'app-filter-member',
  templateUrl: './filter-member.component.html',
  styleUrls: ['./filter-member.component.scss'],
})
export class FilterMemberComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  get room(): Room {
    return this.roomService.room;
  }

  memberAdd: FormGroup = this.fb.group({});

  constructor(
    public dialogRef: MatDialogRef<MembersComponent>,
    @Inject(MAT_DIALOG_DATA) public fields: RoomField[],
    private fb: FormBuilder,
    private snack: SnackService,
    private roomService: RoomService,
    private memberService: MemberService,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.fields.forEach((field) => {
      let validators: Validators[] = [];
      if (field.isRequired) validators.push(Validators.required);
      if (field.mask) validators.push(Validators.pattern(field.mask));

      this.addField(field.name, '', validators);
    });
  }

  addField(name: string, value: string = '', validators: Validators[]): void {
    this.memberAdd.addControl(name, this.fb.control(value, ...validators));
  }

  getErrorMessage(control: FormControl) {
    if (control.hasError('required')) return 'Введите значение';
    else if (control.hasError('minlength')) return 'Значение слишком короткое';
    else if (control.hasError('maxlength')) return 'Значение слишком длинное';
    else if (control.hasError('repeat')) return 'Значения не совпадают';

    return '';
  }

  onNoClick(result: boolean = false): void {
    this.dialogRef.close(result);
  }

  onSubmit(): void {
    this.memberAdd.disable();
    this.subscription.add(this.memberService.postRoomMember(this.room.id, { fields: this.memberAdd.value }).subscribe(() => {
      this.snack.success('Участник успешно добавлен');
      this.onNoClick(true);
    }, (error) => {
      this.memberAdd.enable();
        if (error instanceof Response)
          this.snack.error(error.errorMessageCode);
        
    }));
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
  }
}
