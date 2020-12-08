import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Response } from 'src/app/entities/response.entities';
import { Room } from 'src/app/entities/room.entities';
import { Test } from 'src/app/entities/test.entities';
import { RoomService } from 'src/app/services/room.service';
import { SnackService } from 'src/app/services/snack.service';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss'],
})
export class TestsComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  roomId: string;
  tests: Test[];

  constructor(
    private route: ActivatedRoute,
    private testService: TestService,
    private roomService: RoomService,
    private snack: SnackService
  ) {
    this.subscription.add(
      this.route.parent.params.pipe(take(1)).subscribe((params) => {
        this.roomId = params['roomId'];
      })
    );
  }

  ngOnInit(): void {
    this.updateRoomTests();
  }

  updateRoomTests(): void {
    this.subscription.add(
      this.testService
        .getTests(this.roomId)
        .pipe(take(1))
        .subscribe((data) => {
          this.tests = data;
        })
    );
  }

  deleteTest(test: Test): void {
    if (confirm(`Вы уверены, что хотите удалить тест ${test.title}?`)) {
      this.subscription.add(
        this.testService
          .deleteTest(test.id)
          .pipe(take(1))
          .subscribe(
            () => {
              this.snack.success(
                `Тест <b>${test.title}</b> был успешно удален`
              );
              this.tests = this.tests.filter((_test) => _test.id != test.id);
              this.updateRoomTests();
            },
            (error) => {
              if (error instanceof Response)
                this.snack.error(error.errorMessageCode);
            }
          )
      );
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
