import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements AfterViewInit, OnDestroy {
  @Input() width: string;
  @Input() top: string;
  @Input() left: string;
  @Input() right: string;
  @Input() zIndex: number;
  @Input() arrowPositionLeft = '20px'; // default
  @Input() arrowPositionRight: string;

  @Output() closeEvent: EventEmitter<void> = new EventEmitter();

  @ViewChild('popover') popover: ElementRef;

  ngAfterViewInit() {
    document.addEventListener('click', this.checkIfClickedInside, true);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.checkIfClickedInside, true);
  }

  private checkIfClickedInside = (event: Event) => {
    if (!this.popover.nativeElement.contains(event.target)) {
      this.closeEvent.emit();
    }
  }
}
