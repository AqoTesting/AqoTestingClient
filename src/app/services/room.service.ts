import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { GetRoomsItemDTO } from '../entities/room.entities';

@Injectable()
export class RoomService {
  constructor(private _http: HttpClient) {}

  getUserRooms(): Observable<GetRoomsItemDTO[]> {
    return this._http.get<GetRoomsItemDTO[]>(
      environment.apiUrl + '/user/rooms'
    );
  }

  getUserRoomById(roomId: string): Observable<GetRoomsItemDTO[]> {
    return this._http.get<GetRoomsItemDTO[]>(
      environment.apiUrl + '/user/rooms'
    );
  }
}
