import { Component, Input, OnInit } from '@angular/core';
import { Gene } from '../../../core/models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-gene-reference',
  templateUrl: './gene-reference.component.html',
  styleUrls: ['./gene-reference.component.scss'],
})
export class GeneReferenceComponent implements OnInit {
  @Input() gene: Gene;

  constructor(public translate: TranslateService) {}

  ngOnInit(): void {}
}
