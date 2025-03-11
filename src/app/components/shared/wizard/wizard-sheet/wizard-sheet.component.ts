import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WindowWidth } from '../../../../core/utils/window-width';
import { WindowService } from '../../../../core/services/browser/window.service';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { WizardService } from '../wizard-service.service';
import { WordpressApiService } from '../../../../core/services/api/wordpress-api.service';
import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '../../../../directives/directives.module';
import { PipesModule } from '../../../../core/pipes/pipes.module';
import { IconComponent } from '../../../ui-components/icon/app-icon.component';
import { NoContentComponent } from '../../no-content/no-content.component';

@Component({
  selector: 'app-wizard-sheet',
  templateUrl: './wizard-sheet.component.html',
  styleUrls: ['./wizard-sheet.component.scss'],
  standalone: true,
  imports: [TranslateModule, DirectivesModule, PipesModule, IconComponent, NoContentComponent],
  providers: [WindowService, WordpressApiService],
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
