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
import { RoomField } from 'src/app/entities/room.entities';
import { SnackService } from 'src/app/services/snack.service';
import { MembersComponent } from './members.component';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss'],
})
export class AddMemberComponent implements OnInit, OnDestroy {
  memberAdd: FormGroup = this.fb.group({});

  constructor(
    public dialogRef: MatDialogRef<MembersComponent>,
    @Inject(MAT_DIALOG_DATA) public fields: RoomField[],
    private fb: FormBuilder,
    private snack: SnackService
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
    setTimeout(() => {
      if (false) {
        this.memberAdd.enable();
        this.snack.fatal('Что-то пошло не так...');
      } else {
        console.log(this.memberAdd.value);
        this.snack.success('Участник успешно добавлен');
        this.onNoClick(true);
      }
    }, 1500);
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
  }
}