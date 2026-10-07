import { useState } from "react";
import "./Favourites.css";

function Favourites() {
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("closetlyFavorites")) || [];
  });

  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter(
      (outfit) => outfit.id !== id
    );

    setFavorites(updatedFavorites);

    localStorage.setItem(
      "closetlyFavorites",
      JSON.stringify(updatedFavorites)
    );
  };

  const getItemName = (item) => {
    if (!item) return null;

    if (typeof item === "string") {
      return item;
    }

    return item.name || "Clothing Item";
  };

  return (
    <div className="favorites-page">

      <div className="favorites-header">
        <div>
          <h1>Favorite Outfits</h1>
          <p>Your favorite saved outfits will appear here.</p>
        </div>

        <span className="favorites-count">
          {favorites.length} Favorites
        </span>
      </div>

      {favorites.length > 0 ? (

        <div className="favorites-grid">

          {favorites.map((outfit) => {

            const outfitItems = [
              outfit.top,
              outfit.bottom,
              outfit.dress,
              outfit.outerwear,
            ]
              .filter(Boolean)
              .map(getItemName)
              .filter(Boolean);

            return (
              <div className="favorite-card" key={outfit.id}>

                <div className="favorite-image-container">

                  <div className="favorite-preview">
                    <div className="preview-title">
                      {outfit.bodyShape || "Outfit"}
                    </div>

                    <div className="preview-subtitle">
                      {outfit.view || "Front view"}
                    </div>
                  </div>

                  <button
                    className="favorite-heart"
                    type="button"
                    onClick={() => removeFavorite(outfit.id)}
                    aria-label={`Remove ${outfit.name} from favorites`}
                    title="Remove from favorites"
                  >
                    ♥
                  </button>

                </div>

                <div className="favorite-card-info">

                  <div className="favorite-title-row">

                    <h3>{outfit.name}</h3>

                    <span className="favorite-occasion">
                      {outfit.occasion}
                    </span>

                  </div>

                  <p>{outfit.description}</p>

                  <div className="favorite-items">

                    {outfitItems.length > 0 ? (

                      outfitItems.map((item, index) => (
                        <span key={index}>
                          {item}
                        </span>
                      ))

                    ) : (

                      <span>No clothing items</span>

                    )}

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      ) : (

        <div className="favorites-empty">

          <div className="empty-heart">♡</div>

          <h2>No favorites yet</h2>

          <p>
            Save the outfits you love, and they&apos;ll appear here.
          </p>

        </div>

      )}

    </div>
  );
}

export default Favourites;