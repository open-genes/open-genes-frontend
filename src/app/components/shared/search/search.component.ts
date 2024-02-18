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
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, pairwise, startWith, takeUntil } from 'rxjs/operators';
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

  // Legacy search mode support
  @Input() multiple = false;
  // TODO: Refactor: this component shouldn't know about it
  @Input() set searchMode(value: SearchMode) {
    if (value) {
      this.mode = value;
      this.searchedData = [];
      this.searchForm.get('searchField').setValue('');
    }
  }

  // UI element behavior
  @Input() showProgressBar: boolean;
  // TODO: Refactor: move it out of component and activate in parent component on event
  @Input() set showClearButton(value: boolean) {
    if (value !== undefined) {
      this.alwaysShowClearButton = value;
    }
  }
  @Input() fixOnTopOnMobile = true;
  @Input() set isDisabled(value: boolean) {
    this.formDisabled = value;
    if (value) {
      this.searchForm.controls['searchField'].disable();
    } else {
      this.searchForm.controls['searchField'].enable();
    }
  }

  // Values
  @Input() set predefinedValue(value: string) {
    if (value) {
      this.searchForm.get('searchField').setValue(value);
    }
  }
  @Input() set searchHintsList(genes: any) {
    if (genes) {
      this.searchedData = genes;
    }
  }
  @Input() placeholder: string;

  @Output() queryChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() search: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() cancel: EventEmitter<boolean> = new EventEmitter<boolean>();

  public searchedData: Partial<Genes[]>;
  public searchForm: UntypedFormGroup;
  public mode: SearchMode;
  public formDisabled: boolean;
  public clearButton: boolean;
  public showSearchHints = false;
  public highlightText: string;

  private alwaysShowClearButton = false;
  private subscription$ = new Subject();

  constructor(
    private renderer: Renderer2,
    private apiService: ApiService,
    private settingsService: SettingsService,
    private cdRef: ChangeDetectorRef,
  ) {
    super();
    this.searchForm = new UntypedFormGroup({
      searchField: new UntypedFormControl(''),
    });
  }

  ngOnInit(): void {
    this.searchForm
      .get('searchField')
      .valueChanges
      .pipe(startWith(null as string), pairwise())
      .pipe(
        map(([prevQuery, nextQuery]: [string, string]) => [
          prevQuery?.toLowerCase().replace(/-/g, ''),
          nextQuery?.toLowerCase().replace(/-/g, '')]),
        filter(([prevQuery, nextQuery]: [string, string]) => {
          if (prevQuery === nextQuery) {
            return false;
          }

          this.clearButton = this.alwaysShowClearButton ? this.alwaysShowClearButton : !!nextQuery;
          this.highlightText = nextQuery;
          this.showSearchHints = nextQuery?.length > 1;

          if (this.showSearchHints && this.fixOnTopOnMobile) {
            this.renderer.addClass(document.body, 'body--search-on-main-page-is-active');
          } else {
            this.renderer.removeClass(document.body, 'body--search-on-main-page-is-active');
          }

          return this.showSearchHints;
        }),
        distinctUntilChanged(),
        debounceTime(300),
        takeUntil(this.subscription$),
      ).subscribe(([prevQuery, nextQuery]: [string, string]) => {
      this.queryChange.emit(nextQuery);
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
    this.closeSearchHintsDropdown();
  }

  public closeSearchHintsDropdown(event?): void {
    event?.stopPropagation();
    this.showSearchHints = false;
    if (this.fixOnTopOnMobile) {
      this.renderer.removeClass(document.body, 'body--search-on-main-page-is-active');
    }
  }

  public patchValue(newValue: string, multiple: boolean, callback?: () => void): void {
    if (multiple === false) {
      this.searchForm.get('searchField').setValue(newValue);
    } else if (multiple) {
      const queryArray = this.searchForm.get('searchField').value.split(',').map(q => q.trim());
      queryArray[queryArray.length - 1] = newValue;
      this.searchForm.get('searchField').setValue(queryArray.join(', '));
    } else {
      return;
    }

    callback && callback();
  }

  public _patchValueSideEffects() {
    this.queryChange.emit(this.searchForm.get('searchField').value);
    this.closeSearchHintsDropdown();
    this.search.emit(true);
  }

  public submitSearch(): void {
    this.search.emit(this.searchForm.get('searchField').value.length !== 0);
    if (this.searchForm.get('searchField').value.length === 0) {
      this.cancelSearch();
    }
  }

  public cancelSearch(): void {
    this.alwaysShowClearButton = false;
    this.searchForm.get('searchField').setValue('');
    this.queryChange.emit(this.searchForm.get('searchField').value);
    this.search.emit(false);
    this.cancel.emit(true);
    this.closeSearchHintsDropdown();
  }
}
