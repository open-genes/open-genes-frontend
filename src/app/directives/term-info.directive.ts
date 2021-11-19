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
  private terms: Terms;
  private unsubscribe$ = new Subject();
  private content: string;

  constructor(
    private http: HttpClient,
    private elementRef: ElementRef,
    private translateService: TranslateService,
    private bottomSheet: MatBottomSheet
  ) {}

  ngAfterViewInit(): void {
    this.content = this.elementRef.nativeElement.innerText;
    this.getTermsByLang();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getTermsByLang(): void {
    const lang = this.translateService.currentLang;
    this.http
      .get(environment.termsJsonUrl[lang === 'en' ? 0 : 1])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((terms: Terms) => {
        this.terms = terms;

        this.findTermAndReplaceIt();
      });
  }

  findTermAndReplaceIt(): void {
    if (!this.terms) {
      return;
    }

    Object.keys(this.terms).forEach((term) => {
      this.content = this.content.replace(
        term,
        `<span class="link link--term">${term}</span>`
      );
    });

    this.elementRef.nativeElement.innerHTML = this.content;
  }

  @HostListener('click', ['$event'])
  showTermInfo(evt): void {
    if (evt.target.className !== 'link link--term') {
      return;
    }

    const term = evt.target.textContent;
    this.bottomSheet.open(TermsComponent, {
      data: {
        term: {
          title: term,
          description: this.terms[term],
        },
      },
    });

    evt.preventDefault();
  }
}
