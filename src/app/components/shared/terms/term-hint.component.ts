import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { WindowWidth } from '../../../core/utils/window-width';
import { WindowService } from '../../../core/services/browser/window.service';
import { BasicTerm } from '../../../core/models/terms.model';

@Component({
  selector: 'app-term-hint',
  templateUrl: './term-hint.component.html',
  styleUrls: ['./term-hint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermHintComponent extends WindowWidth implements OnInit {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data = {
      term: {
        title: 'term',
        disambiguation: 'disambiguation',
      },
    },
    private _windowService: WindowService,
    private bottomSheetRef: MatBottomSheetRef,
    private readonly cdRef: ChangeDetectorRef
  ) {
    super(_windowService);
  }
  public term: BasicTerm = this.data.term;

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
