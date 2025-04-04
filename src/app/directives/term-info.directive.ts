import { AfterViewInit, Directive, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { environment } from '../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { HttpClient } from '@angular/common/http';
import { TermHintComponent } from '../components/shared/terms/term-hint.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AliasTerm, BasicTerm, Terms } from '../core/models/terms.model';
import { SettingsService } from '../core/services/settings.service';

@Directive({
  selector: '[appTermInfo]',
})
export class TermInfoDirective implements AfterViewInit, OnDestroy {
  private isApplicable = true;
  private terms: Terms;
  private unsubscribe$ = new Subject();
  private content: string;

  constructor(
    private settingsService: SettingsService,
    private http: HttpClient,
    private elementRef: ElementRef,
    private translateService: TranslateService,
    private bottomSheet: MatBottomSheet
  ) {
    const retrievedSettings = this.settingsService.getSettings();
    this.isApplicable = retrievedSettings.showUiHints;
  }

  ngAfterViewInit(): void {
    if (!this.isApplicable) {
      return;
    }
    this.content = this.elementRef.nativeElement.innerHTML;
    this.getTermsByLang();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getTermsByLang(): void {
    const lang = this.translateService.currentLang;
    this.http
      .get(environment.termsJsonUrl[lang])
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
      this.content = this.content.replace(` ${term} `, ` <span class="link link--term">${term}</span> `);
    });

    this.elementRef.nativeElement.innerHTML = this.content;
  }

  @HostListener('click', ['$event'])
  showTermInfo(evt): void {
    if (evt.target.className !== 'link link--term') {
      return;
    }

    const term = evt.target.textContent;
    let description = {};

    if (this.terms[term] as AliasTerm | BasicTerm) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.terms[term].hasOwnProperty('alias')) {
        description = Object.keys(this.terms).filter((item: any) => {
          return item.title === this.terms.alias;
        });
      } else {
        description = this.terms[term];
      }
    }

    this.bottomSheet.open(TermHintComponent, {
      data: {
        term: {
          ...description,
        },
      },
    });

    evt.preventDefault();
  }
}
