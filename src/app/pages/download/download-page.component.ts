import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CsvExportService } from '../../core/services/csv-export-service';
import { FileExportService } from 'src/app/core/services/browser/file-export.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CommonModalComponent } from 'src/app/components/ui-components/modals/common-modal/common-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GoogleAnalyticsService } from 'ngx-google-analytics';

@Component({
  selector: 'app-download-page',
  templateUrl: './download-page.component.html',
  styleUrls: ['./download-page.component.scss'],
})
export class DownloadPageComponent {
  private subscription$ = new Subject();
  private initialDownloadLinkVal = '#';
  private initialDatasetName = 'export';

  public currentDownloadLink: string | SafeResourceUrl = this.initialDownloadLinkVal;
  public currentDatasetName = this.initialDatasetName;
  public isProcessing = false;

  @ViewChild('downLoadLinkTemplate') downLoadLinkTemplate: TemplateRef<any>;
  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;

  constructor(
    public translate: TranslateService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private matDialog: MatDialog,
    private csvExportService: CsvExportService,
    private fileExportService: FileExportService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  public openDownloadModal(template): void {
    this.matDialog.open(CommonModalComponent, {
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

  private async trackDownload(datasetName: string) {
    try {
      await this.googleAnalyticsService.event('Download', 'click', datasetName);
    } catch (error) {
      console.error('Error tracking download event:', error);
    }
  }

  private async downloadCsv(datasetName: string, generateFunction: () => Promise<any>) {
    try {
      this.isProcessing = true;
      const res = await generateFunction();
      if (res.length !== 0) {
        this.currentDownloadLink = this.fileExportService.downloadCsv(res);
        this.currentDatasetName = datasetName;
        await this.trackDownload(datasetName);
        this.openDownloadModal(this.downLoadLinkTemplate);
      }
    } catch {
      this.openDownloadModal(this.errorTemplate);
    }
  }

  public async downloadGeneConfidenceLevel() {
    await this.downloadCsv('gene-confidence-level', () => this.csvExportService.generateGenesConfidenceLevelTable());
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
    await this.downloadCsv('gene-regulation', () => this.csvExportService.generateYellowTable());
  }

  public async downloadPinkTablesTsv() {
    await this.downloadCsv('associations-with-longevity', () => this.csvExportService.generatePinkTable());
  }

  public async downloadPurpleTablesTsv() {
    await this.downloadCsv('lifespan-change', () => this.csvExportService.generatePurpleTable());
  }

  public async downloadGreenTableTsv() {
    await this.downloadCsv('age-related-processes-change', () => this.csvExportService.generateGreenTable());
  }

  public async downloadBlueTableTsv() {
    await this.downloadCsv('age-related-changes', () => this.csvExportService.generateBlueTable());
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
