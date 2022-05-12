import { Component } from '@angular/core';
import { ResearchTables } from '../research-tables';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-intervention-affects-aging-process',
  templateUrl: './intervention-affects-aging-process.component.html',
  styleUrls: ['./intervention-affects-aging-process.component.scss'],
})
export class InterventionAffectsAgingProcessComponent extends ResearchTables {

  constructor(protected dialog: MatDialog) {
    super(dialog);
  }
}
