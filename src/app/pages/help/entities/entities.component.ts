import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../core/services/api/open-genes-api.service';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-entities-page',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntitiesComponent implements OnInit, OnDestroy {
  constructor(
    public translate: TranslateService,
    private apiService: ApiService,
    private router: Router,
    private readonly cdRef: ChangeDetectorRef,
  ) {}

  public title: string;
  public list: any[]; // TODO: typing
  public currentPage = 1;
  public itemsPerPage = 20;
  public data: any[];
  private source$: Observable<any[]>;
  private unsubscribe$ = new Subject();

  ngOnInit(): void {
    switch (this.router.url) {
      case '/about/entities/age-related-processes':
        this.source$ = this.apiService.getAgeRelatedProcesses();
        this.title = 'entities_age_related_processes';
        break;
      case '/about/entities/aging-mechanisms':
        this.source$ = this.apiService.getAgingMechanisms();
        this.title = 'entities_aging_mechanisms';
        break;
      case '/about/entities/selection-criteria':
        this.source$ = this.apiService.getSelectionCriteria();
        this.title = 'entities_selection_criteria';
        break;
      case '/about/entities/diseases':
        this.source$ = this.apiService.getDiseases();
        this.title = 'entities_diseases';
        break;
      case '/about/entities/disease-categories':
        this.source$ = this.apiService.getDiseaseCategories();
        this.title = 'entities_disease_categories';
        break;
      default:
        void this.router.navigate(['**']);
        break;
    }

    if (this.source$) {
      this.source$.pipe(takeUntil(this.unsubscribe$))
      .subscribe((items) => {
        this.data = Object.values(items);
        if ('icdName' in this.data[0]) {
          this.data.map((d: any) => d.name = d.name ?? d.icdName);
        }
        if ('icdCategoryName' in this.data[0]) {
          this.data.map((d: any) => d.name = d.icdCategoryName);
        }
        this.list = this.data.slice(0, this.itemsPerPage);
        this.cdRef.markForCheck();
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
  }

  public pageEventHandler(event: PageEvent): void {
    const start = event.pageIndex * event.pageSize;
    const end = start + event.pageSize;
    this.list = this.data.slice(start, end);
    this.currentPage = event.pageIndex + 1;
  }
}
