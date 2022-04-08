import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Pagination } from '../../models/settings.model';
import { Observable } from 'rxjs';
import { Category } from '../../models/wordpress/category.model';
import { Article } from '../../models/wordpress/article.model';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class WordpressApiService {
  private url = environment.wordpressApiUrl;

  constructor(private http: HttpClient, private translate: TranslateService) {}

  getCategories(): Observable<Category[]> {
    const params = new HttpParams().set('slug', this.translate.currentLang);

    return this.http.get<Category[]>(`${this.url}categories`, { params });
  }

  getArticlesByCategoryId(categoryId: number): Observable<Article[]> {
    const params = new HttpParams().set('categories', categoryId);
    return this.http.get<Article[]>(`${this.url}posts`, { params });
  }
}
