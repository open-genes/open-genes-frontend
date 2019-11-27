import {Component, Input, OnInit} from '@angular/core';
import {IGene} from '../../core/models';

@Component({
  selector: 'app-mini-cards',
  templateUrl: './mini-cards.component.html',
  styleUrls: ['./mini-cards.component.scss']
})
export class MiniCardsComponent implements OnInit {

  @Input() lastGenes: IGene[];

  constructor() {
  }

  ngOnInit() {
  }

}
