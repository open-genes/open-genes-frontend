import {
  Component,
  EventEmitter,
  OnDestroy,
  Renderer2,
  Input,
  Output,
  Inject,
  OnInit,
} from '@angular/core';
import { Genes } from '../../../core/models';
import { FormControl, FormGroup } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { merge, takeLast } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  @Inject(Document) public document: Document;
  @Input() dataSource: Genes[];
  @Output()
  isGoModeTriggered: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  isGoSearchTriggered: EventEmitter<string> = new EventEmitter<string>();
  @Output() dataSourceChange: EventEmitter<Genes[]> = new EventEmitter<
    Genes[]
  >();

  public isGoSearchMode = false;
  public searchedData: Genes[];
  public searchForm: FormGroup;
  public showResult: boolean;
  private subscription$ = new Subject();

  constructor(private renderer: Renderer2) {
    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.search();
  }

  private updateUIonSearch(): void {
    this.showResult = true;
    this.renderer.addClass(
      document.body,
      'body--search-on-main-page-is-active'
    );
  }

  private filterBySubstring(query): Genes[] {
    const result = this.dataSource.filter((item) => {
      const searchedText = `${item.id} ${item?.ensembl ? item.ensembl : ''}
      ${item.symbol} ${item.name} ${item.aliases.join(' ')}`;
      return searchedText.toLowerCase().includes(query);
    });

    return result;
  }

  public triggerGenesSearch(query): void {
    this.updateUIonSearch();
    this.searchedData = this.filterBySubstring(
      query ? query.toLowerCase() : ''
    );
    this.dataSourceChange.emit(this.searchedData);
  }

  public debounce(callback: any, time: number): () => void {
    let lastTime = 0;
    return function () {
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
  }

  public triggerGoSearch(query): void {
    this.updateUIonSearch();
    this.isGoSearchTriggered.emit(query ? query.toLowerCase() : '');
    this.dataSourceChange.emit(this.searchedData);
  }

  public setGoSearchMode(state: boolean): void {
    this.isGoModeTriggered.emit(state);
    this.searchForm.reset();
    this.isGoSearchMode = state;
  }

  public search(): void {
    if (this.searchForm.get('searchField').value?.length >= 2) {
      if (this.isGoSearchMode) {
        this.subscribeToGo();
      } else {
        this.triggerGenesSearch(this.searchForm.get('searchField').value);
      }
    }
  }

  public subscribeToGo(): void {
    of(this.searchForm.get('searchField').value)
      .pipe(merge())
      .pipe(takeLast(1))
      .subscribe((value) => {
        this.triggerGoSearch(value);
      });
  }

  public subscribeToGenes(): void {
    this.searchForm.get('searchField').valueChanges.subscribe((value) => {
      this.triggerGenesSearch(value);
    });
  }

  public cancel(event): void {
    this.showResult = false;
    this.renderer.removeClass(
      document.body,
      'body--search-on-main-page-is-active'
    );
    event.stopPropagation();
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(
      document.body,
      'body--search-on-main-page-is-active'
    );
    this.subscription$.unsubscribe();
  }
}
