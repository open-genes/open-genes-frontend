import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "replace",
})
export class ReplacePipe implements PipeTransform {
  transform(value: any, regexValue: string, replaceValue: string): any {
    const formattedValue = value.toString();
    const regex = new RegExp(regexValue, "g");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return formattedValue.replace(regex, replaceValue);
  }
}
