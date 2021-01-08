import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class IsIeService {
  readonly isInternetExplorer =
    !!(document as any).documentMode && (window as any).MSInputMethodContext;

  isIE() {
    return this.isInternetExplorer;
  }
}
