import { Component, EventEmitter, Output } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
// import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-wizard-sheet',
  templateUrl: './wizard-sheet.component.html',
  styleUrls: ['./wizard-sheet.component.scss'],
})
export class WizardSheetComponent {
  @Output()
  wizardSheetCloseEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  // constructor(
  //   @Inject(MAT_BOTTOM_SHEET_DATA) public data: {}
  // ) {}

  public goBack(stepper: MatStepper) {
    stepper.previous();
  }

  public goForward(stepper: MatStepper) {
    stepper.next();
  }

  public close(): void {
    console.log(this.wizardSheetCloseEvent);
    this.wizardSheetCloseEvent.emit(true);
  }
}
