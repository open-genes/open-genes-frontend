import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {IGen} from '../../core/models';
import {fromEvent, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() dataSource: IGen[];
  searchedData: IGen[];
  activeGenesQuantity = 20;
  isSorted;
  hasResult;
  searchForm: FormGroup;
  private subscription$ = new Subject();

  constructor() {
  }

  ngOnInit() {
    this.getScrollPosition();
    this.initForm();
  }

  setResult(i) {
    this.searchForm.get('search').setValue(this.dataSource[i].symbol + ' ' + this.dataSource[i].name);
    this.hasResult = false;
  }

  ngOnChanges(): void {
    this.searchedData = this.dataSource;
  }

  getGenes() {
    this.isSorted ? this.reverse() : this.sortByName();
    this.isSorted = !this.isSorted;
  }

  private reverse() {
    this.dataSource.reverse();
  }

  private sortByName() {
    this.dataSource.sort((a, b) => {
      const A = (a.symbol + a.name).toLowerCase();
      const B = (b.symbol + b.name).toLowerCase();
      if (A < B) {
        return -1;
      } else if (A > B) {
        return 1;
      }
      return 0;
    });
  }

  private sortByAge() {
    this.dataSource.sort((a, b) => {
      const A = a.ageMya;
      const B = b.ageMya;
      if (A - B) {
        return -1;
      }
      return 0;
    });
  }

  private getScrollPosition() {
    fromEvent(document, 'scroll')
      .pipe(takeUntil(this.subscription$))
      .subscribe(() => {
        const d = document.documentElement;
        const offset = d.scrollTop + window.innerHeight;
        const height = d.offsetHeight;
        if (offset >= height - 20 && this.dataSource.length >= this.activeGenesQuantity) {
          this.activeGenesQuantity += 20;
        }
      });
  }

  private initForm() {
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });

    this.searchForm.valueChanges.subscribe(() => {
      this.search();
      this.hasResult = true;
    });
  }

  private search() {
    const searchText = this.searchForm.get('search').value.toLowerCase();
    this.dataSource = this.searchedData.filter((item) => {
      const searchedText = (item.symbol + ' ' + item.name + ' ' + item.aliases).toLowerCase();
      return searchedText.includes(searchText);
    });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
