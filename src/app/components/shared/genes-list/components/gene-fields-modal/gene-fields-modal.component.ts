import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GenesListSettings } from '../../genes-list-settings.model';
import { FilterService } from '../../services/filter.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-gene-fields-modal',
  templateUrl: './gene-fields-modal.component.html',
  styleUrls: ['./gene-fields-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneFieldsModalComponent implements OnInit {
  public listSettings: GenesListSettings;
  private subscription$ = new Subject();

  constructor(
    private dialogRef: MatDialogRef<GeneFieldsModalComponent>,
    private filterService: FilterService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.updateCurrentFields();
  }

  /**
   * Update list view
   */

  private updateCurrentFields() {
    this.filterService.currentFields.pipe(takeUntil(this.subscription$)).subscribe(
      (fields) => {
        this.listSettings = fields;
        this.cdRef.markForCheck();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * List view settings
   */

  public changeGenesListSettings(param: string): void {
    switch (param) {
      case 'gene-age':
        this.listSettings.ifShowAge = !this.listSettings.ifShowAge;
        break;
      case 'classes':
        this.listSettings.ifShowClasses = !this.listSettings.ifShowClasses;
        break;
      case 'expression':
        this.listSettings.ifShowExpression = !this.listSettings.ifShowExpression;
        break;
      case 'diseases':
        this.listSettings.ifShowDiseases = !this.listSettings.ifShowDiseases;
        break;
      case 'disease-categories':
        this.listSettings.ifShowDiseaseCategories = !this.listSettings.ifShowDiseaseCategories;
        break;
      case 'criteria':
        this.listSettings.ifShowCriteria = !this.listSettings.ifShowCriteria;
        break;
      case 'mechanisms':
        this.listSettings.ifShowAgingMechanisms = !this.listSettings.ifShowAgingMechanisms;
        break;
      default:
        break;
    }
    this.filterService.updateFields(this.listSettings);
  }

  public onClose(): void {
    this.dialogRef.close();
  }
}
