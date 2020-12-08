import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Attempt } from '../entities/attempt.entities';

@Injectable()
export class AttemptService {
  constructor(private http: HttpClient) {}

  getAttemptByTestId(testId: string): Observable<Attempt[]> {
    return this.http.get<Attempt[]>(
      environment.apiUrl + '/user/test/' + testId + '/attempts'
    );
  }


}
