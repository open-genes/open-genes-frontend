import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "stripTags",
})
export class StripTagsPipe implements PipeTransform {
  transform(value: string): any {
    return value
      .replace(/&#{0,1}[a-z0-9]+;/gim, "") // Замена html entities
      .replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gim, "") // Замена html-тегов
      .replace(/^\[/gim, "") // Замена открывающей [
      .replace(/\].$/gim, "."); // Замена закрывающей ]
  }
}
