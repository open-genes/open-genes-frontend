import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../core/services/api.service';
import {GoTermsByQuery} from '../../core/models';

@Component({
  selector: 'app-go-search',
  templateUrl: './go-search.component.html',
  styleUrls: ['./go-search.component.scss']
})
export class GoSearchComponent implements OnInit {
  genes: GoTermsByQuery[];
  queryString = 'cyto'; // to lowercase only
  error: any;

  constructor(
    public translate: TranslateService,
    private apiService: ApiService
  ) {
  }

  ngOnInit() {
    this.performSearch(this.queryString);
  }

  private performSearch(request: string) {
    this.apiService.getGoTermMatchByString(request).subscribe((genes) => {
      this.genes = genes; // If nothing found, will return empty array
      }, error => this.error = error);
  }
}
