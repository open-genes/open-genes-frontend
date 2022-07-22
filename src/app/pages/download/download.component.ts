import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CsvExportService } from '../../core/services/csv-export-service';
import { FileExportService } from 'src/app/core/services/browser/file-export.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CommonModalComponent } from 'src/app/components/ui-components/components/modals/common-modal/common-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-download-page',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
})
export class DownloadComponent {
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
    private fileExportService: FileExportService
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

  public async downloadDiseaseTsv() {
    try {
      this.isProcessing = true;
      const res = await this.csvExportService.generateGenesDiseasesTable();
      if (res.length !== 0) {
        // TODO: pass status, and handle if status ok
        this.currentDownloadLink = this.fileExportService.downloadCsv(res);
        this.currentDatasetName = 'gene-diseases';
        this.openDownloadModal(this.downLoadLinkTemplate);
      }
    } catch {
      this.openDownloadModal(this.errorTemplate);
    }
  }

  public async downloadAgingMechanismsTsv() {
    try {
      this.isProcessing = true;
      const res = await this.csvExportService.generateGenesAgingMechanismsTable();
      if (res.length !== 0) {
        this.currentDownloadLink = this.fileExportService.downloadCsv(res);
        this.currentDatasetName = 'gene-aging-mechanisms';
        this.openDownloadModal(this.downLoadLinkTemplate);
      }
    } catch {
      this.openDownloadModal(this.errorTemplate);
    }
  }

  public async generateGeneTissueRpkmTsv() {
    try {
      this.isProcessing = true;
      const res = await this.csvExportService.generateGeneTissueRpkmTable();
      if (res.length !== 0) {
        this.currentDownloadLink = this.fileExportService.downloadCsv(res);
        this.currentDatasetName = 'gene-tissue-rpkm';
        this.openDownloadModal(this.downLoadLinkTemplate);
      }
    } catch {
      this.openDownloadModal(this.errorTemplate);
    }
  }

  public async downloadGoTermsTsv() {
    try {
      this.isProcessing = true;
      const res = await this.csvExportService.generateGeneAndGoTermsTable();
      if (res.length !== 0) {
        this.currentDownloadLink = this.fileExportService.downloadCsv(res);
        this.currentDatasetName = 'gene-go-terms';
        this.openDownloadModal(this.downLoadLinkTemplate);
      }
    } catch {
      this.openDownloadModal(this.errorTemplate);
    }
  }

  public async downloadYellowTablesTsv() {
    try {
      this.isProcessing = true;
      const res = await this.csvExportService.generateYellowTable();
      if (res.length !== 0) {
        this.currentDownloadLink = this.fileExportService.downloadCsv(res);
        this.currentDatasetName = 'gene-regulation';
        this.openDownloadModal(this.downLoadLinkTemplate);
      }
    } catch {
      this.openDownloadModal(this.errorTemplate);
    }
  }

  public async downloadPinkTablesTsv() {
    try {
      this.isProcessing = true;
      const res = await this.csvExportService.generatePinkTable();
      if (res.length !== 0) {
        this.currentDownloadLink = this.fileExportService.downloadCsv(res);
        this.currentDatasetName = 'associations-with-lifespan';
        this.openDownloadModal(this.downLoadLinkTemplate);
      }
    } catch {
      this.openDownloadModal(this.errorTemplate);
    }
  }

  public async downloadPurpleTablesTsv() {
    try {
      this.isProcessing = true;
      const res = await this.csvExportService.generatePurpleTable();
      if (res.length !== 0) {
        this.currentDownloadLink = this.fileExportService.downloadCsv(res);
        this.currentDatasetName = 'lifespan-change';
        this.openDownloadModal(this.downLoadLinkTemplate);
      }
    } catch {
      this.openDownloadModal(this.errorTemplate);
    }
  }

  public async generateGreenTableTsv() {
    try {
      this.isProcessing = true;
      const res = await this.csvExportService.generateGreenTable();
      if (res.length !== 0) {
        this.currentDownloadLink = this.fileExportService.downloadCsv(res);
        this.currentDatasetName = 'gene-activity-change-impact';
        this.openDownloadModal(this.downLoadLinkTemplate);
      }
    } catch {
      this.openDownloadModal(this.errorTemplate);
    }
  }

  public async generateBlueTableTsv() {
    try {
      this.isProcessing = true;
      const res = await this.csvExportService.generateBlueTable();
      if (res.length !== 0) {
        this.currentDownloadLink = this.fileExportService.downloadCsv(res);
        this.currentDatasetName = 'age-related-changes';
        this.openDownloadModal(this.downLoadLinkTemplate);
      }
    } catch {
      this.openDownloadModal(this.errorTemplate);
    }
  }

  public async generateSummarizedResearchResultsTsv() {
    this.isProcessing = true;
    const res = await this.csvExportService.generateSummarizedResearchResults();
    if (res.length !== 0) {
      this.currentDownloadLink = this.fileExportService.downloadCsv(res);
      this.currentDatasetName = 'summarized-research-criteria';
      this.openDownloadModal(this.downLoadLinkTemplate);
    }
  }

  public async generateGeneEvolutionTsv() {
    this.isProcessing = true;
    const res = await this.csvExportService.generateGeneEvolutionTable();
    if (res.length !== 0) {
      this.currentDownloadLink = this.fileExportService.downloadCsv(res);
      this.currentDatasetName = 'gene-evolution';
      this.openDownloadModal(this.downLoadLinkTemplate);
    }
  }


}
