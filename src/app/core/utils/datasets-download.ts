import { SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { CsvExportService } from '../services/csv-export-service';
import { FileExportService } from '../services/browser/file-export.service';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { Subject } from 'rxjs';
import { TemplateRef } from '@angular/core';

export abstract class DatasetsDownload {
  protected initialDownloadLinkVal = '#';
  protected initialDatasetName = 'export';
  protected subscription$ = new Subject();

  public currentDownloadLink:
    | string
    | SafeResourceUrl = this.initialDownloadLinkVal;
  public currentDatasetName = this.initialDatasetName;
  public isProcessing = false;

  protected constructor(
    protected matDialog: MatDialog,
    protected csvExportService: CsvExportService,
    protected fileExportService: FileExportService,
    protected googleAnalyticsService: GoogleAnalyticsService
  ) {}

  public async trackDownload(datasetName: string) {
    try {
      await this.googleAnalyticsService.event(
        'Download',
        'click',
        datasetName
      );
    } catch (error) {
      console.error(
        'Error tracking download event:',
        error
      );
    }
  }

  protected abstract openDownloadModal(template: any): void;

  protected abstract handleError(): void;

  public async downloadCsv(
    datasetName: string,
    generateFunction: () => unknown
  ) {
    try {
      this.isProcessing = true;
      let res;
      if (generateFunction.constructor.name === 'AsyncFunction') {
        res = await generateFunction();
      } else {
        res = generateFunction();
      }

      if (res.length !== 0) {
        this.currentDownloadLink = this.fileExportService.downloadCsv(
          res
        );
        this.currentDatasetName = datasetName;
        await this.trackDownload(datasetName);
        this.openDownloadModal(
          this.getDownloadLinkTemplate()
        );
      }
    } catch {
      this.handleError();
    }
  }

  protected abstract getDownloadLinkTemplate(): TemplateRef<any>;
}
