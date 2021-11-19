import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { WindowWidth } from '../../../core/utils/window-width';
import { WindowService } from '../../../core/services/browser/window.service';

interface Term {
  title: string;
  description: string;
}

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsComponent extends WindowWidth implements OnInit {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      term: Term;
    },
    private _windowService: WindowService,
    private bottomSheetRef: MatBottomSheetRef,
    private readonly cdRef: ChangeDetectorRef
  ) {
    super(_windowService);
  }
  public term = this.data.term;

  ngOnInit(): void {
    this.initWindowWidth(() => {
      this.cdRef.markForCheck();
    });

    this.detectWindowWidth(() => {
      this.cdRef.markForCheck();
    });
  }

  onClose(): void {
    this.bottomSheetRef.dismiss();
  }
}
