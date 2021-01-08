import { Component, Inject, Input } from "@angular/core";

@Component({
  selector: "app-burger-menu",
  templateUrl: "./burger-menu.component.html",
  styleUrls: ["./burger-menu.component.scss"],
})
export class BurgerMenuComponent {
  @Inject(Document) public document: Document;
  @Input() favsCounter: string;
  public isMenuVisible = false;

  public toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
    if (this.isMenuVisible === true) {
      document.body.classList.add("body--still");
    } else {
      document.body.classList.remove("body--still");
    }
  }
}
