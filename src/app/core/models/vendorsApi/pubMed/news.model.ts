interface IPublicationsList {
  total: number;
  page: number;
  items: IPublication[];
}

export interface IPublication {
  gene: string;
  uid: string;
  url: string;
  title: string;
  sortTitle: string;
  date: number; // unix timestamp
}
