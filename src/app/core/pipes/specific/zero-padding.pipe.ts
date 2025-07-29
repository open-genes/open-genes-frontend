import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "zero",
})
export class ZeroPaddingPipe implements PipeTransform {
  transform(num: string): string {
    if (num.length !== 0) {
      const s = "0000000" + num;
      return s.substr(num.length);
    } else {
      return "";
    }
  }
}
