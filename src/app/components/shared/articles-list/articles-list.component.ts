import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { I80levelResponseArticle } from '../../../core/models/vendorsApi/80level/80level.model';
import { takeUntil } from 'rxjs/operators';
import { EightyLevelService } from '../../../core/services/api/80level.api.service';
import { environment } from '../../../../environments/environment';
import { MockApiService } from '../../../core/services/api/mock.api.service';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesListComponent implements OnInit, OnDestroy {
  public articlesList: I80levelResponseArticle[];
  public environment = environment;
  public isLoading = true;
  public error: number;
  public defaultAvatar = '/assets/images/avatar.png';
  public defaultCover = '/assets/images/home-background.png'; // TODO: draw a default cover
  private subscription$ = new Subject();

  constructor(
    public translate: TranslateService,
    private readonly eightyLevelService: EightyLevelService,
    private readonly mock: MockApiService,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.makeArticlesList();
  }

  private makeArticlesList(): void {
    if (this.environment.production) {
      this.eightyLevelService
        .getArticles({ page: 1 })
        .pipe(takeUntil(this.subscription$))
        .subscribe(
          (data) => {
            this.articlesList = data.articles.items;
            this.isLoading = false;
            this.cdRef.markForCheck();
          },
          (error) => (this.error = error)
        );
    } else {
      this.mock
        .getMockResponse()
        .pipe(takeUntil(this.subscription$))
        .subscribe(
          (data) => {
            this.articlesList = data.articles.items;
            this.isLoading = false;
            this.cdRef.markForCheck();
          },
          (error) => (this.error = error)
        );
    }
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
