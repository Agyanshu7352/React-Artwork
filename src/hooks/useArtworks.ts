import { useState, useEffect } from "react";
import type { Artwork, ApiResponse } from "../types/artwork";

const ROWS_PER_PAGE = 12;

export function useArtworks(page: number) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchArtworks = async () => {
      setLoading(true);
      setError(null);

      try {
        const fields = "id,title,place_of_origin,artist_display,inscriptions,date_start,date_end";
        const res = await fetch(
          `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${ROWS_PER_PAGE}&fields=${fields}`
        );

        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        const json: ApiResponse = await res.json();

        if (!cancelled) {
          setArtworks(json.data);
          setTotalRecords(json.pagination.total);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to fetch");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchArtworks();

    return () => {
      cancelled = true;
    };
  }, [page]);

  return { artworks, totalRecords, loading, error, rowsPerPage: ROWS_PER_PAGE };
}