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
import { I80levelResponseArticle } from '../../../core/models/vendorsApi/80level/80level.model';
import { map, takeUntil } from 'rxjs/operators';
import { EightyLevelService } from '../../../core/services/api/80level-api-service/80level-api.service';
import { environment } from '../../../../environments/environment';
import { MockApiService } from '../../../core/services/api/mock-api.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesListComponent implements OnInit, OnDestroy {
  public articlesList: I80levelResponseArticle[] = [];
  public environment = environment;
  public isLoading = true;
  public error: number;
  public defaultAvatar = '/assets/images/avatar.png';
  public defaultCover = '/assets/images/default-article-cover.jpg';
  public pageIndex = 1;
  public showMoreButtonVisible = false;
  public articlesTotal = 0;
  public responsePagePortion: number;
  public articleTags: any[] = [];
  public isAnyArticleModalOpen = false;

  private subscription$ = new Subject();
  private oneArticleSubscription$ = new AsyncSubject();
  private httpCallsCounter = 0;
  private showOnlyForOpenGenes = true;

  @Input() isMiniMode = false;
  @Input() sliceTo: number | undefined = undefined;
  @Output()
  newArticlesLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('articleModalBody') dialogRef: TemplateRef<any>;

  constructor(
    public translate: TranslateService,
    private readonly eightyLevelService: EightyLevelService,
    private readonly mock: MockApiService,
    private readonly cdRef: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.makeArticlesList();
  }

  public showMore(): void {
    if (this.articlesTotal / this.responsePagePortion > this.pageIndex) {
      ++this.pageIndex;
      this.isLoading = true;
      this.cdRef.markForCheck();
      this.makeArticlesList();
    }
  }

  private handleResponse(data): void {
    this.articlesList.push(...data.articles.items);
    this.articlesTotal = data.articles.total;

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
      this.newArticlesLoaded.emit(true);

      // Check if there is more content to show
      // and show/hide 'Show more' button
      if (this.articlesTotal / this.responsePagePortion > this.pageIndex) {
        this.showMoreButtonVisible = true;
      } else {
        this.showMoreButtonVisible = false;
      }
    }

    // All content is loaded
    this.isLoading = false;
    this.cdRef.markForCheck();
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
        (error) => (this.error = error)
      );
  }

  public openArticleModal(slug): void {
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
            image: imageData.content.image,
            description: descData,
          };
        })
      )
      .subscribe(
        (modalData) => {
          this.isAnyArticleModalOpen = false;
          this.cdRef.markForCheck();
          this.dialog.open(this.dialogRef, {
            data: modalData,
            panelClass: 'article-modal',
            minWidth: '320px',
            maxWidth: '768px', // TODO: make a global object with modal settings
          });
        },
        () => {
          console.warn(`Can't get an article by id ${slug}`);
          this.closeArticleModal();
        }
      );
  }

  public closeArticleModal(): void {
    this.dialog.closeAll();
    this.isAnyArticleModalOpen = false;
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
    this.oneArticleSubscription$.unsubscribe();
  }

  imgErrorHandler(event: any, placeholderImg: string) {
    event.target.src = placeholderImg;
  }
}
