import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class ImgBBService {
  imgUrl$ = new Subject();

  constructor() {
    this.load();
  }

  load() {
    let body = <HTMLDivElement>document.body;

    let div = document.createElement('div');
    div.id = 'imgBBContentEditable';
    div.setAttribute('contenteditable', 'true');

    div.addEventListener('input', (e) => {
      const target: HTMLDivElement = e.target as HTMLDivElement;
      console.log(e);
      this.imgUrl$.next(target.innerText);
      target.innerHTML = '';
    });

    let button = document.createElement('button');
    button.id = 'imgBBUpload';
    button.setAttribute('data-imgbb-trigger', 'true');
    button.setAttribute('data-target', '#imgBBContentEditable');

    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'https://imgbb.com/upload.js';
    script.async = true;
    script.defer = true;
    script.setAttribute('data-url', 'https://imgbb.com/upload');
    script.setAttribute('data-auto-insert', 'direct-links');
    script.setAttribute('data-mode', 'manual');

    body.appendChild(div);
    body.appendChild(button);
    body.appendChild(script);
  }
}
