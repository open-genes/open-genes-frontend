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
  public geneOntologyProcessMap: Map<string, string>;
  public geneOntologyComponentMap: Map<string, string>;
  public geneOntologyActivityMap: Map<string, string>;
  public expressionMaxValue: number;

  static toMap(object) {
    const mappedObj = new Map();
    for (const element of object) {
      for (const [key, value] of Object.entries(element)) {
        mappedObj.set(key, value);
      }
    }
    return mappedObj;
  }

  static chartMaxValue(object) {
    const objArray = [];
    for (const value of Object.values(object)) {
      objArray.push(value['exp_rpkm']);
    }
    return Math.max(...objArray);
  }

  ngOnInit() {
    this.getGene();
  }

  private getGene() {
    this.apiService.getGeneByHGNCsymbol(this.symbol).subscribe((geneInterface) => {
      this.gene = geneInterface;
      this.geneOntologyProcessMap = GeneComponent.toMap(this.gene.terms.biological_process);
      this.geneOntologyComponentMap = GeneComponent.toMap(this.gene.terms.cellular_component);
      this.geneOntologyActivityMap = GeneComponent.toMap(this.gene.terms.molecular_activity);
      this.expressionMaxValue = GeneComponent.chartMaxValue(this.gene.expression);
      console.log(this.expressionMaxValue);
    });
  }

  public chartCalculatePercent(a: number, b: number) {
    return (a / b) * 100;
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
      this.gene.orthologs.length !== 0 ||
      this.gene.terms);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
