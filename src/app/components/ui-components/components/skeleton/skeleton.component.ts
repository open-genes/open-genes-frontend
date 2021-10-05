import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
})
export class SkeletonLoaderComponent {
  @Input()
  groups: number;
  @Input() view?: 'line' | 'card' = 'line';
  @Input() cardsInARow?: number = 3;

  public row(n: number): Array<number> {
    return Array(n);
  }
}
