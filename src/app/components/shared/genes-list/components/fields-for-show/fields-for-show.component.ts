import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GenesListSettings } from '../../genes-list-settings.model';
import { FilterService } from '../../services/filter.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-fields-for-show',
  templateUrl: './fields-for-show.component.html',
  styleUrls: ['./fields-for-show.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsForShowComponent implements OnInit {
  public listSettings: GenesListSettings;

  private _subscription$ = new Subject();

  constructor(
    private _dialogRef: MatDialogRef<FieldsForShowComponent>,
    private _filterService: FilterService,
    private _cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.updateCurrentFields();
  }

  /**
   * Update list view
   */

  private updateCurrentFields() {
    this._filterService.currentFields
      .pipe(
        takeUntil(this._subscription$)
      )
      .subscribe((fields) => {
        this.listSettings = fields;
        this._cdRef.markForCheck();
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
      default:
        break;
    }
    this._filterService.updateFields(this.listSettings);
  }

  public onClose(): void {
    this._dialogRef.close();
  }
}
