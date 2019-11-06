import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { IGen } from '../../core/models';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {

  @Input() dataSource: IGen[];
  activeGenes: IGen[];
  activeGenesQuantity = 20;
  isSorted = false;

  constructor() { }

  ngOnInit() {
   this.getScrollPosition();
  }

  ngOnChanges(): void {
    if (this.dataSource) {
      this.activeGenes = this.dataSource;
    }
  }

  getGenes() {
    this.isSorted ? this.reverse() : this.sort();
    this.isSorted = !this.isSorted;
  }

  private reverse() {
    this.activeGenes.reverse();
  }
  private sort() {
    this.dataSource.sort((a, b) => {
      const A = (a.name).toLowerCase();
      const B = (b.name).toLowerCase();
      if (A < B) {
        return -1;
      } else if (A > B) {
        return 1;
      }
      return 0;
    });
  }
  private getScrollPosition() {
    window.onscroll = () => {
      const d = document.documentElement;
      const offset = d.scrollTop + window.innerHeight;
      const height = d.offsetHeight;
      if (offset >= height - 1) {
        this.activeGenesQuantity += 20;
      }
    };
  }
}
