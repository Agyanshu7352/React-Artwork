# GrowMeOrganic — Art Institute of Chicago Browser

A React app that displays artwork data from the [Art Institute of Chicago API](https://api.artic.edu/) using a PrimeReact DataTable with server-side pagination and persistent row selection.

## Features

- **Server-side pagination** — data is fetched per page from the API, never all at once.
- **Persistent row selection** — selected rows are remembered when navigating between pages. Only IDs are stored, not full row objects.
- **Bulk row selection** — overlay panel lets you enter a number N; rows are selected lazily as you browse pages, without prefetching.

## Tech Stack

- React 19 + TypeScript
- Vite
- PrimeReact DataTable
- Tailwind CSS v4

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview
```
# React-Artwork
