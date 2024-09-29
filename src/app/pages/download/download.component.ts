import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CsvExportService } from '../../core/services/csv-export-service';
import { FileExportService } from 'src/app/core/services/browser/file-export.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CommonModalComponent } from 'src/app/components/ui-components/components/modals/common-modal/common-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { DatasetsDownload } from '../../core/utils/datasets-download';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-download-page',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
})
export class DownloadComponent extends DatasetsDownload {
  @ViewChild('downLoadLinkTemplate') downLoadLinkTemplate: TemplateRef<any>;
  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;

  constructor(
    public translate: TranslateService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private _matDialog: MatDialog,
    private _csvExportService: CsvExportService,
    private _fileExportService: FileExportService,
    private _googleAnalyticsService: GoogleAnalyticsService
  ) {
    super(_matDialog, _csvExportService, _fileExportService, _googleAnalyticsService);
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

  public async downloadDiseaseTsv() {
    await this.downloadCsv('gene-diseases', () => this.csvExportService.generateGenesDiseasesTable());
  }

  public async downloadAgingMechanismsTsv() {
    await this.downloadCsv('gene-aging-mechanisms', () => this.csvExportService.generateGenesAgingMechanismsTable());
  }

  public async downloadGeneTissueRpkmTsv() {
    await this.downloadCsv('gene-tissue-rpkm', () => this.csvExportService.generateGeneTissueRpkmTable());
  }

  public async downloadGoTermsTsv() {
    await this.downloadCsv('gene-go-terms', () => this.csvExportService.generateGeneAndGoTermsTable());
  }

  public async downloadYellowTablesTsv() {
    await this.downloadCsv('gene-regulation', () => this.csvExportService.fetchYellowTable());
  }

  public async downloadPinkTablesTsv() {
    await this.downloadCsv('associations-with-longevity', () => this.csvExportService.fetchPinkTable());
  }

  public async downloadPurpleTablesTsv() {
    await this.downloadCsv('lifespan-change', () => this.csvExportService.fetchPurpleTable());
  }

  public async downloadGreenTableTsv() {
    await this.downloadCsv('age-related-processes-change', () => this.csvExportService.fetchGreenTable());
  }

  public async downloadBlueTableTsv() {
    await this.downloadCsv('age-related-changes', () => this.csvExportService.fetchBlueTable());
  }

  public async downloadSummarizedResearchResultsTsv() {
    await this.downloadCsv('summarized-criteria', () => this.csvExportService.generateSummarizedResearchResults());
  }

  public async downloadGeneCriteriaTsv() {
    await this.downloadCsv('gene-criteria', () => this.csvExportService.generateGeneCriteriaTable());
  }

  public async downloadGeneEvolutionTsv() {
    await this.downloadCsv('gene-evolution', () => this.csvExportService.generateGeneEvolutionTable());
  }

  public async downloadGeneConfidenceLevelTsv() {
    await this.downloadCsv('gene-confidence-level', () => this.csvExportService.generateGenesConfidenceLevelTable());
  }
}
