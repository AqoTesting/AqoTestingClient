import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Response } from 'src/app/entities/response.entities';
import { Room, FieldType, RoomField } from 'src/app/entities/room.entities';
import { RoomService } from 'src/app/services/room.service';
import { SnackService } from 'src/app/services/snack.service';
import { Background } from 'src/app/utils/background.utility';
import { Location } from '@angular/common';

@Component({
  selector: 'app-room-create',
  templateUrl: './room-create.component.html',
  styleUrls: ['./room-create.component.scss'],
})
export class RoomCreateComponent implements OnInit, OnDestroy {
  roomCreate: FormGroup = this.fb.group({
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
    tags: this.fb.array([]),
  });

  subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private router: Router,
    private snackService: SnackService,
    public location: Location
  ) {
    Background.setColor('#303030');
  }

  ngOnInit(): void {}

  get fields(): FormArray {
    return this.roomCreate.get('fields') as FormArray;
  }

  getFieldOptions(field: FormGroup): FormArray {
    return field.get('options') as FormArray;
  }

  newField(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      type: [1],
      isRequired: [true],
      placeholder: [],
      mask: [],
      options: this.fb.array([]),
    });
  }

  addField() {
    this.fields.push(this.newField());
  }

  deleteField(i: number) {
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

  onSubmit() {
    this.roomCreate.disable();

    this.roomCreate.value.fields = this.roomCreate.value.fields.map(
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
      this.roomService.createRoom(this.roomCreate.value).subscribe(
        () => {
          this.snackService.success(
            `Комната <b>${this.roomCreate.value.name}</b> была успешно создана`
          );
          this.roomCreate.reset();
          this.router.navigate(['/rooms']);
        },
        (error) => {
          if (error instanceof Response)
            this.snackService.error(error.errorMessageCode);
          this.roomCreate.enable();
        }
      )
    );
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (this.roomCreate.dirty) {
      return confirm(
        'Вы уверены, что хотите покинуть страницу создания комнаты?\nВсе данные будут потеряны'
      );
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
