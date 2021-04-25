import { Component, Input, OnInit } from '@angular/core';
import { GenesListSettings } from '../../genes-list-settings.model';

@Component({
  selector: 'app-genes-table-header',
  templateUrl: './genes-table-header.component.html',
  styleUrls: ['./genes-table-header.component.scss']
})
export class GenesTableHeaderComponent implements OnInit {
  @Input() settings: GenesListSettings;
  @Input() isGoTermsMode: boolean;

  constructor() { }

  ngOnInit(): void {
  }
}
