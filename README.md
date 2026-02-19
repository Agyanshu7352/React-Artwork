<div align="center">

<h1>🎨 Art Institute of Chicago — Artwork Browser</h1>

<p>A sleek, production-ready React app to explore the world-renowned <strong>Art Institute of Chicago</strong> collection — with server-side pagination, persistent cross-page row selections, and bulk select all built in.</p>

<br/>

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![PrimeReact](https://img.shields.io/badge/PrimeReact-10-4CAF50?style=for-the-badge&logo=primereact&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **Server-side Pagination** | Fetches exactly 12 artworks per page from the API — no over-fetching |
| ☑️ **Persistent Row Selection** | Selected rows are remembered as you navigate between pages |
| 🔢 **Bulk Row Selection** | Enter a target count (e.g. 250) — rows accumulate lazily as you browse |
| ⚡ **Race-condition Safe** | Cancelled fetch pattern ensures stale responses never overwrite fresh ones |
| 🎨 **Clean Data Table** | Striped rows, custom column renderers, graceful empty/loading states |
| 📑 **Custom Paginator** | "Showing X to Y of N entries" summary + Previous / 1–5 / Next controls |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/growmeorganic.git
cd growmeorganic

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser — that's it!

---

## 🏗️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19 | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | Type safety |
| [Vite](https://vitejs.dev/) | 7 | Dev server & bundler |
| [PrimeReact](https://primereact.org/) | 10 | DataTable, OverlayPanel components |
| [PrimeIcons](https://primereact.org/icons/) | 7 | Icon set |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Utility-first styling |

---

## 📁 Project Structure

```
growmeorganic/
├── src/
│   ├── components/
│   │   └── ArtworkTable.tsx   # Main table: selection, pagination, overlay
│   ├── hooks/
│   │   └── useArtworks.ts     # Data-fetching hook (server-side, cancel-safe)
│   ├── types/
│   │   └── artwork.ts         # Artwork & API response interfaces
│   ├── App.tsx                # Root component
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── index.html
├── vite.config.ts
├── tsconfig.app.json
└── package.json
```

---

## 🔌 API Reference

This app uses the **public** [Art Institute of Chicago API](https://api.artic.edu/docs/) — no API key required.

```
GET https://api.artic.edu/api/v1/artworks
    ?page=<n>
    &limit=12
    &fields=id,title,place_of_origin,artist_display,inscriptions,date_start,date_end
```

**Columns displayed:**

| Column | API Field |
|---|---|
| Title | `title` |
| Place of Origin | `place_of_origin` |
| Artist | `artist_display` |
| Inscriptions | `inscriptions` |
| Start Date | `date_start` |
| End Date | `date_end` |

---

## 🧠 How Bulk Selection Works

> This is the interesting part 💡

The "Select Rows" dropdown lets you specify a target number — say **50**.

1. A `bulkTarget` state is set to `50`.
2. On every page load, a `useEffect` checks how many IDs are still needed.
3. It fills up from the currently visible artworks without any extra API calls.
4. As you browse naturally, the selection fills up until the target is reached.

**No prefetching. No extra calls. Pure lazy accumulation.**

---

## 📦 Available Scripts

```bash
npm run dev        # Start development server (HMR enabled)
npm run build      # Type-check + production bundle → ./dist
npm run preview    # Serve the production build locally
npm run lint       # Run ESLint
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

<div align="center">

Built with ❤️ using **React + PrimeReact + Tailwind CSS**

Data provided by the [Art Institute of Chicago](https://www.artic.edu/) under their [open access policy](https://www.artic.edu/open-access/open-access-images).

</div>
