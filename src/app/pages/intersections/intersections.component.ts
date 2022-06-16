import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-intersections-page',
  templateUrl: './intersections.component.html',
  styleUrls: ['./intersections.component.scss'],
})
export class IntersectionPageComponent implements OnInit {
  public dataGroup1 = [1, 3, 4, 9];
  public dataGroup2 = [1, 2, 3, 5];

  ngOnInit(): void {

  }
}
