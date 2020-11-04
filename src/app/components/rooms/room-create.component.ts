import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CreateRoom } from 'src/app/entities/room.entities';

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-room-create',
  templateUrl: './room-create.component.html',
  styleUrls: ['./room-create.component.scss'],
})
export class RoomCreateComponent implements OnInit {
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
    isRegistrationAllowed: [true],
    isCheckManually: [false],
    description: ['', [Validators.maxLength(4096)]],

    fields: this.fb.array([]),
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    setInterval(() => {
      console.log(this.roomCreate.value);
    }, 5000);
  }

  get fields(): FormArray {
    return this.roomCreate.get('fields') as FormArray;
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
    console.log(this.roomCreate.value);
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
}
