import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class ImgBBService {
  imgUrl$ = new Subject();
  private button: HTMLButtonElement;

  constructor() {
    this.load();
  }

  open() {
    this.button.click();
  }

  load() {
    let body = <HTMLDivElement>document.body;

    let div = document.createElement('div');
    div.id = 'imgBBContentEditable';
    div.setAttribute('contenteditable', 'true');

    div.addEventListener('input', (e) => {
      const target: HTMLDivElement = e.target as HTMLDivElement;
      this.imgUrl$.next(target.innerText);
      target.innerHTML = '';
    });

    let button = document.createElement('button');
    button.id = 'imgBBUpload';
    button.setAttribute('data-imgbb-trigger', 'true');
    button.setAttribute('data-target', '#imgBBContentEditable');
    button.setAttribute('hidden', 'true');

    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'https://imgbb.com/upload.js';
    script.async = true;
    script.defer = true;
    script.setAttribute('data-url', 'https://imgbb.com/upload');
    script.setAttribute('data-auto-insert', 'direct-links');
    script.setAttribute('data-mode', 'manual');

    body.appendChild(div);
    this.button = button;
    body.appendChild(button);
    body.appendChild(script);
  }
}
