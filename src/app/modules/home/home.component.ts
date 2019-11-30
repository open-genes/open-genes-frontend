import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { IGene } from '../../core/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  genes: IGene[];
  lastGenes: IGene[];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getGenes();
  }

  private getGenes() {
    this.apiService.getGenes().subscribe( (genes) => {
      this.genes = genes;
    });

    this.apiService.getLastGene().subscribe( (genes) => {
      this.lastGenes = genes;
    });
  }
}
