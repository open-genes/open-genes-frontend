import { Component, Inject, Input, OnDestroy, SecurityContext, ViewEncapsulation } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FileExportService } from '../../../core/services/browser/file-export.service';
import { ApiService } from '../../../core/services/api/open-genes-api.service';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  providers: [FileExportService, ApiService],
  imports: [
    TranslateModule,
  ],
})
export class DownloadComponent implements OnDestroy {
  @Input() data: string;

  private unsubscribe$ = new Subject();

  constructor(
    @Inject(DOCUMENT) public document: Document,
    private apiService: ApiService,
    private fileExportService: FileExportService,
    private sanitizer: DomSanitizer
  ) {}

  downloadFile(): void {
    this.apiService
      .getGeneByHGNCsymbol(this.data)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((gene) => {
        const downloadLink = document.createElement('a');
        downloadLink.href = this.sanitizer.sanitize(
          SecurityContext.RESOURCE_URL,
          this.fileExportService.downloadJson(gene)
        );
        downloadLink.setAttribute('download', 'export.json');
        downloadLink.setAttribute('target', '_blank');
        downloadLink.click();
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
