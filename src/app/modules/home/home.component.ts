import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';
import { IGen } from '../../core/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  genes: Observable<IGen[]>;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getGenes();
  }

  private getGenes() {
    this.genes = this.apiService.getGenes();
  }
}
