import { Component, Inject } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { WizardService } from '../wizard-service.service';

@Component({
  selector: 'app-wizard-sheet',
  templateUrl: './wizard-sheet.component.html',
  styleUrls: ['./wizard-sheet.component.scss'],
})
export class WizardSheetComponent {
  constructor(private wizardService: WizardService) {}

  public goBack(stepper: MatStepper) {
    stepper.previous();
  }

  public goForward(stepper: MatStepper) {
    stepper.next();
  }

  public close(): void {
    this.wizardService.close();
  }
}
