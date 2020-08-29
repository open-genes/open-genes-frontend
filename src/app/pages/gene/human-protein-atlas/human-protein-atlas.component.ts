import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-human-protein-atlas',
  templateUrl: './human-protein-atlas.component.html'
})

export class HumanProteinAtlasComponent implements OnInit {
  @Input() public gene: any;
  @Input() public hpa: any; // shorthand property

  constructor(public translate: TranslateService) { }

  ngOnInit() {
  }

  /**
   * Checks if two objects are similar
   */
  public isSimilar(object1: object, object2: object) {
    return JSON.stringify(object1) === JSON.stringify(object2); // boolean
  }
}
