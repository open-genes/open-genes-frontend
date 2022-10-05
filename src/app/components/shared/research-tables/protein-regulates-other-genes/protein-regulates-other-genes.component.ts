import { Component } from '@angular/core';
import { StudyTables } from '../research-tables';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-protein-regulates-other-genes',
  templateUrl: './protein-regulates-other-genes.component.html',
  styleUrls: ['./protein-regulates-other-genes.component.scss'],
})
export class ProteinRegulatesOtherGenesComponent extends StudyTables {

  constructor(protected dialog: MatDialog) {
    super(dialog);
  }
}
