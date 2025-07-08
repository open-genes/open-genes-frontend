import { Inject, Injectable } from '@angular/core';
import { fromEvent, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class WindowService {
  public windowWidth$: Observable<number>;
  public scroll$: Observable<number>;
  public scrollPercentage$: Observable<number>;

  constructor(@Inject(DOCUMENT) public document: Document) {
    this.windowWidth$ = fromEvent(window, 'resize').pipe(
      map(() => {
        const documentElement = document.documentElement;
        const bodyElement =
          document.body || document.getElementsByTagName('body')[0];
        return (
          window.innerWidth ||
          documentElement.clientWidth ||
          bodyElement.clientWidth
        );
      })
    );

    this.scroll$ = fromEvent(window, 'scroll').pipe(
      map(() => window.scrollY || this.document.documentElement.scrollTop)
    );

    this.scrollPercentage$ = fromEvent(window, 'scroll').pipe(
      map(() => window.scrollY || this.document.documentElement.scrollTop),
      tap((scrollPosition) => {
        const totalHeight = this.document.documentElement.scrollHeight - this.document.documentElement.clientHeight;
        const scrollPercentage = (scrollPosition / totalHeight) * 100;
        return of(scrollPercentage);
      })
    );
  }

  public setWindowWidth(): Observable<number> {
    const documentElement = document.documentElement;
    const bodyElement =
      document.body || document.getElementsByTagName('body')[0];
    return of(
      window.innerWidth ||
        documentElement.clientWidth ||
        bodyElement.clientWidth
    );
  }
}
