export interface ApiResponse<T> {
  items: T[];
  options: PageOptions;
}

interface PageOptions {
  objTotal: number;
  pagination: {
    page: number;
    pageSize: number;
    pagesTotal: number;
  };
}