export interface ApiResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
  }