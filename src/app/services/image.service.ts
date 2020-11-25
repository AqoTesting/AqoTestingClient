import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ImgBBResponse, ImgBBService } from './imgbb.service';

@Injectable()
export class ImageService {
  private http: HttpClient;

  constructor(private imgbb: ImgBBService) {}

  upload(file: File): Observable<ImgBBResponse> {
    return this.imgbb.upload(file);
  }
}
