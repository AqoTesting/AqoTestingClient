import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Attempt } from 'src/app/entities/attempt.entities';
import { Member } from 'src/app/entities/member.entities';
import { Room } from 'src/app/entities/room.entities';
import {
  FinalResultCalculationMethod,
  Test,
} from 'src/app/entities/test.entities';
import { AttemptService } from 'src/app/services/attempt.service';
import { MemberService } from 'src/app/services/member.service';
import { RoomService } from 'src/app/services/room.service';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-test-results',
  templateUrl: './test-results.component.html',
  styleUrls: ['./test-results.component.scss'],
})
export class TestResultsComponent implements OnInit, OnDestroy {
  testId: string;
  subscription: Subscription = new Subscription();

  room: Room;
  test: Test;
  attempts: Attempt[];
  private _members: Member[];

  get members(): Member[] {
    if (
      this._members?.length &&
      this.attempts?.length &&
      !this._members[0].attempts
    ) {
      this._members.forEach((member) => {
        member.attempts = this.attempts.filter(
          (attempt) => attempt.memberId == member.id
        );
      });
    }
    return this._members;
  }

  constructor(
    private route: ActivatedRoute,
    private testService: TestService,
    private roomService: RoomService,
    private memberService: MemberService,
    private attemptService: AttemptService
  ) {
    this.subscription.add(
      this.route.params.pipe(take(1)).subscribe((params) => {
        this.testId = params.testId;
      })
    );
  }

  ngOnInit(): void {
    this.subscription.add(
      this.roomService.room$.pipe(take(1)).subscribe((room: Room) => {
        this.room = room;
        this.getData();
      })
    );
  }

  getData(): void {
    this.getTest();
    this.getMembers();
    this.getAttempts();
  }

  getTest(): void {
    this.subscription.add(
      this.testService
        .getTest(this.testId)
        .pipe(take(1))
        .subscribe((test: Test) => {
          this.test = test;
          console.log(this.test);
        })
    );
  }

  getMembers(): void {
    this.subscription.add(
      this.memberService
        .getRoomMembers(this.room.id)
        .pipe(take(1))
        .subscribe((members: Member[]) => {
          this._members = members;
        })
    );
  }

  getAttempts(): void {
    this.subscription.add(
      this.attemptService
        .getAttemptByTestId(this.testId)
        .pipe(take(1))
        .subscribe((attempts: Attempt[]) => {
          this.attempts = attempts;
        })
    );
  }

  getPoints(member: Member): number {
    let points = 0;
    switch (this.test.finalResultCalculationMethod) {
      case FinalResultCalculationMethod.Best:
        let min = member.attempts[0].correctPoints;
        member.attempts.forEach((attempt) => {
          if (min < attempt.correctPoints) min = attempt.correctPoints;
        });
        break;
      case FinalResultCalculationMethod.Average:
        member.attempts.forEach((attempt) => {
          points += attempt.correctPoints;
        });
        points /= member.attempts.length;
        break;
    }
    return points;
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
