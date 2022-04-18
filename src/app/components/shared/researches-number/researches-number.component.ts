import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Researches } from '../../../core/models/open-genes-api/researches.model';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CommonBottomSheetComponent } from '../../ui-components/components/modals/common-bottom-sheet/common-bottom-sheet.component';

@Component({
  selector: 'app-researches-number',
  templateUrl: './researches-number.component.html',
  styleUrls: ['./researches-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResearchesNumberComponent implements OnInit {
  @Input() researches: Researches;
  constructor(
    private bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {}

  public openBottomSheet(ev: MouseEvent, template: TemplateRef<any> = null): void {
    this.bottomSheet.open(CommonBottomSheetComponent, {
      data: {
        template: template,
      },
    });
    ev.preventDefault();
  }
}
