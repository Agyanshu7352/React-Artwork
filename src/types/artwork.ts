export interface Artwork {
  id: number;
  title: string;
  place_of_origin: string | null;
  artist_display: string | null;
  inscriptions: string | null;
  start_date: number | null;
  end_date: number | null;
}

export interface ApiPagination {
  total: number;
  limit: number;
  offset: number;
  total_pages: number;
  current_page: number;
}

export interface ApiResponse {
  data: Artwork[];
  pagination: ApiPagination;
}