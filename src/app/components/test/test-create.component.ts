import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Response } from 'src/app/entities/response.entities';
import { Test } from 'src/app/entities/test.entities';
import { Observable, Subscription } from 'rxjs';
import { TestService } from 'src/app/services/test.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { SnackService } from 'src/app/services/snack.service';
import RegExpValidator from 'src/app/validators/regexp.validator';
import { Color } from '@angular-material-components/color-picker';

@Component({
  selector: 'app-test-create',
  templateUrl: './test-create.component.html',
  styleUrls: ['./test-create.component.scss'],
})
export class TestCreateComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  roomId: string;
  testCreate: FormGroup = this.fb.group({
    title: [
      '',
      [Validators.required, Validators.minLength(1), Validators.maxLength(64)],
    ],
    description: ['', [Validators.minLength(1), Validators.maxLength(4096)]],
    documents: this.fb.array([]),
    attemptsNumber: [1, [Validators.required, Validators.min(1)]],
    finalResultCalculationMethod: [0],
    showAllSections: [{ value: true, disabled: false }],
    attemptSectionsNumber: [1, [Validators.required, Validators.min(1)]],
    isActive: [false],
    activationDate: [null],
    deactivationDate: [null],
    shuffle: [false],
    ranks: this.fb.array([]),
    timeLimit: [0, [Validators.required, Validators.min(0)]],
  });

  get documents(): FormArray {
    return this.testCreate.get('documents') as FormArray;
  }

  get ranks(): FormArray {
    return this.testCreate.get('ranks') as FormArray;
  }

  @ViewChild('pickerActivation') pickerActivation: any;
  @ViewChild('pickerDeactivation') pickerDeactivation: any;
  get now(): Date {
    return new Date();
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    private fb: FormBuilder,
    private snack: SnackService,
    private testService: TestService
  ) {
    this.subscription.add(
      this.route.params.pipe(take(1)).subscribe((params) => {
        this.roomId = params['roomId'];
      })
    );
  }

  ngOnInit(): void {}

  addDocument(): void {
    this.documents.push(
      this.fb.group({
        title: ['', Validators.required],
        link: [
          '',
          [
            Validators.required,
            RegExpValidator(
              /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
              'url'
            ),
          ],
        ],
      })
    );
  }

  timeLimitChange() {
    const timeLimit = this.testCreate.get('timeLimit');
    if (timeLimit.value) {
      timeLimit.setValue(0);
    } else {
      timeLimit.setValue(60);
    }
    timeLimit.markAsDirty();
  }

  deleteDucument(i: number): void {
    this.documents.removeAt(i);
  }

  addRank(color = new Color(255, 255, 255)): void {
    this.ranks.push(
      this.fb.group({
        title: ['', Validators.required],
        minimumScore: [1, Validators.required],
        color: [color, Validators.required],
      })
    );
  }

  deleteRank(i: number): void {
    this.ranks.removeAt(i);
  }

  setShowAllSections(amount: FormControl, showAllSections: FormControl) {
    if (amount.valid) showAllSections.enable();
    else showAllSections.disable();
  }

  onSubmit(): void {
    this.testCreate.disable();

    const test: Test = { ...this.testCreate.value };
    const ratingScale = new Object();

    if (test.showAllSections) test.attemptSectionsNumber = 0;
    delete test.showAllSections;

    if (!test.description.length) delete test.description;
    if (test.ranks.length)
      test.ranks.forEach((rank: any) => {
        rank.color = rank.color.hex;
      });

    if (test.activationDate)
      test.activationDate = new Date(test.activationDate).toISOString();
    if (test.deactivationDate)
      test.deactivationDate = new Date(test.deactivationDate).toISOString();

    this.subscription.add(
      this.testService.postTest(this.roomId, test).subscribe(
        ({ testId }) => {
          this.router.navigate(['room', this.roomId, 'test', 'edit', testId]);
        },
        (error) => {
          this.testCreate.enable();
          if (error instanceof Response)
            this.snack.error(error.errorMessageCode);
        }
      )
    );
  }

  getErrorMessage(control: FormControl) {
    if (control.hasError('required')) return 'Введите значение';
    else if (control.hasError('minlength')) return 'Значение слишком короткое';
    else if (control.hasError('maxlength')) return 'Значение слишком длинное';
    else if (control.hasError('repeat')) return 'Значения не совпадают';

    return '';
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (this.testCreate.dirty) {
      return confirm(
        'Вы уверены, что хотите покинуть страницу создания теста?\nВсе данные будут потеряны'
      );
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
