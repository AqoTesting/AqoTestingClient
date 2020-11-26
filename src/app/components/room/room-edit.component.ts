import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'protractor';
import { Observable, Subscription } from 'rxjs';
import { Room, FieldType, RoomField } from 'src/app/entities/room.entities';
import { RoomService } from 'src/app/services/room.service';
import { SnackService } from 'src/app/services/snack.service';
import { Background } from 'src/app/utils/background.utility';
import { Response } from 'src/app/entities/response.entities';
import { Location } from '@angular/common';

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

  subscription: Subscription = new Subscription();
  roomId: string;
  room: Room;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private roomService: RoomService,
    private router: Router,
    private snackService: SnackService,
    public location: Location
  ) {
    Background.setColor('#303030');
    this.subscription.add(
      this.route.params.subscribe((params) => {
        this.roomId = params['roomId'];
      })
    );
  }

  ngOnInit(): void {
    this.getRoom();
  }

  getRoom() {
    this.roomEdit.disable();
    this.subscription.add(
      this.roomService.getUserRoomById(this.roomId).subscribe(
        (data: Room) => {
          delete data.id;
          delete data.userId;

          this.room = data;
          this.initForm();
          this.roomEdit.enable();
        },
        () => {
          this.roomEdit.enable();
        }
      )
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
      isRequired: [true, Validators.required],
      placeholder: [null],
      mask: [null],
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
    this.roomEdit.markAsDirty();
    return this.getFieldOptions(field).removeAt(i);
  }

  initForm() {
    this.room.fields.forEach((field) => {
      const _field = this.addField();
      if (field.type == FieldType.Select) {
        field.options.forEach(() => this.addFieldOption(_field));
      } else {
        field.options = [];
      }
    });
    this.roomEdit.setValue(this.room);
    this.roomEdit.markAsPending();
  }

  onSubmit() {
    this.roomEdit.disable();

    this.roomEdit.value.fields = this.roomEdit.value.fields.map(
      (filed: RoomField) => {
        switch (filed.type) {
          case FieldType.Input:
            delete filed.options;
            break;

          case FieldType.Select:
            delete filed.placeholder;
            delete filed.mask;
            break;
        }

        return filed;
      }
    );

    this.subscription.add(
      this.roomService.editRoom(this.roomId, this.roomEdit.value).subscribe(
        () => {
          this.snackService.success(
            `Комната <b>${this.roomEdit.value.name}</b> была успешно изменена`
          );
          this.roomEdit.reset();
          this.router.navigate(['/rooms']);
        },
        (error) => {
          if (error instanceof Response)
            this.snackService.error(error.errorMessageCode);
          this.roomEdit.enable();
        }
      )
    );
  }

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
    if (this.subscription) this.subscription.unsubscribe();
  }
}
