import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SettingsService } from '../../core/services/settings.service';
import { SearchModeEnum, Settings } from '../../core/models/settings.model';
import { FavouritesService } from '../../core/services/favourites.service';
import { SnackBarComponent } from '../../components/shared/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenesFilterService } from '../../core/services/filters/genes-filter.service';
import { Gene, Ortholog } from '../../core/models';
import { ApiGeneSearchFilter } from '../../core/models/filters/filter.model';
import { Utils } from '../../core/utils/utils.mixin';
import { Studies } from 'src/app/core/models/open-genes-api/researches.model';

@Component({
  selector: 'app-gene-page',
  templateUrl: './gene.component.html',
  styleUrls: ['./gene.component.scss'],
})
export class GeneComponent extends Utils implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('UiHints') UiHints: TemplateRef<any>;

  public isPageLoaded = false;
  public gene: Gene;
  public symbol: string;
  public timestamp = 1562960035; // July 12 2019 - date when the first data was added
  public geneOntologyProcessMap: Map<string, string> = new Map<string, string>();
  public geneOntologyComponentMap: Map<string, string> = new Map<string, string>();
  public geneOntologyActivityMap: Map<string, string> = new Map<string, string>();
  public commentsReferenceLinksMap: Map<string, string>;
  public ortholog: Ortholog[] = [];
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
  public isInFavourites: boolean;
  public filters: ApiGeneSearchFilter = this.filterService.filters;
  public orthologsMaxItemsToShow = 9;
  public orthologsMaxItems: number = this.orthologsMaxItemsToShow;
  public researches: Observable<Studies>;

  private ngUnsubscribe = new Subject();
  private routeSubscribe: Subscription;
  private retrievedSettings: Settings;
  private searchModeEnum = SearchModeEnum;
  private dateChanged: number | any;

  constructor(
    public translate: TranslateService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private filterService: GenesFilterService,
    private settingsService: SettingsService,
    private apiService: ApiService,
    private favouritesService: FavouritesService,
    private snackBar: MatSnackBar
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
          this.gene.terms.biological_process.map((t) => this.geneOntologyProcessMap.set(t.GOId, t.term));
          this.gene.terms.cellular_component.map((t) => this.geneOntologyComponentMap.set(t.GOId, t.term));
          this.gene.terms.molecular_activity.map((t) => this.geneOntologyActivityMap.set(t.GOId, t.term));
          this.expressionMaxValue = GeneComponent.chartMaxValue(this.gene.expression);
          this.commentsReferenceLinksMap = this.toMap(this.gene.commentsReferenceLinks);

          // Filter researches
          // TODO: tech debt: remove this workaround for displaying only researches without additional interventions
          let increaseLifespan = [];
          increaseLifespan = this.gene.researches.increaseLifespan.filter((item) =>
            this.resolveAdditionalIntervention(item, this.gene.id)
          );

          const compoundResearches = {
            increaseLifespan: increaseLifespan,
            ageRelatedChangesOfGene: [...this.gene.researches?.ageRelatedChangesOfGene],
            interventionToGeneImprovesVitalProcesses: [
              ...this.gene.researches?.interventionToGeneImprovesVitalProcesses,
            ],
            proteinRegulatesOtherGenes: [...this.gene.researches?.proteinRegulatesOtherGenes],
            geneAssociatedWithProgeriaSyndromes: [...this.gene.researches?.geneAssociatedWithProgeriaSyndromes],
            geneAssociatedWithLongevityEffects: [...this.gene.researches?.geneAssociatedWithLongevityEffects],
            additionalEvidences: [...this.gene.researches?.additionalEvidences],
          };
          this.researches = of(compoundResearches);

          // Traits to define if content exists
          const researchesLengths = [];
          Object.values(compoundResearches).forEach((value) => {
            researchesLengths.push(Number(Object.entries(value).length));
          });
          this.isAnyResearchFilled = Math.max(...researchesLengths) !== 0;

          const strongResearchTypes = [
            compoundResearches.increaseLifespan,
            compoundResearches.ageRelatedChangesOfGene,
            compoundResearches.interventionToGeneImprovesVitalProcesses,
            compoundResearches.geneAssociatedWithProgeriaSyndromes,
            compoundResearches.geneAssociatedWithLongevityEffects,
          ];

          if (strongResearchTypes.length !== 0) {
            const strongResearchTypesLengths = [];
            strongResearchTypes.forEach((value) => {
              strongResearchTypesLengths.push(Number(Object.entries(value).length));
            });
            this.isAnyStrongResearchFilled = Math.max(...strongResearchTypesLengths) !== 0;
          } else {
            this.isAnyStrongResearchFilled = false;
          }

          if (this.isAnyStrongResearchFilled) {
            this.isGeneCandidate = false;
          } else if (
            (!!this.gene.researches?.proteinRegulatesOtherGenes &&
              this.gene.researches.proteinRegulatesOtherGenes.length !== 0) ||
            (!!this.gene.researches?.additionalEvidences && this.gene.researches.additionalEvidences.length !== 0)
          ) {
            this.isGeneCandidate = true;
          }

          // TODO: Sort orthologs until OG-651 is done
          this.ortholog = this.gene.ortholog.sort((a, b) => {
            return (
              (a.species.latinName > b.species.latinName ? 1 : -1) &&
              (a.species.latinName?.includes('Drosophila') ? -1 : 1)
            );
          });

          this.isAnyOrtholog = this.gene.ortholog.length !== 0;
          this.isHpa = this.gene.humanProteinAtlas !== '';

          this.isAnyContent =
            !!this.gene?.commentEvolution ||
            !!this.gene?.proteinDescriptionUniProt ||
            !!this.gene?.commentCause ||
            this.gene?.commentAging.length !== 0 ||
            this.isAnyResearchFilled ||
            this.gene?.expression.length !== 0 ||
            this.isAnyOrtholog ||
            !!this.gene?.terms;

          this.isAnyGoCategory =
            this.gene?.terms.biological_process.length >= 1 ||
            this.gene?.terms.cellular_component.length >= 1 ||
            this.gene?.terms.molecular_activity.length >= 1;

          this.isNcbiDescription = this.gene?.descriptionNCBI.length !== 0;

          this.isLocationData = !!this.gene?.location.band;

          this.isInFavourites = this.favouritesService.isInFavourites(this.gene.id);

          // TODO: Fix this crutch for a union type error
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (Object.values(this.gene.timestamp).length > 1) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.dateChanged = Number(this.gene.timestamp?.changed);
          } else {
            this.dateChanged = Number(this.gene.timestamp);
          }
          this.timestamp = !isNaN(this.dateChanged) && this.dateChanged !== 0 ? this.dateChanged : this.timestamp;
        },
        (error: HttpErrorResponse) => {
          void this.router.navigate(['/404']);
        }
      );
  }

  /**
   * Filters translations
   */
  public getExpressionLocaleKey(expression: number): string {
    // TODO: DRY
    const expressionTranslations = new Map([
      [0, 'expression_change_no_data'],
      [1, 'expression_change_decreased'],
      [2, 'expression_change_increased'],
      [3, 'expression_change_mixed'],
    ]);

    return expressionTranslations.get(expression);
  }

  ngAfterViewInit(): void {
    this.isPageLoaded = true;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.routeSubscribe.unsubscribe();
    this.bottomSheet.dismiss();
  }

  public onShowUiHints(ev: MouseEvent): void {
    this.bottomSheet.open(this.UiHints, {});
    ev.preventDefault();
  }

  public onCloseUiHints(): void {
    this.bottomSheet.dismiss();
  }

  public applyFilter(filterType: string, id: number | string): void {
    const queryParams = {};
    queryParams[filterType] = id;

    if (this.retrievedSettings.searchMode === this.searchModeEnum.searchByGoTerms) {
      this.settingsService.setSettings('searchMode', this.searchModeEnum.searchByGenes);
    }

    void this.router.navigate([''], {
      queryParams: queryParams,
    });
  }

  toggleFavourites(id: any) {
    if (!this.favouritesService.isInFavourites(id)) {
      this.isInFavourites = true;
      this.favouritesService.addToFavourites(id);
      this.snackBar.openFromComponent(SnackBarComponent, {
        data: {
          title: 'favourites_added',
          length: '',
        },
        duration: 600,
      });
    } else {
      this.isInFavourites = false;
      this.favouritesService.removeFromFavourites(id);
      this.snackBar.openFromComponent(SnackBarComponent, {
        data: {
          title: 'favourites_removed',
          length: '',
        },
        duration: 600,
      });
    }
  }
}
