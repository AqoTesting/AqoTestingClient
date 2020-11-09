import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Room } from 'src/app/entities/room.entities';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss'],
})
export class TestsComponent implements OnInit, OnDestroy {
  testsSub: Subscription;
  roomId: string;

  tests: any[];

  constructor(private route: ActivatedRoute, private testService: TestService) {
    this.route.params.subscribe((params) => {
      this.roomId = params['roomId'];
    });
  }

  ngOnInit(): void {
    this.getRoomTests();
  }

  getRoomTests(): void {
    this.testsSub = this.testService
      .getRoomTests(this.roomId)
      .subscribe((data) => {
        //this.tests = data;
      });
  }

  ngOnDestroy(): void {
    if (this.testsSub) this.testsSub.unsubscribe();
  }
}
