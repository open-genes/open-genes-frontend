import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  standalone: true,
})
export class AccordionComponent {
  @Input() isOpen = false;
  @Input() clickable = true;
  @Output() isStateOpen: EventEmitter<boolean> = new EventEmitter();
  @HostListener('click', ['$event.target']) toggle(): void {
    if (this.clickable) {
      this.isOpen = !this.isOpen;
      this.isStateOpen.emit(this.isOpen);
    }
  }
}
