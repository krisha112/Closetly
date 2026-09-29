import { useState } from 'react'
import './App.css'
import OutfitBuilder from './components/OutfitBuilder/OutfitBuilder'

function App() {
  const [activePage, setActivePage] = useState('home')

  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="navbar">

        <div
          className="logo"
          onClick={() => setActivePage('home')}
        >
          Closetly
        </div>

        <div className="nav-links">

          <span
            className={activePage === 'home' ? 'active-nav' : ''}
            onClick={() => setActivePage('home')}
          >
            Home
          </span>

          <span
            className={activePage === 'outfitBuilder' ? 'active-nav' : ''}
            onClick={() => setActivePage('outfitBuilder')}
          >
            Outfit Builder
          </span>

          <span
            className={activePage === 'outfits' ? 'active-nav' : ''}
            onClick={() => setActivePage('outfits')}
          >
            My Outfits
          </span>

          <span
            className={activePage === 'favorites' ? 'active-nav' : ''}
            onClick={() => setActivePage('favorites')}
          >
            Favorites
          </span>

        </div>

      </nav>


      {/* HOME PAGE */}
      {activePage === 'home' && (
        <main className="hero">

          <h1>Create Your Perfect Outfit</h1>

          <p>
            Mix and match your wardrobe items to create outfits you love.
          </p>

          <div className="hero-buttons">

            <button
              onClick={() => setActivePage('outfitBuilder')}
            >
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


      {/* OUTFIT BUILDER */}
      {activePage === 'outfitBuilder' && (
        <OutfitBuilder />
      )}


      {/* MY OUTFITS */}
      {activePage === 'outfits' && (
        <main className="page-content">

          <h1>My Outfits</h1>

          <p>
            Your saved outfit combinations will appear here.
          </p>

        </main>
      )}


      {/* FAVORITES */}
      {activePage === 'favorites' && (
        <main className="page-content">

          <h1>Favorite Outfits</h1>

          <p>
            Your favorite saved outfits will appear here.
          </p>

        </main>
      )}

    </div>
  )
}

export default App