import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../../../core/services/api/open-genes.api.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface IResearchTypes {
  [n: number]: number
}

@Component({
  selector: 'app-research-chart',
  templateUrl: './research-chart.component.html',
  styleUrls: ['./research-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResearchChartComponent implements OnInit {
  @Input() hgnc: string;
  public researchStatsObj: IResearchTypes;
  public researchStatsStr: string;
  private subscription$ = new Subject();

  constructor(
    private apiService: ApiService,
    private readonly cdRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.getResearchStats();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  private getResearchStats(): void {
    this.apiService.getGeneByHGNCsymbol(this.hgnc)
      .pipe(takeUntil(this.subscription$))
      .subscribe(
        (gene) => {
          const a = gene?.['researches'];

            a ? this.researchStatsObj = {
              1: a.increaseLifespan.length,
              2: a.ageRelatedChangesOfGene.length,
              3: a.interventionToGeneImprovesVitalProcesses.length,
              4: a.proteinRegulatesOtherGenes.length,
              5: a.geneAssociatedWithProgeriaSyndromes.length,
              6: a.geneAssociatedWithLongevityEffects.length
            } : {};

          this.researchStatsStr = JSON.stringify(this.researchStatsObj);
          this.cdRef.markForCheck();
        });
  }
}
