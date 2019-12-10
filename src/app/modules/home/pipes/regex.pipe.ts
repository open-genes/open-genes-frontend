import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'regex'
})

export class HighlightSearch implements PipeTransform {
  transform(value: any, args: any): any {
    if (!args) {
      return value;
    }

    return value.replace(new RegExp(args, 'gi'), '');
  }
}
