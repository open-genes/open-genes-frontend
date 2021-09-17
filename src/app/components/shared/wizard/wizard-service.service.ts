import { Injectable } from '@angular/core';
import { WizardSheetComponent } from './wizard-sheet/wizard-sheet.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Overlay } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root',
})
export class WizardService {
  private bottomSheetRef: any;

  constructor(private bottomSheet: MatBottomSheet, private overlay: Overlay) {}

  public open(): void {
    this.bottomSheetRef = this.bottomSheet.open(WizardSheetComponent, {
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
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