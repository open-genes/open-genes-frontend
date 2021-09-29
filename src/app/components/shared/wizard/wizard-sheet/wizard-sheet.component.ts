import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { WindowWidth } from '../../../../core/utils/window-width';
import { WindowService } from '../../../../core/services/browser/window.service';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-wizard-sheet',
  templateUrl: './wizard-sheet.component.html',
  styleUrls: ['./wizard-sheet.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardSheetComponent extends WindowWidth implements OnInit {
  constructor(
    public windowService: WindowService,
    private _bottomSheetRef: MatBottomSheetRef,
    private readonly _cdRef: ChangeDetectorRef
  ) {
    super(windowService);
  }

  ngOnInit(): void {
    this.initWindowWidth(() => {
      this._cdRef.markForCheck();
    });
    this.detectWindowWidth(() => {
      this._cdRef.markForCheck();
    });
  }

  public close(): void {
    this._bottomSheetRef.dismiss();
    this._alwaysHide();
  }
  private _alwaysHide(): void {
    localStorage.setItem('showWizardSheet', JSON.stringify(false));
  }
}
