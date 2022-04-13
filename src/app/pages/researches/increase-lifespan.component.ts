import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { SearchModeEnum } from '../../core/models/settings.model';

@Component({
  selector: 'app-lifespan-research-page',
  templateUrl: './increase-lifespan.component.html',
  styleUrls: ['./increase-lifespan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncreaseLifespanComponent {
  public showLoader = false;

  return;
  public tabs = [
    {
      title: 'gene_page_researches_lifespan',
      cssClass: 'tab--age-related-change',
      param: 'lifespan-change',
    },
    {
      title: 'gene_page_researches_age_related_changes',
      cssClass: 'tab--age-related-change',
      param: 'age-related-changes',
    },
    {
      title: 'gene_page_researches_lifespan',
      cssClass: 'tab--gene-intervention-to-vital-processes',
      param: 'gene-activity-change-impact',
    },
    {
      title: 'gene_page_researches_protein_regulates_genes',
      cssClass: 'tab--protein-to-gene',
      param: 'gene-regulation',
    },
    {
      title: 'gene_page_researches_progeria',
      cssClass: 'tab--gene-to-progeria',
      param: 'association-with-accelerated-aging',
    },
    {
      title: 'gene_page_researches_longevity_effects',
      cssClass: 'tab--gene-to-longevity-effect',
      param: 'associations-with-lifespan',
    },
    {
      title: 'gene_page_researches_additional_evidence',
      cssClass: 'tab--gene-to-additional-evidence',
      param: 'other-evidence',
    },
  ];

  constructor(private readonly cdRef: ChangeDetectorRef) {}

  public setIsListLoaded(event: boolean): void {
    this.showLoader = event;
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }
}
