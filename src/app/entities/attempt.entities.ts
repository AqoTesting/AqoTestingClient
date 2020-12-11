import { from } from 'rxjs';
import { Rank } from './test.entities';
import * as moment from 'moment';

export class Attempt {
  id: string;
  memberId: string;
  userId: string;
  testId: string;
  currentSectionId: string;
  currentQuestionId: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  ignore: boolean;

  maxPoints: number;

  correctPoints: number;
  penalPoints: number;

  penalRatio: number;
  correctRatio: number;

  calculated: CalculatedAttempt;
}

export class CalculatedAttempt {
  correctRank: Rank;
  penalRank: Rank;
  timeMinute: number = 0;
}
