import { Color } from '@angular-material-components/color-picker';

export class Test {
  id?: string;
  roomId?: string;
  userId?: string;
  title: string;
  description: string;
  documents: Document[];
  isActive: boolean = false;
  showAllSections: boolean = true;
  finalResultCalculationMethod: FinalResultCalculationMethod;
  attemptSectionsNumber: number = 0;
  creationDate: string;
  activationDate: string;
  deactivationDate: string;
  shuffle: boolean = false;
  ranks: Rank[];
  sections: Section[];
}

export class PostSections {
  constructor(sections: Section[]) {
    this.sections = sections;
  }
  sections: Section[];
}

export class Document {
  title: string;
  link: string;
}

export class Rank {
  minimumSuccessRatio: number;
  title: string;
  backgroundColor: string | Color;
}

export class Section {
  deleted?: boolean = false;
  local?: boolean = false;
  title?: string;
  showAllQuestions?: boolean = true;
  questions?: Question[];
  attemptQuestionsNumber?: number = 0;
  shuffle?: boolean = false;
  weight?: number = 0;
}

export class Question {
  deleted?: boolean = false;
  local?: boolean = false;
  type?: QuestionTypes;
  text?: string;
  imageUrl?: string;
  cost?: number = 1;
  weight?: number = 0;
  options?: CommonOption[];
}

export enum FinalResultCalculationMethod {
  Average = 0,
  Best = 1,
}

export enum QuestionTypes {
  SingleChoice = 0,
  MultipleChoice = 1,
  Matching = 2,
  Sequence = 3,
  FillIn = 4,
}

export class CommonOption {
  isCorrect?: boolean = false;
  text?: string;
  imageUrl?: string;
  rightText?: string;
  rightImageUrl?: string;
  leftText?: string;
  leftImageUrl?: string;
}
