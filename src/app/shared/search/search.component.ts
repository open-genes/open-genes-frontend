import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IGene } from '../../core/models';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

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
  showResult;

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.initform();
  }

  // setResult(i) {
  //   this.searchForm.get('searchField').setValue(this.searchedData[i].symbol + ' ' + this.searchedData[i].name);
  //   this.showResult = false;
  // }

  public search() {
    this.showResult = true;
    const searchField = this.searchForm.get('searchField').value.toLowerCase();
    this.searchedData = this.dataSource.filter((item) => {
      const searchedText = (item.symbol + ' ' + item.name + ' ' + item.aliases.join(' ')).toLowerCase();
      return searchedText.includes(searchField);
    });
    this.dataSourceChange.emit(this.searchedData);
  }

  public initform() {
    this.searchForm = new FormGroup({
      searchField: new FormControl(''),
    });
    this.searchForm.valueChanges.subscribe((x) => {
      if (x) {
        this.search();
      }
    });
  }
}
