import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filters: any;

  constructor() {
  }

  public clustersFilter(clusterId: number, filterModel: any) {
    console.log('filterByFuncClusters triggered!');
    this.filters = filterModel;
    if (!this.filters.byClasses.includes(clusterId)) {
      this.filters.byClasses.push(clusterId);
    } else {
      this.filters.byClasses = this.filters.byClasses.filter(item => item !== clusterId);
    }
  }
}



