import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class FileExportService {
  constructor(private sanitizer: DomSanitizer) {}

  public downloadJson(data) {
    if (data?.length === 0) {
      return '';
    }

    const blob = new Blob([JSON.stringify(data)], {
      type: 'text/json;charset=utf-8',
    });

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      URL.createObjectURL(blob)
    );
  }

  public downloadCsv(data) {
    if (data?.length === 0) {
      return '';
    }
    const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    const csv = data.map((row) =>
      header.map((fieldName) => JSON.stringify(row[fieldName])).join(',')
    );
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');

    const blob = new Blob(['\uFEFF' + csvArray], {
      type: 'text/csv;charset=utf-8',
    });

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      URL.createObjectURL(blob)
    );
  }
}
