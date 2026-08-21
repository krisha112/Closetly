import { useState } from 'react'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('home')

  return (
    <div className="home">
      <nav className="navbar">
        <div
          className="logo"
          onClick={() => setActivePage('home')}
        >
          Closetly
        </div>

        <div className="nav-links">
          <span onClick={() => setActivePage('home')}>Home</span>
          <span onClick={() => setActivePage('outfitBuilder')}>
            Outfit Builder
          </span>
          <span onClick={() => setActivePage('outfits')}>
            My Outfits
          </span>
          <span onClick={() => setActivePage('favorites')}>
            Favorites
          </span>
        </div>
      </nav>

      {activePage === 'home' && (
        <main className="hero">
          <h1>Create Your Perfect Outfit</h1>
          <p>
            Mix and match your wardrobe items to create outfits you love.
          </p>

          <div className="hero-buttons">
            <button onClick={() => setActivePage('outfitBuilder')}>
              Create Outfit
            </button>

            <button
              className="secondary-btn"
              onClick={() => setActivePage('outfits')}
            >
              View My Outfits
            </button>
          </div>
        </main>
      )}

      {activePage === 'outfitBuilder' && (
        <main className="page-content">
          <h1>Outfit Builder</h1>
          <p>
            Choose your body shape and start creating your outfit.
          </p>
        </main>
      )}

      {activePage === 'outfits' && (
        <main className="page-content">
          <h1>My Outfits</h1>
          <p>Your saved outfit combinations will appear here.</p>
        </main>
      )}

      {activePage === 'favorites' && (
        <main className="page-content">
          <h1>Favorite Outfits</h1>
          <p>Your favorite saved outfits will appear here.</p>
        </main>
      )}
    </div>
  )
}

export default App