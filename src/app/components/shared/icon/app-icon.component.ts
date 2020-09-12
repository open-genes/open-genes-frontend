import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IconService } from './services/app-icon.service';
import { ICON_SIZE, ICON_SIZE_ENUM_TO_TYPE } from './core/icon-size.enum';
import { IconStyles } from './core/icon-styles.interface';

@Component({
  selector: 'app-icon',
  templateUrl: './app-icon.component.html',
  styleUrls: ['./app-icon.component.scss']
})
export class IconComponent implements OnChanges {

  @Input()
  set icon(value: string) {
    this.iconSrc = this.iconService.resolveIconSrc(value);
  }
  iconSrc: string;

  @Input()
  staticSrc = '';

  @Input()
  size: ICON_SIZE_ENUM_TO_TYPE = ICON_SIZE.small;

  @Input()
  rotateDeg = 0;

  @Input()
  customWidth = '';

  @Input()
  customHeight = '';

  SizeEnum = ICON_SIZE;
  customStyles: IconStyles = {};

  private styles: IconStyles = {};

  constructor(private iconService: IconService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes['customWidth']) {
      this.styles.width = changes['customWidth'].currentValue;
    }

    if (!!changes['customHeight']) {
      this.styles.height = changes['customHeight'].currentValue;
    }

    if (!!changes['rotateDeg']) {
      this.styles.transform = `rotate(${changes['rotateDeg'].currentValue}deg)`;
    }

    this.updateStyles();
  }

  private updateStyles() {
    if (this.size === ICON_SIZE.custom) {
      this.customStyles = this.styles;
    } else {
      this.customStyles = {
        transform: this.styles.transform
      };
    }
  }
}
