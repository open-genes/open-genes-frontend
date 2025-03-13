import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Studies } from '../../../core/models/open-genes-api/studies.model';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CommonBottomSheetComponent } from '../../ui-components/modals/common-bottom-sheet/common-bottom-sheet.component';
import { KeyValuePipe, NgClass, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SetClassNamePipe } from './set-class-name.pipe';

@Component({
  selector: 'app-experiments-stats',
  templateUrl: './experiments-stats.component.html',
  styleUrls: ['./experiments-stats.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    KeyValuePipe,
    NgTemplateOutlet,
    NgIf,
    NgClass,
    TranslateModule,
    SetClassNamePipe,
    NgForOf,
  ],
})
export class ExperimentsStatsComponent implements OnInit {
  @Input() experiments: Studies;
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
    if (this.experiments) {
      const arr: number[] = Object.values(this.experiments).map((entry) => entry.length);
      const max = Math.max(...arr);
      return max <= 0 ? 1 : max;
    }

    return 1;
  }

  ngOnInit(): void {
    this.maxValue = this.findMaxValue();
  }
}
