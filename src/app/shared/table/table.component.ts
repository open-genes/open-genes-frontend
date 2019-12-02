import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {IGene} from '../../core/models';
import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() dataSource: IGene[];
  searchedData: IGene[];
  genesPerPage = 30;
  loadedGenesQuantity = this.genesPerPage;
  loading = false;
  isSorted = {
    name: false,
    ageMya: false
  };
  asCards = true;
  private subscription$ = new Subject();

  constructor(private translate: TranslateService) {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.searchedData = this.dataSource;
  }

  getSearchedData(e: IGene[]) {
    this.searchedData = e;
  }

  geneView() {
    this.asCards = !this.asCards;
  }

  getGenes(sortBy) {
    if (sortBy === 'name') {
      this.isSorted.name ? this.reverse() : this.sortByName();
      this.isSorted.name = !this.isSorted.name;
    } else {
      this.isSorted.ageMya ? this.reverse() : this.sortByAge();
      this.isSorted.ageMya = !this.isSorted.ageMya;
    }
  }

  private reverse() {
    this.searchedData.reverse();
  }

  private sortByName() {
    this.searchedData.sort((a, b) => {
      const A = (a.symbol + a.name).toLowerCase();
      const B = (b.symbol + b.name).toLowerCase();
      return A > B ? 1 : A < B ? -1 : 0;
    });
  }

  private sortByAge() {
    this.searchedData.sort((a, b) => {
      return a.ageMya - b.ageMya;
    });
  }

  private loadMoreGenes() {
    if (this.searchedData.length >= this.loadedGenesQuantity) {
      this.loadedGenesQuantity += this.genesPerPage;
    }
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
