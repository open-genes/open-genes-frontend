import { Injectable } from '@angular/core';
import { WizardSheetComponent } from './wizard-sheet/wizard-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Injectable({
  providedIn: 'root',
})
export class WizardService {
  private bottomSheetRef: any;
  constructor(private bottomSheet: MatBottomSheet) {}

  public open(): void {
    this.bottomSheetRef = this.bottomSheet.open(WizardSheetComponent, {
      hasBackdrop: false,
      data: {},
    });
  }

  public openOnce(): void {
    if (JSON.parse(localStorage.getItem('showWizardSheet')) !== false) {
      this.open();
    }
  }

  public alwaysShow(): void {
    localStorage.setItem('showWizardSheet', JSON.stringify(true));
  }

  public alwaysHide(): void {
    localStorage.setItem('showWizardSheet', JSON.stringify(false));
  }

  public close(): void {
    this.alwaysHide();
    this.bottomSheetRef.dismiss();
  }
}
