import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class TestService {
  constructor(private http: HttpClient) {}

  getRoomTests(roomId: string): Observable<any[]> {
    return this.http.get<any[]>(
      environment.apiUrl + '/user/room/' + roomId + '/tests'
    );
  }
}
