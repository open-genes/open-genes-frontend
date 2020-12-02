import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject, Subscription} from 'rxjs';
import {ApiService} from '../../core/services/api/open-genes.api.service';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';
import {PageClass} from '../page.class';

@Component({
  selector: 'app-gene',
  templateUrl: './gene.component.html',
  styleUrls: ['./gene.component.scss']
})


export class GeneComponent extends PageClass implements OnInit, OnDestroy {
  public gene: any;
  public symbol: string;
  public dateInitial = 1562960035; // July 12 2019 - date when the first data was added
  public geneOntologyProcessMap: Map<string, string>;
  public geneOntologyComponentMap: Map<string, string>;
  public geneOntologyActivityMap: Map<string, string>;
  public commentsReferenceLinksMap: Map<string, string>;
  public expressionMaxValue: number;

  private ngUnsubscribe = new Subject();
  private routeSubscribe: Subscription;

  constructor(
    public translate: TranslateService,
    private activateRoute: ActivatedRoute,
    private apiService: ApiService
  ) {
    super();
    this.routeSubscribe = activateRoute.params.subscribe(params => this.symbol = params.id);
  }

  static chartMaxValue(object) {
    const objArray = [];
    for (const value of Object.values(object)) {
      objArray.push(value['exp_rpkm']);
    }
    return Math.max(...objArray);
  }

  ngOnInit(): void {
    this.apiService.getGeneByHGNCsymbol(this.symbol).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((geneInterface) => {
      this.gene = geneInterface;
      this.geneOntologyProcessMap = this.toMap(this.gene.terms.biological_process);
      this.geneOntologyComponentMap = this.toMap(this.gene.terms.cellular_component);
      this.geneOntologyActivityMap = this.toMap(this.gene.terms.molecular_activity);
      this.expressionMaxValue = GeneComponent.chartMaxValue(this.gene.expression);
      this.commentsReferenceLinksMap = this.toMap(this.gene.commentsReferenceLinks);
    });
  }

  // Traits to define if content exists
  public isContent() {
    return !!(this.gene.commentEvolution ||
      this.gene.commentFunction ||
      this.gene.commentCause.length !== 0 ||
      this.gene.commentAging ||
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

  public areResearches() {
    return !!(
      this.gene.researches.increaseLifespan.length !== 0 ||
      this.gene.researches.ageRelatedChangesOfGene.length !== 0 ||
      this.gene.researches.interventionToGeneImprovesVitalProcesses.length !== 0 ||
      this.gene.researches.proteinRegulatesOtherGenes.length !== 0 ||
      this.gene.researches.geneAssociatedWithProgeriaSyndromes.length !== 0 ||
      this.gene.researches.geneAssociatedWithLongevityEffects.length !== 0
    );
  }

  public isGeneOntology() {
    return !!(
      this.gene.terms.biological_process.length >= 1 ||
      this.gene.terms.cellular_component.length >= 1 ||
      this.gene.terms.molecular_activity.length >= 1
    );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.routeSubscribe.unsubscribe();
  }
}
