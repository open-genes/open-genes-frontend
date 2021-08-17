import {
  Component,
  EventEmitter,
  OnDestroy,
  Renderer2,
  Input,
  OnInit,
  Output,
  Inject,
} from '@angular/core';
import { Genes } from '../../../core/models';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

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
  @Output() queryChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() dataSourceChange: EventEmitter<Genes[]> = new EventEmitter<
    Genes[]
  >();

  public isGoSearchMode = false;
  public searchedData: Genes[];
  public searchForm: FormGroup;
  public showResult: boolean;
  private subscription$: Subscription;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
    });

    this.subscription$ = this.searchForm.valueChanges.subscribe((x) => {
      if (x) {
        this.search();
      }
    });
  }

  public search(): void {
    this.showResult = true;
    this.renderer.addClass(
      document.body,
      'body--search-on-main-page-is-active'
    );
    const searchField = this.searchForm.get('searchField').value;
    const query = searchField ? searchField.toLowerCase() : '';
    this.searchedData = this.dataSource.filter((item) => {
      const searchedText = `${item.id}${item.symbol}" "${
        item.name
      }" "${item.aliases.join(' ')}`;
      return searchedText.toLowerCase().includes(query);
    });
    this.queryChange.emit(query);
    this.dataSourceChange.emit(this.searchedData);
  }

  public cancelSearch(event): void {
    this.showResult = false;
    this.renderer.removeClass(
      document.body,
      'body--search-on-main-page-is-active'
    );
    event.stopPropagation();
  }

  public setGoSearchMode(state: boolean): void {
    console.log('setGoSearchMode');
    this.isGoModeTriggered.emit(state);
    this.searchForm.reset();
    this.isGoSearchMode = state;
  }

  public triggerGoSearch(): void {
    const query = this.searchForm.get('searchField').value;
    this.isGoSearchTriggered.emit(query ? query.toLowerCase() : '');
  }

  public debounce(callback: any, time: number): () => void {
    let lastCall = 0;
    let now = undefined;
    return function () {
      now = Date.now();
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      if (now > lastCall + time) {
        lastCall = now;
        // eslint-disable-next-line prefer-rest-params
        callback();
      }
    };
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(
      document.body,
      'body--search-on-main-page-is-active'
    );
    this.subscription$.unsubscribe();
  }
}
