import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { attempt } from 'lodash';
import { BehaviorSubject, interval, ReplaySubject, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { Attempt, CalculatedAttempt } from 'src/app/entities/attempt.entities';
import {
  Dictionary,
  CalculatedMember,
  Member,
} from 'src/app/entities/member.entities';
import { Room } from 'src/app/entities/room.entities';
import {
  FinalResultCalculationMethod,
  Rank,
  Test,
} from 'src/app/entities/test.entities';
import { AttemptService } from 'src/app/services/attempt.service';
import { MemberService } from 'src/app/services/member.service';
import { RoomService } from 'src/app/services/room.service';
import { TestService } from 'src/app/services/test.service';
import * as moment from 'moment';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { FormControl } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';
import { ToFixedPipe } from 'src/app/pipes/to-fixed.pipe';

class AverageCalculated {
  timeMinute: number = 0;
  totalBlurTime: number = 0;
  correctRank: Rank = undefined;
  penalRank: Rank = undefined;
  correctRatio: number = 0;
  penalRatio: number = 0;
}

@Component({
  selector: 'app-test-results',
  templateUrl: './test-results.component.html',
  styleUrls: ['./test-results.component.scss'],
})
export class TestResultsComponent implements OnInit, OnDestroy {
  testId: string;
  subscription: Subscription = new Subscription();

  openedMemberIndex: number = -1;

  fieldsKeys: string[] = [];
  filtred: Dictionary<FormControl> = {};

  averageCalculated: AverageCalculated = new AverageCalculated();

  room: Room;
  private test$: BehaviorSubject<Test> = new BehaviorSubject<Test>(undefined);
  private attempts$: BehaviorSubject<Attempt[]> = new BehaviorSubject<
    Attempt[]
  >(undefined);

  members: Member[];
  get test(): Test {
    return this.test$.value;
  }
  get attempts(): Attempt[] {
    return this.attempts$.value;
  }

  constructor(
    private route: ActivatedRoute,
    private testService: TestService,
    private roomService: RoomService,
    private memberService: MemberService,
    private attemptService: AttemptService,
    private toFixed: ToFixedPipe
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
        this.initFiltre();
        this.getData();
        this.subscription.add(
          interval(5000).subscribe(() => {
            this.getMembers();
            this.getAttempts();
          })
        );
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
        .getTestInfo(this.testId)
        .pipe(take(1))
        .subscribe((test: Test) => {
          this.test$.next(test);
        })
    );
  }

  getMembers(): void {
    this.subscription.add(
      this.memberService
        .getRoomMembers(this.room.id)
        .pipe(take(1))
        .subscribe((members: Member[]) => {
          this.calculateMembers(members);
        })
    );
  }

  getAttempts(): void {
    this.subscription.add(
      this.attemptService
        .getAttemptByTestId(this.testId)
        .pipe(take(1))
        .subscribe((attempts: Attempt[]) => {
          this.attempts$.next(attempts);
        })
    );
  }

  calculateMembers(members: Member[]): void {
    this.subscription.add(
      this.test$
        .pipe(filter((test) => test != undefined))
        .pipe(take(1))
        .subscribe((test: Test) => {
          this.subscription.add(
            this.attempts$
              .pipe(filter((attempts) => attempts != undefined))
              .pipe(take(1))
              .subscribe((attempts: Attempt[]) => {
                let membersWithAttempts = 0;
                this.averageCalculated = new AverageCalculated();

                members.forEach((member) => {
                  member.attempts = attempts.filter(
                    (attempt) =>
                      attempt.memberId == member.id && !attempt.isActive
                  );

                  member.calculated = new CalculatedMember();
                  member.attempts
                    .filter((attempt) => !attempt.ignore)
                    .forEach((attempt: Attempt) => {
                      attempt.calculated = new CalculatedAttempt();
                      let startTime = moment(attempt.startDate),
                        endTime = moment(attempt.endDate);
                      let diff = endTime.diff(startTime, 'minute');

                      attempt.calculated.timeMinute = diff;
                      member.calculated.timeMinute += diff;

                      member.calculated.totalBlurTime += attempt.totalBlurTime;

                      switch (this.test.finalResultCalculationMethod) {
                        case FinalResultCalculationMethod.Best:
                          if (
                            member.calculated.correctPoints <
                            attempt.correctPoints
                          ) {
                            member.calculated.correctPoints =
                              attempt.correctPoints;
                            member.calculated.penalPoints = attempt.penalPoints;
                            member.calculated.correctRatio =
                              attempt.correctRatio;
                            member.calculated.penalRatio = attempt.penalRatio;
                          }
                          break;
                        case FinalResultCalculationMethod.Average:
                          member.calculated.correctPoints +=
                            attempt.correctPoints;
                          member.calculated.penalPoints += attempt.penalPoints;
                          member.calculated.correctRatio +=
                            attempt.correctRatio;
                          member.calculated.penalRatio += attempt.penalRatio;
                          break;
                      }

                      if (test.ranks.length) {
                        attempt.calculated.correctRank = this.getRankByRatio(
                          attempt.correctRatio
                        );
                        attempt.calculated.penalRank = this.getRankByRatio(
                          attempt.correctRatio - attempt.penalRatio
                        );
                      }
                    });

                  if (member.attempts.length) {
                    member.calculated.timeMinute /= member.attempts.length;
                    member.calculated.totalBlurTime /= member.attempts.length;
                    membersWithAttempts++;
                    this.averageCalculated.totalBlurTime +=
                      member.calculated.totalBlurTime;
                    this.averageCalculated.timeMinute +=
                      member.calculated.timeMinute;
                    this.averageCalculated.correctRatio +=
                      member.calculated.correctRatio;
                    this.averageCalculated.penalRatio +=
                      member.calculated.penalRatio;

                    switch (this.test.finalResultCalculationMethod) {
                      case FinalResultCalculationMethod.Best:
                        break;
                      case FinalResultCalculationMethod.Average:
                        member.calculated.correctPoints /=
                          member.attempts.length;
                        member.calculated.penalPoints /= member.attempts.length;
                        member.calculated.correctRatio /=
                          member.attempts.length;
                        member.calculated.penalRatio /= member.attempts.length;
                        break;
                    }

                    member.calculated.correctRate = this.toFixed.transform(
                      member.calculated.correctRatio * 100,
                      2
                    );
                    member.calculated.penalRate = this.toFixed.transform(
                      (member.calculated.correctRatio -
                        member.calculated.penalRatio) *
                        100,
                      2
                    );

                    if (test.ranks.length) {
                      member.calculated.correctRank = this.getRankByRatio(
                        member.calculated.correctRatio
                      );
                      member.calculated.penalRank = this.getRankByRatio(
                        member.calculated.correctRatio -
                          member.calculated.penalRatio
                      );
                    }
                  }
                });

                this.averageCalculated.totalBlurTime /= membersWithAttempts;
                this.averageCalculated.timeMinute /= membersWithAttempts;
                this.averageCalculated.correctRank = this.getRankByRatio(
                  this.averageCalculated.correctRatio / membersWithAttempts
                );
                this.averageCalculated.penalRank = this.getRankByRatio(
                  this.averageCalculated.penalRatio / membersWithAttempts
                );

                this.members = members.filter(
                  (member) => member.attempts.length
                );
              })
          );
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

  getRankByRatio(ratio: number): Rank {
    if (ratio < 0) ratio = 0;
    let retval: Rank;
    this.test.ranks.forEach((rank) => {
      if (ratio >= rank.minimumSuccessRatio) retval = rank;
    });
    return retval;
  }

  openOrCloseMemberAttempts(index: number): void {
    if (index == this.openedMemberIndex) {
      this.openedMemberIndex = -1;
    } else {
      this.openedMemberIndex = index;
    }
  }

  initFiltre(): void {
    this.room.fields
      .filter((filed) => filed.type == 2)
      .forEach((field) => {
        this.filtred[field.name] = new FormControl();
        this.fieldsKeys.push(field.name);
      });

    this.filtred.correct = new FormControl();
    this.filtred.penal = new FormControl();
  }

  isFilterIncludes(key: string, value: string): boolean {
    return this.filtred[key]?.value?.includes(value) || false;
  }

  isMemberNotFiltred(member: Member): boolean {
    for (const field of this.room.fields) {
      if (
        field.type == 2 &&
        this.filtred[field.name]?.value?.length &&
        !this.isFilterIncludes(field.name, member.fields[field.name])
      ) {
        return false;
      }
    }

    if (this.test.ranks.length) {
      if (
        this.filtred['correct']?.value?.length &&
        !this.isFilterIncludes('correct', member.calculated.correctRank.title)
      ) {
        return false;
      } else if (
        this.filtred['penal']?.value?.length &&
        !this.isFilterIncludes('penal', member.calculated.penalRank.title)
      ) {
        return false;
      }
    }

    return true;
  }

  saveAsExcel() {
    const header = [],
      date = new Date().toISOString();
    let countFieldTypeSelect = 0;

    this.room.fields.forEach((field) => {
      header.push(field.name);
      if (field.type == 2) countFieldTypeSelect++;
    });

    header.push('Оценка');
    header.push('Коррекция');

    const workbook = new Workbook();

    if (countFieldTypeSelect == 1) {
      this.room.fields
        .filter((field) => field.type == 2)
        .forEach((fieldSelect) => {
          fieldSelect.options.forEach((option) => {
            const worksheet = workbook.addWorksheet(option);
            let headerRow = worksheet.addRow(header);
            this.headerRowEachCell(headerRow);

            this.members
              .filter(
                (member) =>
                  member.fields[fieldSelect.name] == option &&
                  member.attempts.length
              )
              .forEach((member) => {
                const row = [];
                this.room.fields.forEach((field) => {
                  row.push(member.fields[field.name]);
                });
                row.push(member.calculated.correctRank.title);
                row.push(member.calculated.penalRank.title);
                worksheet.addRow(row);
              });

            this.worksheetAutoWidth(worksheet);
          });
        });
    } else {
      const worksheet = workbook.addWorksheet(date);
      let headerRow = worksheet.addRow(header);
      this.headerRowEachCell(headerRow);

      this.members.forEach((member) => {
        const row = [];
        this.room.fields.forEach((field) => {
          row.push(member.fields[field.name]);
        });
        worksheet.addRow(row);
      });

      this.worksheetAutoWidth(worksheet);
    }

    this.removeNullWorksheet(workbook);

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, `${this.room.name}-${this.test.title}-${date}.xlsx`);
    });
  }

  headerRowEachCell(headerRow) {
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'f2f2f2' },
        bgColor: { argb: 'f2f2f2' },
      };
      cell.border = {
        bottom: { style: 'thin' },
      };
    });
  }

  removeNullWorksheet(workbook) {
    workbook.eachSheet((worksheet) => {
      if (worksheet.rowCount < 2) workbook.removeWorksheet(worksheet.name);
    });
  }

  worksheetAutoWidth(worksheet) {
    const minWidth = 11;
    worksheet.columns.forEach((column) => {
      let dataWidth = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        dataWidth = cell.value ? cell.value.toString().length : 0;
      });
      column.width = dataWidth < minWidth ? minWidth : dataWidth + 1;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
