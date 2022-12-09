import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Studies } from '../../../core/models/open-genes-api/researches.model';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CommonBottomSheetComponent } from '../../ui-components/components/modals/common-bottom-sheet/common-bottom-sheet.component';

@Component({
  selector: 'app-studies-stats',
  templateUrl: './studies-stats.component.html',
  styleUrls: ['./studies-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudiesStatsComponent implements OnInit {
  @Input() studies: Studies;
  public maxValue: number;
  public legend = [
    {
      title: 'gene_page_research_data_lifespan',
      cssClass: 'legend-container__item--increase-lifespan',
    },
    {
      title: 'gene_page_research_data_age_related_changes',
      cssClass: 'legend-container__item--age-related-change',
    },
    {
      title: 'gene_page_research_data_lifespan',
      cssClass: 'legend-container__item--gene-intervention-to-vital-processes',
    },
    {
      title: 'gene_page_research_data_protein_regulates_genes',
      cssClass: 'legend-container__item--protein-to-gene',
    },
    {
      title: 'gene_page_research_data_progeria',
      cssClass: 'legend-container__item--gene-to-progeria',
    },
    {
      title: 'gene_page_research_data_longevity_effects',
      cssClass: 'legend-container__item--gene-to-longevity-effect',
    },
  ];

  constructor(private bottomSheet: MatBottomSheet) {}

  public openBottomSheet(ev: MouseEvent, template: TemplateRef<any> = null): void {
    this.bottomSheet.open(CommonBottomSheetComponent, {
      data: {
        template: template,
      },
    });
    ev.preventDefault();
  }

  private findMaxValue(): number {
    if (this.studies) {
      const arr: number[] = Object.values(this.studies).map((entry) => entry.length);
      const max = Math.max(...arr);
      return max <= 0 ? 1 : max;
    }

    return 1;
  }

  ngOnInit(): void {
    this.maxValue = this.findMaxValue();
  }
}
