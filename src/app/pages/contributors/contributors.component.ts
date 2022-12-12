import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { WordpressApiService } from '../../core/services/api/wordpress-api.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Article } from '../../core/models/wordpress/article.model';

@Component({
  selector: 'app-contributors-page',
  templateUrl: './contributors.component.html',
  styleUrls: ['./contributors.component.scss'],
})
export class ContributorsComponent implements OnInit {
  public res: Article;
  private unsubscribe$ = new Subject();
  public showSkeletonChange: BehaviorSubject<boolean> = new BehaviorSubject(true);
  constructor(
    public wpApiService: WordpressApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.wpApiService
      .getArticleBySlug(this.router.url.split('/').pop())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res) => {
          this.res = res[0];
          this.showSkeletonChange.next(false);
        },
        (error) => {
          console.warn(error);
          this.showSkeletonChange.next(false);
        }
      );
  }
}
