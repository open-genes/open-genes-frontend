import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MaterialModule } from '../../../modules/third-party/material.module';
import { NgIf } from '@angular/common';
import { AlertComponentInterface } from '../../../core/services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  standalone: true,
  imports: [MaterialModule, NgIf],
})
export class AlertComponent implements AlertComponentInterface {
  @Input() hasCloseButton: boolean;
  @Output() closeEvent: EventEmitter<never> = new EventEmitter<never>();
}
