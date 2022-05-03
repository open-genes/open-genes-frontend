import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CsvExportService } from '../../core/services/csv-export-service';
import { FileExportService } from 'src/app/core/services/file-export.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonBottomSheetComponent } from '../../components/ui-components/components/modals/common-bottom-sheet/common-bottom-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-api-reference',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
})
export class DownloadComponent {
  public currentDownloadLink: string | SafeResourceUrl = '#';
  public currentDatasetName = 'export';

  @ViewChild('downLoadLinkTemplate') downLoadLinkTemplate: TemplateRef<any>;

  constructor(
    public translate: TranslateService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private csvExportService: CsvExportService,
    private fileExportService: FileExportService
  ) {}

  public openBottomSheet(): void {
    this.bottomSheet.open(CommonBottomSheetComponent, {
      data: {
        template: this.downLoadLinkTemplate,
      },
    });
    // TODO: Add error handling if data has failed to load
  }

  public async downloadDiseaseCsv() {
    const res = await this.csvExportService.generateGenesDiseasesTable();
    if (res.length !== 0) {
      this.currentDownloadLink = this.fileExportService.downloadCsv(res);
      this.currentDatasetName = 'genes-diseases';
      // TODO: Show spinner
      this.openBottomSheet();
    }
  }

  public async downloadAgingMechanismsCsv() {
    const res = await this.csvExportService.generateGenesAgingMechanismsTable();
    if (res.length !== 0) {
      this.currentDownloadLink = this.fileExportService.downloadCsv(res);
      this.currentDatasetName = 'genes-aging-mechanisms';
      this.openBottomSheet();
    }
  }

  public async downloadGoTermsCsv() {
    const res = await this.csvExportService.generateGeneAndGoTermsTable();
    if (res.length !== 0) {
      this.currentDownloadLink = this.fileExportService.downloadCsv(res);
      this.currentDatasetName = 'genes-go-terms';
      this.openBottomSheet();
    }
  }

  public async downloadYellowTablesCsv() {
    const res = await this.csvExportService.generateYellowTable();
    if (res.length !== 0) {
      this.currentDownloadLink = this.fileExportService.downloadCsv(res);
      this.currentDatasetName = 'gene-product-involvement-in-regulation-of-genes-associated-with-aging';
      this.openBottomSheet();
    }
  }
}
