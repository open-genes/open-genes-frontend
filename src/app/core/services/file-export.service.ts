import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class FileExportService {
  constructor(private sanitizer: DomSanitizer) {}

  public downloadJson(data) {
    const blob = new Blob([JSON.stringify(data)], {
      type: 'text/json;charset=utf-8',
    });

    console.log(URL.createObjectURL(blob));

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      URL.createObjectURL(blob)
    );
  }
}
