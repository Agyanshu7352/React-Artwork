import { useRef, useState, useEffect, useCallback } from "react";
import { DataTable, type DataTableSelectionMultipleChangeEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { useArtworks } from "../hooks/useArtworks";
import type { Artwork } from "../types/artwork";

export default function ArtworkTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const { artworks, totalRecords, loading, error, rowsPerPage } = useArtworks(currentPage);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkTarget, setBulkTarget] = useState<number>(0);

  const overlayRef = useRef<OverlayPanel>(null);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");

  const selectedRows = artworks.filter((a) => selectedIds.has(a.id));


  useEffect(() => {
    if (bulkTarget <= 0) return;

    setSelectedIds((prev) => {
      if (prev.size >= bulkTarget) return prev;

      const needed = bulkTarget - prev.size;
      const candidates = artworks.filter((a) => !prev.has(a.id));
      const toAdd = candidates.slice(0, needed);

      if (toAdd.length === 0) return prev;

      const next = new Set(prev);
      toAdd.forEach((a) => next.add(a.id));
      return next;
    });
  }, [artworks, bulkTarget]);

  const handleSelectionChange = useCallback(
    (e: DataTableSelectionMultipleChangeEvent<Artwork[]>) => {
      const nowSelected = (e.value as Artwork[]).map((a) => a.id);
      const nowSelectedSet = new Set(nowSelected);
      const pageIds = new Set(artworks.map((a) => a.id));

      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => {
          if (nowSelectedSet.has(id)) {
            next.add(id);
          } else {
            next.delete(id);
          }
        });
        return next;
      });

      setBulkTarget(0);
    },
    [artworks]
  );

  const handleBulkApply = () => {
    const n = parseInt(inputValue, 10);

    if (isNaN(n) || n < 1) {
      setInputError("Enter a valid number greater than 0");
      return;
    }

    if (n > totalRecords) {
      setInputError(`Max available is ${totalRecords.toLocaleString()}`);
      return;
    }

    setSelectedIds(new Set());
    setBulkTarget(n);
    setInputValue("");
    setInputError("");
    overlayRef.current?.hide();
  };

  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const first = (currentPage - 1) * rowsPerPage + 1;
  const last = Math.min(currentPage * rowsPerPage, totalRecords);

  const titleBody = (row: Artwork) => (
    <span className="font-medium text-gray-900 text-sm">{row.title || "—"}</span>
  );

  const artistBody = (row: Artwork) => (
    <span className="text-gray-500 text-xs whitespace-pre-line">
      {row.artist_display || "—"}
    </span>
  );

  const inscriptionBody = (row: Artwork) => {
    if (!row.inscriptions) return <span className="text-gray-400 italic text-xs">None</span>;
    const text = row.inscriptions.length > 80
      ? row.inscriptions.slice(0, 80) + "…"
      : row.inscriptions;
    return <span className="text-gray-500 text-xs">{text}</span>;
  };

  const selectionHeader = () => (
    <div className="flex items-center">
      <button
        type="button"
        onClick={(e) => {
          setInputError("");
          overlayRef.current?.toggle(e);
        }}
        className="p-1 rounded hover:bg-white/20 transition-colors"
        title="Select rows"
        aria-label="Open row selection panel"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-0">
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between px-2 py-2 bg-blue-50 border border-blue-200 rounded-t-lg text-sm text-blue-700">
          <span>
            <strong>{selectedIds.size}</strong> artwork{selectedIds.size !== 1 ? "s" : ""} selected
            {bulkTarget > 0 && selectedIds.size < bulkTarget && (
              <span className="ml-2 text-blue-500">
                (filling {selectedIds.size}/{bulkTarget} — browse pages to fill remaining)
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={() => {
              setSelectedIds(new Set());
              setBulkTarget(0);
            }}
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            Clear all
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          Failed to load artworks: {error}
        </div>
      )}

      <div className="border border-gray-200 rounded-b-lg overflow-hidden shadow-sm">
        <DataTable<Artwork[]>
          value={artworks}
          loading={loading}
          selection={selectedRows}
          onSelectionChange={handleSelectionChange}
          selectionMode="checkbox"
          dataKey="id"
          tableStyle={{ minWidth: "55rem" }}
          showGridlines={false}
          stripedRows
          emptyMessage={
            <div className="py-12 text-center text-gray-400">No artworks found.</div>
          }
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3.5rem", textAlign: "center" }}
            bodyStyle={{ textAlign: "center" }}
            header={selectionHeader}
          />
          <Column field="title" header="Title" body={titleBody} style={{ minWidth: "16rem" }} />
          <Column
            field="place_of_origin"
            header="Place of Origin"
            body={(row: Artwork) =>
              row.place_of_origin || <span className="text-gray-400">—</span>
            }
            style={{ minWidth: "9rem" }}
          />
          <Column field="artist_display" header="Artist" body={artistBody} style={{ minWidth: "14rem" }} />
          <Column field="inscriptions" header="Inscriptions" body={inscriptionBody} style={{ minWidth: "12rem" }} />
          <Column
            field="start_date"
            header="Start Date"
            body={(row: Artwork) => (
              <span className="font-mono text-sm text-gray-700">{row.start_date ?? "—"}</span>
            )}
            style={{ minWidth: "7rem" }}
          />
          <Column
            field="end_date"
            header="End Date"
            body={(row: Artwork) => (
              <span className="font-mono text-sm text-gray-700">{row.end_date ?? "—"}</span>
            )}
            style={{ minWidth: "7rem" }}
          />
        </DataTable>
      </div>

      {totalRecords > 0 && (
        <div className="flex items-center justify-between mt-3 px-1">
          <div className="text-sm text-gray-600">
            Showing <strong>{first}</strong> to <strong>{last}</strong> of <strong>{totalRecords.toLocaleString()}</strong> entries
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="min-w-[2rem] h-8 px-3 text-sm border border-gray-300 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            {getPageNumbers().map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`min-w-[2rem] h-8 px-2 text-sm border rounded transition-colors ${page === currentPage
                    ? "bg-[#5b6abf] border-[#5b6abf] text-white"
                    : "border-gray-300 hover:bg-gray-50"
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="min-w-[2rem] h-8 px-3 text-sm border border-gray-300 rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <OverlayPanel ref={overlayRef} className="w-72 shadow-xl">
        <div className="p-2 flex flex-col gap-3">
          <div>
            <h3 className="font-semibold text-gray-800 text-base">Select rows</h3>
            <p className="text-xs text-gray-500 mt-1">
              Enter how many rows to select.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="bulk-input" className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Number of rows
            </label>
            <input
              id="bulk-input"
              type="number"
              min={1}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setInputError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleBulkApply()}
              placeholder="e.g. 25"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            {inputError && <p className="text-xs text-red-500">{inputError}</p>}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleBulkApply}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded transition-colors"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => {
                setInputValue("");
                setInputError("");
                overlayRef.current?.hide();
              }}
              className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium py-2 rounded transition-colors"
            >
              Cancel
            </button>
          </div>

          {bulkTarget > 0 && (
            <p className="text-xs text-center text-blue-600 font-mono">
              {selectedIds.size} / {bulkTarget} selected
            </p>
          )}
        </div>
      </OverlayPanel>
    </div>
  );
}