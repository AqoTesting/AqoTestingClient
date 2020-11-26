import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { cloneAbstractControl } from 'src/app/utils/clone-abstract-control.utility';
import { ImageService } from 'src/app/services/image.service';
import { ImgBBResponse } from 'src/app/services/imgbb.service';
import { HttpErrorResponse } from '@angular/common/http';

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
    private testService: TestService,
    private image: ImageService,
    private cdr: ChangeDetectorRef
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

  addSection(
    local: boolean = true,
    id: string = this.getSectionKey().toString()
  ) {
    this.sections.addControl(
      id,
      this.fb.group({
        deleted: [false],
        local: [local],
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
    let section = this.sections.get(control) as FormGroup;
    if (!section.value.local) section.patchValue({ deleted: true });
    else this.sections.removeControl(control);
    section.markAsDirty();
  }

  getSectionKey(): number {
    let keys: any = this.getSectionsKeys();
    return keys?.length ? +Math.max(...keys) + 1 : 0;
  }

  getSectionsKeys(): any {
    return Object.keys(this.sections.value);
  }

  addQuestion(
    questions: FormGroup,
    local: boolean = true,
    id: string = this.getQuestionKey(questions).toString()
  ) {
    questions.addControl(
      id,
      this.fb.group({
        deleted: [false],
        local: [local],
        type: [QuestionTypes.SingleChoice],
        text: [''],
        imageUrl: [null],
        cost: [1],
        weight: [0],
        options: this.fb.array([]),
        shuffle: [false],
      })
    );
  }

  deleteQuestion(questions: FormGroup, control: string) {
    let question = questions.get(control) as FormControl;
    question.markAsDirty();
    if (!question.value.local) question.patchValue({ deleted: true });
    else questions.removeControl(control);
  }

  undoDelete(question: FormGroup) {
    question.patchValue({ deleted: false });
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

  addOption(question: FormControl, isCorrect: boolean = false) {
    this.getOptions(question).push(
      this.fb.group({
        isCorrect: [isCorrect],
        text: [''],
        imageUrl: [null],
        rightText: [''],
        rightImageUrl: [null],
        leftText: [''],
        leftImageUrl: [null],
      })
    );
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

    question.markAsDirty();
    options.removeAt(i);
  }

  changeQuestionType(type: QuestionTypes, question: FormControl) {
    if (type == QuestionTypes.SingleChoice) {
      let count = 0;
      this.getOptions(question).controls.forEach((option: AbstractControl) => {
        if (!count && option.value.isCorrect) count++;
        else option.patchValue({ isCorrect: false });
      });
    }
  }

  radioChange(question: FormControl, i: number) {
    this.getOptions(question).controls.forEach(
      (option: AbstractControl, index) => {
        if (index == i) option.patchValue({ isCorrect: true });
        else option.patchValue({ isCorrect: false });
      }
    );
    question.markAsDirty();
  }

  checkboxChange(option: FormControl) {
    option.patchValue({ isCorrect: !option.value.isCorrect });
    option.markAsDirty();
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
    for (let sectionId in this.test.sections) {
      this.addSection(false, sectionId);
      const questions = this.sections
        .get(sectionId)
        .get('questions') as FormGroup;

      for (let questionId in this.test.sections[sectionId].questions) {
        this.addQuestion(questions, false, questionId);

        const question = questions.get(questionId) as FormControl;
        this.test.sections[sectionId].questions[questionId].options.forEach(
          (option, index) => {
            this.addOption(question, true);
          }
        );
      }
    }

    this.sections.patchValue(this.test.sections);
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

    const postSectionsGroup: FormGroup = cloneAbstractControl(this.sections);

    for (let [sectionId, section] of Object.entries(
      postSectionsGroup.controls
    )) {
      if (section.dirty) {
        const questions = section.get('questions') as FormGroup;
        for (let [questionId, question] of Object.entries(questions.controls)) {
          if (!question.dirty) questions.removeControl(questionId);
        }
      } else {
        postSectionsGroup.removeControl(sectionId);
      }
    }

    const postSectionsValue = new PostSections(postSectionsGroup.value);

    for (let [sectionId, section] of Object.entries(
      postSectionsValue.sections
    )) {
      if (section.deleted && !section.local) {
        postSectionsValue.sections[sectionId] = { deleted: true };
        break;
      }

      if (!section.showAllQuestions) section.attemptQuestionsNumber = 0;
      delete section.showAllQuestions;
      delete section.local;

      for (let [questionId, question] of Object.entries(section.questions)) {
        if (question.deleted && !question.local) {
          section.questions[questionId] = { deleted: true };
          break;
        }

        delete question.local;

        if (!question.imageUrl) delete question.imageUrl;

        question.options.forEach((option, index, options) => {
          for (let key of Object.keys(option)) {
            if (!option[key] && option[key] !== false) option[key] = null;
          }

          const {
            isCorrect,
            text,
            imageUrl,
            rightText,
            rightImageUrl,
            leftText,
            leftImageUrl,
          } = option;
          switch (question.type) {
            case QuestionTypes.SingleChoice:
              options[index] = { isCorrect, text, imageUrl };
              break;
            case QuestionTypes.MultipleChoice:
              options[index] = { isCorrect, text, imageUrl };
              break;
            case QuestionTypes.Matching:
              options[index] = {
                leftText,
                leftImageUrl,
                rightText,
                rightImageUrl,
              };
              break;
            case QuestionTypes.Sequence:
              break;
          }
        });
      }
    }

    this.subscription.add(
      this.testService.patchSections(this.testId, postSectionsValue).subscribe(
        () => {
          this.deleteOnSectionsForm();
          this.sections.enable();
          this.sections.markAsPristine();
          this.snack.success('Данные сохранены');
        },
        (error) => {
          this.sections.enable();
          if (error instanceof Response)
            this.snack.error(error.errorMessageCode);
        }
      )
    );
  }

  deleteOnSectionsForm() {
    for (let [sectionId, section] of Object.entries(this.sections.controls)) {
      if (section.value.deleted) this.sections.removeControl(sectionId);
      else {
        const questions = section.get('questions') as FormGroup;
        for (let [questionId, question] of Object.entries(questions.controls)) {
          if (question.value.deleted) questions.removeControl(questionId);
        }
      }
    }
  }

  uploadImage(
    files: any[],
    formGroup: FormGroup,
    type: QuestionTypes = QuestionTypes.SingleChoice,
    right: boolean = false
  ) {
    this.sections.disable();
    if (files.length) {
      this.image.upload(files[0]).subscribe(
        (response: ImgBBResponse) => {
          if (
            type == QuestionTypes.SingleChoice ||
            type == QuestionTypes.MultipleChoice
          ) {
            formGroup.patchValue({ imageUrl: response.data.display_url });
          } else if (type == QuestionTypes.Matching) {
            if (right) {
              formGroup.patchValue({
                rightImageUrl: response.data.display_url,
              });
            } else {
              formGroup.patchValue({ leftImageUrl: response.data.display_url });
            }
          }
          formGroup.markAsDirty();
          this.sections.enable();
        },
        (response) => {
          this.sections.enable();
          if (response instanceof HttpErrorResponse) {
            this.snack.fatal(response.message);
          } else {
            const { error } = response;
            switch (error.code) {
              case 310:
                this.snack.fatal('Данный файл не является изображением');
                break;
              default:
                this.snack.fatal(error.code + ' - ' + error.message);
                break;
            }
          }
        }
      );
    } else {
      this.snack.fatal('Вы не выбрали файл');
    }
  }

  deleteImage(
    formGroup: FormGroup,
    type: QuestionTypes = QuestionTypes.SingleChoice,
    right: boolean = false
  ) {
    if (
      type == QuestionTypes.SingleChoice ||
      type == QuestionTypes.MultipleChoice
    ) {
      formGroup.patchValue({ imageUrl: null });
    } else if (type == QuestionTypes.Matching) {
      if (right) {
        formGroup.patchValue({
          rightImageUrl: null,
        });
      } else {
        formGroup.patchValue({ leftImageUrl: null });
      }
    }
    formGroup.markAsDirty();
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
