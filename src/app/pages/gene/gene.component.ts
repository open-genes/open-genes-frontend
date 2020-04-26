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

  constructor(private activateRoute: ActivatedRoute,
              private apiService: ApiService) {
    this.subscription = activateRoute.params.subscribe(params => this.symbol = params.id);
  }
  public symbol: string;
  private subscription: Subscription;
  public gene: any;
  public geneOntologyProcess: Map<string, string>;
  public geneOntologyComponent: Map<string, string>;
  public geneOntologyActivity: Map<string, string>;

  static toMap(object) {
    const mappedObj = new Map();
    for (const element of object) {
      for (const [key, value] of Object.entries(element)) {
        mappedObj.set(key, value);
      }
    }
    return mappedObj;
    // console.log(mappedObj);
  }

  ngOnInit() {
    this.getGene();
    // console.log(this.geneOntologyProcess);
  }

  private getGene() {
    this.apiService.getGeneByHGNCsymbol(this.symbol).subscribe((geneInterface) => {
      this.gene = geneInterface;
      this.geneOntologyProcess = GeneComponent.toMap(this.gene.terms.biological_process);
      this.geneOntologyComponent = GeneComponent.toMap(this.gene.terms.cellular_component);
      this.geneOntologyActivity = GeneComponent.toMap(this.gene.terms.molecular_activity);
    });
  }

  public isContent() {
    return !!(this.gene.commentEvolution ||
      this.gene.commentFunction ||
      this.gene.commentCause.length !== 0 ||
      this.gene.commentAging ||
      this.gene.commentsReferenceLinks ||
      this.gene.researches.increaseLifespan.length !== 0 ||
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
