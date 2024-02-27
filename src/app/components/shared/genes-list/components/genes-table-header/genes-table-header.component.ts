import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CommonBottomSheetComponent } from '../../../../ui-components/components/modals/common-bottom-sheet/common-bottom-sheet.component';
import { GenesListSettings } from '../../genes-list-settings.model';

@Component({
  selector: 'app-genes-table-header',
  templateUrl: './genes-table-header.component.html',
  styleUrls: ['./genes-table-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenesTableHeaderComponent {
  @Input() listSettings: GenesListSettings;
  @Input() isUiHintsSettingOn: boolean;

  constructor(
    private snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet
  ) {}

  public openHintSheet(ev: MouseEvent, template: TemplateRef<any> = null): void {
    this.bottomSheet.open(CommonBottomSheetComponent, {
      data: {
        template: template,
      },
    });
    ev.preventDefault();
  }
}
