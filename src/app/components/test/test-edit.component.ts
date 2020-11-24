import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Response } from 'src/app/entities/response.entities';
import {
  CommonOption,
  PostSections,
  QuestionTypes,
  Section,
  Test,
} from 'src/app/entities/test.entities';
import { Observable, Subscription } from 'rxjs';
import { TestService } from 'src/app/services/test.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { SnackService } from 'src/app/services/snack.service';
import RegExpValidator from 'src/app/validators/regexp.validator';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-test-edit',
  templateUrl: './test-edit.component.html',
  styleUrls: ['./test-edit.component.scss'],
})
export class TestEditComponent implements OnInit {
  test: Test;
  subscription: Subscription = new Subscription();
  roomId: string;
  testId: string;
  testEdit: FormGroup = this.fb.group({
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
    ratingScale: this.fb.array([]),
  });

  sections: FormGroup = this.fb.group({});

  get documents(): FormArray {
    return this.testEdit.get('documents') as FormArray;
  }

  get ratingScale(): FormArray {
    return this.testEdit.get('ratingScale') as FormArray;
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
        this.testId = params['testId'];
      })
    );
  }

  ngOnInit(): void {
    this.getTest();
  }

  getTest() {
    this.subscription.add(
      this.testService.getTest(this.testId).subscribe(
        (test: Test) => {
          this.test = test;
          this.initForm();
        },
        (error) => {
          this.router.navigate(['room', this.roomId, 'tests']);
          if (error instanceof Response)
            this.snack.error(error.errorMessageCode);
        }
      )
    );
  }

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

  deleteDucument(i: number): void {
    this.testEdit.markAsDirty();
    this.documents.removeAt(i);
  }

  addRatingScale(): void {
    this.ratingScale.push(
      this.fb.group({
        name: ['', Validators.required],
        value: [null, Validators.required],
      })
    );
  }

  deleteRatingScale(i: number): void {
    this.testEdit.markAsDirty();
    this.ratingScale.removeAt(i);
  }

  addSection() {
    this.sections.addControl(
      this.getSectionKey().toString(),
      this.fb.group({
        deleted: [false],
        local: [true],
        title: [''],
        questions: this.fb.group({}),
        showAllQuestions: [{ value: true, disabled: false }],
        attemptQuestionsNumber: [1, [Validators.required, Validators.min(1)]],
        shuffle: [false],
        weight: [0],
      })
    );
  }

  deleteSection(control: string) {
    this.sections.removeControl(control);
  }

  getSectionKey(): number {
    let keys: any = this.getSectionsKeys();
    return keys?.length ? +Math.max(...keys) + 1 : 0;
  }

  getSectionsKeys(): any {
    return Object.keys(this.sections.value);
  }

  addQuestion(questions: FormGroup) {
    questions.addControl(
      this.getQuestionKey(questions).toString(),
      this.fb.group({
        deleted: [false],
        local: [true],
        type: [QuestionTypes.SingleChoice],
        text: [''],
        imageUrl: [''],
        cost: [1],
        weight: [0],
        options: this.fb.array([]),
      })
    );
  }

  deleteQuestion(questions: FormGroup, control: string) {
    questions.removeControl(control);
  }

  getQuestionKey(questions: FormGroup): number {
    let keys: any = this.getQuestionsKeys(questions);
    return keys?.length ? +Math.max(...keys) + 1 : 0;
  }

  getQuestionsKeys(questions: FormGroup): any {
    return Object.keys(questions.value);
  }

  getOptions(question: FormControl): FormArray {
    return question.get('options') as FormArray;
  }

  addOption(question: FormControl) {
    this.getOptions(question).push(
      this.fb.group({
        isCorrect: [false],
        text: [''],
        imageUrl: [''],
        rightText: [''],
        rightImageUrl: [''],
        leftText: [''],
        leftImageUrl: [''],
      })
    );
    console.log(question.value);
  }

  deleteOption(question: FormControl, options: FormArray, i: number) {
    switch (question.value.type) {
      case QuestionTypes.SingleChoice:
        break;
      case QuestionTypes.MultipleChoice:
        break;
      case QuestionTypes.Matching:
        break;
      case QuestionTypes.Sequence:
        break;
    }

    options.removeAt(i);
  }

  radioChange(question: FormControl, i: number) {
    this.getOptions(question).controls.forEach(
      (option: AbstractControl, index) => {
        if (index == i) option.patchValue({ isCorrect: true });
        else option.patchValue({ isCorrect: false });
      }
    );
  }

  checkboxChange(option: FormControl) {
    option.patchValue({ isCorrect: !option.value.isCorrect });
  }

  setShowAll(amount: FormControl, showAllSections: FormControl) {
    if (amount.valid) showAllSections.enable();
    else showAllSections.disable();
  }

  initForm() {
    delete this.test.id;
    delete this.test.roomId;
    delete this.test.ownerId;
    delete this.test.creationDate;
    // INIT SECTION
    delete this.test.sections;

    if (this.test.documents?.length) {
      this.test.documents.forEach((document) => {
        this.addDocument();
      });
    } else {
      this.test.documents = [];
    }

    if (this.test?.ratingScale?.length) {
      this.test.ratingScale.forEach((scale) => {
        this.addRatingScale();
      });
    } else {
      this.test.ratingScale = [];
    }

    if (this.test.attemptSectionsNumber) this.test.showAllSections = false;
    else {
      this.test.attemptSectionsNumber = 1;
      this.test.showAllSections = true;
    }
    /*const _field = this.addField();
      if (field.type == FieldType.Select) {
        field.options.forEach(() => this.addFieldOption(_field));
      } else {
        field.options = [];
      }*/
    this.testEdit.setValue(this.test);
    this.testEdit.markAsPending();
  }

  onTestSubmit(): void {
    this.testEdit.disable();

    const test: Test = { ...this.testEdit.value };
    const ratingScale = new Object();

    delete test.sections;

    if (test.showAllSections) test.attemptSectionsNumber = 0;
    delete test.showAllSections;

    if (!test.description?.length) delete test.description;
    if (!test.documents?.length) delete test.documents;

    if (test.ratingScale.length) {
      test.ratingScale.forEach((scale) => {
        ratingScale[scale.name] = scale.value;
      });
      test.ratingScale = ratingScale;
    }
    test.ratingScale = {};

    if (test.activationDate)
      test.activationDate = new Date(test.activationDate).toISOString();
    if (test.deactivationDate)
      test.deactivationDate = new Date(test.deactivationDate).toISOString();

    this.subscription.add(
      this.testService.putTest(this.testId, test).subscribe(
        () => {
          this.snack.success('Тест успешно изменён');
          this.testEdit.enable();
          this.testEdit.markAsPristine();
        },
        (error) => {
          this.testEdit.enable();
          if (error instanceof Response)
            this.snack.error(error.errorMessageCode);
        }
      )
    );
  }

  onSectionsSubmit() {
    this.sections.disable();
    const postSections = new PostSections(this.sections.value);

    for (let [sectionId, section] of Object.entries(postSections.sections)) {
      if (!section.deleted) delete section.deleted;
      delete section.local;

      for (let [questionId, question] of Object.entries(section.questions)) {
        if (!question.deleted) delete question.deleted;
        delete question.local;

        if (!question.imageUrl) delete question.imageUrl;

        question.options.forEach((option) => {
          switch (question.type) {
            case QuestionTypes.SingleChoice:
              if (!option.imageUrl) delete option.imageUrl;
              delete option.rightText;
              delete option.rightImageUrl;
              delete option.leftText;
              delete option.leftImageUrl;
              break;
            case QuestionTypes.MultipleChoice:
              if (!option.imageUrl) delete option.imageUrl;
              delete option.rightText;
              delete option.rightImageUrl;
              delete option.leftText;
              delete option.leftImageUrl;
              break;
            case QuestionTypes.Matching:
              if (!option.rightImageUrl) delete option.rightImageUrl;
              if (!option.leftImageUrl) delete option.leftImageUrl;
              delete option.text;
              delete option.imageUrl;
              delete option.isCorrect;
              break;
            case QuestionTypes.Sequence:
              break;
          }
        });
      }
    }

    console.log(postSections);

    this.subscription.add(
      this.testService.patchSections(this.testId, postSections).subscribe(
        (result) => {
          console.log(result);
        },
        (error) => {
          this.sections.enable();
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
    else if (control.hasError('url')) return 'Неверный формат URL';

    return '';
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (this.testEdit.dirty) {
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
