import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GenesListSettings } from '../../genes-list-settings.model';

@Component({
  selector: 'app-genes-table-header',
  templateUrl: './genes-table-header.component.html',
  styleUrls: ['./genes-table-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenesTableHeaderComponent {
  @Input() settings: GenesListSettings;
  @Input() isGoTermsMode: boolean;

  constructor() {}
}
