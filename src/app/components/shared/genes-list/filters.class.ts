import { takeUntil } from 'rxjs/operators';

export abstract class FiltersClass {
  public filterByFuncClusters(id: number): void {
    this.filterService.filterByFuncClusters(id);
    this.filterService.getByFuncClusters().subscribe(
      (list) => {
        if (list.length !== 0) {
          this.apiService.getGenesByFunctionalClusters(list).subscribe(
            (genes) => {
              this.searchedData = genes;
              this.cdRef.markForCheck();
            },
            (error) => this.errorLogger(this, error)
          );
        }
      },
      (error) => this.errorLogger(this, error)
    );
  }

  public filterByExpressionChange(id: number): void {
    this.filterService.filterByExpressionChange(id);
    this.filterService.getByExpressionChange().subscribe(
      (expression) => {
        if (expression) {
          this.apiService.getGenesByExpressionChange(expression).subscribe(
            (genes) => {
              this.searchedData = genes;
              this.cdRef.markForCheck();
            },
            (error) => this.errorLogger(this, error)
          );
        }
      },
      (error) => this.errorLogger(this, error)
    );
  }

  public filterBySelectionCriteria(str: string): void {
    this.filterService.filterBySelectionCriteria(str);
    this.filterService.getBySelectionCriteria().subscribe(
      (list) => {
        if (list.length !== 0) {
          this.apiService.getGeneByHGNCsymbol(str)
            .pipe(takeUntil(this.subscription$))
            .subscribe(
              (gene) => {
                gene?.['commentCause'] ? this.searchedData = gene?.['commentCause'] : this.searchedData = [{ 1: ""}];

                this.cdRef.markForCheck();
              },
              (error) => this.errorLogger(this, error)
            );
        }
      },
      (error) => this.errorLogger(this, error)
    );
  }
}
