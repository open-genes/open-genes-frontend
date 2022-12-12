import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { WordpressApiService } from '../../../core/services/api/wordpress-api.service';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { Article } from '../../../core/models/wordpress/article.model';

@Component({
  selector: 'app-wp-article',
  templateUrl: './wp-article.component.html',
  styleUrls: ['./wp-article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WpArticleComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  public showSkeletonChange: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public res: Article;

  constructor(private wpApiService: WordpressApiService, private router: Router, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getArticleBySlug(this.router.url.split('/').pop());
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getArticleBySlug(slug: string): void {
    this.wpApiService
      .getArticleBySlug(slug)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res) => {
          this.res = res[0];
          this.showSkeletonChange.next(false);
          this.cdRef.markForCheck();
        },
        (error) => {
          console.warn(error);
          this.showSkeletonChange.next(false);
          this.cdRef.markForCheck();
        }
      );
  }
}
