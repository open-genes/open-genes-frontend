import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-intersections-page',
  templateUrl: './intersections.component.html',
  styleUrls: ['./intersections.component.scss'],
})
export class IntersectionPageComponent implements OnInit {
  public data = [
    {
      label: 'GHR',
      values: ['glucose metabolism', 'lipid metabolism', 'insulin sensitivity'],
    },
    {
      label: 'GHRH',
      values: ['glucose metabolism', 'stress response', 'inflamation'],
    },
    {
      label: 'AGTR1',
      values: ['insulin sensitivity', 'cognitive function', 'inflamation'],
    },
    {
      label: 'SIRT',
      values: ['insulin sensitivity', 'cognitive function', 'inflamation', 'stress response',],
    },
    {
      label: 'SIRT1',
      values: ['insulin sensitivity', 'cognitive function', 'inflamation', 'stress response',],
    },
  ];
  public label = 'Genes intersection';

  ngOnInit(): void {}
}
