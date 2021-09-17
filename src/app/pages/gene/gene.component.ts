import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { PageClass } from '../page.class';
import { HttpErrorResponse } from '@angular/common/http';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SettingsService } from '../../core/services/settings.service';
import { Settings } from '../../core/models/settings.model';

@Component({
  selector: 'app-gene',
  templateUrl: './gene.component.html',
  styleUrls: ['./gene.component.scss'],
})
export class GeneComponent extends PageClass implements OnInit, OnDestroy {
  @ViewChild('UiHints') UiHints: TemplateRef<any>;

  public gene: any;
  public symbol: string;
  public dateInitial = 1562960035; // July 12 2019 - date when the first data was added
  public geneOntologyProcessMap: Map<string, string>;
  public geneOntologyComponentMap: Map<string, string>;
  public geneOntologyActivityMap: Map<string, string>;
  public commentsReferenceLinksMap: Map<string, string>;
  public expressionMaxValue: number;
  public isAnyContent: boolean;
  public isAnyOrtholog: boolean;
  public isNcbiDescription: boolean;
  public isLocationData: boolean;
  public isAnyGoCategory: boolean;
  public isHpa: boolean;
  public isAnyResearchFilled: boolean;
  public isAnyStrongResearchFilled: boolean;
  public isGeneCandidate = false;
  public isUiHintsSettingOn: boolean;

  private ngUnsubscribe = new Subject();
  private routeSubscribe: Subscription;
  private retrievedSettings: Settings;

  constructor(
    public translate: TranslateService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private _bottomSheet: MatBottomSheet,
    private settingsService: SettingsService,
    private apiService: ApiService
  ) {
    super();
    this.routeSubscribe = activateRoute.params.subscribe((params) => {
      this.symbol = params.id;
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  static chartMaxValue(obj: object): number {
    const objArray = [];
    for (const value of Object.values(obj)) {
      objArray.push(value.exp_rpkm);
    }
    return Math.max(...objArray);
  }

  ngOnInit(): void {
    this.retrievedSettings = this.settingsService.getSettings();
    this.isUiHintsSettingOn = this.retrievedSettings.showUiHints;

    this.apiService
      .getGeneByHGNCsymbol(this.symbol)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response) => {
          this.gene = response;

          // Map fields
          this.geneOntologyProcessMap = this.toMap(this.gene.terms.biological_process);
          this.geneOntologyComponentMap = this.toMap(this.gene.terms.cellular_component);
          this.geneOntologyActivityMap = this.toMap(this.gene.terms.molecular_activity);
          this.expressionMaxValue = GeneComponent.chartMaxValue(this.gene.expression);
          this.commentsReferenceLinksMap = this.toMap(this.gene.commentsReferenceLinks);

          // Traits to define if content exists
          const researchesLengths = [];
          Object.values(this.gene.researches).forEach((value) => {
            researchesLengths.push(Number(Object.entries(value).length));
          });
          this.isAnyResearchFilled = Math.max(...researchesLengths) !== 0;

          const strongResearches = [
            ...this.gene.researches?.increaseLifespan,
            ...this.gene.researches?.ageRelatedChangesOfGene,
            ...this.gene.researches?.interventionToGeneImprovesVitalProcesses,
            ...this.gene.researches?.geneAssociatedWithProgeriaSyndromes,
            ...this.gene.researches?.geneAssociatedWithLongevityEffects,
          ];

          if (strongResearches.length !== 0) {
            const strongResearchesLengths = [];
            strongResearches.forEach((value) => {
              strongResearchesLengths.push(Number(Object.entries(value).length));
            });
            this.isAnyStrongResearchFilled = Math.max(...strongResearchesLengths) !== 0;
          } else {
            this.isAnyStrongResearchFilled = false;
          }

          if (this.isAnyStrongResearchFilled) {
            this.isGeneCandidate = false;
          } else if (
            (!!this.gene.researches?.proteinRegulatesOtherGenes &&
              this.gene.researches.proteinRegulatesOtherGenes !== 0) ||
            (!!this.gene.researches?.additionalEvidences && this.gene.researches.additionalEvidences.length !== 0)
          ) {
            this.isGeneCandidate = true;
          }

          this.isAnyOrtholog = Object.values(this.gene.orthologs).toString() !== ''; // TODO: backend: instead of {"":""} should be an empty array of objects
          this.isHpa = this.gene.human_protein_atlas !== '';

          this.isAnyContent =
            this.gene?.commentEvolution ||
            this.gene?.proteinDescriptionUniProt ||
            this.gene?.commentCause.length !== 0 ||
            this.gene?.commentAging ||
            this.isAnyResearchFilled ||
            this.gene?.expression.length !== 0 ||
            this.isAnyOrtholog ||
            this.gene?.terms;

          this.isAnyGoCategory =
            this.gene?.terms.biological_process.length >= 1 ||
            this.gene?.terms.cellular_component.length >= 1 ||
            this.gene?.terms.molecular_activity.length >= 1;

          this.isNcbiDescription = this.gene?.descriptionNCBI.length !== 0;

          this.isLocationData =
            this.gene?.band?.length || this.gene?.locationStart?.length || this.gene?.locationEnd?.length;

          // TODO: Set properties which values depend on a selected language
        },
        (error: HttpErrorResponse) => {
          void this.router.navigate(['/404']);
        }
      );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.routeSubscribe.unsubscribe();
    this._bottomSheet.dismiss();
  }

  public onShowUiHints(ev: MouseEvent): void {
    this._bottomSheet.open(this.UiHints, {});
    ev.preventDefault();
  }

  public onCloseUiHints(): void {
    this._bottomSheet.dismiss();
  }
}
