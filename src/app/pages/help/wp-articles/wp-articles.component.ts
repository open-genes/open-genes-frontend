import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output,
} from '@angular/core';
import { WordpressApiService } from '../../../core/services/api/wordpress-api.service';
import { Articles } from '../../../core/models/wordpress/articles.model';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Pagination } from '../../../core/models/settings.model';

@Component({
  selector: 'app-wp-articles',
  templateUrl: './wp-articles.component.html',
  styleUrls: ['./wp-articles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WpArticlesComponent implements OnInit, OnDestroy {
  @Input() showSkeleton: boolean;
  @Output() showSkeletonChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public articlesList: Articles[] = [];
  public articleTags: any[] = [];
  public pagination: Pagination = {
    page: 1,
    pageSize: 20,
  };
  public showMoreButtonVisible = false;
  private unsubscribe$ = new Subject();
  // Slugs of articles which are required on a website but should be hidden in a main list
  private hiddenArticles = ['cookies-policy', 'donate-us'];

  constructor(private wpApiService: WordpressApiService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getArticles(this.pagination);
  }

  private getArticles(pagination: Pagination): void {
    this.wpApiService
      .getCategories('en')
      .pipe(
        switchMap((categories) => {
          return this.wpApiService.getArticlesByCategoryId(categories[0].id, pagination);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        (articles) => {
          // Populate tag list avoiding duplicates
          articles.forEach((article) => {
            // Populate articles array avoiding duplicates
            if (!this.hiddenArticles.includes(article.slug)) {
              this.articlesList.push(article);
            }

            // Populate tag array avoiding duplicates
            if (article?.tags.length !== 0) {
              this.articleTags = [...new Set(article.tags)];
            }
          });

          this.showSkeletonChange.emit(false);
          this.cdRef.markForCheck();
        },
        (error) => {
          console.warn(error);
          this.showSkeletonChange.emit(false);
          this.cdRef.markForCheck();
        }
      );
  }

  public showMore(): void {
    this.pagination.page++;
    this.getArticles(this.pagination);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
