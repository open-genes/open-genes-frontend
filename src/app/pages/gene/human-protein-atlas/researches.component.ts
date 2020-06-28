import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-human-protein-atlas',
  templateUrl: './human-protein-atlas.component.html'
})

export class HumanProteinAtlasComponent implements OnInit {
  @Input() public gene: any;

  constructor(public translate: TranslateService) { }

  ngOnInit() {

  }
}
