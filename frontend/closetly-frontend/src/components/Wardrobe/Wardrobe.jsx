
import { useEffect, useState } from "react";
import "./Wardrobe.css";

const API_URL = "http://localhost:5000/api/clothing";

function Wardrobe() {
  const [clothes, setClothes] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [color, setColor] = useState("All");
  const [season, setSeason] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadClothes() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`Could not load wardrobe (${response.status}).`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error("The wardrobe API returned an unsuccessful response.");
        }

        if (!cancelled) {
          setClothes(
            (result.data ?? []).map((item) => ({
              ...item,
              id: item._id ?? item.id,
              image: item.image || "",
              category: item.category || "Other",
              color: item.color || "Other",
              season: item.season || "All Season",
            }))
          );
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load wardrobe:", err);
          setError(
            "Could not load your wardrobe. Please check the backend connection and try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadClothes();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredClothes = clothes.filter((item) => {
    const matchesSearch = (item.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || item.category === category;

    const matchesColor = color === "All" || item.color === color;

    const matchesSeason = season === "All" || item.season === season;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesColor &&
      matchesSeason
    );
  });

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setColor("All");
    setSeason("All");
  };

  return (
    <div className="wardrobe-page">
      <div className="wardrobe-header">
        <div>
          <h1>My Wardrobe</h1>
          <p>Find the perfect piece from your collection.</p>
        </div>

        <span className="wardrobe-count">
          {filteredClothes.length} Items
        </span>
      </div>

      <div className="wardrobe-controls">
        <input
          type="text"
          placeholder="Search your wardrobe..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="wardrobe-search"
        />

        <div className="wardrobe-filters">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Tops">Tops</option>
            <option value="Bottoms">Bottoms</option>
            <option value="Dresses">Dresses</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
          </select>

          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
          >
            <option value="All">All Colours</option>
            <option value="White">White</option>
            <option value="Black">Black</option>
            <option value="Brown">Brown</option>
            <option value="Beige">Beige</option>
            <option value="Cream">Cream</option>
            <option value="Blue">Blue</option>
            <option value="Green">Green</option>
            <option value="Olive">Olive</option>
            <option value="Mauve">Mauve</option>
            <option value="Pink">Pink</option>
            <option value="Red">Red</option>
            <option value="Grey">Grey</option>
            <option value="Yellow">Yellow</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          >
            <option value="All">All Seasons</option>
            <option value="Summer">Summer</option>
            <option value="Winter">Winter</option>
            <option value="Spring">Spring</option>
            <option value="Monsoon">Monsoon</option>
            <option value="All Season">All Season</option>
          </select>

          <button className="clear-filters" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading your wardrobe...</p>
      ) : error ? (
        <div className="wardrobe-empty">
          <h3>Wardrobe unavailable</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      ) : (
        <div className="wardrobe-grid">
          {filteredClothes.length > 0 ? (
            filteredClothes.map((item) => (
              <div className="wardrobe-card" key={item.id}>
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="wardrobe-image-placeholder">
                    No image available
                  </div>
                )}

                <div className="wardrobe-card-info">
                  <h3>{item.name}</h3>
                  <p>{item.category} · {item.color}</p>
                  <span>{item.season}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="wardrobe-empty">
              <h3>No items found</h3>
              <p>
                {clothes.length === 0
                  ? "Your wardrobe is empty. Add clothing to get started."
                  : "Try changing your search or filters."}
              </p>
              <button onClick={clearFilters}>Reset Filters</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Wardrobe;
