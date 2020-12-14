import {Inject, Injectable} from '@angular/core';
import {fromEvent, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';

@Injectable()
export class WindowService {
  public windowWidth$: Observable<number>;
  public scroll$: Observable<number>;

  constructor(
    @Inject(DOCUMENT) public document: Document
  ) {

    this.windowWidth$ = fromEvent(window, 'resize').pipe(
      map(event => {
        const documentElement = document.documentElement;
        const bodyElement = document.body || document.getElementsByTagName('body')[0];
        return window.innerWidth || documentElement.clientWidth || bodyElement.clientWidth;
      })
    );

    this.scroll$ = fromEvent(window, 'scroll').pipe(
      map(event => {
        return window.scrollY || this.document.documentElement.scrollTop;
      })
    );
  }

  public setWindowWidth(): Observable<number> {
    const documentElement = document.documentElement;
    const bodyElement = document.body || document.getElementsByTagName('body')[0];
    return of(window.innerWidth || documentElement.clientWidth || bodyElement.clientWidth);
  }
}


