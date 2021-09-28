import { Component, Input } from "@angular/core";

@Component({
  selector: "app-skeleton",
  templateUrl: "./skeleton.component.html",
  styleUrls: ["./skeleton.component.scss"],
})
export class SkeletonLoaderComponent {
  @Input()
  groups: number;
  quantity = Array;
}
