interface PublicationsList {
  total: number;
  page: number;
  items: Publication[];
}

export interface Publication {
  gene: string;
  uid: string;
  url: string;
  title: string;
  sortTitle: string;
  date: number; // unix timestamp
}
