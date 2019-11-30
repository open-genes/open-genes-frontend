import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IGene} from '../../core/models';
import {FormControl, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Input() dataSource: IGene[];
  @Output() dataSourceChange: EventEmitter<IGene[]> = new EventEmitter<IGene[]>();
  searchedData: IGene[];
  searchForm: FormGroup;
  hasResult;

  constructor(private translate: TranslateService) {
  }

  ngOnInit() {
    this.initform();
  }

  // setResult(i) {
  //   this.searchForm.get('searchText').setValue(this.searchedData[i].symbol + ' ' + this.searchedData[i].name);
  //   this.hasResult = false;
  // }

  private search() {
    const searchText = this.searchForm.get('searchText').value.toLowerCase();
    this.searchedData = this.dataSource.filter((item) => {
      const searchedText = (item.symbol + ' ' + item.name + ' ' + item.aliases.join(' ')).toLowerCase();
      return searchedText.includes(searchText);
    });
    this.dataSourceChange.emit(this.searchedData);
  }

  private initform() {
    this.searchForm = new FormGroup({
      searchText: new FormControl(''),
    });
    this.searchForm.valueChanges.subscribe((x) => {
      if (x) {
        this.search();
        this.hasResult = true;
      }
    });
  }
}
