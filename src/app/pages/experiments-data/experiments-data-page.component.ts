import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ResearchArguments } from '../../core/models/open-genes-api/researches.model';
import { WindowWidth } from '../../core/utils/window-width';
import { WindowService } from '../../core/services/browser/window.service';

interface Tab {
  title: string;
  cssClass: string;
  param: ResearchArguments;
}

@Component({
  selector: 'app-experiments-data-page',
  templateUrl: './experiments-data-page.component.html',
  styleUrls: ['./experiments-data-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperimentsDataPageComponent extends WindowWidth implements OnInit {
  public tabs: Tab[] = [
    {
      title: 'gene_page_research_data_lifespan',
      cssClass: 'tab--increase-lifespan',
      param: 'lifespan-change',
    },
    {
      title: 'gene_page_research_data_age_related_changes',
      cssClass: 'tab--age-related-change',
      param: 'age-related-changes',
    },
    {
      title: 'gene_page_intervention_moderates_aging',
      cssClass: 'tab--gene-intervention-to-vital-processes',
      param: 'gene-activity-change-impact',
    },
    {
      title: 'gene_page_research_data_protein_regulates_genes',
      cssClass: 'tab--protein-to-gene',
      param: 'gene-regulation',
    },
    {
      title: 'gene_page_research_data_progeria',
      cssClass: 'tab--gene-to-progeria',
      param: 'association-with-accelerated-aging',
    },
    {
      title: 'gene_page_research_data_longevity_effects',
      cssClass: 'tab--gene-to-longevity-effect',
      param: 'associations-with-lifespan',
    },
    // {
    //   title: 'gene_page_research_data_additional_evidence',
    //   cssClass: 'tab--gene-to-additional-evidence',
    //   param: 'other-evidence',
    // },
  ];
  public activeTabIndex: number;

  constructor(
    private readonly cdRef: ChangeDetectorRef,
    public windowService: WindowService
  ) {
    super(windowService);
  }

  ngOnInit(): void {
    if (localStorage.getItem('researchesActiveTab')) {
      this.activeTabIndex = Number(localStorage.getItem('researchesActiveTab'));
    }
  }

  public setIsListLoaded(event): void {
    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  public setActiveTab($event: any): void {
    this.activeTabIndex = $event.index;
    localStorage.setItem('researchesActiveTab', JSON.stringify(this.activeTabIndex));
  }
}
