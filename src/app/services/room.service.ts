import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Room, GetRoomsItem } from '../entities/room.entities';

@Injectable()
export class RoomService {
  constructor(private _http: HttpClient) {}

  getUserRooms(): Observable<GetRoomsItem[]> {
    return this._http.get<GetRoomsItem[]>(environment.apiUrl + '/user/rooms');
  }

  getUserRoomById(roomId: string): Observable<Room> {
    return this._http.get<Room>(environment.apiUrl + '/user/room/' + roomId);
  }

  createRoom(room: Room): Observable<any> {
    return this._http.post<any>(environment.apiUrl + '/user/room', room);
  }

  getUserRoomByIdForEdit(roomId: string): Observable<Room> {
    return this._http.get<Room>(
      environment.apiUrl + '/user/room/' + roomId + '/edit'
    );
  }

  deleteRoomById(roomId: string): Observable<any> {
    return this._http.delete<any>(environment.apiUrl + '/user/room/' + roomId);
  }
}
