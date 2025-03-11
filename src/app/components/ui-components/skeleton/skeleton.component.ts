import { Component, Input } from '@angular/core';
import { NgClass, NgForOf, NgSwitch, NgSwitchCase } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    NgSwitch,
    NgSwitchCase,
    NgForOf,
  ],
})
export class SkeletonLoaderComponent {
  @Input() groups? = 1;
  @Input() view?: 'line' | 'card' | 'panel' | 'aliases' | 'inline' = 'line';
  @Input() itemsInRow? = 3;

  public row(n: number): Array<number> {
    return Array(n);
  }
}
