import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export class ImgBBResponse {
  data: any;
  status: number;
  success: boolean;
}

@Injectable()
export class ImgBBService {
  private http: HttpClient;

  constructor(private handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  upload(file: File): Observable<ImgBBResponse> {
    const formData: FormData = new FormData();
    formData.append('key', environment.imgbbKey);
    formData.append('image', file, file.name);
    formData.append('name', file.name);

    return this.http.post<ImgBBResponse>(
      'https://api.imgbb.com/1/upload',
      formData
    );
  }
}
