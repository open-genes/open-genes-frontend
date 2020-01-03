import {Component, Input, OnInit} from '@angular/core';
import {Genes} from '../../core/models';

@Component({
  selector: 'app-mini-cards',
  templateUrl: './mini-cards.component.html',
  styleUrls: ['./mini-cards.component.scss']
})
export class MiniCardsComponent implements OnInit {

  @Input() lastGenes: Genes[];

  constructor() {
  }

  ngOnInit() {
  }

}
