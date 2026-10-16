
import { useState } from "react";
import "./Wardrobe.css";

const sampleClothes = [
  {
    id: 1,
    name: "White Shirt",
    category: "Tops",
    color: "White",
    season: "Summer",
    image: "https://placehold.co/300x350/F5F5F5/443223?text=White+Shirt",
  },
  {
    id: 2,
    name: "Blue Jeans",
    category: "Bottoms",
    color: "Blue",
    season: "All Season",
    image: "https://placehold.co/300x350/DCE6F1/443223?text=Blue+Jeans",
  },
  {
    id: 3,
    name: "Black Dress",
    category: "Dresses",
    color: "Black",
    season: "Winter",
    image: "https://placehold.co/300x350/333333/FFFFFF?text=Black+Dress",
  },
  {
    id: 4,
    name: "Beige Jacket",
    category: "Outerwear",
    color: "Beige",
    season: "Winter",
    image: "https://placehold.co/300x350/DBC4A5/443223?text=Beige+Jacket",
  },
  {
    id: 5,
    name: "Green Top",
    category: "Tops",
    color: "Green",
    season: "Summer",
    image: "https://placehold.co/300x350/DDE8D5/443223?text=Green+Top",
  },
  {
    id: 6,
    name: "Black Trousers",
    category: "Bottoms",
    color: "Black",
    season: "All Season",
    image: "https://placehold.co/300x350/333333/FFFFFF?text=Black+Trousers",
  },
];

function Wardrobe() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [color, setColor] = useState("All");
  const [season, setSeason] = useState("All");

  const filteredClothes = sampleClothes.filter((item) => {
    const matchesSearch = item.name
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
            <option value="Outerwear">Outerwear</option>
          </select>

          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
          >
            <option value="All">All Colours</option>
            <option value="White">White</option>
            <option value="Black">Black</option>
            <option value="Blue">Blue</option>
            <option value="Beige">Beige</option>
            <option value="Green">Green</option>
          </select>

          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          >
            <option value="All">All Seasons</option>
            <option value="Summer">Summer</option>
            <option value="Winter">Winter</option>
            <option value="All Season">All Season</option>
          </select>

          <button
            className="clear-filters"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="wardrobe-grid">
        {filteredClothes.length > 0 ? (
          filteredClothes.map((item) => (
            <div className="wardrobe-card" key={item.id}>
              <img src={item.image} alt={item.name} />

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
            <p>Try changing your search or filters.</p>
            <button onClick={clearFilters}>Reset Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wardrobe;
