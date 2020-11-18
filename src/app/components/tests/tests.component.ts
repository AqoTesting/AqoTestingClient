import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Room } from 'src/app/entities/room.entities';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss'],
})
export class TestsComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  roomId: string;
  tests: any[];

  constructor(private route: ActivatedRoute, private testService: TestService) {
    this.subscription.add(
      this.route.parent.params.pipe(take(1)).subscribe((params) => {
        this.roomId = params['roomId'];
      })
    );
  }

  ngOnInit(): void {
    this.getRoomTests();
  }

  getRoomTests(): void {
    this.subscription.add(
      this.testService.getRoomTests(this.roomId).subscribe((data) => {
        this.tests = data;
      })
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
