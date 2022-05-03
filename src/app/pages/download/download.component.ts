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
  }

  public async downloadDiseaseCsv() {
    const res = await this.csvExportService.generateGenesDiseasesTable();
    if (res.length !== 0) {
      this.currentDownloadLink = this.fileExportService.downloadCsv(res);
      this.openBottomSheet();
    }
    // this.currentDownloadLink = this.sanitizer.bypassSecurityTrustResourceUrl(link as string);
  }
}
