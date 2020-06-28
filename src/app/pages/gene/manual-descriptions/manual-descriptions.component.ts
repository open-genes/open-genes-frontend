import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-manual-descriptions',
  templateUrl: './manual-descriptions.component.html'
})

export class ManualDescriptionsComponent implements OnInit {
  @Input() public gene: any;

  constructor(public translate: TranslateService) { }

  ngOnInit() {

  }
}
