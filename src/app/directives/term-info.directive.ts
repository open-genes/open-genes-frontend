import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { environment } from '../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { HttpClient } from '@angular/common/http';
import { TermsComponent } from '../components/shared/terms/terms.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Terms {
  [key: string]: string;
}

@Directive({
  selector: '[appTermInfo]',
})
export class TermInfoDirective implements AfterViewInit, OnDestroy {
  private _terms: Terms;
  private _unsubscribe$ = new Subject();
  private _content: string;

  constructor(
    private _http: HttpClient,
    private _elementRef: ElementRef,
    private _translateService: TranslateService,
    private _bottomSheet: MatBottomSheet
  ) {}

  ngAfterViewInit(): void {
    this._content = this._elementRef.nativeElement.innerText;
    this.getTermsByLang();
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  getTermsByLang(): void {
    const lang = this._translateService.currentLang;
    this._http
      .get(environment.termsJsonUrl[lang === 'en' ? 0 : 1])
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((terms: Terms) => {
        this._terms = terms;

        this.findTermAndReplaceIt();
      });
  }

  findTermAndReplaceIt(): void {
    if (!this._terms) {
      return;
    }

    Object.keys(this._terms).forEach((term) => {
      this._content = this._content.replace(
        term,
        `<span class="link link--term">${term}</span>`
      );
    });

    this._elementRef.nativeElement.innerHTML = this._content;
  }

  @HostListener('click', ['$event'])
  showTermInfo(evt): void {
    if (evt.target.className !== 'link link--term') {
      return;
    }

    const term = evt.target.textContent;
    this._bottomSheet.open(TermsComponent, {
      data: {
        term: {
          title: term,
          description: this._terms[term],
        },
      },
    });

    evt.preventDefault();
  }
}
