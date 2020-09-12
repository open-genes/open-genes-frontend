import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ApiService} from '../../core/services/api.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-go-search',
  templateUrl: './go-search.component.html',
  styleUrls: ['./go-search.component.scss']
})
export class GoSearchComponent implements OnInit {
  apiUrl = 'http://dev.open-genes.com/api/gene/by-go-term/';
  request = 'BLM';
  error: any;

  constructor(
    public translate: TranslateService,
    private apiService: ApiService,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.performSearch(this.request);
  }


// эндпоинт api/gene/by-go-term
// http://dev.open-genes.com/api/gene/by-go-term/cyto
// вывод как в списке генов, но еще с го-термами (только теми, в которых нашлось совпадение со строкой)
// принимает от трех символов, если меньше - вернет пустой массив
// потому что по двум вообще фигня получается

  private performSearch(request: string) {
    this.apiService.getGoTermMatchByString(this.request).subscribe((request) => {
      console.log('fine!');
      const responceURL = this.apiUrl + this.request;
      return this.http.get(responceURL, {responseType: 'json'});
    }, error => this.error = error);
  }
}
