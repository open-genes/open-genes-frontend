import { Injectable, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginatorIntl } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl implements OnDestroy {
  private unsubscribe$ = new Subject();
  private of_label = 'of';

  constructor(private translate: TranslateService) {
    super();
    this.translate.onLangChange
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getAndInitTranslations();
      });

    this.getAndInitTranslations();
  }

  private getAndInitTranslations() {
    this.translate
      .get(['items_per_page', 'next_page', 'prev_page', 'of_label'])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((translation) => {
        this.itemsPerPageLabel = translation['items_per_page'];
        this.nextPageLabel = translation['next_page'];
        this.previousPageLabel = translation['prev_page'];
        this.of_label = translation['of_label'];
        this.changes.next();
      });
  }

  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 ${this.of_label} ${length}`;
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} ${this.of_label} ${length}`;
  };

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
