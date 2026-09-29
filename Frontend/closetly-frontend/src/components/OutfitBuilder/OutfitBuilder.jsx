import { useState } from "react";
import "./OutfitBuilder.css";

/* ---------------------------------------------
   Data
--------------------------------------------- */

const bodyShapes = [
  {
    id: "hourglass",
    name: "Hourglass",
    description: "Balanced shoulders and hips with a defined waist.",
    thumb: "/Images/HourglassBody_Front.png",
    views: {
      front: "/Images/HourglassBody_Front.png",
      side: "/images/mannequin-side.png",
      back: "/images/mannequin-back.png",
    },
  },
  {
    id: "pear",
    name: "Pear",
    description: "Narrower shoulders with wider hips.",
    thumb: "/Images/PearBody_Front.png",
    views: {
      front: "/Images/PearBody_Front.png",
      side: "/images/mannequin-side.png",
      back: "/images/mannequin-back.png",
    },
  },
  {
    id: "rectangle",
    name: "Rectangle",
    description: "Straight body with a less defined waist.",
   thumb: "/Images/RectangleBody_Front.png",
views: {
  front: "/Images/RectangleBody_Front.png",
  side: "/images/mannequin-side.png",
  back: "/images/mannequin-back.png",
},
  },
  {
    id: "apple",
    name: "Apple",
    description: "Fuller midsection with slimmer legs.",
    thumb: "/Images/AppleBody_Front.png",
    views: {
      front: "/Images/AppleBody_Front.png",
      side: "/images/mannequin-side.png",
      back: "/images/mannequin-back.png",
    },
  },
];

const categories = [
  { id: "tops", label: "Tops" },
  { id: "bottoms", label: "Bottoms" },
  { id: "dresses", label: "Dresses" },
  { id: "outerwear", label: "Outerwear" },
];

const clothingItems = {
  tops: [
    { id: "top1", name: "White tee", image: "/images/clothing/tops1.svg" },
    { id: "top2", name: "Black tank", image: "/images/clothing/tops2.svg" },
    { id: "top3", name: "Ribbed cami", image: "/images/clothing/tops3.svg" },
    { id: "top4", name: "Brown knit", image: "/images/clothing/tops4.svg" },
    { id: "top5", name: "Striped shirt", image: "/images/clothing/tops5.svg" },
    { id: "top6", name: "Puff blouse", image: "/images/clothing/tops6.svg" },
    { id: "top7", name: "Cropped shirt", image: "/images/clothing/tops7.svg" },
    { id: "top8", name: "Sage top", image: "/images/clothing/tops8.svg" },
    { id: "top9", name: "Rose bustier", image: "/images/clothing/tops9.svg" },
  ],
  bottoms: [
    { id: "bot1", name: "Straight jeans", image: "/images/clothing/bottoms1.svg" },
    { id: "bot2", name: "Wide trousers", image: "/images/clothing/bottoms2.svg" },
    { id: "bot3", name: "Midi skirt", image: "/images/clothing/bottoms3.svg" },
    { id: "bot4", name: "Tailored shorts", image: "/images/clothing/bottoms4.svg" },
    { id: "bot5", name: "Denim skirt", image: "/images/clothing/bottoms5.svg" },
    { id: "bot6", name: "Linen pants", image: "/images/clothing/bottoms6.svg" },
  ],
  dresses: [
    { id: "dre1", name: "Casual dress", image: "/images/clothing/dresses1.svg" },
    { id: "dre2", name: "Formal gown", image: "/images/clothing/dresses2.svg" },
    { id: "dre3", name: "Midi dress", image: "/images/clothing/dresses3.svg" },
    { id: "dre4", name: "Slip dress", image: "/images/clothing/dresses4.svg" },
    { id: "dre5", name: "Wrap dress", image: "/images/clothing/dresses5.svg" },
    { id: "dre6", name: "Shirt dress", image: "/images/clothing/dresses6.svg" },
  ],
  outerwear: [
    { id: "out1", name: "Denim jacket", image: "/images/clothing/outerwear1.svg" },
    { id: "out2", name: "Blazer", image: "/images/clothing/outerwear2.svg" },
    { id: "out3", name: "Cardigan", image: "/images/clothing/outerwear3.svg" },
    { id: "out4", name: "Wool coat", image: "/images/clothing/outerwear4.svg" },
    { id: "out5", name: "Trench coat", image: "/images/clothing/outerwear5.svg" },
    { id: "out6", name: "Cropped jacket", image: "/images/clothing/outerwear6.svg" },
  ],
};

const layerStyles = {
  top: { top: "22%", height: "30%" },
  outerwear: { top: "20%", height: "38%" },
  bottom: { top: "48%", height: "38%" },
  dress: { top: "22%", height: "55%" },
};

/* ---------------------------------------------
   Icons
--------------------------------------------- */

const Icon = {
  hanger: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 7a2 2 0 1 1 2-2c0 1.2-2 1.2-2 2Z" />
      <path d="M12 7v2l8 5.5c1 .7.5 2.5-.8 2.5H4.8c-1.3 0-1.8-1.8-.8-2.5L12 9" />
    </svg>
  ),
  home: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" />
    </svg>
  ),
  grid: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  heart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9Z" />
    </svg>
  ),
  eye: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}>
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  ),
  user: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  ),
  check: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  ),
  close: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  ),
  front: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <circle cx="12" cy="4.6" r="2.6" />
      <path d="M8 9h8a1 1 0 0 1 1 1v5h-2v7h-2v-7h-2v7H9v-7H7v-5a1 1 0 0 1 1-1Z" />
    </svg>
  ),
  side: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <circle cx="11" cy="4.6" r="2.6" />
      <path d="M9.5 9h3a2.5 2.5 0 0 1 2.5 2.5V15h-2v7h-4v-8.5L8 15V11a2 2 0 0 1 1.5-2Z" />
    </svg>
  ),
  back: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <circle cx="12" cy="4.6" r="2.6" />
      <path d="M7.5 9h9a1 1 0 0 1 1 1.2l-1 4.8h-1.7l.7 7h-7l.7-7H7.5l-1-4.8A1 1 0 0 1 7.5 9Z" />
    </svg>
  ),
  tops: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...p}>
      <path d="M9 4 4 6.5 5.5 10 8 9v11h8V9l2.5 1L20 6.5 15 4a3 3 0 0 1-6 0Z" />
    </svg>
  ),
  bottoms: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...p}>
      <path d="M7 3h10l1 18h-5l-1-9-1 9H6Z" />
    </svg>
  ),
  dresses: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...p}>
      <path d="M9 3h6l-1 5 5 13H5l5-13Z" />
    </svg>
  ),
  outerwear: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...p}>
      <path d="M8 3h8l3 3-1 15H6L5 6Z" />
      <path d="M12 3v18" />
    </svg>
  ),
};

const categoryIcons = {
  tops: Icon.tops,
  bottoms: Icon.bottoms,
  dresses: Icon.dresses,
  outerwear: Icon.outerwear,
};

const viewOptions = [
  { id: "front", label: "Front", icon: Icon.front },
  { id: "side", label: "Side", icon: Icon.side },
  { id: "back", label: "Back", icon: Icon.back },
];

const panelMeta = {
  bodyShape: { title: "Body Shape", sub: "Pick the shape closest to yours." },
  closet: { title: "Closet", sub: "Browse your wardrobe and layer pieces." },
  view: { title: "View", sub: "Rotate the mannequin preview." },
};

/* ---------------------------------------------
   Component
--------------------------------------------- */

export default function OutfitBuilder() {
  const [activePanel, setActivePanel] = useState("bodyShape");
  const [bodyShape, setBodyShape] = useState("hourglass");
  const [view, setView] = useState("front");
  const [clothingCategory, setClothingCategory] = useState("tops");
  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [selectedDress, setSelectedDress] = useState(null);
  const [selectedOuterwear, setSelectedOuterwear] = useState(null);

  const shape = bodyShapes.find((s) => s.id === bodyShape) ?? bodyShapes[0];
  const items = clothingItems[clothingCategory] ?? [];

  const selectedByCategory = {
    tops: selectedTop,
    bottoms: selectedBottom,
    dresses: selectedDress,
    outerwear: selectedOuterwear,
  };

  const handleSelectItem = (item) => {
    const current = selectedByCategory[clothingCategory];
    const next = current?.id === item.id ? null : item;
    if (clothingCategory === "tops") setSelectedTop(next);
    if (clothingCategory === "bottoms") setSelectedBottom(next);
    if (clothingCategory === "dresses") setSelectedDress(next);
    if (clothingCategory === "outerwear") setSelectedOuterwear(next);
  };

  const togglePanel = (id) => setActivePanel((cur) => (cur === id ? null : id));

  const outfit = {
    bodyShape,
    view,
    top: selectedTop,
    bottom: selectedBottom,
    dress: selectedDress,
    outerwear: selectedOuterwear,
  };

  const toolbarButtons = [
    { id: "bodyShape", label: "Body Shape", icon: Icon.user },
    { id: "closet", label: "Closet", icon: Icon.hanger },
    { id: "view", label: "View", icon: Icon.eye },
  ];

  const meta = activePanel ? panelMeta[activePanel] : null;

  return (
    <div className="cl-app">
      <header className="cl-nav">
        <div className="cl-nav-inner">
          <a className="cl-logo" href="/">
            Closetly
            <Icon.hanger className="cl-logo-icon" />
          </a>
          <nav className="cl-nav-links">
            <a className="cl-nav-link" href="/">
              <Icon.home className="cl-nav-icon" /> Home
            </a>
            <a className="cl-nav-link is-active" href="/" aria-current="page">
              <Icon.hanger className="cl-nav-icon" /> Outfit Builder
            </a>
            <a className="cl-nav-link" href="/">
              <Icon.grid className="cl-nav-icon" /> My Outfits
            </a>
            <a className="cl-nav-link" href="/">
              <Icon.heart className="cl-nav-icon" /> Favorites
            </a>
          </nav>
          <div className="cl-nav-actions">
            <button className="cl-icon-btn" type="button" aria-label="Favorites">
              <Icon.heart />
            </button>
            <button className="cl-avatar" type="button" aria-label="Account">
              <Icon.user />
            </button>
          </div>
        </div>
      </header>

      <main className="cl-main">
        <div className={`cl-workspace${activePanel ? " has-panel" : ""}`}>
          {/* Dynamic left panel / drawer */}
          {activePanel && (
            <>
              <div className="cl-scrim" onClick={() => setActivePanel(null)} aria-hidden="true" />
              <aside className="cl-panel" role="dialog" aria-label={meta.title}>
                <div className="cl-panel-head">
                  <div className="cl-panel-heading">
                    <h2 className="cl-panel-title">{meta.title}</h2>
                    <p className="cl-panel-sub">{meta.sub}</p>
                  </div>
                  <button className="cl-panel-close" type="button" onClick={() => setActivePanel(null)} aria-label="Close panel">
                    <Icon.close />
                  </button>
                </div>

                <div className="cl-panel-body">
                  {activePanel === "bodyShape" && (
                    <div className="cl-shape-grid">
                      {bodyShapes.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          className={`cl-shape-card${s.id === bodyShape ? " is-selected" : ""}`}
                          onClick={() => setBodyShape(s.id)}
                          aria-pressed={s.id === bodyShape}
                        >
                          {s.id === bodyShape && (
                            <span className="cl-shape-check">
                              <Icon.check />
                            </span>
                          )}
                          <span className="cl-shape-figure">
                            <img src={s.thumb} alt={`${s.name} body shape mannequin`} loading="lazy" />
                          </span>
                          <span className="cl-shape-name">{s.name}</span>
                          <span className="cl-shape-desc">{s.description}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {activePanel === "closet" && (
                    <>
                      <div className="cl-cat-grid">
                        {categories.map((c) => {
                          const CIcon = categoryIcons[c.id];
                          return (
                            <button
                              key={c.id}
                              type="button"
                              className={`cl-cat-btn${c.id === clothingCategory ? " is-active" : ""}`}
                              onClick={() => setClothingCategory(c.id)}
                              aria-pressed={c.id === clothingCategory}
                            >
                              <CIcon className="cl-cat-icon" />
                              {c.label}
                            </button>
                          );
                        })}
                      </div>

                      <div className="cl-items">
                        {items.map((item) => {
                          const isSelected = selectedByCategory[clothingCategory]?.id === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              className={`cl-item${isSelected ? " is-selected" : ""}`}
                              onClick={() => handleSelectItem(item)}
                              aria-pressed={isSelected}
                              title={item.name}
                            >
                              <img src={item.image} alt={item.name} loading="lazy" />
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {activePanel === "view" && (
                    <div className="cl-view-grid">
                      {viewOptions.map((v) => {
                        const VIcon = v.icon;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            className={`cl-view-btn${v.id === view ? " is-active" : ""}`}
                            onClick={() => setView(v.id)}
                            aria-pressed={v.id === view}
                          >
                            <span className="cl-view-tile">
                              <VIcon />
                            </span>
                            <span className="cl-view-label">{v.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </aside>
            </>
          )}

          {/* Hero preview */}
          <section className="cl-stage">
            <div className="cl-stage-head">
              <div className="cl-stage-heading">
                <h1 className="cl-title">Outfit Builder</h1>
                <p className="cl-subtitle">Create your perfect look, one piece at a time.</p>
              </div>
              <div className="cl-stage-tags">
                <span className="cl-tag">{shape.name}</span>
                <span className="cl-tag">{viewOptions.find((v) => v.id === view)?.label} view</span>
              </div>
            </div>

            <div className="cl-mannequin-wrap">
              <div className="cl-mannequin">
                <img
                  className="cl-mannequin-img"
                  key={`${shape.id}-${view}`}
                  src={shape.views[view]}
                  alt={`${shape.name} mannequin, ${view} view`}
                />
                {selectedBottom && (
                  <img className="cl-layer" style={layerStyles.bottom} src={selectedBottom.image} alt={selectedBottom.name} />
                )}
                {selectedTop && (
                  <img className="cl-layer" style={layerStyles.top} src={selectedTop.image} alt={selectedTop.name} />
                )}
                {selectedDress && (
                  <img className="cl-layer" style={layerStyles.dress} src={selectedDress.image} alt={selectedDress.name} />
                )}
                {selectedOuterwear && (
                  <img className="cl-layer" style={layerStyles.outerwear} src={selectedOuterwear.image} alt={selectedOuterwear.name} />
                )}
              </div>
            </div>

            <div className="cl-actions">
              <button className="cl-btn cl-btn-ghost" type="button" onClick={() => console.log("Save Outfit", outfit)}>
                <Icon.heart className="cl-btn-icon" /> Save Outfit
              </button>
              <button className="cl-btn cl-btn-primary" type="button" onClick={() => console.log("Preview Full Look", outfit)}>
                <Icon.eye className="cl-btn-icon" /> Preview Full Look
              </button>
            </div>
          </section>

          {/* Compact toolbar */}
          <nav className="cl-toolbar" aria-label="Builder tools">
            {toolbarButtons.map((b) => {
              const BIcon = b.icon;
              return (
                <button
                  key={b.id}
                  type="button"
                  className={`cl-tool${activePanel === b.id ? " is-active" : ""}`}
                  onClick={() => togglePanel(b.id)}
                  aria-pressed={activePanel === b.id}
                >
                  <BIcon className="cl-tool-icon" />
                  <span className="cl-tool-label">{b.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </main>
    </div>
  );
}
