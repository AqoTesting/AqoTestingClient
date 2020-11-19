import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../entities/member.entities';

@Injectable()
export class MemberService {
  constructor(private http: HttpClient) {}

  getRoomMembers(roomId: string): Observable<Member[]> {
    return this.http.get<Member[]>(
      environment.apiUrl + '/user/room/' + roomId + '/members'
    );
  }

  postRoomMember(roomId: string, fields: any): Observable<any> {
    return this.http.post<any>(
      environment.apiUrl + '/user/room/' + roomId + '/member',
      fields
    );
  }

  memberApprove(memberId: string): Observable<any> {
    return this.http.patch<any>(environment.apiUrl + '/user/member/' + memberId + '/approve', "");
  }

  memberUnregister(memberId: string): Observable<any> {
    return this.http.patch<any>(environment.apiUrl + '/user/member/' + memberId + '/unregister', "");
  }
}
