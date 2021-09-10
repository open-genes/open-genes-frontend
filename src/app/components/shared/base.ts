export abstract class Base {
  protected listLength = 0;
  protected isAccordion = false;
  protected maxItemsToShow = 1;
  protected isAccordionOpen: boolean;



  protected setListLength(list): void {
    if (list) {
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

  protected toggleAccordion(event: boolean): void {
    this.isAccordionOpen = event;
  }
}
