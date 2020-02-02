import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-api-reference',
  templateUrl: './api-reference.component.html'
})
export class ApiReferenceComponent implements OnInit {

  constructor(public translate: TranslateService) { }

  ngOnInit() {
  }

}
