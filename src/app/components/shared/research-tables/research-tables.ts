import { Directive, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdditionalInterventionResolver } from '../../../core/utils/additional-intervention-resolver';
import { CommonModalComponent } from '../../ui-components/modals/common-modal/common-modal.component';

@Directive()
export abstract class ResearchTables extends AdditionalInterventionResolver {
  @Input() items: any;
  @Input() numberColumn: boolean;
  @Input() geneColumnOn: boolean;
  @Input() showTitle = true;
  @Input() slice: number;

  protected constructor(protected dialog: MatDialog) {
    super();
  }

  public openCommentModal(title, body, template = null): void {
    this.dialog.open(CommonModalComponent, {
      data: { title: title, body: body, template: template },
      panelClass: 'comment-modal',
      minWidth: '320px',
      maxWidth: '768px',
      autoFocus: false,
    });
  }

  public outputTemperaturesRange(a: string | number, b: string | number): string {
    if (b) {
      if (b === a) {
        return `${a}C°`;
      } else if (b > a) {
        return `${a}—${b}C°`;
      }
    } else {
      return `${a}C°`;
    }
  }

  public outputValueWithUnit(value: string | number, unit: string): string {
    // We don't know what unit will be, so we use the basic rule for formatting them
    if (unit && unit.length !== 0) {
      if (unit.length > 1) {
        return `${value} ${unit}`; // 10 days
      } else {
        return `${value}${unit}`; // 10%
      }
    }
    return `${value}`; // 10
  }

  public formatUnitGrammaticalCase(num: number, unitStr: string): string {
    const preLastDigit = (num % 100) / 10;

    if (unitStr === 'минуты') {
      if (preLastDigit == 1) {
        return 'минут';
      }

      switch (num % 10) {
        case 1:
          return 'минута';
        case 2:
        case 3:
        case 4:
          return 'минут';
        default:
          return 'минут';
      }
    }

    if (unitStr === 'minutes') {
      if (preLastDigit == 1) {
        return 'minutes';
      }

      switch (num % 10) {
        case 1:
          return 'minute';
        default:
          return 'minutes';
      }
    }

    if (unitStr === 'часы') {
      if (preLastDigit == 1) {
        return 'часов';
      }

      switch (num % 10) {
        case 1:
          return 'час';
        case 2:
        case 3:
        case 4:
          return 'часа';
        default:
          return 'часов';
      }
    }

    if (unitStr === 'hours') {
      if (preLastDigit == 1) {
        return 'hours';
      }

      switch (num % 10) {
        case 1:
          return 'hour';
        default:
          return 'hours';
      }
    }

    if (unitStr === 'дни') {
      if (preLastDigit == 1) {
        return 'дней';
      }

      switch (num % 10) {
        case 1:
          return 'день';
        case 2:
        case 3:
        case 4:
          return 'дня';
        default:
          return 'дней';
      }
    }

    if (unitStr === 'days') {
      if (preLastDigit == 1) {
        return 'days';
      }

      switch (num % 10) {
        case 1:
          return 'day';
        default:
          return 'days';
      }
    }

    if (unitStr === 'недели') {
      if (preLastDigit == 1) {
        return 'недель';
      }

      switch (num % 10) {
        case 1:
          return 'неделя';
        case 2:
        case 3:
        case 4:
          return 'недели';
        default:
          return 'недель';
      }
    }

    if (unitStr === 'weeks') {
      if (preLastDigit == 1) {
        return 'weeks';
      }

      switch (num % 10) {
        case 1:
          return 'week';
        default:
          return 'weeks';
      }
    }

    if (unitStr === 'месяцы') {
      if (preLastDigit == 1) {
        return 'месяцев';
      }

      switch (num % 10) {
        case 1:
          return 'месяц';
        case 2:
        case 3:
        case 4:
          return 'месяца';
        default:
          return 'месяцев';
      }
    }

    if (unitStr === 'month') {
      if (preLastDigit == 1) {
        return 'months';
      }

      switch (num % 10) {
        case 1:
          return 'month';
        default:
          return 'months';
      }
    }

    if (unitStr === 'weeks') {
      if (preLastDigit == 1) {
        return 'weeks';
      }

      switch (num % 10) {
        case 1:
          return 'week';
        default:
          return 'weeks';
      }
    }

    if (unitStr === 'годы') {
      if (preLastDigit == 1) {
        return 'лет';
      }

      switch (num % 10) {
        case 1:
          return 'год';
        case 2:
        case 3:
        case 4:
          return 'лет';
        default:
          return 'лет';
      }
    }

    if (unitStr === 'years') {
      if (preLastDigit == 1) {
        return 'years';
      }

      switch (num % 10) {
        case 1:
          return 'year';
        default:
          return 'years';
      }
    }
  }
}
