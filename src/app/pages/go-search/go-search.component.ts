import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../core/services/api/open-genes.api.service';
import {Genes} from '../../core/models';

@Component({
  selector: 'app-go-search',
  templateUrl: './go-search.component.html',
  styleUrls: ['./go-search.component.scss']
})
export class GoSearchComponent implements OnInit {
  public genes: Genes[];
  public isLoaded = false;

  constructor(
    public translate: TranslateService,
    private apiService: ApiService
  ) {
  }

  ngOnInit() {
  }
}
