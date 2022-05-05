import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class FileExportService {
  constructor(private sanitizer: DomSanitizer) {}

  public downloadJson(data): SafeResourceUrl {
    if (data?.length === 0) {
      return '';
    }

    const blob = new Blob([JSON.stringify(data)], {
      type: 'text/json;charset=utf-8',
    });
    return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
  }

  public downloadCsv(data): SafeResourceUrl {
    if (data?.length === 0) {
      return '';
    }

    const blob = new Blob([data], {
      type: 'text/csv;charset=utf-8',
    });

    return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
  }
}
