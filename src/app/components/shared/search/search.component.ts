import {Component, EventEmitter, OnDestroy, Renderer2, Input, OnInit, Output, Inject} from '@angular/core';
import {Genes} from '../../../core/models';
import {FormControl, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Inject(Document) public document: Document;
  @Input() dataSource: Genes[];
  @Output() isGoModeTriggered: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isGoSearchTriggered: EventEmitter<string> = new EventEmitter<string>();
  @Output() queryChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() dataSourceChange: EventEmitter<Genes[]> = new EventEmitter<Genes[]>();

  public isGoSearchMode = false;
  public searchedData: Genes[];
  public searchForm: FormGroup;
  public showResult: boolean;
  private subscription$: Subscription;

  constructor(private renderer: Renderer2, private translate: TranslateService) {
  }

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
    this.renderer.addClass(document.body, 'body--search-on-main-page-is-active');
    const searchField = this.searchForm.get('searchField').value.toLowerCase();
    this.searchedData = this.dataSource.filter((item) => {
      const searchedText = (item.id + item.symbol + ' ' + item.name + ' ' + item.aliases.join(' ')).toLowerCase();
      return searchedText.includes(searchField);
    });
    this.queryChange.emit(searchField);
    this.dataSourceChange.emit(this.searchedData);
  }

  public cancelSearch(event): void {
    this.showResult = false;
    this.renderer.removeClass(document.body, 'body--search-on-main-page-is-active');
    event.stopPropagation();
  }

  public setGoSearchMode(state: boolean): void {
    this.isGoModeTriggered.emit(state);
    this.isGoSearchMode = state;
  }

  public triggerGoSearch(): void {
    const query = this.searchForm.get('searchField').value.toLowerCase();
    this.isGoSearchTriggered.emit(query);
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'body--search-on-main-page-is-active');
    this.subscription$.unsubscribe();
  }
}
