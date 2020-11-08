import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Room, FieldType } from 'src/app/entities/room.entities';
import { RoomService } from 'src/app/services/room.service';
import { Background } from 'src/app/utils/background.utility';

@Component({
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.scss'],
})
export class RoomEditComponent implements OnInit, OnDestroy {
  roomEdit: FormGroup = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(1), Validators.maxLength(64)],
    ],
    domain: [
      '',
      [Validators.required, Validators.minLength(1), Validators.maxLength(63)],
    ],
    isActive: [true],
    isRegistrationEnabled: [true],
    isApproveManually: [false],
    description: ['', [Validators.maxLength(4096)]],

    fields: this.fb.array([]),
  });

  roomEditSub: Subscription;
  roomId: string;
  room: Room;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private roomService: RoomService
  ) {
    Background.setColor('#303030');
    this.route.params.subscribe((params) => {
      this.roomId = params['roomId'];
    });
  }

  ngOnInit(): void {
    this.getRoom();
  }

  getRoom() {
    this.roomEdit.disable();
    this.roomEditSub = this.roomService
      .getUserRoomByIdForEdit(this.roomId)
      .subscribe(
        (data: Room) => {
          this.room = data;
          console.log(this.room);
          this.initForm();
          this.roomEdit.enable();
        },
        () => {
          this.roomEdit.enable();
        }
      );
  }

  get fields(): FormArray {
    return this.roomEdit.get('fields') as FormArray;
  }

  getFieldOptions(field: FormGroup): FormArray {
    return field.get('options') as FormArray;
  }

  newField(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      type: [0],
      isRequired: [true],
      options: this.fb.array([]),
    });
  }

  addField() {
    const field = this.newField();
    this.fields.push(field);
    return field;
  }

  deleteField(i: number) {
    if (
      confirm(
        `Вы уверены, что хотите удалить данное поле?\nВ таком случае, все данные, что ввели участники в данное поле будут утеряны`
      )
    )
      this.fields.removeAt(i);
  }

  addFieldOption(field: FormGroup) {
    return this.getFieldOptions(field).push(
      new FormControl('', Validators.required)
    );
  }

  deleteFieldOption(field: FormGroup, i: number) {
    return this.getFieldOptions(field).removeAt(i);
  }

  initForm() {
    this.room.fields.forEach((field) => {
      const _field = this.addField();
      if (field.type == FieldType.Select)
        field.options.forEach(() => this.addFieldOption(_field));
    });
    this.roomEdit.setValue(this.room);
    this.roomEdit.markAsPending();
  }

  onSubmit() {
    console.log(this.roomEdit.value);
  }

  checkChanges() {}

  canDeactivate(): boolean | Observable<boolean> {
    if (this.roomEdit.dirty) {
      return confirm(
        'Вы уверены, что хотите покинуть страницу изменения комнаты?\nВсе изменения будут потеряны'
      );
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    if (this.roomEditSub) this.roomEditSub.unsubscribe();
  }
}
