import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Researches } from '../../../core/models/open-genes-api/researches.model';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CommonBottomSheetComponent } from '../../ui-components/components/modals/common-bottom-sheet/common-bottom-sheet.component';

@Component({
  selector: 'app-researches-number',
  templateUrl: './researches-number.component.html',
  styleUrls: ['./researches-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResearchesNumberComponent implements OnInit {
  @Input() researches: Researches;
  public maxValue: number;

  constructor(
    private bottomSheet: MatBottomSheet
  ) {}

  public openBottomSheet(ev: MouseEvent, template: TemplateRef<any> = null): void {
    this.bottomSheet.open(CommonBottomSheetComponent, {
      data: {
        template: template,
      },
    });
    ev.preventDefault();
  }

  private findMaxValue(): number {
    if (this.researches) {
      const arr: number[] = Object.values(this.researches).map((entry) => entry.length);
      const max = Math.max(...arr);
      return max <= 0 ? 1 : max;
    }

    return 1;
  }

  ngOnInit(): void {
    this.maxValue = this.findMaxValue();
  }
}
