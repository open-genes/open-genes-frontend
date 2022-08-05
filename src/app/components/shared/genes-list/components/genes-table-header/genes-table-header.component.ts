import { ChangeDetectionStrategy, ChangeDetectorRef, Component, TemplateRef } from '@angular/core';
import { GenesFilterService } from '../../../../../core/services/filters/genes-filter.service';
import { GeneTableCardLogic } from '../../../../../core/utils/gene-table-card-logic';
import { FavouritesService } from '../../../../../core/services/favourites.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Settings } from '../../../../../core/models/settings.model';
import { SettingsService } from '../../../../../core/services/settings.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CommonBottomSheetComponent } from '../../../../ui-components/components/modals/common-bottom-sheet/common-bottom-sheet.component';

@Component({
  selector: 'app-genes-table-header',
  templateUrl: './genes-table-header.component.html',
  styleUrls: ['./genes-table-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenesTableHeaderComponent extends GeneTableCardLogic {
  public isUiHintsSettingOn: boolean;

  private retrievedSettings: Settings;

  constructor(
    protected _filterService: GenesFilterService,
    protected _favouritesService: FavouritesService,
    protected _snackBar: MatSnackBar,
    protected cdRef: ChangeDetectorRef,
    protected settingsService: SettingsService,
    protected bottomSheet: MatBottomSheet
  ) {
    super(_filterService, _favouritesService, _snackBar, cdRef);
    this.retrievedSettings = this.settingsService.getSettings();
    this.isUiHintsSettingOn = this.retrievedSettings.showUiHints;
  }

  public openBottomSheet(ev: MouseEvent, template: TemplateRef<any> = null): void {
    this.bottomSheet.open(CommonBottomSheetComponent, {
      data: {
        template: template,
      },
    });
    ev.preventDefault();
  }
}
