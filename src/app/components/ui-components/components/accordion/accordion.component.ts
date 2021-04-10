import { Component, EventEmitter, HostListener, Output } from "@angular/core";

@Component({
  selector: "app-accordion",
  templateUrl: "./accordion.component.html",
  styleUrls: ["./accordion.component.scss"],
})
export class AccordionComponent {
  @HostListener('click', ['$event.target']) toggle(): void {
    this.isOpen = !this.isOpen;
    this.isStateOpen.emit(this.isOpen);
  }

  public isOpen: boolean = false;
  @Output() isStateOpen: EventEmitter<boolean> = new EventEmitter();
}
