import { Component, EventEmitter, OnDestroy, Renderer2, Input, OnInit, Output } from '@angular/core';
import { Genes } from '../../core/models';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Input() dataSource: Genes[];
  @Output() dataSourceChange: EventEmitter<Genes[]> = new EventEmitter<Genes[]>();
  searchedData: Genes[];
  searchForm: FormGroup;
  public showResult: boolean;
  private subscription$: Subscription;

  constructor(private renderer: Renderer2, private translate: TranslateService) {}

  ngOnInit() {
    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
    });

    this.subscription$ = this.searchForm.valueChanges.subscribe((x) => {
      if (x) {
        this.search();
      }
    });
  }

  public search() {
    this.showResult = true;
    this.renderer.addClass(document.body, 'body--search-on-main-page-is-active');
    const searchField = this.searchForm.get('searchField').value.toLowerCase();
    this.searchedData = this.dataSource.filter((item) => {
      const searchedText = (item.id + item.symbol + ' ' + item.name + ' ' + item.aliases.join(' ')).toLowerCase();
      return searchedText.includes(searchField);
    });
    this.dataSourceChange.emit(this.searchedData);
  }

  public cancelSearch(event) {
    this.showResult = false;
    this.renderer.removeClass(document.body, 'body--search-on-main-page-is-active');
    event.stopPropagation();
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'body--search-on-main-page-is-active');
    this.subscription$.unsubscribe();
  }
}
