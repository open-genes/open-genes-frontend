import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AsyncSubject, Subject } from 'rxjs';
import { I80levelResponseArticle } from '../../../core/models/vendors-api/80level/80level.model';
import { map, takeUntil } from 'rxjs/operators';
import { EightyLevelService } from '../../../core/services/api/80level-api-service/80level-api.service';
import { environment } from '../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ArticleModalComponent } from '../../ui-components/components/modals/article-modal/article-modal.component';
import { CommonModalComponent } from '../../ui-components/components/modals/common-modal/common-modal.component';
import { SessionStorageService } from '../../../core/services/session-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesListComponent implements OnInit, OnDestroy {
  public articlesList: I80levelResponseArticle[] = [];
  public environment = environment;

  public error: number;
  public defaultAvatar = '/assets/images/avatar.png';
  public defaultCover = '/assets/images/default-article-cover.jpg';
  public pageIndex = 1;
  public articlesTotal = 0;
  public responsePagePortion: number;
  public articleTags: any[] = [];

  public showMoreButtonVisible = false;
  public isAnyArticleModalOpen = false;

  private subscription$ = new Subject();
  private oneArticleSubscription$ = new AsyncSubject();
  private httpCallsCounter = 0;
  private showOnlyForOpenGenes = true;

  @Input() isMiniMode = false;
  @Input() sliceTo: number | undefined = undefined;

  @Input() showSkeleton: boolean;
  @Output() showSkeletonChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('articleModalBody') dialogRef: TemplateRef<any>;
  @ViewChild('cantGetArticle') cantGetArticleRef: TemplateRef<any>;

  constructor(
    public translate: TranslateService,
    private router: Router,
    private readonly eightyLevelService: EightyLevelService,
    private readonly sessionStorageService: SessionStorageService,
    private readonly cdRef: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    if (this.router.url === '/') {
      if (this.sessionStorageService.getStorageValue('articles')) {
        const storageData = this.sessionStorageService.getStorageValue('articles');
        this.articlesList = storageData.articles;
        this.articlesTotal = storageData.total;
        this.showSkeletonChange.emit(false);
      } else {
        this.makeArticlesList();
      }
    } else {
      this.makeArticlesList();
    }
  }

  public showMore(): void {
    if (this.articlesTotal / this.responsePagePortion > this.pageIndex) {
      ++this.pageIndex;
      this.showSkeletonChange.emit(true)
      this.makeArticlesList();
    }
  }

  private makeArticlesList(): void {
    this.eightyLevelService
      .getArticles(
        this.showOnlyForOpenGenes ? { category: 'open-genes', page: this.pageIndex } : { page: this.pageIndex }
      )
      .pipe(takeUntil(this.subscription$))
      .subscribe(
        (data) => {
          this.handleResponse(data);
        },
        (error) => {
          this.error = error;
          this.showSkeletonChange.emit(false);
        }
      );
  }

  private handleResponse(data): void {
    this.articlesList.push(...data.articles.items);
    this.articlesTotal = data.articles.total;
    if (this.router.url === '/') {
      this.sessionStorageService.setStorage('articles', { articles: this.articlesList, total: +this.articlesTotal });
    }

    if (this.articlesList?.length !== 0) {
      // Set page length after checking the length of the 1st page
      this.httpCallsCounter++;
      if (this.httpCallsCounter === 1) {
        this.responsePagePortion = this.articlesList.length;
      }

      // Populate tag list avoiding duplicates
      data.articles.items.forEach((article) => {
        if (article?.tags.length !== 0) {
          this.articleTags = [...new Set(article.tags)];
        }
      });

      // Emit event to update view
      this.showSkeletonChange.emit(false)

      // Check if there is more content to show
      // and show/hide 'Show more' button
      if (this.articlesTotal / this.responsePagePortion > this.pageIndex) {
        this.showMoreButtonVisible = true;
      } else {
        this.showMoreButtonVisible = false;
      }
    }
    this.cdRef.markForCheck();
  }

  public openArticleModal(slug: string): void {
    this.isAnyArticleModalOpen = true;

    // Subscribe and get one article data
    this.eightyLevelService
      .getArticle(slug)
      .pipe(
        takeUntil(this.oneArticleSubscription$),
        map((res: any) => {
          const imageData = res.content.filter((item) => item.type === 'image-widget')[0];
          const descData = res.content.filter((item) => item.type === 'editor');
          return {
            title: res.title,
            subtitle: res.subtitle,
            image: imageData?.content.image,
            description: descData,
            slug: slug,
          };
        })
      )
      .subscribe(
        (modalData) => {
          this.cdRef.markForCheck();
          this.dialog.open(ArticleModalComponent, {
            data: {
              modalData: modalData,
            },
            panelClass: 'article-modal',
            minWidth: '320px',
            maxWidth: '768px', // TODO: make a global object with modal settings
          });
        },
        () => {
          console.error(`Can't get an article by slug ${slug}`);
          this.dialog.open(CommonModalComponent, {
            data: { title: '', body: null, template: this.cantGetArticleRef },
            panelClass: 'article-modal',
            minWidth: '320px',
            maxWidth: '768px',
          });
        }
      );
    this.isAnyArticleModalOpen = false;
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
    this.oneArticleSubscription$.unsubscribe();
  }

  // TODO: make util class
  imgErrorHandler(event: any, placeholderImg: string) {
    event.target.src = placeholderImg;
  }
}
