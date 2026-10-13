
import { useState } from 'react'
import './SavedLooks.css'

const readStorage = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || []
  } catch {
    return []
  }
}

function getItemName(item) {
  if (!item) return ''
  if (typeof item === 'string') return item
  return item.name || 'Clothing Item'
}

function SavedLooks() {
  const [outfits, setOutfits] = useState(() =>
    readStorage('closetlyOutfits')
  )

  const [favorites, setFavorites] = useState(() =>
    readStorage('closetlyFavorites')
  )

  const [search, setSearch] = useState('')
  const [showSchedule, setShowSchedule] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const saveOutfits = (updated) => {
    setOutfits(updated)
    localStorage.setItem('closetlyOutfits', JSON.stringify(updated))
  }

  const saveFavorites = (updated) => {
    setFavorites(updated)
    localStorage.setItem('closetlyFavorites', JSON.stringify(updated))
  }

  const isFavorite = (outfit) =>
    favorites.some((item) => item.id === outfit.id)

  const toggleFavorite = (outfit) => {
    const updated = isFavorite(outfit)
      ? favorites.filter((item) => item.id !== outfit.id)
      : [...favorites, outfit]

    saveFavorites(updated)
  }

  const scheduleOutfit = (outfit, date) => {
    const updated = outfits.map((item) =>
      item.id === outfit.id
        ? { ...item, scheduledFor: date || '' }
        : item
    )

    saveOutfits(updated)
    setShowSchedule(null)
  }

  const deleteOutfit = (id) => {
    saveOutfits(outfits.filter((item) => item.id !== id))
    saveFavorites(favorites.filter((item) => item.id !== id))
    setDeleteId(null)
  }

  const filteredOutfits = outfits.filter((outfit) => {
    const query = search.toLowerCase()

    const clothingNames = [
      outfit.top,
      outfit.bottom,
      outfit.dress,
      outfit.outerwear,
    ]
      .map(getItemName)
      .join(' ')

    return `${outfit.name || ''} ${outfit.occasion || ''} ${clothingNames}`
      .toLowerCase()
      .includes(query)
  })

  return (
    <main className="saved-looks-page">
      <header className="saved-looks-header">
        <div>
          <span className="saved-eyebrow">YOUR PERSONAL COLLECTION</span>
          <h1>Saved Looks</h1>
          <p>
            All your outfit ideas, ready for whenever you need them.
          </p>
        </div>

        <span className="saved-count">
          {outfits.length} {outfits.length === 1 ? 'Look' : 'Looks'}
        </span>
      </header>

      <div className="saved-toolbar">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search your saved looks..."
          aria-label="Search saved looks"
        />
      </div>

      {filteredOutfits.length > 0 ? (
        <div className="saved-looks-grid">
          {filteredOutfits.map((outfit) => {
            const items = [
              outfit.top,
              outfit.bottom,
              outfit.dress,
              outfit.outerwear,
            ].filter(Boolean)

            return (
              <article className="saved-look-card" key={outfit.id}>
                <div className="saved-look-preview">
                  <div className="saved-look-monogram">C</div>

                  <span className="saved-look-shape">
                    {outfit.bodyShape || 'Your style'}
                  </span>

                  <button
                    type="button"
                    className={`saved-heart ${
                      isFavorite(outfit) ? 'is-favorite' : ''
                    }`}
                    onClick={() => toggleFavorite(outfit)}
                    aria-label={
                      isFavorite(outfit)
                        ? 'Remove from favorites'
                        : 'Add to favorites'
                    }
                    title={
                      isFavorite(outfit)
                        ? 'Remove from Favorites'
                        : 'Add to Favorites'
                    }
                  >
                    {isFavorite(outfit) ? '♥' : '♡'}
                  </button>

                  <span className="saved-look-view">
                    {outfit.view || 'Front view'}
                  </span>
                </div>

                <div className="saved-look-info">
                  <div className="saved-look-title-row">
                    <div>
                      <h2>{outfit.name || 'My Outfit'}</h2>
                      <span className="saved-occasion">
                        {outfit.occasion || 'Custom'}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="saved-delete-icon"
                      onClick={() => setDeleteId(outfit.id)}
                      aria-label={`Delete ${outfit.name || 'outfit'}`}
                      title="Delete outfit"
                    >
                      ×
                    </button>
                  </div>

                  <p className="saved-description">
                    {outfit.description || 'A look created just for you.'}
                  </p>

                  <div className="saved-clothing-list">
                    {items.length ? (
                      items.map((item, index) => (
                        <span key={`${outfit.id}-${index}`}>
                          {getItemName(item)}
                        </span>
                      ))
                    ) : (
                      <span>No clothing details available</span>
                    )}
                  </div>

                  <div className="saved-schedule">
                    {outfit.scheduledFor ? (
                      <p>
                        <span>Planned for</span>
                        <strong>
                          {outfit.scheduledFor}
                        </strong>
                      </p>
                    ) : (
                      <p>Not scheduled yet</p>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setShowSchedule(
                          showSchedule === outfit.id ? null : outfit.id
                        )
                      }
                    >
                      {outfit.scheduledFor ? 'Change date' : 'Plan this look'}
                    </button>
                  </div>

                  {showSchedule === outfit.id && (
                    <div className="saved-date-editor">
                      <label htmlFor={`schedule-${outfit.id}`}>
                        When will you wear it?
                      </label>

                      <input
                        id={`schedule-${outfit.id}`}
                        type="date"
                        value={outfit.scheduledFor || ''}
                        onChange={(event) =>
                          scheduleOutfit(outfit, event.target.value)
                        }
                      />

                      {outfit.scheduledFor && (
                        <button
                          type="button"
                          className="clear-date"
                          onClick={() => scheduleOutfit(outfit, '')}
                        >
                          Clear date
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {deleteId === outfit.id && (
                  <div className="saved-delete-confirm">
                    <p>
                      Delete this outfit? It will also be removed from
                      Favorites.
                    </p>

                    <div>
                      <button
                        type="button"
                        onClick={() => setDeleteId(null)}
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        className="confirm-delete"
                        onClick={() => deleteOutfit(outfit.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      ) : (
        <section className="saved-empty">
          <div className="saved-empty-icon">✧</div>

          <h2>
            {search ? 'No matching looks' : 'Your style story starts here'}
          </h2>

          <p>
            {search
              ? 'Try another search to find your saved outfits.'
              : 'Create an outfit and save it to build your personal collection.'}
          </p>
        </section>
      )}
    </main>
  )
}

export default SavedLooks
