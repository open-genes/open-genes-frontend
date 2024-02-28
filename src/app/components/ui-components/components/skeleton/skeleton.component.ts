import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
})
export class SkeletonLoaderComponent {
  @Input() groups? = 1;
  @Input() view?: 'line' | 'card' | 'panel' | 'aliases' | 'inline' = 'line';
  @Input() itemsInRow? = 3;

  public row(n: number): Array<number> {
    return Array(n);
  }
}
