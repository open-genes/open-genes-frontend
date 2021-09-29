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
    private bottomSheetRef: MatBottomSheetRef,
    private readonly cdRef: ChangeDetectorRef,
  ) {
    super(windowService);
  }

  ngOnInit(): void {
    this.initWindowWidth(() => {
      this.cdRef.markForCheck();
    });
    this.detectWindowWidth(() => {
      this.cdRef.markForCheck();
    });
  }

  public close(): void {
    this.bottomSheetRef.dismiss();
    this.alwaysHide();
  }

  public alwaysHide(): void {
    localStorage.setItem('showWizardSheet', JSON.stringify(false));
  }
}
