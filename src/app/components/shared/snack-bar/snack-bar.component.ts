import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { WindowService } from '../../../core/services/browser/window.service';
import { WindowWidth } from '../../../core/utils/window-width';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnackBarComponent extends WindowWidth implements OnInit {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public message,
    private _windowService: WindowService,
    private _cdRef: ChangeDetectorRef
  ) {
    super(_windowService);
  }

  ngOnInit(): void {
    this.initWindowWidth(() => {
      this._cdRef.markForCheck();
    });

    this.detectWindowWidth(() => {
      this._cdRef.markForCheck();
    });
  }
}
