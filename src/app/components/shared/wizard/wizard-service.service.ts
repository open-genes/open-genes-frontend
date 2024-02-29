import { Injectable } from '@angular/core';
import { WizardSheetComponent } from './wizard-sheet/wizard-sheet.component';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Overlay } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root',
})
export class WizardService {
  private isBottomSheetOpen = false;
ß
  constructor(private bottomSheet: MatBottomSheet, private overlay: Overlay) {}

  public open(): void {
    if (this.isBottomSheetOpen === true) {
      return;
    }

    this.isBottomSheetOpen = true;
    this.bottomSheet.open(WizardSheetComponent, {
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      panelClass: 'mat-bottom-sheet-size-fix',
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

  public close(ref: MatBottomSheetRef): void {
    this.isBottomSheetOpen = false;
    ref.dismiss();
  }
}
