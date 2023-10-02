export type Pagination = {
    pageNumber: number,
    pageSize: number,
    pageCount: number,
  };

export const defaultPagination: Pagination = {
    pageNumber: 0,
    pageSize: 5,
    pageCount: 0,
  };