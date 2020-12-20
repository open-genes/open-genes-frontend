import {Component, OnInit, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-researches',
  templateUrl: './researches.component.html'
})

export class ResearchesComponent implements OnInit {
  @Input() public gene: any;

  constructor(public translate: TranslateService) {
  }

  ngOnInit() {
  }
}
