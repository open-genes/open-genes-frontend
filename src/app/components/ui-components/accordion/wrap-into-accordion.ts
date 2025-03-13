export abstract class WrapIntoAccordion {
  public listLength = 0;
  public isAccordion = false;
  public maxItemsToShow = 1;
  public isAccordionOpen: boolean;

  protected setListLength(list): void {
    if (list) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.listLength = Object.keys(list).length;
    }
  }

  protected putItemsIntoAccordion(list): void {
    if (list && this.listLength !== 0) {
      if (this.listLength > this.maxItemsToShow) {
        // Avoid a case when there is only one item left inside an accordion.
        // In this case we show the whole list.
        this.isAccordion = this.listLength - this.maxItemsToShow !== 1;
      } else {
        this.isAccordion = false;
      }
    }
  }

  public toggleAccordion(): void {
    this.isAccordionOpen = !this.isAccordionOpen;
  }
}
