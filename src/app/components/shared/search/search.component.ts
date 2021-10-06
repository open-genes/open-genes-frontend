import { Component, EventEmitter, Renderer2, Input, Output, Inject, OnDestroy } from '@angular/core';
import { Genes } from '../../../core/models';
import { FormControl, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnDestroy {
  @Inject(Document) public document: Document;

  @Input() genesList: Genes[];

  @Output()
  isGoModeTriggered: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  goSearchQuery: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  genesListQuery: EventEmitter<string> = new EventEmitter<string>();

  public searchedData: Genes[];
  public isGoSearchMode = false;
  public searchForm: FormGroup;
  public showResult: boolean;

  private unsubscribe$ = new Subject();

  constructor(
    private renderer: Renderer2
  ) {
    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public showAutocomplete(): void {
    if (!this.isGoSearchMode) {
      this.searchForm.get('searchField').valueChanges
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((query: string) => {
          if (query?.length >= 2) {
            this.autocompleteSearch(query.toLowerCase());
            this.showResult = true;
            this.renderer.addClass(document.body, 'body--search-on-main-page-is-active');
          } else {
            this.showResult = false;
            this.renderer.addClass(document.body, 'body--search-on-main-page-is-active');
          }
        });
    }
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
    this.isGoModeTriggered.emit(this.isGoSearchMode);
    this.searchForm.reset();
  }

  public onSearch(): void {
    const query: string = this.searchForm.get('searchField').value;
    if (this.isGoSearchMode) {
      this.goSearchQuery.emit(query.toLowerCase());
    } else {
      this.genesListQuery.emit(query.toLowerCase());
    }
  }

  public cancelSearch(event): void {
    this.showResult = false;
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
