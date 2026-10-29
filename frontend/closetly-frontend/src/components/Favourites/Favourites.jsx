
import { useState, useEffect } from "react";
import "./Favourites.css";

const API_URL = "http://localhost:5000/api/outfits";
const USER_ID = "test-user-1";

function Favourites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}?userId=${USER_ID}`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Could not load favorite outfits."
          );
        }

        // Show only outfits marked as favorites in MongoDB.
        setFavorites(
          (result.data || []).filter(
            (outfit) => outfit.isFavorite === true
          )
        );
      } catch (err) {
        console.error("Fetch favorites error:", err);
        setError("Could not load favorites. Please check your backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = async (outfit) => {
    try {
      const response = await fetch(
        `${API_URL}/${outfit._id}/favorite`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isFavorite: false }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Could not remove favorite."
        );
      }

      // Remove it from this page after the database confirms the change.
      setFavorites((previous) =>
        previous.filter((item) => item._id !== outfit._id)
      );
    } catch (err) {
      console.error("Remove favorite error:", err);
      setError("Could not update favorite. Please try again.");
    }
  };

  const getItemName = (item) => {
    if (!item) return null;
    if (typeof item === "string") return item;
    return item.name || "Clothing Item";
  };

  if (loading) {
    return (
      <div className="favorites-page">
        <h2>Loading your favorite outfits...</h2>
      </div>
    );
  }

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

      {error && (
        <p role="alert">{error}</p>
      )}

      {favorites.length > 0 ? (
        <div className="favorites-grid">
          {favorites.map((outfit) => {
            const outfitItems = (
              Array.isArray(outfit.clothingItems)
                ? outfit.clothingItems
                : [
                    outfit.top,
                    outfit.bottom,
                    outfit.dress,
                    outfit.outerwear,
                  ]
            )
              .filter(Boolean)
              .map(getItemName)
              .filter(Boolean);

            return (
              <div className="favorite-card" key={outfit._id}>
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
                    onClick={() => removeFavorite(outfit)}
                    aria-label={`Remove ${outfit.name} from favorites`}
                    title="Remove from favorites"
                  >
                    ♥
                  </button>
                </div>

                <div className="favorite-card-info">
                  <div className="favorite-title-row">
                    <h3>{outfit.name || "My Outfit"}</h3>

                    <span className="favorite-occasion">
                      {outfit.occasion || "Custom"}
                    </span>
                  </div>

                  <p>{outfit.description || ""}</p>

                  <div className="favorite-items">
                    {outfitItems.length > 0 ? (
                      outfitItems.map((item, index) => (
                        <span key={`${outfit._id}-${index}`}>
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
