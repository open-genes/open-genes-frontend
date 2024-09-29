import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Studies } from '../../../core/models/open-genes-api/studies.model';
import { DatasetsDownload } from '../../../core/utils/datasets-download';
import { CommonModalComponent } from '../../../components/ui-components/components/modals/common-modal/common-modal.component';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { CsvExportService } from '../../../core/services/csv-export-service';
import { FileExportService } from '../../../core/services/browser/file-export.service';
import { GoogleAnalyticsService } from 'ngx-google-analytics';

@Component({
  selector: 'app-research-data',
  templateUrl: './research-data.component.html',
  styleUrls: ['./research-data.component.scss'],
})
export class ResearchDataComponent extends DatasetsDownload implements OnInit {
  @ViewChild('downLoadLinkTemplate') downLoadLinkTemplate: TemplateRef<any>;
  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  @Input() geneName: string;
  @Input() studies: Studies;
  @Input() slice = 20;

  public isIncreaseLifespan: boolean;
  public isAgeRelatedChanges: boolean;
  public isInterventionAffectsAgingProcess: boolean;
  public isProteinRegulatesOtherGenes: boolean;
  public isGeneAssociatedWithProgeriaSyndromes: boolean;
  public isGeneAssociatedWithLongevityEffects: boolean;
  public isAdditionalEvidences: boolean;

  constructor(
    private _matDialog: MatDialog,
    private _csvExportService: CsvExportService,
    private _fileExportService: FileExportService,
    private _googleAnalyticsService: GoogleAnalyticsService
  ) {
    super(_matDialog, _csvExportService, _fileExportService, _googleAnalyticsService);
  }

  ngOnInit() {
    this.isIncreaseLifespan =
      this.studies?.increaseLifespan &&
      this.studies?.increaseLifespan.length !== 0;

    this.isAgeRelatedChanges =
      this.studies?.ageRelatedChangesOfGene &&
      this.studies?.ageRelatedChangesOfGene.length !== 0;

    this.isInterventionAffectsAgingProcess =
      this.studies?.interventionToGeneImprovesVitalProcesses &&
      this.studies?.interventionToGeneImprovesVitalProcesses.length !== 0;

    this.isProteinRegulatesOtherGenes =
      this.studies?.proteinRegulatesOtherGenes &&
      this.studies?.proteinRegulatesOtherGenes.length !== 0;

    this.isGeneAssociatedWithProgeriaSyndromes =
      this.studies?.geneAssociatedWithProgeriaSyndromes &&
      this.studies?.geneAssociatedWithProgeriaSyndromes.length !== 0;

    this.isGeneAssociatedWithLongevityEffects =
      this.studies?.geneAssociatedWithLongevityEffects &&
      this.studies?.geneAssociatedWithLongevityEffects.length !== 0;

    this.isAdditionalEvidences =
      this.studies?.additionalEvidences && this.studies?.additionalEvidences.length !== 0;
  }

  protected getDownloadLinkTemplate(): TemplateRef<any> {
    return this.downLoadLinkTemplate;
  }

  protected openDownloadModal(template: any): void {
    this._matDialog.open(CommonModalComponent, {
      data: {
        title: 'download',
        body: null,
        template: template,
      },
      panelClass: 'download-modal',
      minWidth: '280px',
      maxWidth: '280px',
      autoFocus: false,
    });
    this.isProcessing = false;

    this.matDialog.afterAllClosed.pipe(takeUntil(this.subscription$)).subscribe(() => {
      this.currentDownloadLink = this.initialDownloadLinkVal;
      this.currentDatasetName = this.initialDatasetName;
    });
  }

  protected handleError(): void {
    this.openDownloadModal(this.errorTemplate);
  }

  public async downloadPurpleTablesTsv(event) {
    event.stopPropagation();
    await this.downloadCsv(`${this.geneName.toLowerCase()}-lifespan-change`,
      () => this.csvExportService.generatePurpleTable(this.studies.increaseLifespan));
  }

  public async downloadBlueTableTsv(event) {
    event.stopPropagation();
    await this.downloadCsv(`${this.geneName.toLowerCase()}-age-related-changes`,
      () => this.csvExportService.generateBlueTable(this.studies.ageRelatedChangesOfGene));
  }

  public async downloadGreenTableTsv(event) {
    event.stopPropagation();
    await this.downloadCsv(`${this.geneName.toLowerCase()}-age-related-processes-change`,
      () => this.csvExportService.generateGreenTable(this.studies.interventionToGeneImprovesVitalProcesses));
  }

  public async downloadPinkTablesTsv(event) {
    event.stopPropagation();
    await this.downloadCsv(`${this.geneName.toLowerCase()}-associations-with-longevity`,
      () => this.csvExportService.generatePinkTable(this.studies.geneAssociatedWithLongevityEffects));
  }

  public async downloadYellowTablesTsv(event) {
    event.stopPropagation();
    await this.downloadCsv(`${this.geneName.toLowerCase()}-gene-regulation`,
      () => this.csvExportService.generateYellowTable(this.studies.proteinRegulatesOtherGenes));
  }
}
