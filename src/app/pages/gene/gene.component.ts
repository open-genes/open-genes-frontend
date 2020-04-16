import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ApiService} from '../../core/services/api.service';
import {Gene} from '../../core/models';

@Component({
  selector: 'app-gene',
  templateUrl: './gene.component.html',
  styleUrls: ['./gene.component.scss']
})

export class GeneComponent implements OnInit {
  public id: number;
  private subscription: Subscription;
  public gene: any;

  constructor(private activateRoute: ActivatedRoute,
              private apiService: ApiService) {
    this.subscription = activateRoute.params.subscribe(params => this.id = params.id);
  }

  ngOnInit() {
    this.getGene();
  }

  private getGene() {
    this.apiService.getGeneById(this.id).subscribe((geneInterface) => {
      this.gene = geneInterface;
    });
  }

  public isContent() {
    return !!(this.gene.commentEvolution ||
      this.gene.commentFunction ||
      this.gene.commentCause[0].length !== 0 ||
      this.gene.commentAging ||
      this.gene.commentsReferenceLinks ||
      this.gene.researches.increaseLifespan ||
      this.gene.researches.geneAssociatedWithProgeriaSyndromes ||
      this.gene.researches.geneAssociatedWithLongevityEffects ||
      this.gene.researches.ageRelatedChangesOfGene ||
      this.gene.researches.interventionToGeneImprovesVitalProcesses ||
      this.gene.expression.length !== 0 ||
      this.gene.terms);
  }
}
