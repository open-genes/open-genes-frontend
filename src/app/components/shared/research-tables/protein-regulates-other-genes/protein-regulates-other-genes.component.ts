import { Component } from '@angular/core';
import { ResearchTables } from '../research-tables';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

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
