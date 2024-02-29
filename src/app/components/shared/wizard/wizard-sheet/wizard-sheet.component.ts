import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { WindowWidth } from '../../../../core/utils/window-width';
import { WindowService } from '../../../../core/services/browser/window.service';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { WizardService } from '../wizard-service.service';
import { WordpressApiService } from '../../../../core/services/api/wordpress-api.service';

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
  private dynamicContent$ = new Subject<void>();
  public wizardContent: string;

  constructor(
    public windowService: WindowService,
    public bottomSheetRef: MatBottomSheetRef,
    private wizardService: WizardService,
    private wpApiService: WordpressApiService,
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

    this.wpApiService.getSectionContent('wizard')
      .pipe(takeUntil(this.dynamicContent$))
      .subscribe((content) => {
        this.wizardContent = content;
        this.cdRef.markForCheck();
      });
  }

  public alwaysHide(): void {
    localStorage.setItem('showWizardSheet', JSON.stringify(false));
  }

  public close(): void {
    this.wizardService.close(this.bottomSheetRef);
    this.alwaysHide();
  }
}
