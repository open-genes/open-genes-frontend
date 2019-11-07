import {Component, Input, OnInit} from '@angular/core';
import { IGen } from '../../core/models';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() dataSource: IGen[];
  activeGenesQuantity = 20;
  isSorted;

  constructor() { }

  ngOnInit() {
   this.getScrollPosition();
  }

  getGenes() {
    this.isSorted ? this.reverse() : this.sort();
    this.isSorted = !this.isSorted;
  }

  private reverse() {
    this.dataSource.reverse();
  }
  private sort() {
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
