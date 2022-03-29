export interface ApiResponse<T> {
  items: T[];
  options: PageOptions;
}

export interface PageOptions {
  objTotal: number;
  total: number;
  pagination: {
    page: number;
    pageSize: number;
    pagesTotal: number;
  };
}