import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "splitBy",
})
export class SplitByPipe implements PipeTransform {
  transform(value: string, [separator]): string {
    const splits = value.split(separator);
    if (splits.length > 1) {
      return splits.pop();
    } else {
      return "";
    }
  }
}
