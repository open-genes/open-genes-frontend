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
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiService } from '../../../core/services/api/open-genes-api.service';
import { ToMap } from '../../../core/utils/to-map';
import { SettingsService } from '../../../core/services/settings.service';
import { SearchMode } from '../../../core/models/settings.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent extends ToMap implements OnInit, OnDestroy {
  @Inject(Document) public document: Document;

  @Input() set predefinedValue(value: string) {
    if (value) {
      this.searchForm.get('searchField').setValue(value);
    }
  }
  @Input() showProgressBar: boolean;
  @Input() set isDisabled(value: boolean) {
    this.formDisabled = value;
    if (value) {
      this.searchForm.controls['searchField'].disable();
    } else {
      this.searchForm.controls['searchField'].enable();
    }
  }
  @Input() set searchHintsList(genes: any) {
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
  @Input() fixOnTopOnMobile = true; // TODO: move it out of component and activate in parent component on event
  @Input() placeholder: string;
  @Output() queryChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() updateOnKeyUp: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() search: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter<boolean>();

  public searchedData: Partial<Genes[]>;
  public searchForm: FormGroup;
  public searchMode: SearchMode;
  public formDisabled: boolean;
  public clearFieldButton: boolean;
  public showSearchHints = false;
  public highlightText: string;

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
    this.closeSearchHintsDropdown();
  }

  private subsToSearchFieldChanges(): void {
    this.searchForm
      .get('searchField')
      .valueChanges.pipe(
        map((query: string) => query.toLowerCase().replace(/-/g, '')),
        filter((query: string) => {
          this.clearFieldButton = !!query;
          this.highlightText = query;
          this.showSearchHints = query?.length > 1;

          if (this.showSearchHints && this.fixOnTopOnMobile) {
            this.renderer.addClass(document.body, 'body--search-on-main-page-is-active');
          } else {
            this.renderer.removeClass(document.body, 'body--search-on-main-page-is-active');
          }

          return this.showSearchHints;
        }),
        distinctUntilChanged(),
        takeUntil(this.subscription$)
      )
      .subscribe((query: string) => {
        this.queryChange.emit(query);
        this.cdRef.markForCheck();
      });
  }

  public closeSearchHintsDropdown(event?): void {
    event?.stopPropagation();
    this.showSearchHints = false;
    if (this.fixOnTopOnMobile) {
      this.renderer.removeClass(document.body, 'body--search-on-main-page-is-active');
    }
  }

  public updateSearch(): void {
    this.updateOnKeyUp.emit(!!this.highlightText);
  }

  public submitSearch(): void {
    const query: string = this.searchForm.get('searchField').value;
    if (query.length === 0) {
      this.clearSearch();
      return;
    }
    this.search.emit(true);
  }

  public clearSearch(): void {
    this.searchForm.get('searchField').setValue('');
    const query: string = this.searchForm.get('searchField').value;
    this.queryChange.emit(query);
    this.updateOnKeyUp.emit(false);
    this.cancel.emit(true);
    this.closeSearchHintsDropdown();
  }
}
