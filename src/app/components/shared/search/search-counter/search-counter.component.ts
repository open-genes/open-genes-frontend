import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-search-counter',
  templateUrl: './search-counter.component.html',
  styleUrls: ['./search-counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchCounterComponent {
  @Input() quantity: number;
  @Input() title: string;
}
