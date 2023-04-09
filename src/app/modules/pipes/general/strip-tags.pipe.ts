import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "stripTags",
})
export class StripTagsPipe implements PipeTransform {
  transform(value: string): any {
    return value
      .replace(/&#{0,1}[a-z0-9]+;/gim, "") // Replace html entities such as &nbsp;
      .replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gim, "") // Strip tags
      .replace(/^\[/gim, "") // Replace opening square braces
      .replace(/\].$/gim, "."); // Replace closing square braces
  }
}
