
import { useState } from 'react'
import './App.css'

import OutfitBuilder from './components/OutfitBuilder/OutfitBuilder'
import Favourites from './components/Favourites/Favourites'
import Wardrobe from './components/Wardrobe/Wardrobe'
import SavedLooks from './components/SavedLooks/SavedLooks'

function App() {
  const [activePage, setActivePage] = useState('home')

  const navigateTo = (page) => {
    setActivePage(page)
  }

  return (
    <div className="home">
      {/* SHARED SIDEBAR */}
      <aside className="sidebar">
        <div
          className="logo"
          onClick={() => navigateTo('home')}
        >
          Closetly
        </div>

        <nav className="sidebar-nav">
          <button
            className={activePage === 'home' ? 'active-nav' : ''}
            onClick={() => navigateTo('home')}
          >
            Dashboard
          </button>

          <button
            className={activePage === 'wardrobe' ? 'active-nav' : ''}
            onClick={() => navigateTo('wardrobe')}
          >
            Wardrobe
          </button>

          <button
            className={activePage === 'createOutfit' ? 'active-nav' : ''}
            onClick={() => navigateTo('createOutfit')}
          >
            Create Outfit
          </button>

          <button
            className={activePage === 'outfits' ? 'active-nav' : ''}
            onClick={() => navigateTo('outfits')}
          >
            Saved Looks
          </button>

          <button
            className={activePage === 'favorites' ? 'active-nav' : ''}
            onClick={() => navigateTo('favorites')}
          >
            Favorites
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* SHARED TOP BAR */}
        <header className="topbar">
          <div className="breadcrumb">
            <span>My Space</span>
            <span className="breadcrumb-divider">/</span>
            <strong>
              {activePage === 'home' && 'Dashboard'}
              {activePage === 'wardrobe' && 'Wardrobe'}
              {activePage === 'createOutfit' && 'Create Outfit'}
              {activePage === 'outfits' && 'Saved Looks'}
              {activePage === 'favorites' && 'Favorites'}
            </strong>
          </div>

          <div className="topbar-actions">
            <div className="topbar-search">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Search for clothes, outfits, or brands..."
              />
            </div>

            <button
              type="button"
              className="notification-button"
              aria-label="Notifications"
              title="Notifications"
            >
              ♧
            </button>

            <button
              type="button"
              className="profile-button"
              title="User profile"
            >
              <span className="profile-avatar">A</span>
              <span className="profile-name">Anushka</span>
              <span>
                ⌄</span>

            </button>

          </div>
        </header>
        {/* DASHBOARD */}
        {activePage === 'home' && (
          <main className="hero">
            <h1>Your style, your space.</h1>

            <p>
              Organize your wardrobe, create beautiful outfits,
              and make every day a stylish one.
            </p>

            <div className="hero-buttons">
              <button onClick={() => navigateTo('createOutfit')}>
                Create Outfit
              </button>

              <button
                className="secondary-btn"
                onClick={() => navigateTo('outfits')}
              >
                View Saved Looks
              </button>
            </div>
          </main>
        )}

        {/* WARDROBE */}
        {activePage === 'wardrobe' && <Wardrobe />}

        {/* CREATE OUTFIT */}
        {activePage === 'createOutfit' && (
          <OutfitBuilder onNavigate={navigateTo} />
        )}

        {/* SAVED LOOKS */}
        {activePage === 'outfits' && <SavedLooks />}

        {/* FAVORITES */}
        {activePage === 'favorites' && <Favourites />}
      </div>
    </div>
  )
}

export default App
