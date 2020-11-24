import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PostSections, Test } from '../entities/test.entities';

@Injectable()
export class TestService {
  constructor(private http: HttpClient) {}

  getTests(roomId: string): Observable<Test[]> {
    return this.http.get<Test[]>(
      environment.apiUrl + '/user/room/' + roomId + '/tests'
    );
  }

  getTest(testId: string): Observable<Test> {
    return this.http.get<Test>(environment.apiUrl + '/user/test/' + testId);
  }

  postTest(roomId: string, test: Test): Observable<{ testId: number }> {
    return this.http.post<{ testId: number }>(
      environment.apiUrl + '/user/room/' + roomId + '/test',
      test
    );
  }

  putTest(testId: string, test: Test): Observable<any> {
    return this.http.put<any>(
      environment.apiUrl + '/user/test/' + testId,
      test
    );
  }

  patchSections(testId: string, sections: PostSections): Observable<any> {
    return this.http.patch<any>(
      environment.apiUrl + '/user/test/' + testId + '/sections',
      sections
    );
  }

  deleteTest(testId: string): Observable<any> {
    return this.http.delete<any>(environment.apiUrl + '/user/test/' + testId);
  }
}
