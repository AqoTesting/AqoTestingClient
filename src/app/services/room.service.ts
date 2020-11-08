import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Room, GetRoomsItem } from '../entities/room.entities';

@Injectable()
export class RoomService {
  constructor(private http: HttpClient) {}

  getUserRooms(): Observable<GetRoomsItem[]> {
    return this.http.get<GetRoomsItem[]>(environment.apiUrl + '/user/rooms');
  }

  getUserRoomById(roomId: string): Observable<Room> {
    return this.http.get<Room>(environment.apiUrl + '/user/room/' + roomId);
  }

  createRoom(room: Room): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/user/room', room);
  }

  editRoom(roomId: string, room: Room): Observable<any> {
    return this.http.put<any>(
      environment.apiUrl + '/user/room/' + roomId,
      room
    );
  }

  deleteRoomById(roomId: string): Observable<any> {
    return this.http.delete<any>(environment.apiUrl + '/user/room/' + roomId);
  }
}
