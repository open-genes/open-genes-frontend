import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { Genes } from '../../../core/models';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiService } from '../../../core/services/api/open-genes-api.service';
import { ToMap } from '../../../core/utils/to-map';
import { SettingsService } from '../../../core/services/settings.service';
import { SearchMode, SearchModeEnum } from '../../../core/models/settings.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent extends ToMap implements OnInit, OnDestroy {
  @Inject(Document) public document: Document;
  @Input() genesLength: number;
  @Input() showTitle: boolean;

  @Input() set genesList(genes: any) {
    if (genes) {
      this.searchedData = genes;
    }
  }

  @Input() set setSearchMode(value: SearchMode) {
    if (value) {
      this.searchMode = value;
      this.searchedData = [];
      this.searchForm.get('searchField').setValue('');
    }
  }

  @Output() searchQuery: EventEmitter<string> = new EventEmitter<string>();
  @Output() confirmedQuery: EventEmitter<any> = new EventEmitter<any>();

  public clearFieldButton: boolean;
  public foundGenes: string[];
  public notFoundGenes: string[] = [];
  public searchedData: Genes[];
  public searchForm: FormGroup;
  public searchMode: SearchMode;
  public showSearchResult = false;
  public highlightText: string;

  private searchModeEnum = SearchModeEnum;
  public inputData = [
    {
      searchMode: SearchModeEnum.searchByGenes,
      placeholder: 'search_field_start_typing',
    },
    {
      searchMode: SearchModeEnum.searchByGoTerms,
      placeholder: 'search_field_tap_search',
    },
    {
      searchMode: SearchModeEnum.searchByGenesList,
      placeholder: 'search_field_by_comma',
    },
  ];

  private subscription$ = new Subject();

  constructor(
    private renderer: Renderer2,
    private apiService: ApiService,
    private settingsService: SettingsService,
    private cdRef: ChangeDetectorRef
  ) {
    super();
    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.subsToSearchFieldChanges();
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
    this.cancelSearch();
  }

  private subsToSearchFieldChanges(): void {
    this.searchForm
      .get('searchField')
      .valueChanges.pipe(
        map((query: string) => query?.toLowerCase()),
        filter((query: string) => {
          return this.clearFieldButton = !!query;
        }),
        map((query: string) => query.toLowerCase().replace(/-/g, '')),
        filter((query: string) => {
          this.highlightText = query;
          this.showSearchResult = query?.length >= 2;

          if (this.showSearchResult) {
            this.renderer.addClass(document.body, 'body--search-on-main-page-is-active');
          } else {
            this.renderer.removeClass(document.body, 'body--search-on-main-page-is-active');
          }

          if (this.searchMode === this.searchModeEnum.searchByGoTerms && this.showSearchResult) {
            return true;
          }

          if (this.searchMode === this.searchModeEnum.searchByGenes) {
            this.searchQuery.emit(query);
          }

          if (this.searchMode === this.searchModeEnum.searchByGenesList) {
            this.searchQuery.emit(query);
          }

          return false;
        }),
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.subscription$)
      )
      .subscribe((query: string) => {
        this.searchQuery.emit(query);
        this.cdRef.markForCheck();
      });
  }

  public onSearch(): void {
    this.confirmedQuery.emit(this.highlightText);
  }

  public cancelSearch(event?): void {
    this.showSearchResult = false;
    this.renderer.removeClass(document.body, 'body--search-on-main-page-is-active');
    event?.stopPropagation();
  }

  public clearSearch(): void {
    this.searchForm.get('searchField').setValue('');
    const query: string = this.searchForm.get('searchField').value;
    this.searchQuery.emit(query);
    this.confirmedQuery.emit(query.toLowerCase());
    this.cancelSearch();
  }
}
