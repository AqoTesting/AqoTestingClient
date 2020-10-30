import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { GetRoomsItem } from '../entities/room.entities';

@Injectable()
export class RoomService {
  constructor(private _http: HttpClient) {}

  getUserRooms(): Observable<GetRoomsItem[]> {
    return this._http.get<GetRoomsItem[]>(
      environment.apiUrl + '/user/rooms'
    );
  }

  getUserRoomById(roomId: string): Observable<GetRoomsItem[]> {
    return this._http.get<GetRoomsItem[]>(
      environment.apiUrl + '/user/rooms'
    );
  }
}
