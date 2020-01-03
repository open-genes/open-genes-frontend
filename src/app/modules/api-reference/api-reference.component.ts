import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-api-reference',
  templateUrl: './api-reference.component.html',
  styleUrls: ['./api-reference.component.scss']
})
export class ApiReferenceComponent implements OnInit {

  constructor(public translate: TranslateService) { }

  ngOnInit() {
  }

}
