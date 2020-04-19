import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ApiService} from '../../core/services/api.service';
import {Gene} from '../../core/models';

@Component({
  selector: 'app-gene',
  templateUrl: './gene.component.html',
  styleUrls: ['./gene.component.scss']
})

export class GeneComponent implements OnInit, OnDestroy {
  public symbol: string;
  private subscription: Subscription;
  public gene: any;

  constructor(private activateRoute: ActivatedRoute,
              private apiService: ApiService) {
    this.subscription = activateRoute.params.subscribe(params => this.symbol = params.id);
  }

  ngOnInit() {
    this.getGene();
  }

  private getGene() {
    this.apiService.getGeneByHGNCsymbol(this.symbol).subscribe((geneInterface) => {
      this.gene = geneInterface;
    });
  }

  public isContent() {
    return !!(this.gene.commentEvolution ||
      this.gene.commentFunction ||
      this.gene.commentCause[0].length !== 0 ||
      this.gene.commentAging ||
      this.gene.commentsReferenceLinks ||
      this.gene.researches.increaseLifespan !== 0 ||
      this.gene.researches.ageRelatedChangesOfGene.length !== 0 ||
      this.gene.researches.interventionToGeneImprovesVitalProcesses.length !== 0 ||
      this.gene.researches.proteinRegulatesOtherGenes.length !== 0 ||
      this.gene.researches.geneAssociatedWithProgeriaSyndromes.length !== 0 ||
      this.gene.researches.geneAssociatedWithLongevityEffects.length !== 0 ||
      this.gene.expression.length !== 0 ||
      this.gene.terms);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
