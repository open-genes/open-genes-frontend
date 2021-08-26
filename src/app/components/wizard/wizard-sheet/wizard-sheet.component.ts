import { Component } from '@angular/core';
import { WizardService } from '../wizard-service.service';

@Component({
  selector: 'app-wizard-sheet',
  templateUrl: './wizard-sheet.component.html',
  styleUrls: ['./wizard-sheet.component.scss'],
})
export class WizardSheetComponent {
  constructor(private wizardService: WizardService) {}

  public close(): void {
    this.wizardService.close();
  }
}
