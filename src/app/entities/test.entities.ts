export class Test {
  id?: string;
  roomId?: string;
  ownerId?: string;
  title: string;
  description: string;
  documents: Document[];
  isActive: boolean = false;
  showAllSections: boolean = true;
  attemptSectionsNumber: number = 0;
  creationDate: string;
  activationDate: string;
  deactivationDate: string;
  shuffle: boolean = false;
  ratingScale: any = {};
  sections: any[];
}

export class Document {
  title: string;
  link: string;
}

export class Section {
  deleted: boolean = false;
  local: boolean = false;
  title: string;
  showAllQuestions: boolean = true;
  questions: Question[];
  attemptQuestionsNumber: number = 0;
  shuffle: boolean = false;
  weight: number = 0;
}

export class Question {
  deleted: boolean = false;
  local: boolean = false;
  type: QuestionTypes;
  text: string;
  imageUrl: string;
  cost: number = 1;
  weight: number = 0;
}

export enum QuestionTypes {
  SingleChoice = 0,
  MultipleChoice = 1,
  Matching = 2,
  Sequence = 3,
}

export class CommonOption {
  isCorrect: boolean = false;
  text: string;
  imageUrl: string;
  rightText: string;
  rightImageUrl: string;
  leftText: string;
  leftImageUrl: string;
}
