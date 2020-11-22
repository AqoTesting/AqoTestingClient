import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CreateTest } from 'src/app/entities/test.entities';

@Component({
  selector: 'app-test-create',
  templateUrl: './test-create.component.html',
  styleUrls: ['./test-create.component.scss'],
})
export class TestCreateComponent implements OnInit, OnDestroy {
  testCreate: FormGroup = this.fb.group({
    title: [
      '',
      [Validators.required, Validators.minLength(1), Validators.maxLength(64)],
    ],
    description: ['', [Validators.minLength(1), Validators.maxLength(4096)]],
    documents: this.fb.array([]),
    numberOfAttempts: [1, [Validators.required, Validators.min(1)]],
    finalScore: [0],
    showAllSections: [{ value: true, disabled: false }],
    amount: [1, [Validators.required, Validators.min(1)]],
    isActive: [false],
    activationDate: [null],
    deactivationDate: [null],
    shuffle: [false],
    ratingScale: this.fb.array([]),
  });

  get documents(): FormArray {
    return this.testCreate.get('documents') as FormArray;
  }

  get ratingScale(): FormArray {
    return this.testCreate.get('ratingScale') as FormArray;
  }

  @ViewChild('pickerActivation') pickerActivation: any;
  @ViewChild('pickerDeactivation') pickerDeactivation: any;
  get now(): Date {
    return new Date();
  }

  constructor(public location: Location, private fb: FormBuilder) {}

  ngOnInit(): void {}

  addDocument(): void {
    this.documents.push(
      this.fb.group({
        name: ['', Validators.required],
        value: ['', Validators.required],
      })
    );
  }

  deleteDucument(i: number): void {
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
    this.ratingScale.removeAt(i);
  }

  setShowAllSections(amount: FormControl, showAllSections: FormControl) {
    if (amount.valid) showAllSections.enable();
    else showAllSections.disable();
  }

  onSubmit(): void {
    const test: CreateTest = { ...this.testCreate.value };
    const documents = new Object();
    const ratingScale = new Object();

    if (test.documents.length) {
      test.documents.forEach((document) => {
        documents[document.name] = document.value;
      });
      test.documents = documents;
    }

    if (test.ratingScale.length) {
      test.ratingScale.forEach((scale) => {
        ratingScale[scale.name] = scale.value;
      });
      test.ratingScale = ratingScale;
    }

    if (test.activationDate)
      test.activationDate = new Date(test.activationDate).toISOString();
    if (test.deactivationDate)
      test.deactivationDate = new Date(test.deactivationDate).toISOString();

    console.log(test);
  }

  ngOnDestroy() {}
}
