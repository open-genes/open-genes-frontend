import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../core/services/api/open-genes.api.service';
import {Genes} from '../../core/models';

@Component({
  selector: 'app-go-search',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent {
  constructor(
    public translate: TranslateService,
  ) {
  }
}
