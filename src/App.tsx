import './index.css'
import ArtworkTable from './components/ArtworkTable'

function App() {
  return (
    <div className="max-w-100vw mx-auto px-2 py-8">
      <h1 className="text-2xl px-2 font-bold text-gray-800 mb-6">Artworks</h1>
      <ArtworkTable />
    </div>
  )
}

export default App