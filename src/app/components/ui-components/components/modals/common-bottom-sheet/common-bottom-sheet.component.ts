import { Component, Inject, TemplateRef } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-common-bottom-sheet',
  templateUrl: './common-bottom-sheet.component.html',
  styleUrls: ['./common-bottom-sheet.component.scss'],
})
export class CommonBottomSheetComponent {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      title?: string;
      template: TemplateRef<any>;
    },
    private bottomSheetRef: MatBottomSheetRef<CommonBottomSheetComponent>
  ) {}

  public closeBottomSheet(): void {
    this.bottomSheetRef.dismiss();
  }
}
