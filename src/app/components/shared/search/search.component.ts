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
import { debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiService } from '../../../core/services/api/open-genes-api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, OnDestroy {
  @Inject(Document) public document: Document;

  @Input() genesList: Genes[];

  @Output() dataFromSearchBar: EventEmitter<any> = new EventEmitter<any>();

  public searchedData: Genes[];
  public isGoSearchMode = false;
  public searchForm: FormGroup;
  public showSearchResult = false;

  private subscription$ = new Subject();

  constructor(
    private renderer: Renderer2,
    private apiService: ApiService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
    });
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  ngOnInit(): void {
    this.searchForm.get('searchField').valueChanges
      .pipe(
        filter((query: string) => !!query),
        map((query: string) => query.toLowerCase()),
        filter((query: string) => {
          this.showSearchResult = query.length >= 2;

          if (this.showSearchResult) {
            this.renderer.addClass(document.body, 'body--search-on-main-page-is-active');
          } else {
            this.renderer.removeClass(document.body, 'body--search-on-main-page-is-active');
          }

          if (this.showSearchResult) {
            if (this.isGoSearchMode) {
              return true;
            } else {
              this.autocompleteSearch(query);
            }
          }

          return false;
        }),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((query: string) => this.apiService.getGoTermMatchByString(query)),
        takeUntil(this.subscription$)
      )
      .subscribe((genes: Genes[]) => {
        this.searchedData = genes;
        this.cdRef.markForCheck();
      });
  }

  private autocompleteSearch(query: string): void {
    this.searchedData = this.genesList.filter((gene) => {
      const searchedText = `${gene.id} ${gene?.ensembl ? gene.ensembl : ''}
      ${gene.symbol} ${gene.name} ${gene.aliases.join(' ')}`;
      return searchedText.toLowerCase().includes(query);
    });
  }

  public setGoSearchMode(): void {
    this.isGoSearchMode = !this.isGoSearchMode;
    this.searchedData = [];
    this.searchForm.get('searchField').setValue('');
    this.onSearch();
  }

  public onSearch(): void {
    const query: string = this.searchForm.get('searchField').value;
    this.dataFromSearchBar.emit({
      isGoSearchMode: this.isGoSearchMode,
      searchQuery: query.toLowerCase(),
    });
  }

  public cancelSearch(event): void {
    this.showSearchResult = false;
    this.renderer.removeClass(document.body, 'body--search-on-main-page-is-active');
    event.stopPropagation();
  }

  /*  public debounce(callback: any, time: number): () => void {
    let lastTime = 0;
    return function() {
      const now = new Date();

      // first run
      if (lastTime === 0) {
        callback();
      }

      if (now.getTime() - lastTime >= time) {
        callback();
        lastTime = now.getTime();
      }
    };
  }*/
}
