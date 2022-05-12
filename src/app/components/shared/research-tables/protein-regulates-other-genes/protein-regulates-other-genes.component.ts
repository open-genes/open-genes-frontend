import { Component } from '@angular/core';
import { ResearchTables } from '../research-tables';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-protein-regulates-other-genes',
  templateUrl: './protein-regulates-other-genes.component.html',
  styleUrls: ['./protein-regulates-other-genes.component.scss'],
})
export class ProteinRegulatesOtherGenesComponent extends ResearchTables {

  constructor(protected dialog: MatDialog) {
    super(dialog);
  }
}
