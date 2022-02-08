import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { ApiService } from '../../core/services/api/open-genes-api.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { ToMap } from '../../core/utils/to-map';
import { HttpErrorResponse } from '@angular/common/http';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SettingsService } from '../../core/services/settings.service';
import { SearchModeEnum, Settings } from '../../core/models/settings.model';
import { FavouritesService } from '../../core/services/favourites.service';
import { SnackBarComponent } from '../../components/shared/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilterService } from '../../components/shared/genes-list/services/filter.service';
import { FilterTypesEnum } from '../../components/shared/genes-list/services/filter-types.enum';
import { Gene } from '../../core/models';

@Component({
  selector: 'app-gene',
  templateUrl: './gene.component.html',
  styleUrls: ['./gene.component.scss'],
})
export class GeneComponent extends ToMap implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('UiHints') UiHints: TemplateRef<any>;

  public isPageLoaded = false;
  public gene: Gene;
  public symbol: string;
  public timestamp = 1562960035; // July 12 2019 - date when the first data was added
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
  public isInFavourites: boolean;
  public filterTypes = FilterTypesEnum;

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
    private filterService: FilterService,
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
              this.gene.researches.proteinRegulatesOtherGenes.length !== 0) ||
            (!!this.gene.researches?.additionalEvidences && this.gene.researches.additionalEvidences.length !== 0)
          ) {
            this.isGeneCandidate = true;
          }

          this.isAnyOrtholog = this.gene.ortholog.length !== 0;
          this.isHpa = this.gene.human_protein_atlas !== '';

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

          this.isLocationData =
            !!this.gene?.band?.length || !!this.gene?.locationStart  || !!this.gene?.locationEnd ;

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

          // TODO: Set properties which values depend on a selected language
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

  public onApplyFilter(filterType: string, id: number): void {
    const queryParams = {};
    queryParams[filterType] = id;

    if (this.retrievedSettings.searchMode === this.searchModeEnum.searchByGoTerms) {
      this.settingsService.setSettings('searchMode', this.searchModeEnum.searchByGenes);
    }

    this.router.navigate([''], {
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
