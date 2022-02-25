import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
})
export class SearchFilterPipe implements PipeTransform {
  transform(items: any[], searchTxt: string): any[] {
    if (!items || !items.length) return items;
    if (!searchTxt || !searchTxt.length) return items;
    return items.filter((item) => {
      return item.viewValue.toString().toLowerCase().indexOf(searchTxt.toLowerCase()) > -1;
    });
  }
}
