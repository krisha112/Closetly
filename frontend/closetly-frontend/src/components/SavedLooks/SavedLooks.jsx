import { useState, useEffect } from 'react'
import './SavedLooks.css'

const API_URL = 'http://localhost:5000/api/outfits'

// Temporary ID until authentication is integrated
const USER_ID = 'test-user-1'

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
const [outfits, setOutfits] = useState(() => {
  const saved = readStorage('closetlyOutfits')
  console.log('SavedLooks loaded outfits:', saved)
  return saved
})
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')


    useEffect(() => {
    const fetchOutfits = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_URL}?userId=${USER_ID}`
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Failed to load outfits')
        }

        setOutfits(result.data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOutfits()
  }, [])

  const [search, setSearch] = useState('')
  const [showSchedule, setShowSchedule] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const saveOutfits = (updated) => {
    setOutfits(updated)
    localStorage.setItem('closetlyOutfits', JSON.stringify(updated))
  }
  
const isFavorite = (outfit) => outfit.isFavorite === true;

const toggleFavorite = async (outfit) => {
  const nextFavorite = !outfit.isFavorite;

  try {
    const response = await fetch(
      `${API_URL}/${outfit._id}/favorite`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isFavorite: nextFavorite,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Could not update favorite.');
    }

    setOutfits((previous) =>
      previous.map((item) =>
        item._id === outfit._id
          ? { ...item, ...result.data }
          : item
      )
    );
  } catch (err) {
    console.error('Favorite update error:', err);
    setError(err.message || 'Could not update favorite. Please try again.');
  }
};


  

  const scheduleOutfit = (outfit, date) => {
    const updated = outfits.map((item) =>
      item.id === outfit._id
        ? { ...item, scheduledFor: date || '' }
        : item
    )

    saveOutfits(updated)
    setShowSchedule(null)
  }

  const deleteOutfit = async (id) => {
  try {
    const response = await fetch(
      `${API_URL}/${id}?userId=${USER_ID}`,
      {
        method: 'DELETE',
      }
    )

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete outfit')
    }

    setOutfits((previous) =>
      previous.filter((item) => item._id !== id)
    )

    setDeleteId(null)
  } catch (err) {
    setError(err.message)
  }
}

  const filteredOutfits = outfits.filter((outfit) => {
    const query = search.toLowerCase()

    const clothingNames = (outfit.clothingItems || [])
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
            const items = outfit.clothingItems || [];

            return (
              <article className="saved-look-card" key={outfit._id}>
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
                    onClick={() => {
  console.log('HEART CLICKED:', outfit._id);
  toggleFavorite(outfit);
}}
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
                      onClick={() => setDeleteId(outfit._id)}
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
                        <span key={`${outfit._id}-${index}`}>
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
                          showSchedule === outfit._id ? null : outfit._id
                        )
                      }
                    >
                      {outfit.scheduledFor ? 'Change date' : 'Plan this look'}
                    </button>
                  </div>

                  {showSchedule === outfit._id && (
                    <div className="saved-date-editor">
                      <label htmlFor={`schedule-${outfit._id}`}>
                        When will you wear it?
                      </label>

                      <input
                        id={`schedule-${outfit._id}`}
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

                {deleteId === outfit._id && (
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
                        onClick={() => deleteOutfit(outfit._id)}
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
