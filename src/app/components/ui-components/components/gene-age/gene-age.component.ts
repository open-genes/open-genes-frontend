import { Component, Input, OnInit } from '@angular/core';
import { Gene } from '../../../../core/models';

@Component({
  selector: 'app-gene-age',
  templateUrl: './gene-age.component.html',
  styleUrls: ['./gene-age.component.scss']
})
export class GeneAgeComponent implements OnInit {
  @Input() gene: Gene;

  constructor() { }

  ngOnInit(): void {
  }
}
